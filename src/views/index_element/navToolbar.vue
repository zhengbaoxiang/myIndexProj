<template>
    <div class="navtoolbar">
        <button @click="showNav = !showNav">导航栏</button>
        <nav v-show="showNav">
            <ul>
                <li
                    @click="goto(item.routeName)"
                    class="link"
                    v-for="(item, index) in linkList"
                    :key="index"
                >
                    {{ item.title }}
                </li>
            </ul>
        </nav>
    </div>
</template>
<script>
export default {
    name: 'navtoolbar',
    components: {},
    props: {},
    data() {
        return {
            showNav: false,
            linkList: [
                {
                    title: 'web系统',
                    routeName: '/management'
                },
                {
                    title: '图片识别',
                    routeName: window.myConfig.publicPath + 'picTotext'
                }
            ]
        }
    },
    created() {},
    mounted() {},
    activated() {},
    methods: {
        goto(name) {
            console.log(name)
            console.log(window.location)
            const url = window.location.origin + name
            window.open(url, '_blank')
        }
    }
}
</script>
<style lang="less" scoped>
.navtoolbar {
    position: absolute;
    top: 20px;
    right: 20px;
    span {
        background-color: #ff8800;
    }
    nav ul {
        position: fixed;
        right: 0px;
        background-color: #fff;
        transition: all 600ms ease;
        z-index: 11;
        .link {
            height: 40px;
            width: 100px;
            border-bottom: 1px solid grey;
            box-sizing: border-box;
            padding: 5px 5px 5px 10px;
            line-height: 30px;
            cursor: pointer;
        }
    }
}
</style>
