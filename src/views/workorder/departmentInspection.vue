<template >
<div class="departmentInspection">
    <my-header title="科室巡查"> </my-header>
    <ul class="clearfix basicInfo">
      <li class="clearfix ">
        <span  class="name "> 科室床位:   </span>
        <span class="value"> {{ basicInfo.bedName }} </span>
      </li>
      <li class="clearfix btdashed">
        <span  class="name fl"> 服务护工:   </span>
        <span ref='orderWorkers' class="value fl"
          :class="[showAll ? 'wrap' : 'nowrap',showArrow ? 'WorkersName':'']">
          {{ basicInfo.orderWorkerStr}}
          </span>
        <span  v-if="showArrow"
            @click.stop="showAll=!showAll"
            :class="['myicon', showAll ? 'icon-top' : 'icon-down']"
        ></span>
      </li>
      <li class="clearfix btdashed">
        <span  class="name">  查房时间:    </span>
        <span class="value" > {{inspectTime }}  </span>
      </li>
    </ul>
    <div class="form">
      <h3>{{formTitle}}</h3>
      <ul class="content clearfix">
        <li v-for="(item) in formData" :key="item.id">
          <p class="groupName"> {{item.id}}.{{item.name}} </p>
          <ul class="groupContent" v-for="(subItem,index) in item.careInspectionItemVos"
              :key="subItem.id" >
              <li class="question">{{item.id}}.{{index+1}} {{subItem.title}}</li>
              <ul class="stars clearfix" >
                <li v-for="(score,index) in evaluateList" :key=index
                  @click="clickStart(subItem,score)"
                  :class="['icon-evaluate',
                          'icon-evaluate-' + index,
                  subItem.starNum&&subItem.starNum >= index+1 ? 'active':  'disabled']"
                ></li>
              </ul>
              <li class="note">
                <input type="text" class="mint-field-core" name="" id=""
                v-model="subItem.note"
                placeholder="备注，选填"
                maxlength="40"
                :disabled="!editable"
                @input="inputNote(subItem,subItem.note)">
              </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="footer" v-if="editable">
      <mt-button
        size="large"
        class="my-btn"
        @click="submitInspection "
        type='primary'
      >提交</mt-button>

    </div>
</div>
</template>
<script>
import { workOrderApi } from '@/assets/api'

