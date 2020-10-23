<template>
  <div class="select-hospital">
    <div class="myheader fixed">
      <div class="shadow">
        <my-header title="选择医院"></my-header>
        <div class="search-bar">
          <div class="city" @click="isShowCityList = true">
            <i class="myicon icon-lbs text-green fl"></i>
            <span class="font14 fl">{{currentCity || "请选择"}}</span>
            <i class="myicon text-grey icon-down fl"></i>
          </div>
          <my-inputsearch
            :value.sync="hospitalSearchText"
            placeholder="请输入医院名称"
            @input="hospitalSearchText  = arguments[0]"
          ></my-inputsearch>
        </div>
      </div>
      <div class="mint-cell">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title" v-if="hospitalName">
            <span class="mint-cell-text fl">{{hospitalName}}</span>
            <i class="icon-default fl">当前</i>
          </div>
          <div class="mint-cell-value text-grey" @click="refreshLocation">
            <i class="myicon icon-target"></i>
            <span class="font14">重新定位</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 租户列表 -->
    <my-loading :data="displayHospitals" class="tenant-list" emptyText="未搜索到相关医院">
      <li
        class="mint-cell"
        v-for="(tenant, index) in displayHospitals"
        :key="index"
        @click="changeHospital(tenant)"
        v-html="tenant.name"
      ></li>
    </my-loading>
    <!-- 向上拉起的选城市的浮层 -->
    <mt-popup v-show="isShowCityList" class="my-city-list" position="bottom">
      <header class="mint-header">
        <mt-button icon="back" @click="isShowCityList = false"></mt-button>
        <my-inputsearch
          :value.sync="citySearchText"
          placeholder="请输入城市名"
          @input="citySearchText = arguments[0]"
        ></my-inputsearch>
      </header>
      <div class="mint-cell" v-if="currentCity">
        <div class="mint-cell-wrapper">
          <div class="mint-cell-title">
            <span class="mint-cell-text fl">{{currentCity}}</span>
            <i class="icon-default fl">当前</i>
          </div>
        </div>
      </div>
      <my-loading :data="displayCityList" emptyText="未搜索到相关城市">
        <li
          class="mint-cell"
          v-for="(cityName, index) in displayCityList"
          :key="index"
          @click="resetCity(cityName)"
          v-html="cityName"
        ></li>
      </my-loading>
    </mt-popup>
  </div>
</template>

<script>
import { homeApi } from '@/assets/api'
import getLocation from './getLocation'
import utils from '@/utils/myUtils'

