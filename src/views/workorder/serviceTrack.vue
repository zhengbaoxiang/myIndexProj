<template>
  <div class="workorder-serviceTrack">
    <my-header title="服务跟踪">
      <div>
        <img
          v-if="role === '4' || role === '3' || role === '7'"
          src="../../assets/imgs/scanCode@2x.png"
          slot="right"
          height="20px"
          width="20px"
          @click="scanMyQRCodeFunc"
        />
      </div>
    </my-header>
    <div v-if="role === '4' || role === '3' || role === '7'">
      <service-filter @change="serviceFiltered"></service-filter>
    </div>
    <div class="pb65 plr15">
      <mt-loadmore
        :top-method="getWorkServices"
        :auto-fill="false"
        ref="serviceLoadmoreRef"
      >
        <ul style="min-height: 400px">
          <div v-for="(item, index) in trackList" :key="index">
            <!-- 护工存在跨院区派单 -->
            <li
              class="trackiCampus"
              v-if="
                (index === 0 ||
                  item.campusId !== trackList[index - 1].campusId) &&
                  allCampusDispatch === 1 &&
                  role === '5'
              "
            >
              {{ item.campusName }}
            </li>
            <li class="mtb15 trackitem">
              <div class="track-top ptb10 plr15">
                <service-card
                  :serviceOrder="item"
                  :role="role"
                  :componentId="'serviceTrack'"
                ></service-card>
              </div>
              <div
                v-if="
                  (item.note && role !== '3' && role !== '7') ||
                    (item.careOrderNoteRemarksList &&
                      item.careOrderNoteRemarksList.length > 0) ||
                    role === '4' ||
                    role === '5' ||
                    role === '8'
                "
                class="track-bottom clearfix"
              >
                <div
                  class="mb10"
                  v-if="
                    (item.careOrderNoteRemarksList &&
                      item.careOrderNoteRemarksList.length > 0 &&
                      (role === '3' ||
                        role === '4' ||
                        role === '5' ||
                        role === '7' ||
                        role === '8')) ||
                      (item.note && role !== '3' && role !== '7')
                  "
                >
                  <div
                    v-if="
                      item.careOrderNoteRemarksList &&
                        item.careOrderNoteRemarksList.length > 0 &&
                        (role === '3' ||
                          role === '5' ||
                          role === '7' ||
                          role === '8')
                    "
                    class="trackNote p10 mb5 font12"
                  >
                    <div
                      v-for="(remarks, i) in item.careOrderNoteRemarksList"
                      :key="i"
                    >
                      <div v-if="remarks.userName && remarks.role !== 4">
                        <!-- <span class="text-grey fl">{{ remarks.userName + '(护士):' }} </span> -->
                        <span class>{{ remarks.remarks }}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="item.note && role !== '3' && role !== '7'"
                    class="trackNote p10 font12"
                  >
                    <!-- <span class="text-grey"> {{ item.oldTeamManagerName + '(护工主管):' }}</span> -->
                    <span>{{ item.note }}</span>
                  </div>
                </div>

                <mt-button
                  v-if="role === '4'"
                  class="fr"
                  size="small"
                  @click="openInspection(item)"
                  type="primary"
                  >科室巡查</mt-button
                >
                <!-- 4主管能上传照片 -->
                <mt-button
                  v-if="role === '4'"
                  class="fr mr10"
                  size="small"
                  @click="uploadImageshow(item)"
                  plain
                  >上传照片</mt-button
                >
                <mt-button
                  v-if="role === '4' || role === '6' || role === '8'"
                  class="fr mr10"
                  size="small"
                  plain
                  @click.native="showRemarkPopup(item)"
                  >备注说明</mt-button
                >

                <mt-button
                  v-if="role === '5'"
                  class="fr"
                  size="small"
                  @click="serviceListshow(item)"
                  type="primary"
                  >去服务</mt-button
                >
              </div>
            </li>
          </div>
        </ul>
      </mt-loadmore>
      <div v-show="!loading && trackList.length === 0" class="noOrders center">
        <img src="../../assets/imgs/noOrders.png" alt />
        <div class="word">暂无服务跟踪单</div>
      </div>
    </div>
    <my-tabbar current="服务" />
    <remark-popup
      :visible.sync="remarkPopupVisible"
      :workOrderId="currentServerId"
      @remarkOk="remarkOk"
      used="workServiceNote"
      :propnote.sync="currentOrderNote"
    ></remark-popup>
    <mt-popup v-model="uploadVisible" class="popup">
      <uploadImage
        :uploadUrl="uploadUrl"
        :addUrl="addUrl"
        :currentServerId="currentServerId"
        :urlListLength="length"
        @uploadSuccess="uploadSuccess"
      ></uploadImage>
    </mt-popup>
  </div>
