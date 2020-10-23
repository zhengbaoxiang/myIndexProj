<template>
  <div class="person-detail pb65">
    <my-header title="被护理人信息">
      <div>
        <span
          v-if="detail.code"
          slot="right"
          class="font14"
          @click="deletePatient(detail.code)">删除</span>
      </div>
    </my-header>
    <div>
      <mt-cell title="姓名" class="my-required">
        <slot name="right">
          <input
            v-model="detail.name"
            class="mint-field-core right"
            maxlength="8"
            placeholder="请填写姓名"
            @input="filterName(detail.name)"
            @blur="restore"
          >
        </slot>
      </mt-cell>
      <mt-cell title="性别" class="my-required">
        <slot name="right">
          <my-radiogroup
            v-model="detail.sex"
            :options="[
            {
              label: '男',
              value: '1'
            },
            {
              label: '女',
              value: '2'
            }]"
          ></my-radiogroup>
        </slot>
      </mt-cell>
      <mt-cell title="出生年月" class="my-required">
        <slot name="right">
          <span @click="getbirthday" class="pr15">
            <input
              class="mint-field-core right"
              readonly
              :value="detail.birthday ? new Date(detail.birthday).Format('yyyy年MM月') : ''"
              :placeholder="birthdayText"
            >
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell title="身高">
        <slot name="right">
          <span @click="heightSheetVisible = true" class="pr15">
            <input
              class="mint-field-core right"
              readonly
              :value="detail.heightval"
              placeholder="请选择身高"
            >
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell title="体重">
        <slot name="right">
          <span @click="weightSheetVisible = true" class="pr15">
            <input
              class="mint-field-core right"
              readonly
              :value="detail.weightval"
              placeholder="请选择体重"
            >
            <i class="mint-cell-allow-right"></i>
          </span>
        </slot>
      </mt-cell>
      <mt-cell title="自理能力" class="my-required">
        <slot name="right">
          <my-radiogroup
            v-model="detail.selfCare"
            :options="[
              {
                label: '自理',
                value: '1'
              },
              {
                label: '半自理',
                value: '2'
              },
              {
                label: '不能自理',
                value: '3'
              }]"
          ></my-radiogroup>
        </slot>
      </mt-cell>
      <mt-cell :title="'备注('+detail.note.length+'/500)'" style="box-shadow:none"></mt-cell>
      <div class="detailnote">
        <textarea
          placeholder="请输入被护理人情况说明"
          class="mint-field-core note"
          maxlength="500"
          v-model="detail.note"
          @input="filterNote(detail.note)"
          @blur="restore"
        ></textarea>
      </div>
    </div>
    <div class="hr-10"></div>
    <mt-cell title="设为默认被护理人">
      <mt-switch v-model="detail.isDefault"></mt-switch>
    </mt-cell>
    <div class="bottom fixed">
      <mt-button
        type="primary"
        size="large"
        v-if="detail.code && !isEdit"
        @click="patientUpdate()"
      >更新被护理人</mt-button>
      <mt-button v-else-if="!detail.code" type="primary" size="large" @click="savePatient()">保 存</mt-button>
    </div>
    <!-- 出生年月弹窗 -->
    <my-actionsheet
      title="请选择出生年月"
      v-model="birthdaySheetVisible"
      :data="birthdayList"
      @change="birthdaySelected"
      :valueKey="'value'"
    ></my-actionsheet>
    <!--身高弹窗 -->
    <my-actionsheet
      title="请选择身高"
      v-model="heightSheetVisible"
      :data="heightList"
      @change="heightSelected"
    ></my-actionsheet>
    <!--体重弹窗 -->
    <my-actionsheet
      title="请选择体重"
      v-model="weightSheetVisible"
      :data="weightList"
      @change="weightSelected"
    ></my-actionsheet>
  </div>
</template>

