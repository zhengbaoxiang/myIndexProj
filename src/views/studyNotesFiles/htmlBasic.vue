<template >
<div class="htmlBasic">
  <div class="container mtb10 clearfix">
      <h1 class="bigTitle">{{title}}</h1>
      <div class="midcont clearfix">
        <h2 class="midTitle">二级标题</h2>
          <div class="smallcont clearfix">
            <h3 class="smallTitle">三级标题</h3>
            <p class="text">
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
            </p>
            <h3 class="smallTitle">三级标题</h3>
            <p class="text">
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
              文本锻炼卡德加了法律的附近开了法律骄傲的立刻解
              放飞机阿里会计分录发简历
            </p>
          </div>
      </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'htmlBasic',
  data () {
    return {
      id: '1',
      title: '大标题居中'
    }
  },
  created () {
    this.initial()
  },
  mounted () {

  },
  activated () {
    console.log('activated', this.$route.query)
  },
  methods: {
    initial () {
      console.log('初始化')
      console.log(this.$route.query)
      this.title = this.$route.query.title
      // this.$set(this, 'title', this.$route.query.title)
    }
  }

}
</script>
<style lang="less" scoped>
.htmlBasic{
  .container{
    min-height: 100px;
    .bigTitle{
      font-size: 44px;
      height: 60px;
      font-weight: bold;
     }
    .midTitle{
      margin: 20px 30px 0;
      font-size: 30px;
      font-weight: bold;
      text-align: left;

     }
    .smallTitle{
      margin: 10px 40px 0;
      font-size: 22px;
      font-weight: normal;
      text-align: left;
      }
    .text{
      margin:20px  50px 20px;
      padding: 5px;
      text-align: left;
      }
  }

}

</style>
