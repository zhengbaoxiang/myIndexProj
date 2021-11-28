<template>
    <footer class="myfooter">
        <div class="footer_link">
            <a href="#">By</a>
            <span></span>
            <a href="#">Neo</a>
        </div>
    </footer>
</template>
<script>
export default {
    name: 'myfooter',
    components: {},
    props: {},
    data() {
        return {}
    },
    created() {},
    mounted() {},
    activated() {},
    methods: {}
}
</script>
<style lang="less" scoped>
footer.myfooter {
    position: fixed;
    bottom: 0px;
    width: 100%;
    /*border-top: 2px solid lightgray;*/
    background: rgba(242, 242, 242, 0.1);
    /*border-bottom: 1px solid #cecece;*/
    .footer_link {
        text-align: center;
        // margin-top: 8px;
        a {
            color: rgb(165, 161, 161);
            font-size: 14px;
        }
        a:hover {
            color: #f80;
        }
        span {
            color: #4e4e4e;
            font-size: 14px;
            padding: 0px 10px;
        }
    }
    p {
        text-align: center;
        margin: 5px auto 3px;
        font-size: 13px;
        color: rgb(165, 161, 161);
    }
}
</style>
