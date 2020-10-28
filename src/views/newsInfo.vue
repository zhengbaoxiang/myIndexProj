<template>
<div class="newsInfo">
  <h1>新闻列表</h1>
    <ol class="pageList" >
        <li
          v-for="(item,index) in catalogList"
          @click="getNews(item.id)"
          :class="{'selected':tagId===item.id}"
          :key='index'>
          <!-- <span>{{item.id}}</span> -->
          <span>{{item.name}}</span>
        </li>
      </ol>
    <ol class="dataList" >
            <li v-for="(item,index) in dataList"
              :key='item.uniquekey || index'
              >
              <a :href="item.url" target="__blank">{{item.title}}</a>
              <div class="img_zone">
                <img :src="item.thumbnail_pic_s" alt="">
                <!-- <img :src="item.thumbnail_pic_s02" alt="">
                <img :src="item.thumbnail_pic_s03" alt=""> -->
              </div>
              <p class="">{{item.author_name}}</p>
              <span>{{item.date}}</span>
            </li>
    </ol>
    <div class="clearfix">
      <my-pagination
        :dataNums="dataNums" :tagId="tagId"
        @changePages="changePages"></my-pagination>
    </div>

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
      this.getNews(this.catalogList[0].id)
    },
    getNews (type = 'top') {
      /* type 类型 - 字符串，非必填
        top(头条，默认),shehui(社会),guonei(国内),
        guoji(国际),yule(娱乐),tiyu(体育)junshi(军事),
        keji(科技),caijing(财经),shishang(时尚)
      */
      this.tagId = type
      myUtils.getApiData(type, 'getNews', type, (res) => {
        this.dataList = res.data.slice(0, 8)
        this.dataNums = res.data.length
      })
    },
    changePages (index, counts = 8) {
      // index表示第一页，counts表示每页显示几个，默认为8
      console.log(`拿到子组件传值index=${index}，重新调接口`)
      this.getNews(this.tagId)
    }
  }
}
</script>
<style lang="less" scoped>
.newsInfo{
  width: 100%;
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
