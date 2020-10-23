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

    <div class="empty content" v-if="!paramsObj.dataId">
        <img :src="domPicUrl" alt="动态路径"/>
        <p @click="clickEdit($event)" class="title">添加</p>

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
          picName: 'homepage_banner@2x.png',
          title: '标题'
        }
      }
    }
  },
  data () {
    return {
      fileBtnId: String(Math.random()), // 保证每个文件在各自的dom中，不会覆盖
      domPicUrl: '',
      srcPath: '../../assets/imgs/' // 相对当前文件的相对路径，当前路径./成功！
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
      this.domPicUrl = require('../../assets/imgs/' + this.paramsObj.picName)
    } else {
      this.domPicUrl = require('../../assets/imgs/noHead@2x.png')
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
      this.domPicUrl = require('../../assets/imgs/' + fileName)
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
  height: 180px;
  overflow: hidden;
  .head_btn{
    // display: none;
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    label{
      display: inline-block;
      margin: 0 10px;
      height: 20px;
      width: 20px;
      cursor: pointer;
      background-size: contain;
      background-repeat: no-repeat;

    }
    .edit_btn{
      background-image: url('../../assets/imgs/appraise.png');
    }
    .bgc_btn{
      background-image: url('../../assets/imgs/CertFile@2x.png');
    }
    .del_btn{
      float: right;
      background-image: url('../../assets/imgs/close@2x.png');
    }
  }
  .content{
    position: relative;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
    p.title{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
      text-align: center;
      cursor: pointer;
    }
  }

  &:hover{
    .head_btn{
      display: block;
      background-color:rgba(255, 244, 244, 0.4);
      border-bottom: 1px dashed grey;
      color: red;
    }
    .content{
      .title{
        color: yellow;
        font-size: 20px;
      }
    }

  }
}

</style>
