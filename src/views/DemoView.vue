<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import BottomSheet from '@/components/BottomSheet.vue'
</script>

<template lang="pug">

#background
  p Accusantium inventore sit est minima ea nostrum incidunt. Libero dolores quis provident aut sapiente repellat enim aut. Unde id vel incidunt dignissimos. Iste facere iste praesentium aut eveniet quidem. Rerum fugit sed earum voluptatem nisi fuga. Ea repellendus quis eos asperiores.

BottomSheet
  template(#header)
    h1 Title
  template(#body)
    ul
      li(v-for="i in [1, 2, 3, 4, 5, 6]")
        h2 Item
        p Accusantium inventore sit est minima ea nostrum incidunt. Libero dolores quis provident aut sapiente repellat enim aut. Unde id vel incidunt dignissimos. Iste facere iste praesentium aut eveniet quidem. Rerum fugit sed earum voluptatem nisi fuga. Ea repellendus quis eos asperiores.


</template>

<style lang="scss">
#background {
  background-color: hsl(220deg, 100%, 50%);
  max-height: 100vh;
  overflow: auto;

  @media (prefers-color-scheme: dark) {
    background-color: hsl(220deg, 100%, 10%);
  }
}

#background p {
  font-size: 12rem;
  font-weight: 200;
  line-height: 0.8;
  width: 150%;
  margin: 0;
  word-break: break-all;

  @media (prefers-color-scheme: dark) {
    color: fade-out(white, 0.96);
  }
}

.bottom-sheet {
  ul {
    list-style: none;
    margin: 0;
    padding: 0.75em;

    li {
      background-color: var(--color-root);
      border-radius: 8px;
      padding: 0.75em;
      margin-bottom: 0.75em;
    }

    h2 {
      margin-top: 0;
    }
  }

  @media (prefers-color-scheme: dark) {
    background-color: var(--color-root);

    ul li {
      background-color: var(--color-contrast-5);
    }
  }
}
</style>
