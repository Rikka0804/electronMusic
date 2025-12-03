<template>
  <div class="bottom-container ">
    <slot></slot>
  </div>

</template>

<script lang="ts" setup>


</script>

<style scoped lang="scss">
.bottom-container {
  height: 80px;
  border-top: rgb(59, 59, 62) 1px solid;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1999;
  width: 100%;
  transition: 0.5s;
}
</style>
