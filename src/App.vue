<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  // components: {
  //   MainPage,
  // }
}
</script>

<style lang="less">
body {
  background-color: #fcfcfc!important;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top:30px;
  text-align: center;
  color: #2c3e50;
}
</style>
