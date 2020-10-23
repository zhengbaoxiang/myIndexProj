<template>
  <ul class="templates mt10" :class="{'templates-select' :role==='5' && chooseAndGoServiceItem}">
    <li v-if="serviceOrder.sumTotalCount >serviceOrder.sumRealCount" class="bg-white">
      <mt-badge
        size="small"
        class="unfinish mt15"
      >{{serviceOrder.sumTotalCount -serviceOrder.sumRealCount}}项服务未完成</mt-badge>
    </li>
    <li
      class="pl15"
      v-for="(item, index) in serviceOrder.comenOrderServiceLogs"
      :key="'conmon'+index"
      :class="[getCountStatus(item.itemRealCount,item.itemTotalCount)? (role === '2'? 'unPoint': 'point')  : (role === '2'? 'mark': 'unmark') ]"
      @click="selectServiceItem(item.orderServiceItemId)"
    >
      <div class="icon">
        <mt-badge v-if="getCountStatus(item.itemRealCount,item.itemTotalCount)" size="small"></mt-badge>
      </div>
      <div
        class="mint-cell font14"
        @click="item.normalCount > 0 ? showWorkers(item):null"
        :class="{'text-default' :(getCountStatus(item.itemRealCount,item.itemTotalCount) && role !== '2')  || (!getCountStatus(item.itemRealCount,item.itemTotalCount) && role === '2') ,'first': index === 0} "
      >
        <span>{{item.serviceItemName}}</span>
        <span v-if="item.itemTotalCount>0">{{ '('+item.itemRealCount+"/"+item.itemTotalCount + ")"}}</span>
        <span v-if="item.normalCount > 0" :class="['myicon', item.show ? 'icon-top' : 'icon-down']"></span>
      </div>
      <my-loading class="content"
        :class="[{'end':index === serviceOrder.comenOrderServiceLogs.length -1}]"
        :data="item.workerList"
        v-if="item.show"
        emptyText="加载失败请稍后再试"
      >
        <li
          class="clearfix  singleService"
          v-for="(workerLog, index) in item.workerList"
          :key="'conmonitem'+index+item.id"
          :style="workerLog.note || workerLog.commonLanguage || workerLog.completeStatus !== 0? '':'line-height: 42px'"
          >
          <div class="fl  leftImg">
            <img :src="path + workerLog.imgUrl" alt="暂无图片" @error="_imageError" />
          </div>
          <div class="fl clearfix rightInfo">
            <p class='workinfo'>
              <span class="name">{{workerLog.workerName}}</span>
              <span class=" time">{{new Date(workerLog.careTime).Format('yyyy-MM-dd hh:mm:ss')}}</span>
            </p>
            <p class="noteInfo">
              <mt-badge v-if="workerLog.completeStatus ===1" size="small" class="unfinish">
                <span class="font10">无法服务</span>
              </mt-badge>
              <mt-badge  v-if="workerLog.commonLanguage"   size="small"  >
                <span class="font10">{{workerLog.commonLanguage}}</span>
              </mt-badge>
            <!-- </p>
            <p> -->
              <span v-if="workerLog.note" class="note text-grey">“{{workerLog.note}}”</span>
            </p>
          </div>
        </li>
      </my-loading>
    </li>
    <!-- 附加服务 -->
    <li
      :class="['pl15' ,'mt10',role === '2'? 'mark': 'point' ]"
      v-if="addService && (addService.normalCount || chooseAndGoServiceItem)"
      @click="selectServiceItem(addService.orderServiceItemId)"
    >
      <div class="icon">
        <mt-badge v-if=" role !== '2'" size="small"></mt-badge>
      </div>
      <div class="mint-cell font14 text-default" @click="showWorkers(addService)">
        {{addService.serviceItemName}}
        <span
          :class="['myicon', addService.show ? 'icon-top' : 'icon-down']"
        ></span>
      </div>
      <my-loading
        class="pb10 content"
        :data="addService.workerList"
        v-if="addService.show"
        emptyText="暂无附加工作报告"
      >
        <li
          class="clearfix singleService"
          v-for="(addworkerLog, index) in addService.workerList"
          :key="'addService' +index"
        >
          <div class="fl leftImg">
            <img :src="path + addworkerLog.imgUrl" alt="暂无图片" @error="_imageError" />
          </div>
          <div class="fl clearfix rightInfo">
            <p class='workinfo'>
              <span class="name">{{addworkerLog.workerName}}</span>
              <span class="time">{{new Date(addworkerLog.careTime).Format('yyyy-MM-dd hh:mm:ss')}}</span>
            </p>
            <p class="noteInfo">
              <span v-if="addworkerLog.note" class="note text-grey">“{{addworkerLog.note}}”</span>
            </p>
          </div>
        </li>
      </my-loading>
    </li>
  </ul>
