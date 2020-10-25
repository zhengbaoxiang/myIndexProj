<template>
<div class="pageCard">
    <div class="head_btn" v-if="paramsObj.dataId">
        <label @click="clickEdit($event)" class="edit_btn"></label>
        <label :for="fileBtnId"           class="bgc_btn"></label>
        <input type="file"  style="display:none"  :id='fileBtnId'
            accept="image/*" @change="fileChange($event)"   />
        <label @click="clickDel($event)" class="del_btn"></label>
    </div>
    <div @click="openNewTag(paramsObj.url)" class="content" v-if="paramsObj.dataId" >
        <!-- <img src="./bgc.jpg" alt="静态路径"/> -->
        <img :src="domPicUrl" alt="动态路径"/>
        <!-- <img :src="'' + this.paramsObj.picUrl" alt="写在这不管用"/> -->
        <p class="title">{{paramsObj.title}}</p>
    </div>

    <div @click="clickEdit($event)"  class="empty content" v-if="!paramsObj.dataId">
    </div>
</div>
</template>
<script>
export default {
  name: 'pageCard',
  props: {
    paramsObj: {
      default: function () {
        return {
          id: 9,
          dataId: 9,
          url: 'https://www.baidu.com',
          picName: 'bg.jpg',
          title: '标题'
        }
      }
    }
  },
  data () {
    return {
      fileBtnId: String(Math.random()), // 保证每个文件在各自的dom中，不会覆盖
      domPicUrl: '',
      srcPath: '@/assets/images/backgrounds/' // 相对当前文件的相对路径，当前路径./成功！
    }
  },
  watch: {

  },
  created () {
    // 动态路径不同于静态，不能直接引用，要require引入，且路径必须是字符串形式
    // this.domPicUrl = require('../../assets/imgs/noHead@2x.png')
    // this.domPicUrl = require('@/assets/imgs/homepage_img3@2x.png')
    // 直接使用变量srcpath拼接会报错,因此采用部分拼接，以路径格式开头
    if (this.paramsObj.picName) {
      this.domPicUrl = require('@/assets/images/backgrounds/' + this.paramsObj.picName)
    } else {
      this.domPicUrl = require('@/assets/images/backgrounds/bg (17).jpg')
    }
  },
  mounted () { },
  activated () {},
  updated () {
    // console.log(this.paramsObj)
  },
  methods: {
    // 把id传出去
    clickEdit (e) {
      this.$emit('editInfo', this.paramsObj)
    },
    clickDel (e) {
      console.log('Del', this.paramsObj.id)
      this.$emit('delInfo', this.paramsObj)
    },
    fileChange (el) {
      if (!el.target.files[0].size) return
      const files = el.target.files
      const fileName = files[0].name
      // el.target.value = ''
      // 修改背景 文件名传出去
      console.log(el, fileName)
      // this.domPicUrl = require('./' + fileName) //当前路径可以切换
      this.domPicUrl = require('@/assets/images/backgrounds/' + fileName)
      this.$emit('getPicName', this.paramsObj, fileName)
    },
    // 没有后台服务的情况，上传保存图片背景比较困难，暂时搁置，使用本地图片
    Upload () {
      console.log('todo')
    },
    // 打开新窗口
    openNewTag (url) {
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.pageCard{
  position: relative;
  width: 100% ;
  height: 100%;
  .head_btn{
    display: none;
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 24px;
    label{
      background-color: transparent;
      background: url("../assets/images/controls-431.png");
      cursor: pointer;
      border: 0px none;
      height: 24px;
      width: 24px;
      -moz-appearance: none;
      position: absolute;
    }
    label.edit_btn{
      background-position: 177px 0px;
      left: 0px;
    }
    label.edit_btn:hover{
      background-position: 177px 25px;
    }
    label.bgc_btn{
      background-position: 207px 0px;
      left: 24px;
    }
    label.bgc_btn:hover{
     background-position: 207px 25px;
    }
    label.del_btn{
      background-position: 147px 0px;
      right: 0;
    }
    label.del_btn:hover{
      background-position: 147px 25px;
    }
  }
  .content{
    position: relative;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    color: rgb(60,60,60);
    border: 1px solid #d8d8d8;
    transition: all 500ms ease;
    img {
      display: block;
      height: 100%;
      width: 100%;
      transition: all 600ms ease;
    }
    p.title{
      display: block;
      /*background: rgb(250,250,250) none repeat scroll;*/
      position: absolute;
      bottom: 0;
      height: 25px;
      width: 100%;
      overflow: hidden;
      font: normal 20px/25px "KaiTi";
      color: white;
      text-align: center;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: all 400ms ease;
    }
  }
  .content:hover{
    border-color:rgb(154,159,164);
    box-shadow: rgba(0,0,0,0.85) 0 0 6px 0;
    cursor: pointer;
    .head_btn{
      display: block;
    }
    img{
      transform: scale(1.2,1.2);
      z-index: 1;
    }
    .title{
      transform: scale(1.5,1.5);
      color: #ff8800;
      z-index: 2;
    }
  }
  .content.empty{
    /*没有标签用虚线*/
    border-style:dashed ;
    overflow: auto;
    background: url("../assets/images/plus.png") scroll center center no-repeat,url("../assets/images/noise.png" ) repeat;
  }
}

</style>
