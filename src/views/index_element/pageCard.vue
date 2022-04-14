<template>
    <div class="pageCard">
        <div class="head_btn" v-if="paramsObj.dataId">
            <label @click="clickEdit($event)" class="edit_btn"></label>
            <label @click="clickDel($event)" class="del_btn" title="删除"></label>
        </div>
        <div class="cardCon">
            <div class="scaling-helper"></div>
            <div
                v-if="paramsObj.dataId"
                class="content"
                @click="openNewTag(paramsObj.url)"
            >
                <!-- <img src="./bgc.jpg" alt="静态路径"/> -->
                <img :src="domPicUrl" alt="动态路径" />
                <!-- <img :src="'' + this.paramsObj.picUrl" alt="拼接写在这不管用"/> -->
                <p class="title">{{ paramsObj.title }}</p>
            </div>
            <div
                v-if="!paramsObj.dataId"
                class="empty content"
                @click="clickEdit($event)"
            ></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'pageCard',
    props: {
        paramsObj: {
            default: function() {
                return {
                    id: 9,
                    dataId: 9,
                    url: 'https://www.baidu.com',
                    picName: 'background.jpeg',
                    title: '标题'
                }
            }
        }
    },
    data() {
        return {
            fileBtnId: String(Math.random()), // 保证每个文件在各自的dom中，不会覆盖
            domPicUrl: '',
            srcPath: '@/assets/images/backgrounds/' // 相对当前文件的相对路径，当前路径./成功！
        }
    },
    watch: {
        paramsObj: {
            handler(val) {
                this.initial()
            }
        }
    },
    created() {
        this.initial()
    },
    mounted() {},
    activated() {},
    updated() {},
    methods: {
        initial() {
            // 动态路径不同于静态，不能直接引用，要require引入，且路径必须是字符串形式
            // this.domPicUrl = require('../../assets/imgs/noHead@2x.png')
            // this.domPicUrl = require('@/assets/imgs/homepage_img3@2x.png')
            // 直接使用变量srcpath拼接会报错,因此采用部分拼接，以路径格式开头
            if (this.paramsObj.picName) {
                this.domPicUrl = require('@/assets/images/backgrounds/' +
                    this.paramsObj.picName)
            } else if(this.paramsObj.dataId) {
                this.domPicUrl = require(`@/assets/images/backgrounds/bg (${this.paramsObj.dataId}).jpg`            )
            }
        },
        // 把id传出去
        clickEdit(e) {
            this.$emit('editInfo', this.paramsObj)
        },
        clickDel(e) {
            this.$confirm('是否要删除该卡片?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$emit('delInfo', this.paramsObj)
                })
                .catch(() => {})
        },
        // getRequireUrl(name) {
        //     const url = require('@/assets/images/' + name)
        //     return url
        // },
        // 打开新窗口
        openNewTag(url) {
            window.open(url, '_blank')
        }
    }
}
</script>
<style lang="less" scoped>
.pageCard {
    position: relative;
    margin: 10% auto;
    width: 72%;
    .head_btn {
        display: none;
        position: absolute;
        z-index: 10;
        width: 100%;
        height: 24px;
        top: -10px;
        label {
            background-color: transparent;
            background: url('../../assets/images/controls-431.png');
            cursor: pointer;
            border: 0px none;
            height: 24px;
            width: 24px;
            -moz-appearance: none;
            position: absolute;
        }
        label.edit_btn {
            background-position: 177px 0px;
            left: 0px;
        }
        label.edit_btn:hover {
            background-position: 177px 25px;
        }
        label.bgc_btn {
            background-position: 207px 0px;
            left: 24px;
        }
        label.bgc_btn:hover {
            background-position: 207px 25px;
        }
        label.del_btn {
            background-position: 147px 0px;
            right: 0;
        }
        label.del_btn:hover {
            background-position: 147px 25px;
        }
    }
    .cardCon {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        transition: all 500ms ease;
        .scaling-helper {
            // 子元素设置100%，即位父元素的宽度，
            // 可以撑开一个正方形
            // margin-top: 100%;
            padding-top: 100%;
        }
        .content {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;

            border-radius: 50%;
            border: 1px solid #d8d8d8;
            overflow: hidden;
        }
        .content.empty {
            /*没有标签用虚线*/
            border-style: dashed;
            overflow: auto;
            background: url('../../assets/images/plus.png') scroll center center
                    no-repeat,
                url('../../assets/images/noise.png') repeat;
        }

        img {
            display: block;
            height: 100%;
            // width: 100%;
            transition: all 600ms ease;
        }
        p.title {
            display: block;
            /*background: rgb(250,250,250) none repeat scroll;*/
            position: absolute;
            bottom: 20px;
            height: 25px;
            width: 100%;
            overflow: hidden;
            font: normal 20px/25px 'KaiTi';
            color: white;
            text-align: center;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: all 400ms ease;
        }
    }
}
.pageCard:hover {
    .head_btn {
        display: block;
        z-index: 10;
    }
    .content {
        border-color: rgb(154, 159, 164);
        box-shadow: rgba(0, 0, 0, 0.85) 0 0 6px 0;
        cursor: pointer;
        img {
            transform: scale(1.2, 1.2);
            z-index: 1;
        }
        .title {
            background-color: rgba(0, 0, 0, 0.5);
            transform: scale(1.1, 1.3);
            color: #ff8800;
            z-index: 2;
        }
    }
}
</style>
