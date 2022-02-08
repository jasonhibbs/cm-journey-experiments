<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// Props

interface Props {
  scrollBody?: boolean
  allowWheel?: boolean
}

const { scrollBody = null, allowWheel = false } = defineProps<Props>()

// Template

const sheetContext = ref(null)
const sheet = ref(null)

const contextClasses = $computed(() => ({
  _dragging: !!sheetDelta,
}))
const contextStyles: any = $computed(() => ({
  '--sheet-delta': `${sheetDelta}px`,
}))

// Detents

// Weakly-typed…
// 2: top
// 1: middle
// 0: bottom

const maxDetent = 2
const minDetent = 0
const defaultDetent = 1
let currentDetent = $ref(defaultDetent)

function getDetentDelta(delta: number) {
  const { innerHeight: h } = window
  return delta / h
}

function getNextDetent(delta: number) {
  const d = getDetentDelta(delta)
  if (d < -0.1) {
    return getHigherDetent()
  }
  if (d > 0.1) {
    return getLowerDetent()
  }
  return currentDetent
}

function getHigherDetent() {
  const next = currentDetent + 1
  return next > maxDetent ? maxDetent : next
}

function getLowerDetent() {
  const next = currentDetent - 1
  return next < minDetent ? minDetent : next
}

// Dragging

let sheetDelta = $ref(0)
let sheetScrolled = $ref(false)

function canDrag(e: TouchEvent | MouseEvent | WheelEvent) {
  const notDragging = !isTouching && !isMousing
  const notScrolled = scrollBody || currentDetent !== 2 || !sheetScrolled
  const draggingHeader = !!(e.target as HTMLElement).closest(
    '.bottom-sheet-header'
  )
  const onTarget = !scrollBody ? true : draggingHeader
  return notDragging && notScrolled && onTarget
}

// Dragging: Touch

let firstTouch = $ref(0)
let isTouching = $ref(false)

function onTouchstartContext(e: TouchEvent) {
  if (!canDrag(e)) {
    return
  }
  if (currentDetent !== 2) {
    e.preventDefault()
  }
  isTouching = true
  firstTouch = e.touches[0].screenY
  window.addEventListener('touchmove', onTouchmoveContext)
  window.addEventListener('touchend', onTouchendContext)
}

function onTouchmoveContext(e: TouchEvent) {
  sheetDelta = e.touches[0].screenY - firstTouch
}

function onTouchendContext() {
  currentDetent = getNextDetent(sheetDelta)
  isTouching = false
  firstTouch = 0
  sheetDelta = 0
  window.removeEventListener('touchmove', onTouchmoveContext)
  window.removeEventListener('touchend', onTouchendContext)
}

// Dragging: Mouse

let firstMouse = $ref(0)
let isMousing = $ref(false)

function onMousedownContext(e: MouseEvent) {
  if (!canDrag(e)) {
    return
  }
  e.preventDefault()
  isMousing = true
  firstMouse = e.screenY
  window.addEventListener('mousemove', onMousemoveContext)
  window.addEventListener('mouseup', onMouseupContext)
}

function onMousemoveContext(e: MouseEvent) {
  sheetDelta = e.screenY - firstMouse
}

function onMouseupContext() {
  currentDetent = getNextDetent(sheetDelta)
  isMousing = false
  firstMouse = 0
  sheetDelta = 0
  window.removeEventListener('mousemove', onMousemoveContext)
  window.removeEventListener('mouseup', onMouseupContext)
}

// Dragging: Wheel

function onWheelContext(e: WheelEvent) {
  if (!allowWheel || !canDrag(e)) {
    return
  }
  sheetDelta -= e.deltaY * 1.1
  onWheelContextFinished(sheetDelta)
}

const onWheelContextFinished = useDebounceFn((delta) => {
  currentDetent = getNextDetent(delta)
  sheetDelta = 0
})

// Content Scroll

function onScrollSheet(e: Event) {
  const target = e.target as HTMLElement
  if (!sheetScrolled && target.scrollTop !== 0) {
    sheetScrolled = true
  }
  if (target.scrollTop === 0) {
    sheetScrolled = false
  }
}
</script>

<template lang="pug">

.bottom-sheet-context(
  ref="sheetContext",
  :class="contextClasses",
  :style="contextStyles",
  :data-detent="currentDetent"
  :data-scroll="scrollBody"
  @touchstart="onTouchstartContext"
  @mousedown="onMousedownContext"
  @wheel="onWheelContext"
)
  .bottom-sheet(
    ref="sheet"
    @scroll="onScrollSheet"
  )
    .bottom-sheet-header
      slot(name="header")
    .bottom-sheet-body
      slot(name="body")

</template>

<style lang="scss">
.bottom-sheet-context {
  --sheet-delta: 0px;
  --sheet-header-height: 80px;

  // detents

  --sheet-detent-0: calc(
    100% - var(--sheet-header-height) - env(safe-area-inset-bottom)
  );
  --sheet-detent-1: 50%;
  --sheet-detent-2: 0px;

  // overscroll

  --sheet-overscroll: 12px;
  --sheet-overscroll-bottom: calc(
    var(--sheet-detent-0) + var(--sheet-overscroll)
  );
  --sheet-overscroll-top: var(--sheet-detent-2);

  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 400px;
  margin: auto;

  top: #{clamp(
      var(--sheet-overscroll-top),
      calc(var(--sheet-detent-1) + var(--sheet-delta)),
      var(--sheet-overscroll-bottom)
    )};

  &[data-detent='2'] {
    border-radius: 0;
    top: #{clamp(
        var(--sheet-overscroll-top),
        calc(var(--sheet-detent-2) + var(--sheet-delta)),
        var(--sheet-overscroll-bottom)
      )};
  }

  &[data-detent='0'] {
    top: #{clamp(
        var(--sheet-overscroll-top),
        calc(var(--sheet-detent-0) + var(--sheet-delta)),
        var(--sheet-overscroll-bottom)
      )};
  }

  &:not(._dragging) {
    transition: top 0.3s cubic-bezier(0.4, 1.4, 0.4, 1);
  }
}

.bottom-sheet {
  overscroll-behavior-y: none;
  background-color: var(--color-contrast-5);
  overflow: hidden;
  height: 100%;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 0 20px fade-out(#012, 0.6);
  transition: border-radius 0.3s ease;

  [data-scroll='true']:not(._dragging) & {
    overflow: auto;
  }

  [data-detent='2'] & {
    border-radius: 0;
    overflow: auto;
  }

  [data-detent='0'] & {
    overflow: hidden;
  }
}

.bottom-sheet-body {
  padding-bottom: 12rem;
  transition: opacity 0.2s;

  [data-detent='0']:not(._dragging) & {
    opacity: 0;
  }
}

.bottom-sheet-header {
  background-color: inherit;
  border-radius: inherit;
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>
