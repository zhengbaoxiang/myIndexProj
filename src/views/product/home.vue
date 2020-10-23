<template>
  <div class="product-home">
    <header class="mint-header is-fixed" @click="$router.push({ name: 'selectHospital'})">
      <h1 class="mint-header-title">
        <i class="myicon icon-lbs text-green"></i>
        <span class="mint-button-icon">{{hospitalName || city || '请选择'}}</span>
        <i class="myicon text-grey icon-down"></i>
      </h1>
    </header>
    <!-- 首页展示 -->
    <div v-if="hospitalName && hasService">
      <div class="banner">
        <img class="banner" src="../../assets/imgs/homepage_banner@2x.png" />
      </div>
      <div class="carerservice pt15">
        <div class="header clearfix">
          <div class="fl">
            <span>热门护理</span>
          </div>
          <div class="fr">
            <router-link :to="{name:'serviceList',query:{hospitalId : hospitalId}}">
              <span class="more" v-if="serviceList.length > 3">更多</span>
            </router-link>
          </div>
        </div>
        <div>
          <div class="carebody">
            <table v-if="serviceList.length > 0 ">
              <tr v-if="serviceList.length !== 2 ">
                <td colspan="2">
                  <div class="serveitem item1">
                    <router-link
                      :to="{name:'serviceDetail',query:{serviceId : serviceList[indexSize-1].id}}"
                    >
                      <div class="name">{{this.serviceList[indexSize-1].bigTitle}}</div>
                      <div class="simple">{{this.serviceList[indexSize-1].smallTitle}}</div>
                      <div class="price myFont-DINPro-Medium">
                        <span
                          class="font18"
                        >&yen;{{this.serviceList[indexSize-1].realPrice | priceFilters}}</span>
                        <span
                          v-if="this.serviceList[indexSize-1].kind === 1"
                          class="font14"
                        >/{{this.periodFormat(this.serviceList[indexSize-1].period)}}</span>
                        <mt-badge
                          size="small"
                          class="allin-price-badge"
                          v-if="this.serviceList[indexSize-1].kind === 2"
                        >全包价</mt-badge>
                      </div>
                    </router-link>
                  </div>
                </td>
                <td></td>
              </tr>
              <tr v-if="serviceList.length >= 2 " class="secTr">
                <td>
                  <div class="serveitem item2">
                    <router-link
                      :to="{name:'serviceDetail',query:{serviceId : serviceList[indexSize].id}}"
                    >
                      <div class="name">{{this.serviceList[indexSize].bigTitle}}</div>
                      <div class="simple">{{this.serviceList[indexSize].smallTitle}}</div>
                      <div class="price myFont-DINPro-Medium">
                        <span
                          class="font14"
                        >&yen;{{this.serviceList[indexSize].realPrice | priceFilters}}</span>
                        <span
                          v-if="this.serviceList[indexSize].kind === 1"
                          class="font14"
                        >/{{this.periodFormat(this.serviceList[indexSize].period)}}</span>
                        <mt-badge
                          size="small"
                          class="allin-price-badge"
                          v-if="this.serviceList[indexSize].kind === 2"
                        >全包价</mt-badge>
                      </div>
                    </router-link>
                  </div>
                </td>
                <td>
                  <div class="serveitem item3">
                    <router-link
                      :to="{name:'serviceDetail',query:{serviceId : serviceList[indexSize+1].id}}"
                    >
                      <div class="name">{{this.serviceList[indexSize+1].bigTitle}}</div>
                      <div class="simple">{{this.serviceList[indexSize+1].smallTitle}}</div>
                      <div class="price myFont-DINPro-Medium">
                        <span
                          class="font14"
                        >&yen;{{this.serviceList[indexSize+1].realPrice | priceFilters}}</span>
                        <span
                          v-if="this.serviceList[indexSize+1].kind === 1"
                          class="font14"
                        >/{{this.periodFormat(this.serviceList[indexSize].period)}}</span>
                        <mt-badge
                          size="small"
                          class="allin-price-badge"
                          v-if="this.serviceList[indexSize+1].kind === 2"
                        >全包价</mt-badge>
                      </div>
                    </router-link>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="careworker pt15">
        <div class="header clearfix">
          <div class="fl">
            <span>金牌团队</span>
          </div>
          <div class="fr">
            <span v-if="teamWorkerList.length > 4">
              <router-link :to="{name:'careworkerList',query:{hospitalId : hospitalId}}">更多</router-link>
            </span>
          </div>
        </div>
        <ul class="p15 clearfix">
          <!-- 团队列表 -->
          <li v-for="(item, index) in this.teamWorkerList" :key="index" class="careritem fl">
            <router-link
              v-if="index < 4"
              :to="{name:'careworkerDetail',query:{userCode : item.workerCode}}"
            >
              <img :src="path + item.imgUrl" @error="_imageError" />
              <p>{{item.name | nameFilters}}</p>
              <mt-badge
                size="small"
                :class="item.rank === 1 ? 'rank1':item.rank === 2 ? 'rank2': 'rank3' "
                v-if="item.rank <= 3 && item.rank >=1"
              >{{rankFormat(item.rank)}}</mt-badge>
            </router-link>
          </li>
        </ul>
      </div>
      <div class="foot"></div>
    </div>
    <!-- 其他 -->
    <div v-else class="noHospital">
      <i class="bg"></i>
      <span>{{errText}}</span>
    </div>
    <div class="hr-50"></div>
    <my-tabbar current="首页" />
  </div>
