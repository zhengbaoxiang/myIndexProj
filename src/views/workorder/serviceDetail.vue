<template>
  <div class="workorder-serviceDetail" v-if="serviceOrder">
    <my-header title="服务详情"></my-header>
    <div>
      <mt-navbar v-model="selected" class="mb10" v-if="ids.length > 1">
        <mt-tab-item :id="index" v-for="(item, index) in ids" :key="index">{{index + 1}}</mt-tab-item>
      </mt-navbar>
      <div class="serviceInfo">
        <serviceCard :serviceOrder="serviceOrder"
                      :role="role"
                      :componentId="'serviceDetail'"
        ></serviceCard>
        <div class="mt10">
          <div
            v-if="serviceOrder.careOrderNoteRemarksList && serviceOrder.careOrderNoteRemarksList.length > 0 &&  (role==='3' || role==='5'|| role==='7' ||  role==='8')"
            class="trackNote p10 mb5 font12 "
          >
            <div v-for="(remarks, i) in serviceOrder.careOrderNoteRemarksList" :key="i">
              <div v-if="remarks.userName && remarks.role !== 4">
                <!-- <span class="text-grey fl">{{remarks.userName + '(护士):'}}</span> -->
                <span class>{{remarks.remarks}}</span>
              </div>
            </div>
          </div>
          <div v-if="serviceOrder.note && role !=='3' && role !=='7'" class="trackNote p10 font12">
            <!-- <span class="text-grey">{{serviceOrder.oldTeamManagerName + '(护工主管):'}}</span> -->
            <span>{{serviceOrder.note}}</span>
          </div>

        </div>
      </div>
    </div>
    <div class="tabcontain" v-if="role === '3' || role === '4' || role === '7'" >
      <mt-navbar v-model="tabId" class="navbar2" >
        <mt-tab-item id="1">服务明细</mt-tab-item>
        <mt-tab-item id="2">巡查记录</mt-tab-item>
        <mt-tab-item id="3">护理照片</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="tabId" >
        <mt-tab-container-item id="1">
          <service-list :serviceOrder="serviceOrder" :addService="addService" :role="role"></service-list>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <!-- 巡查记录模块 -->
          <serviceDetailRecord :serviceOrder="serviceOrder" :role="role"></serviceDetailRecord>
        </mt-tab-container-item>
        <mt-tab-container-item id="3">
          <div v-if="urlListLength>0"  class="mt10 bg-white uploadImageText">
            <!-- <p class="pb10">照片上传</p> -->
            <my-imagegallery
                :data="urlList"
                :imagegalleryIndex="'imagegallery'"
                :id="id"
                :deleteFlag="true">
            </my-imagegallery>
          </div>
            <div v-else class="nodata">
            <div></div>
            <span>暂无数据</span>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div v-if="role === '5'">
      <service-list :serviceOrder="serviceOrder" :addService="addService" :role="role"></service-list>
    </div>

    <div class="footer center">
      <mt-button
            v-if="role === '4' || role === '6' || role === '8'"
            size="large"
            class="my-btn br"
            @click.native="showRemarkPopup()"
            plain

          >备注说明</mt-button>
      <mt-button
        size="large"
        v-if="role === '4'"
        class="my-btn "
        @click="uploadImageshow"
        plain

      >上传照片</mt-button>
      <mt-button
        size="large"
        v-if="role === '4'"
        class="my-btn"
        @click="openInspection(serviceOrder) "
        type='primary'
      >科室巡查</mt-button>
      <mt-button
        size="large"
        v-if="role === '5'"
        class="my-btn"
        @click="serviceListshow()"
        type="primary"
      >去服务</mt-button>
    </div>

    <remark-popup
      used="workServiceNote"
      :visible.sync="remarkPopupVisible"
      :workOrderId="serviceOrder.id"
      :propnote="currentOrderNote"
      @remarkOk="remarkOk"
    ></remark-popup>

    <mt-popup v-model="uploadVisible" class="popup">
     <uploadImage :uploadUrl="uploadUrl" :addUrl="addUrl"
                  :currentServerId="id"
                  :urlListLength="urlListLength"
                  @uploadSuccess="uploadSuccess"></uploadImage>
    </mt-popup>
  </div>
</template>

