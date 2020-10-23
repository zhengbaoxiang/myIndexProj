<template>
  <div class="send-order">
    <my-header title="派单"></my-header>
    <div class="bg-white ptb10 plr15" :class="{'mb10':allCampusDispatch === 0}">
      <my-inputsearch
        large
        placeholder="搜索"
        :value.sync="carerSearchText"
        @input="carerSearchText  = arguments[0]"
      ></my-inputsearch>
    </div>
    <!-- 护工列表 -->
    <div v-if="carerSearchText === ''" class="pb65">
      <my-loading :data="districtList" emptyText="未搜索到相关护工">
        <ul v-for="(district, index) in districtList" :key="index" class="mb10">
          <li
            v-if="(index === 0 || district.campusId !== districtList[index-1].campusId) && allCampusDispatch === 1"
            class="mint-cell mb10 campus-info"
            :class="{'mt20':index !== 0}"
            @click="showCampus(district.campusId)"
          >
            <span>{{district.campusName}}</span>
            <span
              :class="['myicon',closeList.indexOf(district.campusId) < 0 ? 'icon-top':'icon-down' ]"
            ></span>
          </li>
          <div v-if="closeList.indexOf(district.campusId) < 0">
            <li class="mint-cell plr15">
              <span>{{district.districtName}}</span>
              <span
                class="fr font14 text-green"
                @click="chooseAll(district)"
              >{{district.checkedAll?'全不选' : '全选'}}</span>
            </li>
            <li
              class="mint-cell"
              v-for="(carer, itemindex) in district.careWorkerList"
              :key="itemindex"
            >
              <label class="mint-checklist-label">
                <span class="fr">
                  <input
                    type="checkbox"
                    class="mint-checkbox-input"
                    :value="carer.workerCode"
                    v-model="selectedList"
                    @change="choose(carer.districtId,carer.workerCode)"
                  />
                  <span class="mint-checkbox-core"></span>
                </span>
                <div class="mint-checkbox-label">
                  <span>{{carer.name}}</span>
                  <div
                    class="mint-badge my-badge ml5"
                    :style="rankStyle[carer.rank - 1]"
                    size="small"
                  >{{rankFormat(carer.rank)}}</div>
                </div>
              </label>
            </li>
          </div>
        </ul>
      </my-loading>
    </div>
    <div v-else class="pb65">
      <my-loading :data="carerSearchList" emptyText="未搜索到相关护工">
        <li class="mint-cell" v-for="(carer, index) in carerSearchList" :key="index">
          <label class="mint-checklist-label">
            <span class="fr">
              <input
                type="checkbox"
                class="mint-checkbox-input"
                :value="carer.workerCode"
                v-model="selectedList"
                @change="choose(carer.districtId,carer.workerCode)"
              />
              <span class="mint-checkbox-core"></span>
            </span>
            <div class="mint-checkbox-label">
              <span v-html="carer.name"></span>
              <div
                class="mint-badge my-badge"
                :style="rankStyle[carer.rank - 1]"
                size="small"
              >{{rankFormat(carer.rank)}}</div>
            </div>
          </label>
        </li>
      </my-loading>
    </div>
    <div class="footer center" v-if="selectedList.length > 0">
      <mt-button size="large" class="my-btn" type="primary" @click="sendOrder">确 定</mt-button>
    </div>
  </div>
</template>

