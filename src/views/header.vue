<template>
<div class="myHeader">
  <header>
    <div class="header_con">
        <div id="haed_time">倒计时</div>
    </div>
    <p class="mesg">要加油呀！(*^_^*)</p>
  </header>
  <nav>导航栏</nav>
  <ul class="moving_con">
      <!-- <img src="images/snow.jpg" alt="snows" /> -->
  </ul>
</div>
</template>
<script>
// import pageCard from './pageCard'
// import myfooter from './footer'
export default {
  name: 'myHeader',
  components: { },
  props: { },
  data () {
    return { }
  },
  created () { },
  mounted () { },
  activated () {},
  methods: { }

}
</script>
<style lang="less" scoped>
.myHeader{
  header{
    width: 100%;
    height: 50px;
    position: relative;
    .header_con{
      width: 60%;
      height:100%;
      margin:0 auto ;
      text-align: center;
      vertical-align: center;
      /*background-color: gold;*/
      #haed_time{
        font: 35px/50px 'KaiTi';
        color: #ffc107;
      }
    }
    .mesg{
      position: absolute;
      right: 0;
      top: 0;
      font: 30px/50px 'KaiTi';
      color: #ff8800;
    }

  }
  nav{
    position: absolute;
    top: 80px;
    right: calc(5% + 10px);
    background-color: #ff8800;
  }
  ul.moving_con{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: none;
    img{
      position: absolute;
      top: 0px;
      left: 0;
      z-index: 9999;
    }
  }
}

</style>
