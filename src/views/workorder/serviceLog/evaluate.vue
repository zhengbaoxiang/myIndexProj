<template>
  <div
    class="workServiceEvaluate font12 text-grey center"
    :class="{ evaluated: userSatisfaction }"
    v-if="role === roleWx || userSatisfaction"
  >
    <h3 v-if="role === roleWx"><span>评价一下今天的服务吧～</span></h3>
    <h4
      v-else-if="role !== roleWx && userSatisfaction"
      class="font16 text-default left pb10"
    >
      <span>当日服务评价</span>
    </h4>
    <ul>
      <li
        v-for="(item, index) in evaluateList"
        :key="index"
        @click="evaluateClick(index + 1)"
      >
        <i
          :class="[
            'icon-evaluate',
            'icon-evaluate-' + index,
            userSatisfaction && userSatisfaction - 1 !== index
              ? 'disabled'
              : 'active'
          ]"
        ></i>
        <span>{{ item }}</span>
      </li>
    </ul>
    <p v-if="userSatisfaction && role === roleWx" class="mt20">
      已收到评价，感谢您的反馈！
    </p>
  </div>
</template>

<script>
import utils from '@/utils/myUtils'
import { workOrderApi } from '@/assets/api'

export default {
  data () {
    return {
      role: utils.getItem('role'),
      roleWx: '2', // 微信用户
      evaluateList: ['不满', '一般', '满意', '超赞']
    }
  },
  props: {
    serviceId: {
      default: -1
    },
    userSatisfaction: {
      default: 0
    }
  },
  created () {},
  methods: {
    evaluateClick (i) {
      if (this.userSatisfaction) {
        return false
      }
      if (!this.$store.state.submit) {
        return false
      }
      this.$Indicator.open()
      this.$store.commit('setSubmit', false)
      workOrderApi
        .workServiceEvaluate(this.serviceId, i)
        .then((resp) => {
          this.userSatisfaction = i
        })
        .catch((e) => {
          this.$MessageBox.alert(e.data.errmsg)
        })
        .finally(() => {
          this.$Indicator.close()
          this.$store.commit('setSubmit', true)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.workServiceEvaluate {
  background-color: #ffffff;
  padding: 20px 20px 80px;
  h3 {
    margin-bottom: 30px;
    &::before {
      content: '';
      position: relative;
      border-top: 1px dashed #8e6e60;
      height: 0;
      display: block;
      width: 100%;
      top: 10px;
    }
    span {
      position: relative;
      background-color: #ffffff;
      padding: 10px;
    }
  }
  ul {
    .flex();
  }
  li {
    .flex-num(1);
    .icon-evaluate {
      display: block;
      margin: 10px auto;
      height: 48px;
      width: 48px;
      background-size: 100% 100%;
    }
    .icon-evaluate-0.active {
      background-image: url('../../../assets/imgs/serviceLog/upset.png');
    }
    .icon-evaluate-1.active {
      background-image: url('../../../assets/imgs/serviceLog/normal.png');
    }
    .icon-evaluate-2.active {
      background-image: url('../../../assets/imgs/serviceLog/good.png');
    }
    .icon-evaluate-3.active {
      background-image: url('../../../assets/imgs/serviceLog/great.png');
    }
    .icon-evaluate-0.disabled {
      background-image: url('../../../assets/imgs/serviceLog/upset_grey.png');
    }
    .icon-evaluate-1.disabled {
      background-image: url('../../../assets/imgs/serviceLog/normal_grey.png');
    }
    .icon-evaluate-2.disabled {
      background-image: url('../../../assets/imgs/serviceLog/good_grey.png');
    }
    .icon-evaluate-3.disabled {
      background-image: url('../../../assets/imgs/serviceLog/great_grey.png');
    }
  }
}
</style>
