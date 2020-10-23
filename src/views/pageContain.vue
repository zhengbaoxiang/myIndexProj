<template>
 <div class="main_page">
    <ul class="pageList">
        <li v-for="(item,index) in dataList" :key='index'>
            <pageCard :paramsObj='item'
                      @editInfo="editInfo"
                      @delInfo="delInfo"
                      @getPicName="getPicName"
                      ></pageCard>
        </li>
    </ul>
    <div class="overlay  " v-if="showPopup">
      <div class="popup" >
              <input type="text" name='title' v-model="currentData.title" placeholder="标题">
              <input type="text" name='url' v-model="currentData.url">
              <button @click="cancel">取消</button>
              <button @click="confirm(currentData.id)">添加</button>
              <div class="close"></div>
      </div>
    </div>
  <footer>
    <div class="footer_link">
            <a href="#">I</a>
            <span>|</span>
            <a href="#">love</a>
              <span>|</span>
            <a href="#">you</a>
              <span>|</span>
            <a href="#">forever</a>
        </div>
        <p>每天都要开开心心哒</p>
</footer>
 </div>
</template>
<script>
import pageCard from './pageCard'
export default {
  name: 'pageContain',
  components: { pageCard },
  props: {
    tab_index: {
      default: 0
    }
  },
  data () {
    return {
      dataList: [],
      setLength: 5,
      currentData: {},
      showPopup: false
    }
  },
  created () {
    this.initialData()
  },
  mounted () { },
  activated () {},
  methods: {
    initialData () {
      // 从localStorage中读取。
      const myUrlListStr = window.localStorage.getItem('myUrlList')
      console.log(myUrlListStr)
      if (!myUrlListStr) {
        for (let i = 0; i < this.setLength; i++) {
          this.dataList.push({ id: i })
        }
      } else {
        const myUrlList = JSON.parse(myUrlListStr)
        this.dataList = myUrlList
      }
    },
    editInfo (data) {
      // 直接=赋值是浅拷贝，数据会联动
      this.currentData.id = data.id
      this.currentData.dataId = data.id + 1// 更新dataId
      this.currentData.url = data.url
      this.currentData.title = data.title
      this.showPopup = true
    },
    cancel () {
      this.currentData = {}
      this.showPopup = false
    },
    confirm (id) {
      // 根据 currentData 的Id保存最新网址
      this.showPopup = false
      this.dataList[id] = this.currentData

      this.updatePage()
    },
    delInfo (data) {
      console.log('Del', data)
      this.dataList[data.id] = { id: data.id }
      this.updatePage()
    },
    getPicName (data, name) {
      console.log('pic', data, name)
      this.dataList[data.id].picName = name
    },
    updatePage () {
      const dataListStr = JSON.stringify(this.dataList)
      window.localStorage.setItem('myUrlList', dataListStr)
    }

  }

}
</script>
<style lang="less" scoped>
.main_page{
    .pageList{
        padding: 10px;
        &>li{
            margin: 10px 0;

        }

    }

    .overlay{
        background: rgba(25,25,25,0.3) no-repeat repeat;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        margin: auto;
        z-index: 100;
        .popup{
            position: fixed;
            margin: auto;
            top: 40%;
            left: 50%;
            transform: translate(-50%);
            width: 500px;
            height: 100px;
            padding: 10px;
            background: white url("../assets/images/noise.png") repeat;
            border-color:rgb(154,159,164);
            box-shadow: rgba(0,0,0,0.85) 0 0 6px 0;
            z-index: 1000;
            .input{
                display: inline-block;
                margin: 8px 20px 0;
                width: 90%;
                height: 25px;
            }
            .close{
              background: transparent url("../assets/images/close.png") -9px -43px;
              border-radius:15px;
              cursor: pointer;
              height: 30px;
              width: 30px;
              position: relative;
              top: -130px;
              left: 500px
            }

    }

    }

}

</style>