</template>
<script>
import { homeApi } from '@/assets/api'
import getLocation from './getLocation'
import utils from '@/utils/myUtils'

export default {
  name: 'home',
  data () {
    return {
      indexSize: 1,
      city: window.localStorage.getItem('city'),
      hospitalId: window.localStorage.getItem('hospitalID') || 0,
      hospitalName: window.localStorage.getItem('hospitalName') || null,
      serviceList: [],
      teamWorkerList: [],
      hasService: this.$store.state.hasService,
      path: window.hcsConfig.imgURL
    }
  },
  computed: {
    errText () {
      if (this.city && !this.hospitalName) {
        return '该城市服务正在建设中,敬请期待'
      }
      if (this.city && this.hospitalName && !this.hasService) {
        return '当前医院无服务'
      }
      return '暂未定位到城市'
    }
  },
  created () {
    // 角色拦截 除普通用户外跳转至服务跟踪页
    if (utils.getItem('role') !== '2') {
      let name = this.getHomeName()
      // 说明进入到非该角色进入的页面 非法路径删除
      let _breadcrumbs = this.$store.state.breadcrumbs
      _breadcrumbs = _breadcrumbs.slice(0, _breadcrumbs.length)
      this.$store.commit('setBreadcrumbs', _breadcrumbs)
      console.log('_breadcrumbs', _breadcrumbs)
      this.$router.push({ name: name })
      return
    }
    // if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
    //   getLocation.getWXConfig()
    // }
    // 首页的存储： localStorage存储：医院名称，医院ID，城市； store中存默认为setTenantConfirmed : false
    // localStorage: 三个字段都没有， 或者三个字段都有（但city必然有值，而其他两个可能为空，即该城市没有医院的场景）
    // 进入首页，如果localStorage存在数据，直接调用getServiceAndWorkerList。
    if (this.hospitalId) {
      // 只要有hospitalId 直接取数据
      this.getServiceAndWorkerList(this.hospitalId)
    }

    // 进入微信入口， 用store的tenantConfirmed字段进行判断， 走完整的wx定位-获取院区信息的流程。否则是在SPA内切换回首页的，不用处理。
    // 这里接口拿到院区信息后，如果拿到的新院区信息和localStorage里存的不一致，需要走setTenant方法，具体逻辑见setTenant。
    if (!this.$store.state.tenantConfirmed) {
      // this.loadWXAddress()
      getLocation.getLocationAndTenant(data => {
        this.setTenant(data)
      })
    }
  },
  methods: {
    setTenant (data) {
      // store存储首页已经拿到院区信息，切换再次进入首页，无需再调wx定位接口
      this.$store.commit('setTenantConfirmed', true)
      // 医院名称和本地存储的不一致
      if (this.hospitalName && this.hospitalName !== data.name) {
        let msg = '当前定位为'
        if (data.city) {
          msg += data.city
        }
        // if (data.tenantName) {
        //   msg += '-' + data.tenantName
        // }
        if (data.name) {
          msg += '-' + data.name
        }
        msg += '，是否切换？'
        this.$MessageBox.confirm(msg).then(() => {
          this.changeHospital(data)
        })
      } else if (!this.hospitalName) {
        // 上次存储的city，但没有hospitalName ， 或者 本地没存储过数据
        this.changeHospital(data)
      }
    },
    changeHospital (hospital) {
      this.city = hospital.city
      this.hospitalId = hospital.id
      // if (hospital.tenantName && hospital.name) {
      //   this.hospitalName = hospital.tenantName + '-' + hospital.name
      // }
      this.hospitalName = hospital.name
      getLocation.setLocalStorage(hospital)
      if (hospital.id) this.getServiceAndWorkerList(hospital.id)
    },
    // 获取服务列表， 护工列表
    getServiceAndWorkerList (id) {
      homeApi.serviceList(id, 1, 5).then(response => {
        this.serviceList = response.data.data.list
        this.indexSize = this.serviceList.length === 2 ? 0 : 1
        this.hasService = this.serviceList.length !== 0
        this.$store.commit('setHasService', this.serviceList.length !== 0)
      })
      homeApi.teamWorkerList(id, 1, 5).then(response => {
        this.teamWorkerList = response.data.data.list
      })
    },
    rankColorFormat: function (rank) {
      return window.hcsConfig.rankColorList[rank - 1]
    },
    rankFormat: function (rank) {
      return window.hcsConfig.rankList[rank - 1]
    },
    periodFormat: function (period) {
      return window.hcsConfig.periodList[period]
    }
  },
  filters: {
    priceFilters: function (value) {
      return (value / 100).toFixed(2)
    },
    nameFilters: function (value) {
      return value.length > 6 ? value.substr(0, 6) : value
    }
  }
}
</script>
<style lang="less" scoped>
.product-home {
  text-align: center;
  position: relative;
  .mint-header-button {
    span {
      vertical-align: middle;
      padding-left: 5px;
    }
  }
  .noHospital {
    width: 160px;
    margin: 0 auto;
    padding-top: 114px;
    .bg {
      display: block;
      width: 160px;
      height: 160px;
      margin-bottom: 20px;
      background-image: url("../../assets/imgs/noHospital@2x.png");
      background-position: center center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    span {
      color: @color-grey;
      text-align: center;
    }
  }
  .banner {
    width: 100%;
    height: 100%;
  }
  // 护工和金牌团队的标题
  .header {
    width: 100%;
    height: 22px;
    line-height: 22px;
    overflow: hidden;
    .fl {
      margin-left: 15px;
      padding-left: 14px;
      text-align: center;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -6px;
        width: 4px;
        height: 12px;
      }
    }
    .fr {
      margin-right: 15px;
      color: rgba(141, 146, 158, 1);
      font-size: @font-size-mini;
      text-align: center;
    }
  }

  .carerservice .header .fl:before {
    background-color: rgba(31, 193, 201, 1);
  }

  .careworker .header .fl:before {
    background-color: rgba(193, 151, 5, 1);
  }

  //-----精品护工模块样式---------------------

  .carebody {
    margin: 0 12.5px;
    table {
      width: 100%;
      tr {
        width: 100%;
        .serveitem {
          text-align: left;
          border-radius: 5px;
          box-shadow: 0px 2px 13px 0px rgba(215, 215, 215, 0.5);
          margin: 10px 2.5px 0 2.5px;
          background-color: #ffffff;
          border: 0.5px solid rgba(236, 236, 243, 1);
          height: 150px;
          background-image: url("../../assets/imgs/homepage_img1@2x.png");
          background-position: center center;
          background-size: 100% 100%;
          background-repeat: no-repeat;
          font-size: @font-size-large;
          .simple {
            color: rgba(141, 146, 158, 1);
            font-size: @font-size-mini;
            margin-top: 3px;
            width: 50%;
            .line-clamp(1);
          }
          .price {
            position: absolute;
            bottom: 12px;
            left: 12px;
            color: rgba(242, 121, 103, 1);
            .allin-price-badge {
              height: 14px;
              line-height: 14px;
              font-size: 10px;
              padding: 0px 5px;
              border-radius: 100px 100px 100px 0;
              background-color: rgba(242, 121, 103, 1);
              margin-left: 2px;
              float: right;
              margin-top: 6px;
            }
          }
          a {
            display: block;
            padding: 12px;
            height: 100%;
            position: relative;
            box-sizing: border-box;
          }
        }
      }
      .secTr {
        td {
          width: 50%;
        }
        .serveitem {
          height: 100px;
          .name {
            font-size: @font-size-normal;
          }
          .simple {
            .line-clamp(2);
          }
        }
        .item2 {
          background-image: url("../../assets/imgs/homepage_img2@2x.png");
        }
        .item3 {
          background-image: url("../../assets/imgs/homepage_img3@2x.png");
        }
      }
    }
  }
  //-----金牌团队模块样式---------------------

  .careritem {
    width: 25%;
    text-align: center;
    a {
      display: block;
    }
    img {
      width: 66px;
      height: 66px;
      border-radius: 21px;
      border: 3px solid #ffffff;
      box-sizing: border-box;
    }
    p {
      height: 20px;
      margin-top: @m10;
      color: rgba(62, 66, 85, 1);
      font-size: @font-size-small;
    }
    span {
      margin-top: 2px;
      left: 42px;
      color: @color-white;
      font-size: 11px;
      border-radius: 3px;
      background-color: rgba(252, 236, 181, 1);
    }
    .rank1 {
      background: -webkit-linear-gradient(left, #b7cbe8, #a2b5d1);
    }
    .rank2 {
      background: -webkit-linear-gradient(left, #68a6e7, #798ed5);
    }
    .rank3 {
      background: -webkit-linear-gradient(left, #dcbf7a, #d1ae63);
    }
  }
}
</style>
