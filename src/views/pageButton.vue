<template>
  <div class="pageButton "  v-if="this.pageNums>1">
    <a @click.prevent="prevOrNext(-1)"
      v-if="currentPageIndex!==1">上一页
    </a>
    <li
      class="singelbtn"
      :class="{current:item===currentPageIndex}"
      v-for="(item,index) in pageNums"
      @click="chooseIndex(item)"
      :key="index">
      {{item}}
    </li>
    <a @click.prevent="prevOrNext(1)"
      v-if="currentPageIndex!==pageNums">下一页
    </a>
    <div class="page-jumper" >
      <span>到</span>
      <input  v-model="inputIndex"  class="page-number" type="text">
      <span>页</span>
      <input @click="confirmValue(inputIndex)" class="page-jump-btn" type="button" value="确定">
    </div>
  </div>
</template>
<script>
export default {
  name: 'pageButton',
  props: {
    dataNums: {
      default: 0
    },
    tagId: {
      default: 0
    }
  },
  data () {
    return {
      currentPageIndex: 1,
      pageNums: 0,
      inputIndex: '',
      counts: 8 // 还差一个功能，每页显示多少条数据，counts
    }
  },
  watch: {
    dataNums: {
      handler (newval, oldval) {
        console.log('watch=>> dataNums:', newval)
        this.currentPageIndex = 1
        this.pageNums = parseInt(this.dataNums / this.counts + 1)
      },
      deep: true,
      immediate: true
    },
    // 由于不同菜单传递相同的dataNum时，不会触发监听，无法刷新页码，
    // 因此增加唯一标识 tagId作为监听参数
    tagId (newval) {
      console.log('watch=>> tagId:', newval, this.dataNums)
      this.currentPageIndex = 1
    }
  },
  computed: { },
  created () {},
  mounted () {},
  methods: {
    prevOrNext (i) {
      this.currentPageIndex += i
      this.emitIndex(this.currentPageIndex)
    },
    chooseIndex (index) {
      if (this.currentPageIndex === index) return
      this.currentPageIndex = index
      this.emitIndex(this.currentPageIndex)
    },
    confirmValue (value) {
      const index = parseInt(value)
      console.log(typeof index, index)

      if (index > 0 && index < this.pageNums) {
        this.currentPageIndex = index
        this.emitIndex(this.currentPageIndex)
        return
      }
      console.log('请输入正确的页码')
      this.inputIndex = ''
    },
    emitIndex (index) {
      console.log(`返回父级index=${index}，重新载入页面`)
      this.$emit('changePages', index, this.counts)
    }
  }

}
</script>
<style lang="less" scoped>
.pageButton{
  width: 100%;
  height: 35px;
  margin: 15px auto;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  li,a{
    display: block;
    color: #999;
    border: 1px solid #ccc;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    margin-right: 10px;
    padding: 7px 13px;
  }
  a:hover,li:hover{
    // color: #fff;
    border-color: #ff8a00;
    background-color: #ff8a00;
  }
  li.current{
    color: #fff;
    border-color: #ff8a00;
    background-color: #ff8a00;

  }
  .page-jumper{
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;

    span{
      margin: 0 10px;
      padding: 11px 0;
      color: #999;
      line-height: 1;
    }
    .page-number , .page-jump-btn{
      display: block;
      height: 36px;
      text-align: center;
      border-radius: 4px;
      font-size:14px ;
      outline: 0;
    }
    .page-number{
      width: 44px;
      color: #999;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
    .page-jump-btn{
      width: 56px;
      color: #fff;
      background: #ff9100;
      cursor: pointer;
    }

  }

}
</style>
