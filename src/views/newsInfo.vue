<template>
<div class="newsInfo">
  <h1>新闻列表</h1>
    <ol class="pageList" >
            <li v-for="(item,index) in dataList"
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

</div>
</template>
<script>
import myUtils from '@/utils/myUtils'
export default {
  name: 'newsInfo',
  props: {
    tab_type: {
      default: 'yule'
    }
  },
  data () {
    return {
      dataList: []
    }
  },
  created () {
    this.initialData()
  },
  mounted () { },
  activated () {},
  methods: {
    initialData () {
      console.log(this.$route)
      this.getNews()
    },
    getNews () {
      /* type 类型 - 字符串，非必填
        top(头条，默认),shehui(社会),guonei(国内),
        guoji(国际),yule(娱乐),tiyu(体育)junshi(军事),
        keji(科技),caijing(财经),shishang(时尚)
      */
      const saveName = this.tab_type
      const apiParams = this.tab_type
      myUtils.getApiData(saveName, 'getNews', apiParams, (data) => {
        this.dataList = data
      })
    }
  }
}
</script>
<style lang="less" scoped>
.newsInfo{
  width: 100%;
  height: 200px;
  background-color: #fff;

}

</style>
