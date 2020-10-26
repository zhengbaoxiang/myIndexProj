<template>
  <div class="register">
    <header>
      <i class="mintui mintui-back fl" @click="goHistory"></i>
      <h1 class="font16">手机号绑定</h1>
    </header>
    <div class="mlr15">
      <a
        :class="this.telCls === 0 ? 'input-area' : 'input-area focus'"
        class="mb10 mint-cell mint-field is-nolabel"
      >
        <i class="img userimg" :class="{'disabled':!ruleForm.tel}"></i>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-value">
            <input
              @focus="telCls = 1"
              @blur="telCls = 0"
              v-model="ruleForm.tel"
              placeholder="请输入手机号"
              type="text"
              maxlength="11"
              class="mint-field-core"
            />
          </div>
        </div>
      </a>
      <a
        :class="this.randomimgCls === 0 ? 'input-area' : 'input-area focus'"
        class="mb10 mint-cell mint-field is-nolabel"
      >
        <i class="img randomimg" :class="{'disabled':!ruleForm.randomCode}"></i>
        <div class="mint-cell-wrapper">
          <div class="mint-cell-value">
            <input
              @focus="randomimgCls = 1"
              @blur="randomimgCls = 0"
              v-model="ruleForm.randomCode"
              placeholder="请输入验证码"
              type="text"
              maxlength="6"
              class="mint-field-core"
            />
            <a
              class="random-text"
              :class="{'disabled': randomTips || auth_time > 0 }"
              @click="getRandomCode()"
            >{{auth_time > 0 ? '点击获取(' + auth_time + ')' : '点击获取'}}</a>
          </div>
        </div>
      </a>
      <div class="agreement">
        <label>
          <input type="checkbox" v-model="checked" class="mint-checkbox-input" value="aaa" />
          <span class="mint-checkbox-core"></span>
          <span class="mint-checkbox-label">
            我已阅读并同意
            <span class="text-green" @click="gotoagreement">《天溯运维护工服务协议》</span>
          </span>
        </label>
      </div>
      <mt-button
        type="primary"
        class="button-login"
        size="large"
        :disabled="loginbuttonclick !== checked"
        @click="login"
      >确定</mt-button>
    </div>

    <video autoplay loop muted class="bgvid" id="bgvid" v-show="true">
      <source src="./feng.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script>
import { mineApi } from '@/assets/api'
import utils from '@/utils/myUtils'
import { Indicator } from 'mint-ui'
export default {
  name: 'register',
  data () {
    return {
      value: '1',
      checked: false,
      loginbuttonclick: true,
      auth_time: -1,
      redirect: this.$route.query.redirect || { name: 'minehome' },
      ruleForm: {
        tel: '',
        randomCode: ''
      },
      uncommit: false,
      randomimgCls: 0,
      telCls: 0
      // openId: this.$route.query.openId || this.$route.query.opencode
    }
  },
  created () {
    this.init()
  },
  computed: {
    formTips () {
      if (!utils.validatePhoneNumber(this.ruleForm.tel)) {
        return '手机号码格式不正确'
      }
      if (!this.ruleForm.randomCode) return '请输入验证码'
      else return false
    },
    randomTips () {
      if (!utils.validatePhoneNumber(this.ruleForm.tel)) {
        return '手机号码格式不正确'
      } else return false
    }
  },
  methods: {
    init: function () {
      this.ruleForm = this.$store.state.ruleForm
    },
    gotoagreement: function () {
      this.$store.commit('setRuleForm', this.ruleForm)
      this.$router.push({
        name: 'agreement'
      })
    },
    goHistory: function () {
      this.$store.commit('setRuleForm', { tel: '', randomCode: '' })
      this.$router.go(-1)
    },
    getRandomCode: function () {
      if (this.randomTips || this.auth_time > 0) return
      let nowTime = new Date().getTime()
      let interval = (
        nowTime - parseInt(window.localStorage.getItem('register'))
      ).toFixed(0)
      if (interval < 60) {
        this.auth_time = 60 - interval
      } else {
        this.auth_time = 60
        window.localStorage.setItem('register', nowTime)
        mineApi.getRandomCode(this.ruleForm.tel).catch(e => {
          this.$Toast('验证码获取失败，请稍后再试！')
          this.auth_time = -1
          clearInterval(thisTimer)
        })
      }
      var thisTimer = setInterval(() => {
        this.auth_time--
        if (this.auth_time <= 0) {
          this.auth_time = -1
          clearInterval(thisTimer)
        }
      }, 1000)
    },
    login: function () {
      if (this.formTips) {
        this.$MessageBox.alert(this.formTips)
        return
      }
      this.loginbuttonclick = false
      Indicator.open('正在操作...')
      let arg = null
      arg = {
        telephone: this.ruleForm.tel,
        randomCode: this.ruleForm.randomCode
      }
      mineApi
        .telephone(arg)
        .then(response => {
          Indicator.close()
          console.log(response)
          window.localStorage.setItem('existTel', 'true')
          this.$store.commit('setRuleForm', { tel: '', randomCode: '' })
          this.loginbuttonclick = true
          this.$router.replace(this.redirect)
        })
        .catch(e => {
          Indicator.close()
          console.log(e)
          this.loginbuttonclick = true
          let msg = '绑定失败:'
          msg += e.data.errmsg
          this.$Toast(msg)
        })
        .finally(() => {
          this.uncommit = false
        })
      // }
    }
  }
}
</script>

<style lang="less" scoped>
@bk-size : 13px;
.register {
  height: 700px;
  position: relative;
  video{
    width: 100%;
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    opacity: 0.7;
    z-index: -100;
  }

  header {
    margin: @m15 20px 0 20px;
    height: 75px;
    text-align: center;
    line-height: 75px;
    .mintui-back {
      color: rgba(0, 0, 0, 1);
    }
  }
  .focus {
    box-shadow: 0px 4px 10px 0px rgba(86, 165, 156, 0.3);
  }
  .input-area {
    border-radius: @m5;
    background-color: @color-white;
    position: relative;
    .mint-cell-wrapper {
      padding-left: 35px;
      padding-right: 35px;
      line-height: 25px;
      input {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }
    .img {
      position: absolute;
      left: 15px;
      top: 18px;
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      &.userimg {
        background-image: url("../../assets/imgs/user.png");
      }
      &.randomimg {
        background-image: url("../../assets/imgs/random.png");
      }
      &.disabled {
        opacity: 0.3;
      }
    }
    .random-text {
      position: absolute;
      right: 15px;
      top: 15px;
      color: @color-green;
      font-size: @font-size-small;
    }
    .random-text.disabled {
      opacity: 0.5;
      color: @color-grey;
    }
  }
  .agreement {
    margin-top: 20px;
    margin-bottom: 50px;
    color: @color-default;
    font-size: @font-size-mini;
    .mint-checkbox-core {
      width: @bk-size;
      height: @bk-size;
    }
    .mint-checkbox-core::after {
      top: 0px;
      left: 3px;
    }
  }
  .button-login {
    border-radius: @m5;
    box-shadow: 0px 4px 10px 0px rgba(86, 165, 156, 0.3);
  }
  .button-login[disabled] {
    opacity: 0.5;
    background-color: @color-grey;
    box-shadow: none;
  }
}
</style>
