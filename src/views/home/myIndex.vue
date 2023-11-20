<template>
    <div class="myIndex" :style="styleObj">
        <myheader></myheader>
        <searchArea></searchArea>
        <pageContain></pageContain>
        <navtoolbar></navtoolbar>
        <toolbar @getBgName="getBgName"></toolbar>
        <myfooter></myfooter>
        <div class="bubbleCon">
            <div class="bubble"></div>
        </div>
    </div>
</template>
<script>
import myheader from '@/views/index_element/myHeader'
import navtoolbar from '@/views/index_element/navToolbar'
import toolbar from '@/views/index_element/toolbar'

import searchArea from '@/views/index_element/searchArea'
import pageContain from '@/views/index_element/pageContain'
import myfooter from '@/views/index_element/myfooter'

import { blobToDataURL } from '@/libs/util'
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
    data() {
        return {
            bgName: 'bg2.gif',
            styleObj: {}
        }
    },
    created() {},
    mounted() {
        this.initial()
    },
    activated() {},
    methods: {
        initial() {
            // const url = require('@/assets/images/' + this.bgName)
            let url = window.localStorage.getItem('bgUrl') || ''
            if (url) {
                // console.log('->', url, '<')
                //  js动态控制背景地址
                this.styleObj = {
                    color: '#3E4255',
                    'background-image': `url(${url})`
                }
            }
        },
        getBgName(file) {
            // console.log('-file>', file, '<')
            blobToDataURL(file, (res) => {
                // console.log('-url>', res, '<')
                const base64Url = res
                this.styleObj = {
                    color: '#3E4255',
                    'background-image': `url(${base64Url})`
                }
                window.localStorage.setItem('bgUrl', base64Url)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.myIndex {
    width: 100%;
    height: 100%;
    background: rgba(53,54,58,1);
    //   background: url("@/assets/images/background.jpeg")  no-repeat; //失败 Can't resolve './@/assets/images/background.jpeg'
    background: url('../../assets/images/bg2.gif') no-repeat; //成功
    background-size: cover;
    // background-size: 100% 100%;
    background-attachment: fixed;
    font-size: 16px;
    overflow: hidden;

    .bubbleCon {
        width: 50px;
        height: 50px;
        position: fixed;
        left: -100px;
        bottom: 0px;
        // border: 1px solid red;
        // transition: all 2s;
        animation: move 15s ease 0s infinite alternate;
        // -webkit-animation: move 5s linear 2s infinite alternate;
        .bubble {
            height: 100%;
            // border: 1px solid #ff6600;
            border-radius: 50%;
            background: url('../../assets/images/bubble.jpeg');
            background-size: cover;
        }
    }
    @keyframes move {
        from {
            left: -100px;
            transform: rotateZ(0);
        }
        to {
            left: 100%;
            transform: rotateZ(1800deg);
        }
    }
}
</style>
