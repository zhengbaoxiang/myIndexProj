<template>
    <div class="myIndex" :style="styleObj">
        <myheader></myheader>
        <searchArea></searchArea>
        <pageContain></pageContain>
        <navtoolbar></navtoolbar>
        <toolbar></toolbar>
        <myfooter></myfooter>
    </div>
</template>
<script>
import myheader from '@/views/index_element/myHeader'
import navtoolbar from '@/views/index_element/navToolbar'
import toolbar from '@/views/index_element/toolbar'

import searchArea from '@/views/index_element/searchArea'
import pageContain from '@/views/index_element/pageContain'
import myfooter from '@/views/index_element/myfooter'
export default {
    name: 'myIndex',
    components: {
        myheader,
        searchArea,
        navtoolbar,
        toolbar,
        pageContain,
        myfooter
    },
    props: {
        tab_index: {
            default: 0
        }
    },
    data() {
        return {
            bgName: 'bg2.gif',
            styleObj: {}
        }
    },
    created() {},
    mounted() {},
    activated() {},
    methods: {
        initial() {
            //  js动态控制背景地址
            //   const url = require('@/assets/images/' + this.bgName)
            //   console.log('->', url,'<');
            //   this.styleObj = { color: '#3E4255', 'background-image': `url(${url})` }
        }
    }
}
</script>
<style lang="less" scoped>
.myIndex {
    width: 100%;
    height: 100%;
    //   background: url("@/assets/images/background.jpeg")  no-repeat; //失败 Can't resolve './@/assets/images/background.jpeg'
    background: url('../../assets/images/bg2.gif') no-repeat; //成功
    background-size: cover;
    background-attachment: fixed;
    font-size: 16px;
    overflow: hidden;
}
</style>
