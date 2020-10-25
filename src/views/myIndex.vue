<template>
<div class="myIndex">
  <myheader></myheader>
  <searchArea></searchArea>
  <pageContain></pageContain>
  <myfooter></myfooter>
</div>
</template>
<script>
import myheader from './header'
import searchArea from './searchArea'
import pageContain from './pageContain'
import myfooter from './myfooter'
export default {
  name: 'myIndex',
  components: { myheader, searchArea, pageContain, myfooter },
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

}

</style>
