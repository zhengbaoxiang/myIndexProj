<template>
    <div class="myHeader">
        <header>
            <div class="header_con">
                <div id="haed_time" v-html="timeStr"></div>
            </div>
        </header>
    </div>
</template>
<script>
export default {
    name: 'myHeader',
    components: {},
    props: {},
    data() {
        return {
            timeStr: '',
            dateStr: '',
            timer: null
        }
    },
    created() {
        let date = window.localStorage.getItem('headDate') || myConfig.initialTime
        this.initialData(date)
    },
    mounted() {
        // 监听change事件，同时附带回调函数处理传值
        EVENT_BUS.$on('headDateChange', this.handleChange)
    },
    activated() {},
    methods: {
        handleChange(value) {
            window.localStorage.setItem('headDate', value)
            this.initialData(value)
        },
        initialData(value) {
            this.dateStr = value
            this.fnTimeleft(value)
            clearInterval(this.timer)
            this.timer = setInterval(this.fnTimeleft, 60000)
        },
        fnTimeleft(dateStr) {
            dateStr = dateStr || this.dateStr
            // console.log('dateStr:参数：', dateStr)
            // 实际开发需要通过ajax来读取后台的时间
            var sNow = new Date()
            // 未来时间：12月31日晚24点
            var sFuture = new Date(dateStr).setHours(0, 0, 0)
            // 计算还有多少秒
            var sLeft = parseInt((sFuture - sNow) / 1000)
            // 计算还剩多少天
            var iDays = parseInt(sLeft / 86400)
            // 计算还剩多少小时
            var iHours = parseInt((sLeft % 86400) / 3600)
            // 计算还剩多少分
            var iMinutes = parseInt(((sLeft % 86400) % 3600) / 60)
            // 计算还剩多少秒
            // var iSeconds = sLeft % 60
            var sTr =
                `距离${dateStr}还剩:<strong>${iDays}</strong>天${this.fnTodou(
                    iHours
                )}时` + `${this.fnTodou(iMinutes)}分`
            this.timeStr = sTr
        },
        fnTodou(n) {
            if (n < 10) {
                return '0' + n
            } else {
                return n
            }
        }
    }
}
</script>
<style lang="less" scoped>
.myHeader {
    padding-top: 10px;
    header {
        width: 100%;
        height: 30px;
        position: relative;
        .header_con {
            width: 60%;
            height: 100%;
            margin: 0 auto;
            text-align: center;
            vertical-align: center;
            /*background-color: gold;*/
            #haed_time {
                font: 28px/30px 'KaiTi';
                color: #ffc107;
            }
        }
    }
}
</style>
