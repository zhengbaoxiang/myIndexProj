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
  font-family: 'Microsoft Yahei';
  background: url("./assets/images/background.jpeg")  no-repeat;
  background: url("./assets/images/bg2.gif")  no-repeat;
  background-size: cover;
  background-attachment:fixed;
  font-size:16px;
  }
#app {
  text-align: center;
  font-family: PingFangSC-Regular, 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