</template>
<script>
import { workOrderApi } from '@/assets/api'
export default {
  data () {
    return {
      path: window.hcsConfig.imgURL
    }
  },
  props: {
    serviceOrder: {
      default: null
    },
    addService: {
      default: null
    },
    role: {
      default: '0'
    },
    // 是否可以选择并进行服务，在详情页默认可以展开收起不会跳到ITEM，在扫码后列表中可以点击
    chooseAndGoServiceItem: {
      default: false
    }
  },
  updated () {
    this.$emit('updated')
  },
  mounted () {
    this.$emit('mounted')
  },
  methods: {
    showWorkers: function (item) {
      if (this.chooseAndGoServiceItem) return
      if (item.workerList === undefined) this.$set(item, 'workerList', null)
      item.show === undefined
        ? this.$set(item, 'show', true)
        : this.$set(item, 'show', !item.show)
      if (item.show && !item.workerList) {
        workOrderApi.getWorkerLogs(item.id).then(resp => {
          this.$set(item, 'workerList', resp.data.data)
        })
      }
    },
    selectServiceItem (id) {
      if (!this.chooseAndGoServiceItem) return
      console.log(id)
      this.$router.push({
        name: 'serviceConfirm',
        query: { orderServiceItemId: id }
      })
    },
    getCountStatus (real, total) {
      if (total === 0 && real === 0) {
        return true
      }
      if (total > 0 && real < total) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="less" scoped>
.templates {
  padding-bottom: 10px;
  .unfinish {
    color: @color-red;
    background-color: rgba(242, 121, 103, 0.08);
  }
  .mint-cell {
    height: 50px;
    line-height: 50px;
    min-height: 50px;
    color: @color-grey;
    -webkit-box-shadow: inset 0 0.5px 0 0 rgba(141, 146, 158, 0.15);
    box-shadow: inset 0 0.5px 0 0 rgba(141, 146, 158, 0.15);
  }
  .first {
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .end {
    -webkit-box-shadow: inset 0 -0.5px 0 0 rgba(141, 146, 158, 0.15);
    box-shadow: inset 0 -0.5px 0 0 rgba(141, 146, 158, 0.15);
  }
  li.pl15 {
    background-color: @color-white;
    position: relative;
    padding-left: 40px;
    .icon {
      background-position: center center;
      background-size: 16px auto;
      background-repeat: no-repeat;
      position: absolute;
      width: 40px;
      height: 50px;
      line-height: 45px;
      top: 0;
      left: 0;
      text-align: center;
      span {
        padding: 3px 3px;
        border-radius: @m5;
        background-color: rgba(199, 199, 204, 1);
      }
    }
    .text-default {
      color: #3e4255;
    }
    .myicon {
      position: absolute;
      right: 15px;
      top: 15px;
      color: @color-grey;
    }
    // 单条的样式。zbx
    .content{
      .singleService{
        padding: 5px 0;
        display: flex;
        .leftImg {
          height: 42px;
          width: 42px;
          margin-right: 10px;
          img {
            height: 100%;
            width: 100%;
            max-width: 42px;
            border-radius: 5px;
          }
        }
        .rightInfo{
          .workinfo{
            .name{
              margin-right: 10px;
              height: 20px;
              line-height: 20px;
              font-size: 14px
            }
            .time{
              height: 20px;
              line-height: 17px;
              font-size: 12px
            }
          }
          .noteInfo{
            margin-top: 5px;
            display: flex;
            .mint-badge.is-primary.is-size-small{
              margin-right: 10px;
              padding:2px;
              height: 12px;
              line-height: 12px;
              font-size: 10px;

            }
            span.note{
              flex: 1;
              line-height: 17px;
              font-size: 12px;
              padding: 0 ;

            }

          }

        }
      }
    }
    p {
      .line-clamp(1);
    }

  }

  .point {
    .icon {
      .mint-badge {
        background-color: rgba(31, 193, 201, 1);
      }
    }
  }
  .unPoint {
    .icon {
      .mint-badge {
        background-color: rgba(199, 199, 204, 1);
      }
    }
  }
  .mark {
    .icon {
      background-image: url("../../assets/imgs/mark.png");
    }
  }
  .unmark {
    .icon {
      background-image: url("../../assets/imgs/unmark.png");
    }
  }
}
.templates-select {
  margin: 0;
  padding: 30px 20px;
  .bg-white {
    display: none;
  }
  li.pl15 {
    // height: 52px;
    margin-bottom: 10px;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
  }
  .myicon {
    display: none;
  }
}
</style>
