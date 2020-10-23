<template>
  <div class="mine-home">
    <my-header v-if="role !== '2'" title="我的"></my-header>
    <div class="mine-info" v-if="info">
      <!-- (isBind || role !== '2') && -->
      <img v-if="info.imgUrl" :src="info.imgUrl" />
      <img v-else src="../../assets/imgs/noBind@2x.png" />
      <div class="mt10">{{ info.name }}</div>
      <!-- <div v-else class="mt10 text-grey" @click="$router.push('/login')">点击绑定手机</div> -->
    </div>
    <div class="module" v-if="info">
      <router-link to="/user/list" class="mint-cell" v-if="role === '2'">
        <div class="mint-cell-wrapper top userList">
          <div class="mint-cell-title">
            <span class="mint-cell-text">被护理人信息</span>
          </div>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
      <router-link to="/login" class="mint-cell" v-if="role === '2'">
        <div class="mint-cell-wrapper top bindTel">
          <div class="mint-cell-title">
            <span class="mint-cell-text">{{
              info.telephone ? '更换绑定手机' : '点击绑定手机'
            }}</span>
          </div>
          <div v-if="info.telephone" class="mint-cell-value">
            {{ info.telephone | telFilters }}
          </div>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
    </div>
    <div class="module" v-if="role === '3' || role === '7'">
      <div class="mint-cell" @click="getCampus">
        <div class="mint-cell-wrapper switchCampus">
          <div class="mint-cell-title">
            <span class="mint-cell-text">切换院区</span>
          </div>
          <div class="mint-cell-value">{{ selectedCampusName }}</div>
          <i class="mint-cell-allow-right"></i>
        </div>
      </div>
    </div>
    <div
      class="module mt10 "
      v-if="role === '3' || role === '4' || role === '7'"
    >
      <router-link to="dataStats" class="mint-cell">
        <div class="mint-cell-wrapper dataStats">
          <div class="mint-cell-title">
            <span class="mint-cell-text">数据统计</span>
          </div>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
    </div>

    <div class="module mt10 mb65">
      <!-- <router-link to="/mine/issue" class="mint-cell">
          <div class="mint-cell-wrapper issue">
            <span class="mint-cell-text">常见问题</span>
            <i class="mint-cell-allow-right"></i>
          </div>
      </router-link>-->
      <router-link to="/mine/agreement" class="mint-cell" v-if="role === '2'">
        <div class="mint-cell-wrapper top agreement">
          <span class="mint-cell-text">协议条款</span>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
      <router-link
        to="/mine/dailyReport"
        class="mint-cell"
        v-if="role === '4' || role === '7' || role === '3'"
      >
        <div class="mint-cell-wrapper top dailyReport">
          <div class="mint-cell-title">
            <span class="mint-cell-text">每日简报</span>
          </div>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
      <router-link
        to="/mine/satisfactionAppraise"
        class="mint-cell"
        v-if="role === '6' || role === '7'"
      >
        <div class="mint-cell-wrapper top appraise">
          <span class="mint-cell-text">满意度评价</span>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
      <router-link
        @click.native="suggestRecent"
        to
        class="mint-cell"
        v-if="role === '6' || role === '7' || role === '8' || role === '3'"
      >
        <div class="mint-cell-wrapper top suggest">
          <span class="mint-cell-text">建议与反馈</span>
          <mt-badge v-if="newSuggest" size="small" class="updated"></mt-badge>
          <i class="mint-cell-allow-right"></i>
        </div>
      </router-link>
      <!-- <div @click="switchRole" v-if="this.info.roleList!=null &&this.info.roleList.length > 1" class="mint-cell">
          <div class="mint-cell-wrapper switchRole">
            <span class="mint-cell-text" v-if="this.role === '2' ">切换至管理员角色</span>
            <span class="mint-cell-text" v-else>切换至用户角色</span>
            <i class="mint-cell-allow-right"></i>
          </div>
      </div>-->
    </div>
    <div class="call" v-if="role === '2'">
      <mt-button type="primary" size="large" @click="call">呼叫护工</mt-button>
    </div>
    <!-- 床位弹窗 -->
    <my-actionsheet
      title="选择院区"
      v-if="campusList.sheetVisible"
      v-model="campusList.sheetVisible"
      :data="campusList.sheetList"
      @change="campusSelected"
    ></my-actionsheet>
    <my-tabbar current="我的" />
  </div>