export default {
  name: 'departmentInspection',
  props: {},

  data () {
    return {
      basicInfo: {},
      inspectTime: '',
      showAll: false,
      showArrow: false,
      recordId: -1,
      formData: [],
      formTitle: '',
      evaluateList: [1, 2, 3, 4, 5],
      submitDataList: [], // 提交的答卷 id-value一一对应
      editable: false
    }
  },
  created () {
    this.getBasicInfo()
    this.recordId = this.$route.query.inspectionItemId
    if (this.recordId > 0) {
      // 查询单条记录的详情
      this.getRecordById(this.recordId)
      this.editable = false
    } else {
      // 没有记录id,则是新建一条巡查记录
      this.getInspectForm()
      this.editable = true
    }
  },
  mounted () {
    this.showArrow = this.$refs.orderWorkers.clientWidth >= 250
  },
  activated () {},
  methods: {
    // localStorage// 获取顶部科室数据
    getBasicInfo () {
      this.basicInfo = {
        bedName: window.localStorage.getItem('bedName'),
        orderWorkerStr: window.localStorage.getItem('orderWorkerStr')
      }
    },

    // 获取新建巡查记录的表单x
    getInspectForm () {
      workOrderApi.getInspectForm().then((resp) => {
        this.initialData(resp.data.data)
      })
    },
    // 获取已有的巡查记录详情
    getRecordById (id) {
      workOrderApi.getRecordById(id).then((resp) => {
        this.initialData(resp.data.data)
      })
    },
    initialData (data) {
      this.inspectTime = this.handleTime(data.inspectTime)
      this.formData = data.groupItems
      this.formTitle = data.title
      this.recordId = data.id
      this.submitDataList = data.items.map((item) => {
        return {
          'inspectionItemId': item.id,
          'starNum': item.starNum,
          'note': item.note
        }
      })
    },
    clickStart (item, score) {
      if (!this.editable) return
      item.starNum = score
      this.handleData(item)
    },
    inputNote (item, note) {
      item.note = note
      this.handleData(item)
    },
    handleTime (time) {
      const timeStr = time ? new Date(time).Format('yyyy.MM.dd') : new Date(new Date().getTime()).Format('yyyy.MM.dd')
      return timeStr
    },
    handleData (singleData) {
      this.submitDataList.some((item, index) => {
        if (item.inspectionItemId === singleData.id) {
          item.starNum = singleData.starNum
          item.note = singleData.note
          return true
        }
        return false
      })
    },
    submitInspection () {
      const finished = this.submitDataList.every(item => {
        return item.starNum
      })
      if (!finished) {
        // 有选项未填写
        this.$Toast({
          message: '请填完所有题目',
          duration: 2000
        })
        return
      }
      const params = {
        'orderId': this.$route.query.orderId,
        'serviceId': this.$route.query.serviceId,
        'inspectionFormId': this.recordId,
        'items': this.submitDataList
      }
      console.log('提交记录', params)
      workOrderApi.addRecord(params).then((resp) => {
        if (resp.data.errcode === '0000') {
          this.editable = false
          this.$Toast({
            message: '提交成功',
            duration: 3000
          })
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.departmentInspection{
  .basicInfo{
    // height: 150px;
    padding: 0 15px;
    background-color: rgba(255, 255, 255, 1);
    overflow: hidden;
    &>li{
      padding: 15px 0;
      line-height: 20px;
      font-size: 14px;
      .WorkersName{
        width: 250px;
      }
      .wrap{
        white-space: wrap;
      }
      .name{
        color: #3E4255;
        font-weight: 550;
      }
      .value{
        color: #3E4255;
      }
    }
    .btdashed{
      border-top: 1px dashed #BFBFBF;
    }
  }
  .form{
    margin: 10px 0 65px;
    padding: 20px 15px 10px;
    background-color: rgba(255, 255, 255, 1);
    &>h3{
      margin: auto;
      text-align: center;
      height: 22px;
      color: rgba(74, 74, 74, 100);
      font-size: 16px;
      font-weight: 550;

    }
    & >.content {
      &>li{
        padding: 20px 0 0;
        &>.groupName{
          height: 22px;
          color: rgba(62, 66, 85, 100);
          font-size: 16px;
          text-align: left;
        }
        &>.groupContent{
          padding: 15px 0 10px;
          font-size: 14px;
          .question{
            color: rgba(62, 66, 85, 100);
          }
          .stars ,.note{
            margin-top: 10px;
            height: 40px;
            border-radius: 4px;
            border: 0.5px solid rgba(191, 191, 191, 1);
            box-sizing: border-box;
            color: rgba(191, 191, 191, 100);
          }
          .stars{
            padding: 5px 15px;
            display: flex;
            justify-content: space-around;
            .icon-evaluate{
              flex:0 0 auto;
              height: 28px;
              width: 28px;
              background-size: contain;
            }
            .icon-evaluate.active {
              background-image: url('../../assets/imgs/star_checked.png');
            }
            .icon-evaluate.disabled {
              background-image: url('../../assets/imgs/star_nochecked.png');
            }
          }
          .note{
            padding: 10px 15px;
            input{
              height: 20px;
              line-height: 20px;
            }
            input:disabled {
            color: rgb(84, 84, 84);
            background:none;
}
          }

        }

      }

    }

  }

   .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    .flex();
    .my-btn {
      .flex-num(1);
      border-radius: 0;
      border:none;
      padding: 15px 20px;
      line-height: 22px;
      font-size: 16px;

      .mint-button-text{
        display: block;
        height: 22px;
      }
    }

  }

}
</style>
