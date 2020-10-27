<template>
<div class="message">
  <h1>新闻列表</h1>
    <ol class="pageList" >
            <li v-for="(item,index) in NewsList"
              :key='item.uniquekey || index'>
              <a :href="item.url" target="__blank">{{item.title}}</a>
              <br>
              <span>{{item.date}}</span>
              <p class="">{{item.author_name}}</p>
              <ol class="img_zone">
                <img :src="item.thumbnail_pic_s" alt="">
                <img :src="item.thumbnail_pic_s02" alt="">
                <img :src="item.thumbnail_pic_s03" alt="">
              </ol>
              <br>
            </li>
    </ol>
    <ol class="pageList" v-if="this.name === 'BookCatalog'">
            <li
              v-for="(item,index) in catalogList"
              @click="bookQuery(item.id)"
              :key='index'>
              <span>{{item.id}}</span>- <span>{{item.catalog}}</span>
            </li>
    </ol>

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
      catalogList: [],
      bookList: [],
      NewsList: [],
      setLength: 24,
      currentData: {},
      showPopup: false,
      name: ''
    }
  },
  created () {
    console.log(this.$route)
  },
  mounted () {
    this.initialData()
  },
  activated () {},
  methods: {
    initialData (name) {
      // this.getPics()
      this.getNews()
      this.getBookCatalog()
    },
    getBookCatalog () {
      this.name = 'BookCatalog'
      this.getData(this.name, 'getBookCatalog', (data) => {
        this.catalogList = data
      })
    },
    bookQuery (id) {
      console.log(id)
    },
    getNews () {
      /* type 类型 - 字符串，非必填
        top(头条，默认),shehui(社会),guonei(国内),
        guoji(国际),yule(娱乐),tiyu(体育)junshi(军事),
        keji(科技),caijing(财经),shishang(时尚)
      */
      this.name = 'NEWS'
      const type = 'yule'

      this.getData(type, 'getNews', type, (data) => {
        this.NewsList = data
      })
    },
    getData (dataName, apiName, apiParams, callback) {
      // 从localStorage中读取
      const myDataListStr = window.localStorage.getItem(dataName)
      // 如果本地没有存储过，则使用接口数据
      if (myDataListStr) {
        console.log('dataName =', dataName)
        callback(JSON.parse(myDataListStr))
        return
      }
      myApi[apiName](apiParams).then((resp) => {
        console.log('接口resp', resp)
        let tempList = []
        if (apiName === 'getNews') {
          tempList = resp.result.data || []
        } else if (apiName === 'getBookCatalog') {
          tempList = resp.result
        }
        const dataListStr = JSON.stringify(tempList)
        window.localStorage.setItem(dataName, dataListStr)
        callback(tempList)
      })
    },
    getPics (params) {
      myApi.getPics(params).then((resp) => {
        console.log('resp', resp)
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
