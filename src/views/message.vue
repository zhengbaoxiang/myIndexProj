<template>
<div class="message">
  <h1>留言板</h1>
</div>
</template>
<script>

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
  mounted () { },
  activated () {},
  methods: {}

}
</script>
<style lang="less" scoped>
.message{
  width: 100%;
  height: 200px;
  background-color: #fff;

}

</style>
