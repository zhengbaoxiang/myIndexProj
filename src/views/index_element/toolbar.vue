<template>
    <div class="toolbar" id="toolbar">
        <nav class="nav" v-show="true">
            <label @click="showSetting = !showSetting" class="set_btn"></label>
            <label :for="fileBtnId" class="bgc_btn"></label>
            <input
                type="file"
                style="display:none"
                :id="fileBtnId"
                accept="image/*"
                @change="fileChange($event)"
            />
        </nav>
        <div class="overlay" v-if="showSetting">
            <ul class="popup rel">
                <p class="title">请选择倒计时日期：</p>
                <el-date-picker
                    type="date"
                    size="small"
                    value-format="yyyy-MM-dd"
                    v-model="selectDate"
                    @change="chooseDate"
                    placeholder="选择日期"
                >
                </el-date-picker>
                <!-- <div class="originDate">
                    <input
                        type="date"
                        name="mdate"
                        id="sdate"
                        v-model="selectDate"
                        @change="originChange(selectDate)"
                    />
                </div> -->
                <p class="title">请选择布局方案：</p>
                <li v-for="(item, index) in gridList" :key="index">
                    <input
                        type="radio"
                        name="set"
                        :value="item.value"
                        :checked="item.value === curValue"
                        :id="item.value"
                        @click="chooseGridNum(item)"
                    />
                    <label :for="item.value" style="margin-left:5px">{{
                        item.title
                    }}</label>
                </li>
                <div class="bottomZone">
                    <button @click="cancel">关闭</button>
                    <button @click="resetClick">重置</button>
                </div>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    // template:template,
    name: 'toolbar',
    components: {},
    props: {},
    data() {
        return {
            fileBtnId: String(Math.random()), // 保证每个文件在各自的dom中，不会覆盖
            showSetting: false,
            curValue: '15',
            selectDate: window.localStorage.getItem('headDate'),
            gridList: [
                {
                    title: '2x5',
                    value: '10'
                },
                {
                    title: '3x5',
                    value: '15'
                }
            ]
        }
    },
    created() {},
    mounted() {
        this.initial()
    },
    activated() {},
    methods: {
        initial() {
            let temp = window.localStorage.getItem('gridNum')
            this.curValue = temp || this.curValue
        },

        // 选择倒计时日期
        chooseDate(value) {
            // 刷新页面布局
            this.selectDate = value
            EVENT_BUS.$emit('headDateChange', value)
        },
        originChange(value){
            EVENT_BUS.$emit('headDateChange', value)
        },
        chooseGridNum(data) {
            // console.log(data.value)
            this.curValue = data.value
            window.localStorage.setItem('gridNum', data.value)
            // 刷新页面布局
            EVENT_BUS.$emit('gridNumChange', data.value)
            // this.showPopup = false
        },
        fileChange(el) {
            if (!el.target.files[0].size) return
            const file = el.target.files[0]
            // 修改背景 文件名传出去
            // 处理blob文件
            this.$emit('getBgName', file)
        },
        cancel() {
            this.showSetting = false
        },
        resetClick() {
            this.$confirm('重置全部数据？, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.resetConfirm()
                })
                .catch(() => {})
        },
        resetConfirm() {
            this.showSetting = false
            // 重置按钮,清掉所有存储数据
            window.localStorage.clear()
            window.location.reload() // 刷新页面，不重复提交页面。
            // window.location.href=window.location.href // 刷新页面，不重复提交页面。
            // location = location
            // location.replace(location.href) //刷新页面，不重复提交页面。
            // window.location.replace(location) //重定向一个页面，也可以为当前页面。
        }
    }
}
</script>

<style lang="less">
// /* 工具栏 */
.toolbar {
    position: absolute;
    bottom: 150px;
    right: 15px;
    height: 100px;
    width: 50px;
    z-index: 2;
}

#toolbar.toolbar nav label {
    display: block;
    background-color: transparent;
    cursor: pointer;
    border: 0px none;
    height: 40px;
    width: 40px;
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.5;
    margin-bottom: 20px;
}
.toolbar nav label.set_btn {
    background: url('../../assets/images/setting.png');
}
.toolbar nav label.bgc_btn {
    background: url('../../assets/images/bgset.png');
}
.toolbar .overlay {
    background: rgba(25, 25, 25, 0.3) no-repeat repeat;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    margin: auto;
    z-index: 100;
}
.toolbar .overlay .popup {
    position: fixed;
    margin: auto;
    top: 35%;
    left: 50%;
    transform: translate(-50%);
    width: 300px;
    min-height: 250px;
    /* padding: 10px; */
    background: white url('../../assets/images/noise.png') repeat;
    border-color: rgb(154, 159, 164);
    box-shadow: rgba(0, 0, 0, 0.85) 0 0 6px 0;
    z-index: 1000;
    border-radius: 10px;
}
.toolbar .overlay .popup {
    .el-date-editor {
        margin-left: 30px;
        width: 200px;
    }
    .originDate {
        margin-left: 30px;
        width: 200px;
        input{
            height: 30px;
        }
    }
}

.toolbar .overlay .popup p.title {
    font-size: 18px;
    height: 20px;
    padding: 20px;
    margin-left: 10px;
    margin-bottom: 0px;
}
.toolbar .overlay .popup li {
    padding: 2px 40px;
    cursor: pointer;
    width: 100px;
    height: 20px;
}
.toolbar .overlay .popup .bottomZone {
    width: 100%;
    height: 60px;
    padding: 15px 0 15px;
    box-sizing: border-box;
    text-align: center;
}
.toolbar .overlay .popup button {
    width: 100px;
    height: 30px;
    padding: 0px;
    margin: 0 10px;
}
</style>
