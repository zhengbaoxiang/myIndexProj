<template>
<div class="booksInfo">
  <h1>图书馆</h1>
    <ol class="pageList" >
      <li
        v-for="(item,index) in catalogList"
        @click="bookQuery(item.id)"
         :class="{'selected':tagId===item.id}"
        :key='index'>
        <!-- <span>{{item.id}}</span> -->
        <span>{{item.catalog}}</span>
      </li>
    </ol>
    <ol class="dataList" >
      <li v-for="(item,index) in dataList" :key='index'>
        <h4>《{{item.title}}》</h4>
        <img :src="item.img" alt="暂无照片"  @error="_imageError">
        <div>
          <p>{{item.catalog}}</p>
          <p>{{item.bytime}}</p>
          <p>{{item.reading}}</p>
          <p>{{item.tags}}</p>
          <!-- <p>{{item.sub2}}</p> -->
        </div>
      </li>
    </ol>
    <div class="clearfix">
      <my-pageButton
        :dataNums="dataNums" :tagId="tagId"
        @changePages="changePages"></my-pageButton>
    </div>

</div>
</template>
<script>
import myUtils from '@/utils/myUtils'
export default {
  name: 'booksInfo',
  props: {
    tab_index: {
      default: 0
    }
  },
  components: { },
  data () {
    return {
      catalogList: [],
      dataList: [],
      tagId: 0,
      dataNums: 0

    }
  },
  created () {
    this.initialData()
  },
  mounted () { },
  activated () {},
  methods: {
    initialData (name) {
      console.log(this.$route)
      this.getCatalog()
    },
    getCatalog () {
      const saveName = 'BookCatalog'
      const apiParams = ''
      myUtils.getApiData(saveName, 'getBookCatalog', apiParams, (data) => {
        this.catalogList = data
      })
    },
    bookQuery (id, params = {}) {
      if (this.tagId === id && !params.startIndex && params.startIndex !== 0) return
      this.tagId = id
      const apiParams = {
        catalog_id: id,
        startIndex: params.startIndex || 0,
        counts: params.counts || 8
      }
      myUtils.getApiData(id, 'getBooks', apiParams, (res) => {
        this.dataList = res.data
        this.dataNums = res.totalNum
      })
    },
    changePages (index, counts = 8) {
      // index表示第一页，counts表示每页显示几个，默认为8
      const params = {
        startIndex: index * counts - counts,
        counts: counts
      }
      console.log(`拿到子组件传值index=${index}，重新调接口`)
      this.bookQuery(this.tagId, params)
    }
  }

}
</script>
<style lang="less" scoped>
.booksInfo{
  width: 100%;
  // height: 80%;
  background-color: #fff;
  margin: 0 auto;
  padding: 0px 100px 50px ;
  width: 1010px;

  .pageList{
    display: flex;
    flex-wrap: wrap;
    li{
      width: 200px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      border: 0.5px solid #ccc;
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
  .dataList{
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
    li{
      width: 250px;
      font-size: 18px;
      border: 0.5px solid grey;
      text-align: center;
      h4{
        height: 30px;
        width: 90%;
        line-height: 30px;
        margin: 0 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      img{
        width: 200px;
        height: 200px;
      }
      p{
        font-size: 14px;
      }

    }
  }

}

</style>