</template>

<script>
import { mineApi, orderApi } from '@/assets/api'
import SDK from '@/utils/SDK'
import { Indicator } from 'mint-ui'
import utils from '@/utils/myUtils'
export default {
  name: 'mine_index',
  data () {
    return {
      info: null,
      role: utils.getItem('role'),
      timer: null,
      // isBind: window.localStorage.getItem('existTel'),
      show: false,
      newSuggest: false,
      suggestId: window.localStorage.getItem('suggestId'),
      replyTime: window.localStorage.getItem('replyTime'),
      selectedCampusName: window.localStorage.getItem('selectedCampusName'),
      selectedCampusId: null,
      campusList: {
        totalData: [],
        sheetList: [],
        sheetVisible: false
      }
    }
  },
  created () {
    if (!/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      SDK.getWXConfig()
    }
    if (this.$route.query.showtype) {
      if (this.role !== '6') {
        let _breadcrumbs = this.$store.state.breadcrumbs
        _breadcrumbs = _breadcrumbs.slice(0, _breadcrumbs.length)
        this.$store.commit('setBreadcrumbs', _breadcrumbs)
      }
      if (this.role === '5' || this.role === '8') {
        this.$router.replace({ path: '/workorder/serviceTrack' })
        return
      } else if (this.role === '3' || this.role === '7') {
        this.$router.replace({ path: '/mine/selectCampus' })
        return
      } else if (this.role === '4') {
        this.$router.replace({ path: '/workorder/manageList' })
        return
      }
    }
    this.mineInit()
    // 获取最新的建议与反馈
    if (
      this.role === '3' ||
      this.role === '6' ||
      this.role === '7' ||
      this.role === '8'
    ) {
      this.getNewSuggest()
      this.timer = setInterval(() => {
        this.getNewSuggest()
      }, 30000)
    }
  },
  destroyed () {
    if (this.timer) clearInterval(this.timer)
  },
  components: {},
  methods: {
    campusSelected: function (val) {
      if (this.selectedCampusName !== val[0]) {
        Indicator.open('正在切换院区...')
        this.selectedCampusId = this.campusList.totalData.filter((m) => {
          return m.name === val[0]
        })[0].id
        mineApi
          .updateSelectedCampus(this.selectedCampusId)
          .then((Resp) => {
            this.selectedCampusName = val[0]
            window.localStorage.setItem(
              'selectedCampusId',
              this.selectedCampusId
            )
            window.localStorage.setItem('selectedCampusName', val[0])
          })
          .catch((e) => {
            alert('指定院区失败', e.data.errmsg)
          })
          .finally(() => {
            Indicator.close()
          })
      }
    },
    getCampus: function () {
      mineApi
        .workCampusList()
        .then((Response) => {
          const list = Response.data.data
          console.log('list', list)
          if (!list || !list.length) {
            return this.$MessageBox.alert('没有可以选择的科室')
          }
          let defaultIndex = 0
          if (this.selectedCampusName) {
            list.forEach((Campus, i) => {
              if (Campus.name === this.selectedCampusName) {
                defaultIndex = i
              }
            })
          }
          this.campusList.sheetList = [
            {
              flex: 1,
              values: list.map((m) => {
                return m.name
              }),
              defaultIndex: defaultIndex
            }
          ]
          this.campusList.totalData = list
          this.campusList.sheetVisible = true
        })
        .catch(() => {
          this.$MessageBox.alert('数据异常，请重试！')
        })
    },
    mineInit: function () {
      mineApi.selfInfo().then((Response) => {
        console.log(Response)
        this.info = Response.data.data
        window.localStorage.setItem(
          'selectedCampusId',
          this.info.selectedCampusId
        )
      })
    },
    // 请求处理是否更新了建议
    suggestRecent () {
      let name =
        (this.role === '6' || this.role === '8') && !this.suggestId
          ? 'suggest'
          : 'suggestList'
      this.$router.push({ name: name })
    },
    getNewSuggest () {
      mineApi.getRecentSuggest().then((resp) => {
        let ret = resp.data.data
        if (this.role === '7' || this.role === '3') {
          if (
            (!this.suggestId && ret.id) ||
            (this.suggestId && ret.id > parseInt(this.suggestId))
          ) {
            this.newSuggest = true
            this.suggestId = ret.id
            if (this.timer) clearInterval(this.timer)
          }
        }
        if (this.role === '6' || this.role === '8') {
          this.suggestId = ret.id
          if (
            (!this.replyTime && ret.replyTime) ||
            (this.replyTime && ret.replyTime > parseInt(this.replyTime))
          ) {
            this.newSuggest = true
            this.replyTime = ret.replyTime
            if (this.timer) clearInterval(this.timer)
          }
        }
      })
    },
    call: function () {
      orderApi.callOut(5, 1).then((response) => {
        if (response.data.data.list.length > 0) {
          this.$router.push({ name: 'call' })
        } else {
          this.$Toast({
            message: '当前没有护理服务'
          })
        }
      })
    }
  },
  filters: {
    telFilters: function (value) {
      return value.substr(0, 3) + '****' + value.substr(7)
    }
  }
}
</script>

