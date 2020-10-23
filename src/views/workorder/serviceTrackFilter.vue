<template>
  <div class="serviceTrackFilter">
    <ul class="nav fixed mint-navbar">
      <li
        @click="
          showDistrictContent = !showDistrictContent
          showWorkerContent = false
        "
      >
        <span>{{ listDistrictsText }}</span>
        <i
          :class="['myicon', showDistrictContent ? 'icon-top' : 'icon-down']"
        ></i>
      </li>
      <li
        @click="
          showWorkerContent = !showWorkerContent
          showDistrictContent = false
        "
      >
        <span>{{ listWorkersText }}</span>
        <i
          :class="['myicon', showWorkerContent ? 'icon-top' : 'icon-down']"
        ></i>
      </li>
    </ul>

    <div class="content" v-if="showWorkerContent || showDistrictContent">
      <ul v-if="showDistrictContent">
        <li
          v-for="(item, index) in listDistricts"
          :key="index"
          @click="districtSelect(item, index)"
          :class="{ selected: item.checked }"
        >
          {{ item.name }}
        </li>
      </ul>
      <ul v-if="showWorkerContent">
        <my-inputsearch
          large
          class="mtb10 mlr15"
          :value.sync="searchText"
          @input="searchText = arguments[0]"
        ></my-inputsearch>
        <li
          v-for="(item, index) in listWorkersFiltered"
          :key="index"
          @click="workerSelect(item, index)"
          :class="{ selected: item.checked }"
        >
          {{ item.name }}
        </li>
      </ul>
      <div class="footer center">
        <mt-button size="large" class="my-btn" plain @click.native="reset"
          >重置</mt-button
        >
        <mt-button
          size="large"
          class="my-btn"
          type="primary"
          @click.native="confirm"
          >确定</mt-button
        >
      </div>
    </div>

    <div class="mt44"></div>
  </div>
</template>
<script>
import { workOrderApi } from '@/assets/api'

export default {
  name: 'serviceTrackFilter',
  data () {
    return {
      listDistricts: [],
      listWorkers: [],
      listWorkersFiltered: [],
      selected: 0,
      showDistrictContent: false,
      showWorkerContent: false,
      searchText: ''
    }
  },
  computed: {
    listDistrictsText () {
      const selected = this.listDistricts
        .filter((m) => m.checked)
        .map((item) => item.name)
      return selected.length > 0 ? selected.join(',') : '选择科室'
    },
    listWorkersText () {
      const selected = this.listWorkers
        .filter((m) => m.checked)
        .map((item) => item.name)
      return selected.length > 0 ? selected.join(',') : '选择护工'
    }
  },
  created () {
    workOrderApi
      .getWorkServiceDistricts()
      .then((resp) => {
        this.listDistricts = resp.data.data
      })
      .finally(() => {})
    workOrderApi
      .getWorkServiceWorkers()
      .then((resp) => {
        this.listWorkersFiltered = this.listWorkers = resp.data.data
      })
      .finally(() => {})
  },
  watch: {
    listWorkers: {
      handler (curVal, oldVal) {
        this.listWorkersFiltered = curVal.filter((m) =>
          m.name.includes(this.searchText)
        )
      },
      deep: true
    },
    searchText (newval, oldval) {
      if (oldval !== null) {
        clearTimeout(this.timer)
        // let _this = this
        this.timer = setTimeout(() => {
          console.log('searchText', this.searchText)
          this.listWorkersFiltered = this.listWorkers.filter((m) =>
            m.name.includes(this.searchText)
          )
        }, 400)
      }
    }
  },
  methods: {
    reset () {
      this.searchText = ''
      if (this.showDistrictContent) {
        this.listDistricts = this.listDistricts.map((item) => {
          item.checked = false
          return item
        })
      }
      if (this.showWorkerContent) {
        this.listWorkers = this.listWorkers.map((item) => {
          item.checked = false
          return item
        })
      }
    },
    confirm () {
      this.searchText = ''
      this.$emit(
        'change',
        this.listDistricts.filter((m) => m.checked),
        this.listWorkers.filter((m) => m.checked)
      )
      this.showWorkerContent = false
      this.showDistrictContent = false
    },
    districtSelect (item, index) {
      item.checked = !item.checked
      this.listDistricts.splice(index, 1, item)
    },
    workerSelect (item, index) {
      item.checked = !item.checked
      const indexListWorker = this.listWorkers.findIndex(
        (m) => m.workerCode === item.workerCode
      )
      this.listWorkers.splice(indexListWorker, 1, item)
    }
  }
}
</script>
<style lang="less" scoped>
.serviceTrackFilter {
  height: 44px;
  .nav {
    display: block;
    top: 44px;
    right: 0;
    left: 0;
    z-index: 1001;
    -webkit-box-shadow: 0 0.5px 0.5px 0 rgba(16, 47, 163, 0.07);
    box-shadow: 0 0.5px 0.5px 0 rgba(16, 47, 163, 0.07);
    li {
      float: left;
      box-sizing: border-box;
      width: 50%;
      line-height: 1;
      padding: 12px;
      span {
        width: 50%;
        font-size: 14px;
        color: #8d929e;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        vertical-align: middle;
      }
      i {
        color: #8d929e;
      }
    }
  }
  .content {
    position: fixed;
    top: 88px;
    left: 0;
    bottom: 50px;
    right: 0;
    background-color: #ffffff;
    z-index: 1000;
    overflow: scroll;
    padding-bottom: 20px;
    li {
      margin: 15px 0 0 15px;
      float: left;
      width: 28%;
      box-sizing: border-box;
      padding: 0 8px;
      font-size: 14px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 1);
      border: 0.5px solid rgba(0, 0, 0, 0.1);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &.selected {
        color: rgba(31, 193, 201, 1);
        border: 0.5px solid transparent;
        background-color: rgba(31, 193, 201, 0.1);
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
    z-index: 999;
    .flex();
  }
}
</style>