export default {
  name: 'selectHospital',
  data () {
    return {
      hospitals: null,
      displayHospitals: null,
      hospitalSearchText: '',
      cityList: null,
      displayCityList: null,
      citySearchText: '',
      currentCity: window.localStorage.getItem('city') || '',
      hospitalId: window.localStorage.getItem('hospitalID') || 0,
      hospitalName: window.localStorage.getItem('hospitalName') || null,
      isShowCityList: false
    }
  },
  watch: {
    citySearchText (val) {
      // if (val) {
      this.displayCityList = this.cityList
        .filter(m => m.includes(val))
        .map(m => {
          return m.replace(
            new RegExp(val, 'gi'),
            '<span class="text-green">' + val + '</span>'
          )
        })
      // } else {
      //   this.displayCityList = this.cityList
      // }
    },
    hospitalSearchText (val) {
      if (!val) {
        this.displayHospitals = this.hospitals
        return
      }
      let result = []
      this.hospitals.forEach(m => {
        if (m.name.includes(val)) {
          let n = {}
          n.name = m.name.replace(
            new RegExp(val, 'gi'),
            '<span class="text-green">' + val + '</span>'
          )
          n.id = m.id
          result.push(n)
        }
      })
      this.displayHospitals = result
    }
  },
  created () {
    // 有城市时，直接拿院区列表
    if (this.currentCity) {
      this.getTenantList(this.currentCity)
    }
    // 没有城市，从首页请选择进来，默认使用cityList的第一个城市。
    homeApi
      .getCityList()
      .then(data => {
        this.displayCityList = this.cityList = data.data.data.list
        if (this.cityList.length > 0) {
          if (!this.currentCity) {
            this.currentCity = '北京市'
            this.getTenantList(this.currentCity)
          }
        }
      })
      .catch(e => {
        this.displayCityList = this.cityList = []
        if (!this.currentCity) {
          this.displayHospitals = this.hospitals = []
        }
      })
  },
  methods: {
    getTenantList (cityName) {
      homeApi
        .getTenantList(cityName)
        .then(data => {
          this.displayHospitals = this.hospitals = data.data.data.list
        })
        .catch(e => {
          this.displayHospitals = this.hospitals = []
        })
    },
    // 点击医院，或者重新定位后，触发存储相关数据的操作。默认会跳回第一页，stay为true则不跳
    changeHospital (hospital, stay) {
      const _hospital =
        this.hospitals.filter(m => m.id === hospital.id)[0] || hospital
      this.hospitalId = _hospital.id
      this.hospitalName = _hospital.name
      getLocation.setLocalStorage(_hospital)
      if (!stay) this.$router.go(-1)
    },
    // 重新根据经纬度，拿到最近的定位医院
    refreshLocation () {
      this.$Indicator.open('重新定位中')
      var timer = setTimeout(() => {
        if (this.$Indicator) {
          this.$toast('定位失败，请重试！')
          this.$Indicator.close()
        }
      }, 5000)
      if (utils.isIOS()) {
        getLocation.getwxLocationAndTenant(data => {
          this.$Indicator.close()
          clearTimeout(timer)
          this.changeHospital(data)
        })
      } else {
        getLocation.getLocationAndTenant(data => {
          this.$Indicator.close()
          clearTimeout(timer)
          this.changeHospital(data)
        }, true)
      }
    },
    // 切换城市，关闭浮层，重新获取新城市的院区信息，数据变化仅局限于当前页，不触发存储操作。
    resetCity (cityName) {
      this.hospitalSearchText = ''
      this.isShowCityList = false
      this.currentCity = cityName
        .replace(new RegExp('<span class="text-green">', 'gi'), '')
        .replace(new RegExp('</span>', 'gi'), '')
      this.getTenantList(this.currentCity)
    }
  }
}
</script>

<style lang="less">
.select-hospital {
  background-color: #ffffff;
  .shadow {
    box-shadow: 0 1px 4px 0 rgba(16, 47, 163, 0.07);
    position: relative;
    z-index: 2;
    .mint-header {
      box-shadow: none;
    }
  }
  .myheader.fixed {
    left: 0;
    right: 0;
    top: 0;
    z-index: 2;
  }
  .search-bar {
    background-color: #ffffff;
    padding: 10px;
    position: relative;
    .city {
      position: absolute;
      left: 5px;
      top: 15px;
    }
    span.font14 {
      width: 54px;
      .line-clamp(1);
      display: -webkit-inline-box;
      white-space: initial;
      text-align: left;
      line-height: 20px;
    }
    .my-search {
      margin-left: 100px;
    }
  }
  .icon-default {
    display: inline-block;
    margin-left: 8px;
    text-align: center;
    width: 44px;
    height: 18px;
    line-height: 18px;
    border-radius: 1px;
    background-color: rgba(31, 193, 201, 0.1);
    color: @color-green;
    font-size: @font-size-mini;
  }
  .tenant-list {
    position: absolute;
    top: 52px + 86px;
    left: 0;
    right: 0;
    background-color: #ffffff;
    overflow: auto;
  }
  li.mint-cell {
    margin-left: 30px;
    height: 52px;
    line-height: 52px;
  }
  .my-city-list {
    top: 0;
    z-index: 3;
    .mintui-back {
      margin-right: 10px;
    }
  }
}
</style>