</template>
<script>
import remarkPopup from './remarkPopup'
import { workOrderApi } from '@/assets/api'
import scanCode from './scanCode'
import utils from '@/utils/myUtils'
import uploadImage from './uploadImage'
import serviceFilter from './serviceTrackFilter'
import serviceCard from './serviceTrackCard'

export default {
  name: 'serviceTrack',
  data () {
    return {
      uploadVisible: false, // 控制上传弹框
      urlList: [],
      uploadUrl:
        window.hcsConfig.axiosBaseURL + '/file/uploadWorkServiceImages', // post
      addUrl: window.hcsConfig.axiosBaseURL + '/orderNote/addPhoto', // put
      deleteUrl: window.hcsConfig.axiosBaseURL + '/orderNote/deletePhoto', // delete
      role: null,
      trackList: [],
      loading: true,
      remarkPopupVisible: false,
      currentServerId: -1,
      currentOrderNote: '',
      focusState: false,
      allCampusDispatch: null,
      length: -1,
      currentItem: null, // 点击上传照片的当前单
      selectDistrictIds: [],
      selectWorkerCodes: []
    }
  },
  components: { remarkPopup, uploadImage, serviceFilter, serviceCard },
  created () {
    this.role = utils.getItem('role')
    this.getWorkServices()
    // 获取是否跨院区的参数
    this.allCampusDispatch = this.$store.state.allCampusDispatch
    // 如果是护工且没有初始化allCampusDispatch
    if (this.role === '5' && this.allCampusDispatch === null) {
      // 调用接口
      workOrderApi.getAllCampusDispatch().then((resp) => {
        this.allCampusDispatch = this.$store.state.allCampusDispatch = parseInt(
          resp.data.data
        )
      })
    }
  },
  activated () {
    console.log('activated')
    // 在这里初始化页面数据
    if (this.$store.state.refreshNext.serviceTrack) {
      this.$store.state.refreshNext.serviceTrack = false
      this.getWorkServices()
    }
  },
  methods: {
    uploadImageshow (item) {
      console.log('已经上传的照片数量：', item.noteImgLength)
      this.length = item.noteImgLength || 0
      // 先判断是不是超过六张了，是的话，弹窗提示 return
      if (this.length >= 6) {
        this.uploadVisible = false
        this.$Toast({
          message: '照片数量已达限制',
          duration: 2000
        })
        return
      }
      // 保存当前项，上传照片后，改写noteImagLength
      this.currentItem = item
      this.currentItem.noteImgLength = this.length

      console.log('显示，选择拍照还是相册？')
      this.uploadVisible = true
      this.currentServerId = item.id
      console.log('当前服务id：', this.currentServerId)
    },
    uploadSuccess (list) {
      this.uploadVisible = false
      console.log('track', list)
      // 追加照片列表长度
      this.currentItem.noteImgLength += list.length
      console.log('更新后的照片数量', this.currentItem.noteImgLength)
    },
    // 打开新的科室巡查记录
    openInspection (serviceOrder) {
      utils.setBasicInfo(serviceOrder)
      this.$router.push({
        name: 'departmentInspection',
        query: {
          serviceId: serviceOrder.id,
          orderId: serviceOrder.orderId
        }
      })
    },
    remarkOk (data) {
      const index = this.trackList.findIndex((m) => m.id === data.id)
      if (this.role === '4') {
        this.trackList[index].note = data.note
        this.trackList[index].oldTeamManagerName = data.userName
      }
      if (this.role === '8') {
        const _list = this.trackList[index].careOrderNoteRemarksList
        let userindex = _list.findIndex((m) => m.userCode === data.userCode)
        // console.log(userindex)
        if (userindex >= 0) {
          this.trackList[index].careOrderNoteRemarksList[userindex].remarks =
            data.note
        } else {
          this.trackList[index].careOrderNoteRemarksList.push({
            remarks: data.note,
            role: 8,
            userCode: data.userCode,
            userName: data.userName
          })
        }
      }
    },
    sexFormat: function (sex) {
      return window.hcsConfig.sexList[sex]
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
    statusFormat (payStatus) {
      const payStatusList = [
        '已取消',
        '待支付',
        '已支付',
        '待退款',
        '退款中',
        '已退款',
        '退款失败',
        '延期支付'
      ]
      return payStatusList[payStatus]
    },
    getWorkServices () {
      this.trackList = []
      this.loading = true
      const params = {
        pageNo: 1,
        pageSize: 999,
        selectDistrictIds: this.selectDistrictIds,
        selectWorkerCodes: this.selectWorkerCodes
      }
      workOrderApi
        .getWorkServices(params)
        .then((resp) => {
          if (resp.data && resp.data.data && resp.data.data.length > 0) {
            let list = []
            list.push(...resp.data.data)
            list.forEach((item) => {
              // item.payStatus = 1
              if (item.careOrderNoteRemarksList) {
                item.careOrderNoteRemarksList = item.careOrderNoteRemarksList.filter(
                  (remark) => {
                    return remark.userName && remark.role
                  }
                )
              }
            })
            // 对数据进行排序
            list.sort((a, b) => {
              return a.campusId - b.campusId
            })
            this.trackList.push(...list)
          }
        })
        .finally(() => {
          this.loading = false
          this.$refs.serviceLoadmoreRef.onTopLoaded()
        })
    },
    showRemarkPopup (item) {
      this.currentServerId = item.id
      if (item.note & (this.role === '4')) this.currentOrderNote = item.note
      this.focusState = true
      this.remarkPopupVisible = true
    },
    getCompStatus (comp, total) {
      return comp === total ? '已完成' : comp + '/' + total
    },
    scanMyQRCodeFunc () {
      // 右上角护工主管扫码
      scanCode.scanQRCode()
    },
    serviceListshow (item) {
      // 跳到服务选择页面进行选择
      let ids = []
      ids.push(item.id)
      this.$router.push({
        name: 'serviceSelect',
        query: { serviceIds: ids }
      })
    },
    serviceFiltered (districts, workers) {
      console.log('serviceFiltered', districts, workers)
      this.selectDistrictIds = districts.map((item) => item.id)
      this.selectWorkerCodes = workers.map((item) => item.workerCode)
      this.getWorkServices()
    }
  }
}
</script>
<style lang="less" scoped>
.workorder-serviceTrack {
  .serviceFilterFixed {
    position: relative;
  }
  .trackiCampus {
    margin: 30px 0 15px 0;
    color: rgba(62, 66, 85, 1);
    padding-left: 20px;
    background-position: 0px center;
    background-size: 15px auto;
    background-repeat: no-repeat;
    background-image: url('../../assets/imgs/campus@2x.png');
  }
  .trackitem {
    position: relative;
    background-color: @color-white;
    box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
    overflow: hidden;
    .border_radius();
    .track-top {
      li:first-child {
        height: 28px;
        line-height: 28px;
      }
      .font20 {
        height: 28px;
      }
    }
    .track-bottom {
      position: relative;
      padding: @m15;
      background-color: @color-white;
      .trackNote {
        background-color: rgba(197, 208, 224, 0.15);
      }
      &::before {
        content: '';
        border-top: 0.5px solid @border-color;
        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        transform: scaleY(0.5);
      }
    }
  }
  .loading {
    text-align: center;
    width: 100px;
    margin: @m5 auto 0 auto;
    .word {
      vertical-align: 0;
      margin-left: @m5;
    }
  }
  .noOrders {
    position: absolute;
    top: 150px;
    pointer-events: none;
    z-index: -1;
    img {
      width: 50%;
      max-width: 378px;
    }
    .word {
      padding-top: @m15;
      color: rgba(141, 146, 158, 0.5);
    }
  }
  .popup {
    width: 90%;
    border-radius: 4px;
    height: 100px;
    overflow: hidden;
  }
}
</style>
