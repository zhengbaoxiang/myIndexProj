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
     <div class="mask" v-if="showPopup">
        <div class="popUP" >
            <div>
                <label for="">标题</label>
                <input type="text" name='输' v-model="currentData.title">
            </div>
            <div>
                <label for="">网址</label>
                <input type="text" name='输' v-model="currentData.url">
            </div>
            <div>
                <button @click="cancel">取消</button>
                <button @click="confirm(currentData.id)">确认</button>
            </div>
        </div>
     </div>
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

    .mask{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(255,255,255,0.5);
        z-index: 100;
        .popUP{
            position: fixed;
            margin: auto;
            top: 40%;
            left: 50%;
            transform: translate(-50%);
            background-color: #fff;
            z-index: 1000;
            padding: 20px;

    }

    }

}

</style>