<script>
import { patientApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  name: 'userDetail',
  data () {
    return {
      detail: {
        code: '',
        name: '',
        sex: '1',
        birthday: 0,
        height: 0,
        heightval: '',
        weight: 0,
        weightval: '',
        selfCare: '1',
        note: '',
        isDefault: true
      },
      birthdayList: [],
      birthdayText: '请选择出生年月',
      birthdaySheetVisible: false,
      heightData: [],
      heightList: [],
      heightSheetVisible: false,
      weightData: [],
      weightList: [],
      weightSheetVisible: false,
      originData: '',
      isEdit: false
    }
  },
  computed: {
    formTips () {
      if (this.detail.name === '') return '请输入名字'
      if (this.detail.sex === '') return '请选择性别'
      if (!this.detail.birthday) return this.birthdayText
      if (this.detail.selfCare === '') return '请选择自理能力'
      else return false
    }
  },
  watch: {
    detail: {
      handler (curVal, oldVal) {
        this.isEdit = JSON.stringify(this.detail) === this.originData
      },
      deep: true
    }
  },
  created () {
    // 接收到前一个页面的userCode
    var userCode = this.$route.query.userCode
    this.detail.code = userCode
    // let this = this
    const getDatas = async () => {
      if (userCode) {
        return Promise.all([
          patientApi.patientHM(1),
          patientApi.patientHM(2),
          patientApi.patientDetail(userCode)
        ]).then(results => ({
          height: results[0].data.data,
          weight: results[1].data.data,
          detail: results[2].data.data
        }))
      } else {
        return Promise.all([
          patientApi.patientHM(1),
          patientApi.patientHM(2)
        ]).then(results => ({
          height: results[0].data.data,
          weight: results[1].data.data
        }))
      }
    }
    getDatas()
      .then(arg => {
        console.log(123)
        // 遍历数组得到身高/体重的组件需要的数据
        this.heightData = arg.height
        this.heightList = [
          { values: this.heightData.map(item => item.pvalue) }
        ]
        this.weightData = arg.weight
        this.weightList = [
          { values: this.weightData.map(item => item.pvalue) }
        ]
        if (arg.detail) {
          this.detail = arg.detail
          this.detail.heightval = (
            this.heightData.filter(m => m.id === this.detail.height)[0] || {}
          ).pvalue
          this.detail.weightval = (
            this.weightData.filter(m => m.id === this.detail.weight)[0] || {}
          ).pvalue
          this.detail.selfCare = (this.detail.selfCare || '').toString()
          this.detail.sex = (this.detail.sex || '').toString()
          this.detail.birthday = this.detail.birthday
          this.detail.isDefault = this.detail.isDefault === 1
          this.detail.note = this.detail.note || ''
          this.originData = JSON.stringify(this.detail)
        } else if (arg.detail === '') {
          this.$MessageBox.alert('数据异常，请稍后重试！').then(() => {
            this.$router.go(-1)
          })
        }
      })
      .catch(() => {
        this.$MessageBox.alert('数据异常，请稍后重试！！').then(() => {
          this.$router.go(-1)
        })
      })
  },
  methods: {
    // 选中的出生日期
    birthdaySelected (val) {
      this.detail.birthday = new Date(val[0].value, val[1].value - 1).getTime()
    },
    // 选中的身高
    heightSelected (val) {
      this.detail.heightval = val[0]
      this.detail.height = this.heightData.find(m => m.pvalue === val[0]).id
    },
    // 选中的体重
    weightSelected (val) {
      this.detail.weightval = val[0]
      this.detail.weight = this.weightData.find(m => m.pvalue === val[0]).id
    },
    // 处理出生年月选择列表
    getbirthday () {
      this.birthdaySheetVisible = true
      let curYear = new Date().getFullYear()
      let curMonth = new Date().getMonth()
      if (this.detail.birthday) {
        curYear = new Date(this.detail.birthday).getFullYear()
        curMonth = new Date(this.detail.birthday).getMonth()
      }
      let list = new Array(120).fill({}).map((m, i) => ({
        value: new Date().getFullYear() - i,
        items:
          i === 0
            ? new Array(new Date().getMonth() + 1)
              .fill({})
              .map((m, i) => (i >= 0 ? { value: i + 1 } : {}))
            : new Array(12)
              .fill({})
              .map((m, i) => (i >= 0 ? { value: i + 1 } : {}))
      }))
      console.log(list)
      this.birthdayList = [
        {
          values: list,
          defaultIndex: new Date().getFullYear() - curYear
        },
        {
          values: list[new Date().getFullYear() - curYear].items,
          defaultIndex: curMonth
        }
      ]
      // this.birthdayList = [
      //   {
      //     values: new Array(120)
      //       .fill(0)
      //       .map((m, i) => new Date().getFullYear() - i),
      //     defaultIndex: new Date().getFullYear() - curYear
      //   },
      //   {
      //     values: new Array(12).fill(0).map((m, i) => i + 1),
      //     defaultIndex: curMonth
      //   }
      // ]
    },
    // 删除数据
    deletePatient (userCode) {
      this.$MessageBox.confirm('是否确认删除该被护理人').then(() => {
        if (!this.$store.state.submit) {
          return
        }
        this.$store.commit('setSubmit', false)
        patientApi
          .patientDelete(userCode)
          .then(() => {
            this.$MessageBox.alert('删除成功!').then(e => {
              this.$router.go(-1)
            })
          })
          .catch(() => {
            this.$Toast('删除失败，请稍后再试！')
          })
          .finally(() => {
            this.$store.commit('setSubmit', true)
          })
      })
    },
    // 保存被护理人
    savePatient () {
      // 校验是否已经全部填写信息
      if (this.formTips) {
        this.$MessageBox.alert(this.formTips)
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      const arg = {
        name: this.detail.name,
        sex: this.detail.sex,
        birthday: this.detail.birthday,
        selfCare: this.detail.selfCare,
        note: this.detail.note,
        isDefault: this.detail.isDefault ? 1 : 0
      }
      if (this.detail.height) arg.height = this.detail.height
      if (this.detail.weight) arg.weight = this.detail.weight
      patientApi
        .patientAdd(arg)
        .then(e => {
          this.$MessageBox.alert('添加成功!').then(e => {
            this.$router.go(-1)
          })
        })
        .catch(e => {
          if (e.data) {
            this.$MessageBox.alert(e.data.errmsg)
          } else {
            this.$MessageBox.alert('添加失败，请稍后再试!')
          }
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    patientUpdate () {
      // 校验是否已经全部填写信息
      if (this.formTips) {
        this.$MessageBox.alert(this.formTips)
        return
      }
      if (!this.$store.state.submit) {
        return
      }
      this.$store.commit('setSubmit', false)
      const arg = {
        id: this.detail.id,
        name: this.detail.name,
        sex: this.detail.sex,
        birthday: this.detail.birthday,
        selfCare: this.detail.selfCare,
        note: this.detail.note,
        isDefault: this.detail.isDefault ? 1 : 0
      }
      if (this.detail.height) arg.height = this.detail.height
      if (this.detail.weight) arg.weight = this.detail.weight
      patientApi
        .patientUpdate(arg)
        .then(e => {
          this.$MessageBox.alert('更新成功!').then(e => {
            this.$router.go(-1)
          })
        })
        .catch(e => {
          if (e.data) {
            this.$MessageBox.alert(e.data.errmsg)
          } else {
            this.$MessageBox.alert('更新失败，请稍后再试!')
          }
        })
        .finally(() => {
          this.$store.commit('setSubmit', true)
        })
    },
    filterName (name) {
      this.detail.name = utils.filterEmojiStrict(name)
    },
    filterNote (note) {
      this.detail.note = utils.filterEmoji(note)
    }
  }
}
</script>

<style lang="less">
.person-detail {
  .my-required {
    .mint-cell-text::after {
      content: "*";
      color: @color-red;
    }
  }
  .updUser {
    margin: 30px 37% 15px 37%;
    height: 22px;
    color: @color-green;
    font-size: 16px;
    text-align: center;
    display: block;
  }
  .detailnote {
    padding: 0 15px 15px;
    background-color: @color-white;
    .note {
      width: 100%;
      height: 90px;
      line-height: 1.2;
      padding: 15px;
      box-sizing: border-box;
      border-radius: 1px;
      box-shadow: 0px 1px 4px 0px rgba(16, 47, 163, 0.07);
      border: 0.5px solid rgba(236, 236, 243, 1);
      font-size: 16px;
    }
  }
}
</style>
