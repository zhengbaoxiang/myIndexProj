<template>
  <div class="pagination "  v-if="this.pageNums>1" ref="pagination">
    <a class="page_click_btn"
      @click.prevent="prevOrNext(-1)"
      v-if="currentPageIndex!==1">上一页
    </a>
    <li
      class="page_click_btn"
      :class="{current:item===currentPageIndex}"
      v-for="(item,index) in pageBtnList"
      @click="chooseIndex(item,index)"
      :key="index">
      {{item}}
    </li>
    <a class="page_click_btn"
      @click.prevent="prevOrNext(1)"
      v-if="currentPageIndex!==pageNums">下一页
    </a>
    <div class="page-jumper" v-if="jumper!=='false'">
      <span>到</span>
      <input  v-model="inputIndex"  class="page-jump-number" type="text">
      <span>页</span>
      <input @click="confirmValue(inputIndex)" class="page-jump-btn" type="button" value="确定">
    </div>
  </div>
</template>
<script>
export default {
  name: 'my-pagination',
  props: {
    dataNums: {
      default: 0
    },
    page_size: {
      default: 10
    },
    tagId: {
      default: 0
    },
    // 非绑定传值，组件不写jumper则不启用跳页功能，写jumper，无需赋值即可启用
    jumper: {
      default: 'false'
    }
  },
  data () {
    return {
      currentPageIndex: 0,
      pageBtnList: [],
      pageNums: 0,
      inputIndex: ''
    }
  },
  watch: {
    dataNums: {
      handler (newval, oldval) {
        console.log('watch=>> dataNums:', newval)
        this.pageNums = this.dataNums % this.page_size === 0 ? this.dataNums / this.page_size : parseInt(this.dataNums / this.page_size + 1)
        // 初始时不保证所有页面都有tagid的变化，保险起见，写两次
        this.currentPageIndex = 1
        // 当前页发生改变时，重新生成翻页按钮
        this.generateBtnList()
      },
      deep: true,
      immediate: true
    },
    // 由于不同菜单传递相同的dataNum时，不会触发监听，无法刷新页码，
    // 因此增加菜单的唯一标识 tagId作为监听参数
    tagId (newval) {
      console.log('watch=>> tagId:', newval, this.dataNums)
      // this.currentPageIndex = 1
      // 当前页发生改变时，重新生成翻页按钮
      this.generateBtnList()
    }
  },
  computed: { },
  created () {},
  mounted () {
  },
  methods: {
    generateBtnList () {
      const index = this.currentPageIndex
      const tNums = this.pageNums
      if (tNums > 7) {
        if (index > 4 && index < tNums - 3) {
          const tempList = [index - 2, index - 1, index, index + 1, index + 2]
          this.pageBtnList = [1, '...'].concat(tempList).concat(['...', tNums])
        } else if (index <= 4) {
          this.pageBtnList = [1, 2, 3, 4, 5, 6].concat(['...', tNums])
        } else {
          const tempList = [tNums - 5, tNums - 4, tNums - 3, tNums - 2, tNums - 1, tNums]
          this.pageBtnList = [1, '...'].concat(tempList)
        }
      } else {
        this.pageBtnList = tNums
      }
      // console.log(this.pageBtnList)
    },
    prevOrNext (i) {
      this.currentPageIndex += i
      this.emitIndex(this.currentPageIndex)
    },
    chooseIndex (pageBtn, index) {
      if (this.currentPageIndex === pageBtn) return

      if (pageBtn === '...' && (index === 6 || index === 7)) {
        this.currentPageIndex += 4
      } else if (pageBtn === '...' && index === 1) {
        this.currentPageIndex -= 4
      } else {
        this.currentPageIndex = pageBtn
      }
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
      // console.log(`返回父级index=${index}，重新载入页面`)
      this.$emit('changePages', index, this.page_size)
      this.generateBtnList()
    }
  }
}
</script>
<style lang="less" scoped>
.pagination{
  width: 100%;
  height: 35px;
  margin: 15px auto;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  .page_click_btn{
    display: block;
    color: #999;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
    padding: 7px 13px;
    cursor: pointer;
  }
  .page_click_btn:hover{
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
    .page-jump-number , .page-jump-btn{
      display: block;
      height: 36px;
      text-align: center;
      border-radius: 4px;
      font-size:14px ;
      outline: 0;
    }
    .page-jump-number{
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
