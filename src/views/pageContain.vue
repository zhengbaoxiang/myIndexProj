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
              <input type="text" name='title' v-model="currentData.title" autocomplete='off' placeholder="标题" autofocus >
              <input type="text" name='url'   v-model="currentData.url"   autocomplete='off' placeholder="网址" >
              <button @click="cancel">取消</button>
              <button @click="confirm(currentData)">添加</button>
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
      this.currentData = {
        id: data.id,
        dataId: data.id + 1, // 更新dataId
        url: data.url,
        title: data.title
      }
      this.showPopup = true
    },
    cancel () {
      this.currentData = {}
      this.showPopup = false
    },
    confirm (data) {
      if (!data.title) {
        console.log('不能为空')
        return
      }
      // 直接=赋值是浅拷贝，数据会联动
      this.dataList[data.id] = {
        id: data.id,
        dataId: data.dataId,
        url: data.url,
        title: data.title
      }
      this.showPopup = false
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
        display: flex;
        flex-wrap: wrap;
        &>li{
            margin: 10px 10px;
            width: calc(90% / 3);
            max-width: 300px;
            flex: 0 1 auto;
        }
    }
    .overlay{
        background: rgba(25,25,25,0.3) no-repeat repeat;
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        margin: auto;
        z-index: 100;
        .popup{
            position: fixed;
            margin: auto;
            top: 35%;
            left: 50%;
            transform: translate(-50%);
            width: 500px;
            padding: 10px;
            background: white url("../assets/images/noise.png") repeat;
            border-color:rgb(154,159,164);
            box-shadow: rgba(0,0,0,0.85) 0 0 6px 0;
            z-index: 1000;
            input{
                display: block;
                margin: 20px 20px 3px;
                padding: 1px 5px;
                width: 90%;
                height: 30px;
                border: 0.5px solid grey;
            }
            button{
              width: 80px;
              height: 30px;
              margin: 15px 0 20px 20px;
              padding: 0px;
            }
            .close{
              background: transparent url("../assets/images/close.png") -9px -43px;
              border-radius:15px;
              cursor: pointer;
              height: 30px;
              width: 30px;
              position: absolute;
              top: -15px;
              right:-15px
            }

    }

    }

}

</style>