<script>
import { workOrderApi, homeApi } from '@/assets/api'
import Utils from '../../utils/myUtils'
export default {
  data () {
    return {
      orderId: this.$route.query.orderId || 1211,
      districtList: null,
      selectedList: [],
      carerSearchText: '',
      carerSearchList: [],
      allCampusDispatch: null,
      closeList: [],
      rankStyle: [
        {
          background: '-webkit-linear-gradient(left, #b7cbe8, #a2b5d1)'
        },
        {
          background: '-webkit-linear-gradient(left, #68a6e7, #798ed5)'
        },
        {
          background: '-webkit-linear-gradient(left, #dcbf7a, #d1ae63)'
        }
      ]
    }
  },
  created () {
    this.allCampusDispatch = this.$store.state.allCampusDispatch
    if (this.allCampusDispatch === null) {
      // 调用接口
      workOrderApi
        .getAllCampusDispatch()
        .then(resp => {
          this.allCampusDispatch = this.$store.state.allCampusDispatch = parseInt(
            resp.data.data
          )
        })
        .finally(() => {})
    }
    this.getCarers()
  },
  watch: {
    carerSearchText (val) {
      if (!val) {
        this.carerSearchList = []
        return
      }
      this.carerSearchList = []
      this.districtList.forEach(district => {
        district.careWorkerList.forEach(carer => {
          if (carer.name.includes(val)) {
            let n = {}
            n.name = carer.name.replace(
              new RegExp(val, 'gi'),
              '<span class="text-green">' + val + '</span>'
            )
            n.workerCode = carer.workerCode
            n.rank = carer.rank
            n.districtId = carer.districtId
            this.carerSearchList.push(n)
          }
        })
      })
    }
  },
  methods: {
    showCampus: function (campusId) {
      let index = this.closeList.indexOf(campusId)
      if (index >= 0) {
        // 截取
        this.closeList.splice(index, 1)
      } else {
        this.closeList.push(campusId)
      }
    },
    sendOrder: function () {
      // 调用api传递 this.selectedList
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      console.log('传递参数', this.orderId, this.selectedList)
      workOrderApi
        .sendCareWorkers(this.orderId, this.selectedList)
        .then(response => {
          let n = Utils.getItem('newWorkOrderNum')
          Utils.setItem('newWorkOrderNum', n--)
          this.$Toast({
            message: '派单成功！',
            duration: 2000
          })
          // 关闭弹窗
        })
        .catch(e => {
          this.$Toast({
            message: '派单失败,' + (e.data.errmsg || '请稍后重试!'),
            duration: 2000
          })
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
          // this.$store.state.refreshNextPage = true
          this.$store.state.refreshNext.manageList = true
          this.$store.state.refreshNext.serviceTrack = true
          this.$router.go(-1)
        })
    },
    // 点击全选时
    chooseAll: function (district) {
      district.checkedAll = !district.checkedAll
      district.careWorkerList.forEach(carer => {
        let index = this.selectedList.indexOf(carer.workerCode)
        console.log(index)
        if (index >= 0 && !district.checkedAll) {
          this.selectedList.splice(index, 1)
        }
        if (index < 0 && district.checkedAll) {
          this.selectedList.push(carer.workerCode)
        }
      })
      console.log(this.selectedList)
    },
    // 点击单个选择时更新 '全选'按钮状态
    choose: function (districtId, workerCode) {
      let index = this.selectedList.indexOf(workerCode)
      let districtIndex = this.districtList.findIndex(
        m => m.districtId === districtId
      )
      if (index >= 0) {
        let size = 0
        this.districtList[districtIndex].careWorkerList.forEach(carer => {
          let index = this.selectedList.indexOf(carer.workerCode)
          if (index >= 0) size++
        })
        this.districtList[districtIndex].checkedAll =
          size === this.districtList[districtIndex].careWorkerList.length
      } else {
        this.districtList[districtIndex].checkedAll = false
      }
      console.log(this.selectedList)
    },
    // 初始化方法获取所有护工
    getCarers: function () {
      homeApi
        .teamOrderWorkers(this.orderId, 0, 0)
        .then(resp => {
          console.log(resp.data.data)
          let list = resp.data.data
          list.sort((a, b) => {
            return a.campusId - b.campusId
          })
          this.districtList = list
          this.districtList.forEach(district => {
            let size = 0
            district.careWorkerList.forEach(carer => {
              if (carer.selected) {
                size++
                this.selectedList.push(carer.workerCode)
              }
            })
            this.$set(
              district,
              'checkedAll',
              size === district.careWorkerList.length
            )
          })
        })
        .catch(e => {
          console.log(e)
        })
    },
    rankFormat: function (rank) {
      return window.hcsConfig.rankList[rank - 1]
    }
  }
}
</script>
<style lang="less" scoped>
.send-order {
  .campus-info {
    background-position: 15px center;
    padding-left: 35px;
    padding-right: 15px;
    background-size: 15px auto;
    background-repeat: no-repeat;
    background-image: url("../../assets/imgs/campus@2x.png");
    .myicon {
      position: absolute;
      top: 17px;
      right: 16px;
      color: rgba(171, 171, 193, 1);
    }
  }

  .mint-cell {
    line-height: 52px;
    .mint-checklist-label {
      padding: 0 15px 0 9px;
      .mint-checkbox-core {
        border-radius: 0;
      }
      .mint-checkbox-core::after {
        top: 4px;
        left: 7px;
      }
      .my-badge {
        position: absolute;
        top: 50%;
        margin-top: -8px;
        height: 12px;
        line-height: 12px;
        border-radius: 1px;
        font-size: 12px;
        padding: 2px 10px;
      }
    }
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 52px;
    line-height: 52px;
    .flex();
    .my-btn {
      .flex-num(1);
      border-radius: 0;
    }
  }
}
</style>
