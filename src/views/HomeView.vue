<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template lang="pug">
main
  h1 Demos
  ul
    li
      RouterLink(to="/demo/sheet") Sheet
    li
      RouterLink(to="/demo/scooter") Scooter
</template>
<style lang="scss">
main {
  width: calc(100% - 2rem);
  max-width: calc(1rem * (400 / 16));
  margin: 1rem auto;

  ul a {
    display: block;
  }
}
</style>