<style lang="less" scoped>
@img-size: 16px;
.mine-home {
  margin: 0;
  padding: 0;
  height: 100%;
  .updated {
    padding: 2px 2px;
    margin-left: 3px;
    border-radius: 5px;
    background-color: red;
  }
  .mine-info {
    text-align: center;
    height: 138px;
    background-image: url('../../assets/imgs/my_bg@2x.png');
    background-position: center center;
    background-size: auto auto;
    background-repeat: no-repeat;
    img {
      border-radius: 100px;
      background-color: #ffffff;
      border: 3px solid @color-white;
      height: 60px;
      width: 60px;
      margin-top: 30px;
    }
  }
  .module {
    margin-bottom: @m10;
    .mint-cell {
      box-shadow: none;
      padding-left: 15px;
    }
    .mint-cell-wrapper {
      height: 62px;
      background-position: 0 center;
      background-size: @img-size auto;
      background-repeat: no-repeat;
      position: relative;
      padding: 0 15px 0 0;
      // &::before {
      //   content: "";
      //   border-top: 0.5px solid @border-color;
      //   position: absolute;
      //   top: -1px;
      //   left: 0;
      //   width: 100%;
      //   transform: scaleY(0.5);
      // }
      .mint-cell-text {
        margin-left: 26px;
        color: @color-default;
        font-size: @font-size-normal;
      }
      .mint-cell-value {
        margin-right: 12px;
      }
    }
    .userList {
      background-image: url('../../assets/imgs/userList@2x.png');
    }
    .bindTel {
      background-image: url('../../assets/imgs/bindTel@2x.png');
    }
    .switchCampus {
      background-image: url('../../assets/imgs/switch@2x.png');
    }
    .dataStats {
      background-image: url('../../assets/imgs/dataStats@2x.png');
    }
    .issue {
      background-image: url('../../assets/imgs/question@2x.png');
    }
    .agreement {
      background-image: url('../../assets/imgs/agreement@2x.png');
    }
    .appraise {
      background-image: url('../../assets/imgs/appraise.png');
    }
    .suggest {
      background-image: url('../../assets/imgs/suggestAndFeedback@2x.png');
    }
    .dailyReport {
      background-image: url('../../assets/imgs/dailyReport.png');
    }
    .logout {
      text-align: center;
      line-height: 62px;
      color: @color-green;
      font-size: @font-size-normal;
    }
  }
  .mb65 > a:first-child {
    div {
      border-top: none;
    }
  }
  .top {
    border-top: 0.5px solid rgba(236, 236, 243, 1);
  }
}
.call {
  margin: 20px @m15 70px @m15;
  button {
    border-radius: 1px;
    background-color: @color-green;
    label {
      color: @color-white;
      font-size: @font-size-normal;
    }
  }
}
</style>
