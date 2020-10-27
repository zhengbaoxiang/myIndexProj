<template>
<div class="message">
  <h1>留言板todo</h1>

</div>
</template>
<script>
import { myApi } from '../assets/api'
export default {
  name: 'message',
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
  created () {
    console.log(this.$route)
  },
  mounted () {
    this.getPics()
  },
  activated () {},
  methods: {
    getPics (params) {
      myApi.getPics(params).then((resp) => {
        console.log(resp)
      })
    }
  }

}
</script>
<style lang="less" scoped>
.message{
  width: 100%;
  height: 200px;
  background-color: #fff;

}

</style>
