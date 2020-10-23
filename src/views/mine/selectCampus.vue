<template>
  <div class="mine-select-campus" v-if="campusList.length > 1">
    <div class="select-campus-title">
      <p class="font18 text-default myFont-DINPro-Medium">请选择院区</p>
      <p class="text-grey mt5">您有多个院区权限，请选择要查看的院区</p>
    </div>
    <ul class="select-campus-list">
      <li
        class="select-campus mb15"
        :class="[campus.id === selectedId  ? 'check':'uncheck']"
        v-for="(campus, index) in campusList"
        :key="index"
      >
        <label class="mint-radiolist-label">
          <span class="mint-radio is-right">
            <input type="radio" class="mint-radio-input" :value="campus.id" v-model="selectedId" />
            <span class="mint-radio-core"></span>
          </span>
          <span class="mint-radio-label">{{campus.name}}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import { mineApi } from '@/assets/api'
import { Indicator } from 'mint-ui'
// import MyUtils from '@/utils/myUtils'
export default {
  name: 'selectCampus',
  data () {
    return {
      // role: null,
      campusList: [],
      selectedId: null
    }
  },
  created () {
    this.getWorkCampusList()
  },
  mounted () {
    document
      .querySelector('body')
      .setAttribute('style', 'background-color:#ffffff;height:100%')
  },
  beforeDestroy () {
    document.querySelector('body').removeAttribute('style')
  },
  watch: {
    selectedId (val) {
      if (!val) {
        return
      }
      let _this = this
      this.campusList.forEach(campus => {
        if (campus.id === val) {
          _this.selectCampus(campus.id, campus.name)
        }
      })
    }
  },
  components: {},
  methods: {
    // 根据当前角色获取管辖院区列表
    getWorkCampusList () {
      mineApi.workCampusList().then(Response => {
        // 获取初始数据
        console.log(Response)
        let _campusList = Response.data.data
        let selectedCampusId = parseInt(
          window.localStorage.getItem('selectedCampusId')
        )
        console.log('selectedCampusId', selectedCampusId)
        // 如果 campusList只有一个 ,设置这个并进入
        if (_campusList.length === 1) {
          this.selectCampus(_campusList[0].id, _campusList[0].name)
        } else if (selectedCampusId) {
          let _this = this
          // 如果 当前selectCampusId 存在于campusList,直接设置这个并进入
          _campusList.forEach(campus => {
            if (campus.id === selectedCampusId) {
              _this.selectCampus(campus.id, campus.name)
            }
          })
          this.campusList = _campusList
        } else {
          // 如果 当前selectCampusId 不存在于campusList,进行campusList判断
          // 或者不存在selectedCampusId ,进行campusList判断
          this.campusList = _campusList
        }
      })
    },
    // 点击选择指定院区后
    selectCampus (campusId, campusName) {
      Indicator.open('正在指定院区...')
      mineApi
        .updateSelectedCampus(campusId)
        .then(Resp => {
          window.localStorage.setItem('selectedCampusId', campusId)
          window.localStorage.setItem('selectedCampusName', campusName)
          this.$router.replace({ path: '/order/list' })
        })
        .catch(e => {
          alert('指定院区失败', e.data.errmsg)
        })
        .finally(() => {
          Indicator.close()
        })
    }
  }
}
</script>

<style lang="less" scoped>
@img-size: 16px;
.mine-select-campus {
  padding: 40px 15px;
  background-color: #ffffff;
  .select-campus-list {
    margin-top: 40px;
    .select-campus {
      line-height: 16px;
      padding: 20px 10px 20px 4px;
      border-radius: 5px;
      .mint-radio-core {
        background-color: rgba(245, 245, 250, 1);
      }
      input:checked + .mint-radio-core {
        background-color: rgba(31, 193, 201, 1);
      }
      .mint-radio-input:checked + .mint-radio-label {
        background-color: rgba(31, 193, 201, 1);
      }
    }
    .check {
      background-color: #ffffff;
      height: 20px;
      box-shadow: 0px 1px 4px 0px rgba(16, 47, 163, 0.07);
      border: 0.5px solid rgba(236, 236, 243, 1);
    }
    .uncheck {
      background-color: rgba(245, 245, 250, 1);
      height: 22px;
    }
  }
}
</style>
