<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import Register from "@/views/Register";

export default {
  name: 'app',
  components: {
    Register
  }
}
</script>

<style>
  html,body{
    width: 100%;
    height: 100%;

  }
  #app{
    width: 100%;
    height: 100%;
  }
</style>
