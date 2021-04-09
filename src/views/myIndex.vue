<template>
<div class="myIndex">
  <myheader></myheader>
  <searchArea></searchArea>
  <navtoolbar></navtoolbar>
  <pageContain></pageContain>
  <myfooter></myfooter>
</div>
</template>
<script>
import myheader from './index_element/myHeader'
import navtoolbar from './index_element/navToolbar'
import searchArea from './index_element/searchArea'
import pageContain from './index_element/pageContain'
import myfooter from './index_element/myfooter'
export default {
  name: 'myIndex',
  components: { myheader, searchArea, navtoolbar, pageContain, myfooter },
  props: {
    tab_index: {
      default: 0
    }
  },
  data () {
    return {
      dataList: [],
      setLength: 24,
      currentData: {},
      showPopup: false
    }
  },
  created () { },
  mounted () { },
  activated () {},
  methods: {}

}
</script>
<style lang="less" scoped>
.myIndex{
  width: 100%;
  height: 100%;
  background: url("../assets/images/background.jpeg")  no-repeat;
  background: url("../assets/images/bg2.gif")  no-repeat;
  background-size: cover;
  background-attachment:fixed;
  font-size:16px;

}

</style>
