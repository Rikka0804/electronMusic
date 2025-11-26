<template>
  <div class="context-menu-wrapper h-full w-full">
    <slot></slot>
  </div>
  <Teleport to="body">
    <div class="context-menu ">
      <slot></slot>
    </div>
  </Teleport>

</template>

<script lang="ts">

</script>

<style scoped lang="scss">

</style>
