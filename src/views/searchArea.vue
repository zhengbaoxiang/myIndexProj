<template>
<div class="searchArea">
     <form action="http://www.baidu.com/s" class="search_form" target="_blank">
        <a href="http://www.baidu.com/"></a>
        <input type="text" name="wd" id="input_con" placeholder="search" value="" autofocus  autocomplete="off">
        <input type="submit" name="" id="submit_con" value="百度一下">
    </form>
</div>
</template>
<script>
// import pageCard from './pageCard'
export default {
  name: 'searchArea',
  components: { },
  props: { },
  data () {
    return {}
  },
  created () {
  },
  mounted () { },
  activated () {},
  methods: { }

}
</script>
<style lang="less" scoped>
.searchArea {
    width: 100%;
    margin: auto;
    /*background-color: #d6e9c6;*/
    .search_form {
      height: 42px;
      width: 610px;
      margin: 30px auto 15px;
      /*overflow: hidden;*/
      font-size: 0;
      /*background-color: #cecece;*/
      a{
        display: inline-block;
        height: 40px;
        width: 100px;
        text-align: center;
        vertical-align: top;
        background: url("../assets/images/bd_logo1.png") center -4px no-repeat;
        background-size: cover;
        /*background-color: red;*/
      }
      #input_con{
        display: inline-block;
        vertical-align: bottom;
        height: 38px;
        width: 400px;
        margin: 1px 0 0 5px;
        padding: 0px 5px;
        border: 1px solid rgb(216,216,216) ;

        font:normal 20px/37px "KaiTi";
        /*/* 去掉获得焦点(点击)时显示的蓝色的框   */
        /*outline:none;*/
      }
        #submit_con {
        display: inline-block;
        width: 83px;
        height: 40px;
        cursor: pointer;
        border: 0;
        background-color:#3385ff ;
        margin: 0px 2px;
        color: white;

      }

    }

}

</style>
