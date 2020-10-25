<template>
  <footer class="myfooter">
    <div class="footer_link">
      <a href="#">I</a>
      <span>|</span>
      <a href="#">love</a>
        <span>|</span>
      <a href="#">you</a>
        <span>|</span>
      <a href="#">forever</a>
    </div>
    <p>每天都要开开心心哒</p>
  </footer>
</template>
<script>
export default {
  name: 'myfooter',
  components: {},
  props: {
  },
  data () {
    return { }
  },
  created () {
  },
  mounted () { },
  activated () {},
  methods: {}
}
</script>
<style lang="less" scoped>
footer.myfooter{
  position: fixed;
  bottom: 0px;
  width: 100%;
  /*border-top: 2px solid lightgray;*/
  background: rgba(242, 242, 242, 0.2);
  margin: 15px 0 0px;
  /*border-bottom: 1px solid #cecece;*/
  .footer_link {
    text-align: center;
    margin-top: 8px;
    a{
      color: #666;
      font-size: 14px;
    }
    a:hover{
      color:#f80
    }
    span{
      color: #4e4e4e;
      font-size: 14px;
      padding: 0px 10px;
    }
  }
  p{
    text-align: center;
    margin: 5px auto 3px;
    font-size: 13px;
  }
}
</style>
