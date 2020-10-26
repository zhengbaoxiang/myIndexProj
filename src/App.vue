<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>-->
    <router-view/>
  </div>
</template>

<style lang="less">
body{
  min-height: 510px;
  height: 100%;
  margin: 0 auto;

  }
#app {
  text-align: center;
  height: 100%;
  font-family: 'Microsoft Yahei';
}
</style>
