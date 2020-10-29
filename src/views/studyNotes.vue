<template>
<div class="newsInfo">
  <!-- <h1>前端知识学习笔记</h1> -->
  <div class="catalogContainer">
    <div class="folder" @click="showCatalog=!showCatalog"
      >点击折叠
    </div>
    <ol class="catalogList" v-show="showCatalog">
        <li
          v-for="(item,index) in catalogList"
          @click="catalogClick(item.id)"
          :class="{'selected':tagId===item.id}"
          :key='index'>
          <!-- <span>{{item.id}}</span> -->
          <span>{{item.name}}</span>
        </li>
      </ol>

  </div>

  <section class="content clearfix" :class="{wider:!showCatalog}">
    <div class="main" v-for="(i,index) in 100" :key='index'>内容</div>
  </section>
</div>
</template>
<script>
// import myUtils from '@/utils/myUtils'
// import { myApi } from '@/assets/api'
export default {
  name: 'newsInfo',
  props: {
    tab_type: {
      default: 'yule'

    }
  },
  data () {
    return {
      catalogList: [],
      tagId: null,
      showCatalog: true
    }
  },
  created () {
  },
  mounted () {
    this.initialData()
  },
  activated () {},
  methods: {
    initialData () {
      console.log(this.$route)
      this.getCatalog()
    },
    getCatalog () {
      // 自定义导航栏目录
      this.catalogList = [
        {
          name: '头条',
          id: 'top'
        },
        {
          name: '社会',
          id: 'shehui'
        },
        {
          name: '国内',
          id: 'guonei'
        },
        {
          name: '国际',
          id: 'guoji'
        },
        {
          name: '娱乐',
          id: 'yule'
        },
        {
          name: '体育',
          id: 'tiyu'
        },
        {
          name: '军事',
          id: 'junshi'
        },
        {
          name: '科技',
          id: 'keji'
        },
        {
          name: '财经',
          id: 'caijing'
        },
        {
          name: '时尚',
          id: 'shishang'
        }
      ]
      // 初始加载第一个
      this.tagId = this.catalogList[0].id
    },
    catalogClick (id) {
      if (this.tagId === id) return
      this.tagId = id
      console.log(id)
    }
  }
}
</script>
<style lang="less" scoped>
.newsInfo{
  width: 100%;
  display: flex;

  .catalogContainer{
    background-color: #fff;
    padding-top: 20px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    border-right: 0.5px solid #ccc;

    .catalogList{
      li{
        width: 200px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-bottom: 0.5px solid #ccc;
        font-size: 20px;
        color: rgb(116, 116, 116);
        cursor: pointer;
      }
      li.selected{
        color: #fff;
        border-color: #ff8a00;
        background-color: #ff8a00;
      }
      li:hover{
        border-color: #ff8a00;
        background-color: #ff8a00;

      }

    }
    .folder{
      cursor: pointer;
      position:absolute;
      right: -30px;
      top:20px;
      z-index: 10;
    }
  }
  section.content{
    margin: 10px 40px 20px 250px;
    background-color: #fff;
    min-width: 800px;
    width: calc(100% - 300px);
  }
  section.wider{
    margin: 0 auto ;
    width: calc(100% - 100px);
  }

}

</style>