<script>
import remarkPopup from './remarkPopup'
import serviceList from './serviceList'
import uploadImage from './uploadImage'
import serviceCard from './serviceTrackCard'
import serviceDetailRecord from './serviceDetailRecord'
import { workOrderApi } from '@/assets/api'
import utils from '@/utils/myUtils'
export default {
  name: 'serviceDetail',
  data () {
    return {
      uploadVisible: false, // 控制上传弹框
      urlList: [],
      urlListLength: -1,
      uploadUrl: window.hcsConfig.axiosBaseURL + '/file/uploadWorkServiceImages', // post
      addUrl: window.hcsConfig.axiosBaseURL + '/orderNote/addPhoto', // put
      deleteUrl: window.hcsConfig.axiosBaseURL + '/orderNote/deletePhoto', // delete
      remarkPopupVisible: false,
      role: utils.getItem('role'),
      ids: this.$route.query.serviceOrderIds || [],
      id:
        this.$route.query.serviceOrderId ||
        this.$route.query.serviceOrderIds[0] ||
        '',
      serviceOrder: null,
      path: window.hcsConfig.imgdomain,
      addService: null,
      currentOrderNote: '',
      selected: 0,
      tabId: '1'
    }
  },
  components: { remarkPopup, serviceList, uploadImage, serviceCard, serviceDetailRecord },
  created () {
    this.serviceOrderInit()
  },
  watch: {
    selected (newval, oldval) {
      this.id = this.ids[parseInt(this.selected)]
      this.serviceOrderInit()
    }
  },
  methods: {
    uploadImageshow () {
      // 先判断是不是超过六张了，是的话，弹窗提示 return
      this.urlListLength = this.urlList.length
      if (this.urlListLength >= 6) {
        this.uploadVisible = false
        this.$Toast({
          message: '照片数量已达限制',
          duration: 2000
        })
        return
      }
      console.log('显示，选择拍照还是相册？')
      this.uploadVisible = true
    },
    uploadSuccess (list) {
      this.uploadVisible = false
      // 将上传的图片列表，合并到原有列表末尾
      // console.log(191, list)
      this.urlList = this.urlList.concat(list)
      console.log('上传成功，更新后的照片', this.urlList)
    },
    // 打开新的科室巡查记录
    openInspection (serviceOrder) {
      // utils.setBasicInfo(serviceOrder)
      this.$router.push({
        name: 'departmentInspection',
        query: {
          serviceId: serviceOrder.id,
          orderId: serviceOrder.orderId
        }
      })
    },

    showRemarkPopup () {
      if (this.serviceOrder.note & (this.role === '4')) {
        this.currentOrderNote = this.serviceOrder.note
      }
      this.focusState = true
      this.remarkPopupVisible = true
    },
    remarkOk (data) {
      // this.$store.state.refreshNextPage = true
      this.$store.state.refreshNext.serviceTrack = true
      if (this.role === '4') {
        this.serviceOrder.note = data.note
        this.serviceOrder.oldTeamManagerName = data.userName
      }
      if (this.role === '8') {
        let userindex = this.serviceOrder.careOrderNoteRemarksList.findIndex(
          m => m.userCode === data.userCode
        )
        console.log(userindex)
        if (userindex >= 0) {
          this.serviceOrder.careOrderNoteRemarksList[userindex].remarks =
            data.note
        } else {
          this.serviceOrder.careOrderNoteRemarksList.push({
            remarks: data.note,
            role: 8,
            userCode: data.userCode,
            userName: data.userName
          })
        }
      }
    },
    serviceListshow () {
      // 跳到服务选择页面进行选择
      let ids = []
      ids.push(this.id)
      this.$router.push({
        name: 'serviceSelect',
        query: { serviceIds: ids }
      })
    },
    serviceOrderInit () {
      this.$Indicator.open('正在加载...')
      workOrderApi
        .getWorkService(this.id)
        .then(resp => {
          // console.log(resp.data.data)
          if (resp.data.data) {
            let data = resp.data.data
            if (data.careOrderNoteRemarksList) {
              data.careOrderNoteRemarksList = data.careOrderNoteRemarksList.filter(
                remark => {
                  return remark.userName && remark.role
                }
              )
            }
            // 获取护理图片列表
            this.urlList = data.imgList
            this.urlListLength = this.urlList.length
            this.serviceOrder = data
            this.addService = resp.data.data.addOrderServiceLogs[0]
          } else {
            this.$MessageBox
              .alert('未查询到服务单,请确认服务单状态')
              .then(() => {
                this.$router.go(-1)
              })
          }
        })
        .catch(e => {
          this.$MessageBox
            .alert(e.data.errmsg || '服务数据异常，请稍后重试！！')
            .then(() => {
              this.$router.go(-1)
            })
        })
        .finally(() => {
          this.$Indicator.close()
        })
    },
    getCompStatus (comp, total) {
      return comp === total ? '已完成' : comp + '/' + total
    },
    sexFormat: function (sex) {
      return window.hcsConfig.sexList[sex]
    },
    statusFormat (payStatus) {
      const payStatusList = ['已取消', '待支付', '已支付', '待退款', '退款中', '已退款', '退款失败', '延期支付']
      return payStatusList[payStatus]
    },
    selfCareFormat: function (selfCare) {
      switch (selfCare) {
        case 1:
          return '自理'
        case 2:
          return '半自理'
        case 3:
          return '不能自理'
        default:
          return ''
      }
    },
    showWorkers: function (item) {
      if (item.workerList === undefined) this.$set(item, 'workerList', null)
      item.show === undefined
        ? this.$set(item, 'show', true)
        : this.$set(item, 'show', !item.show)
      if (item.show && (!item.workerList === undefined || !item.workerList)) {
        workOrderApi.getWorkerLogs(item.id).then(resp => {
          console.log('resp', resp)
          this.$set(item, 'workerList', resp.data.data)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.workorder-serviceDetail {
  padding-bottom: 60px;
  .mint-navbar {
    padding: 12px 15px 2px 15px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    .mint-tab-item {
      margin-right: 10px;
      margin-bottom: 10px;
      padding: 11px 0;
      font-size: 14px;
      background-color: rgba(245, 245, 250, 1);
      width: 36px;
      flex: none;
    }
    .mint-tab-item.is-selected {
      background-color: rgba(31, 193, 201, 0.1);
    }
  }
  .navbar2.mint-navbar{
    padding: 12px 15px 2px 15px;
    background:none;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    justify-content: center;

    .mint-tab-item {
      position: relative;
      margin: 0 10px;
      padding: 11px 0;
      font-size: 14px;
      background:none;
      // flex: none;
      width: 70px;
      white-space: nowrap;
    }
    .mint-tab-item.is-selected {
      border: none;
      &:after{
        content: '';
        display: block;
        width: 24px;
        height: 5px;
        background-color: #1FC1C9;
        position: absolute;
        bottom: 0px;
        left: 24px;
      }
    }

  }
  .serviceInfo {
    position: relative;
    background-color: @color-white;
    padding: 0px 15px 20px 15px;
    overflow: hidden;
    .border_radius();
    color: rgba(62, 66, 85, 1);
    .mt10{
      div.p10{
        background-color: rgba(197, 208, 224, 0.15);
      color: @color-default;
      }
    }
  }

  .uploadImageText{
    padding: 15px;
  }
  .nodata{
  div{
    width: 189px;
    height: 120px;
    margin: 60px auto 10px;
    opacity: 0.9;
    background: url('../../assets/imgs/nodata@2x.png');
    background-size: contain;
  }
  span{
    display: block;
    width: 64px;
    height: 22px;
    opacity: 0.5;
    color: rgba(141, 146, 158, 100);
    font-size: 16px;
    text-align: center;
    margin: auto;
  }
}
  .popup{
    width: 90%;
    border-radius: 4px;
    height: 100px;
    overflow: hidden;
    }
  /*九宫格*/
  .img-list {
    margin: 10px 5px 0 5px;
    display: flex;
    flex-wrap: wrap;
    flex-grow: 1;
    li {
      width: calc(94% / 3);
      height: calc(94% / 3);
      padding-top: calc(94% / 3);
      margin-right: 3%;
      margin-bottom: 0;
      position: relative;
      .icon-close {
        position: absolute;
        right: -6px;
        top: -6px;
      }
      img {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    li:nth-of-type(3n) {
      margin-right: 0;
    }
    li:nth-last-of-type(n + 4) {
      margin-bottom: 3%;
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
      position: relative;
      &.br::before{
        content: '';
        border-right: 1px solid #8D929E;
        display: block;
        height: 20px;
        position: absolute;
        right: 0;
        top:50%;
        transform: translateY(-50%);
      }
      .mint-button-text{
        display: block;
        height: 22px;
      }
    }
    // .btn-refund {
    //   color: rgba(141, 146, 158, 1);
    //   background-color: @background-white;
    // }
  }

}
</style>
