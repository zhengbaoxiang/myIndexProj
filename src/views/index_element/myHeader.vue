<template>
<div class="myHeader">
  <header>
    <div class="header_con">
        <div id="haed_time" v-html="timeStr"></div>
    </div>
    <p class="mesg">要加油呀！(*^_^*)</p>
  </header>
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
    return {
      timeStr: '',
      initialTime: '2022-01-01'
    }
  },
  created () {
    this.fnTimeleft()
    setInterval(this.fnTimeleft, 60000)
  },
  mounted () { },
  activated () {},
  methods: {
    fnTimeleft () {
      // 实际开发需要通过ajax来读取后台的时间
      var sNow = new Date()
      // 未来时间：12月31日晚24点
      var sFuture = new Date(this.initialTime).setHours(0, 0, 0)
      // 计算还有多少秒
      var sLeft = parseInt((sFuture - sNow) / 1000)
      // 计算还剩多少天
      var iDays = parseInt(sLeft / 86400)
      // 计算还剩多少小时
      var iHours = parseInt((sLeft % 86400) / 3600)
      // 计算还剩多少分
      var iMinutes = parseInt(((sLeft % 86400) % 3600) / 60)
      // 计算还剩多少秒
      // var iSeconds = sLeft % 60
      var sTr = `距离${this.initialTime}还剩:<strong>${iDays}</strong>天${this.fnTodou(iHours)}时` +
                `${this.fnTodou(iMinutes)}分`
      this.timeStr = sTr
    },
    fnTodou (n) {
      if (n < 10) {
        return '0' + n
      } else {
        return n
      }
    }
  }
}
</script>
<style lang="less" scoped>
.myHeader{
  padding-top: 5px;
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
}

</style>
