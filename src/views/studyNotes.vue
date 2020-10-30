<template>
<div class="newsInfo">
  <!-- <h1>前端知识学习笔记</h1> -->
  <div class="catalogContainer">
    <div class="folder" @click="showCatalog=!showCatalog"
      >点击折叠
    </div>
    <ol class="catalogList" v-show="showCatalog">
      <div>
        <router-link to="/studyNotes/booksInfo">跳转-demo</router-link>
      </div>
      <li
        v-for="(item,index) in catalogList"
        @click="catalogClick(item.routerName)"
        :class="{'selected':tagId===item.title}"
        :key='index'
      >
        <router-link :to="{path:'/studyNotes/'+item.routerName+'?'+index}">跳转{{item.title}}</router-link>
      </li>
      </ol>
  </div>

  <section class="content clearfix" :class="{wider:!showCatalog}">
    <router-view/>
  </section>
</div>
</template>
<script>
import pageList from '@/views/studyNotesFiles/pages'
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
      // console.log(pageList)
      this.catalogList = pageList
      // 初始加载第一个
      this.tagId = this.catalogList[0].routerName
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
  section.content.wider{
    margin: 0 auto ;
    width: calc(100% - 100px);
  }

}

</style>
