<template>
<div class="careWorkerLogsCard">
  <li v-for="(item,index) in careWorkerLogsTexts" :key='index'>
    <div class="careTime"><p>{{item.careTime}} </p>  <span> ---</span> </div>
    <div class="content">
      <div class="serviceItemName">{{item.serviceItemName}}</div>
      <div class="tag"  v-show="item.tag" :class="{red:item.completeStatus===1}" >{{item.tag}}</div>
      <div class="worker">
        <div class="pic">
          <img :src="path + item.imgUrl" alt="暂无图片" @error="_imageError" />
          </div>
        <div class="workerName">{{item.workerName}}</div>
        <div class="note" v-if="item.note">“{{item.note}}”</div>
      </div>
    </div>
  </li>
</div>
</template>

<script>
import utils from '@/utils/myUtils'
export default {
  name: 'careWorkerLogsCard',
  props: {
    careWorkerLogs: {
      default: []

    }

  },
  data () {
    return {
      role: utils.getItem('role'),
      path: window.hcsConfig.imgURL, // 头像地址
      careWorkerLogsTexts: [] // 服务记录流水

    }
  },
  created () { },
  mounted () { },
  computed: { },
  watch: {
    careWorkerLogs: {
      immediate: true,
      handler (val) {
        if (val) {
          this.dataInit(val)
        }
      }
    }
  },
  methods: {
    dataInit (careWorkerLogs) {
      // console.log(careWorkerLogs)
      if (careWorkerLogs.length > 0) {
        careWorkerLogs.forEach(item => {
          let temp = {}
          temp.careTime = this.timeFormat(item.careTime, 'hh:mm')
          temp.serviceItemName = item.serviceItemName
          temp.workerName = item.workerName
          temp.completeStatus = item.completeStatus
          // 附加服务只有tag，没有note，但是字段存在note中
          if (temp.serviceItemName !== '附加服务') {
            temp.tag = item.completeStatus === 1 ? '无法服务' : item.commonLanguage
            temp.note = item.note
          } else {
            temp.tag = item.note
            temp.note = ''
          }
          this.careWorkerLogsTexts.push(temp)
        })
      }
    },
    timeFormat (time, fomatStr) {
      if (!time) {
        return -1
      } else {
        return new Date(time).Format(fomatStr)
      }
    }

  }
}
</script>
<style lang="less" scoped>
.careWorkerLogsCard{
  & li{
    margin: 10px auto;
    list-style: none;
    display: flex;
    .careTime{
      flex: 1;
      p{
        display: inline-block;
        padding: 16px 0 0;
        color: rgba(195, 83, 11, 1);
        font-size: 12px;
        text-align: left;
      }
    }
    .content{
      flex: 4;
      border-radius: 10px;
      background-color: rgba(250, 251, 252, 1);
      padding: 10px 0 13px 15px;
      .serviceItemName{
        height: 20px;
        padding: 1px 3px 1px 0;
        color: rgba(62, 66, 85, 1);
        font-size: 14px;
        text-align: left;

      }
      .tag{
        height: 14px;
        width: fit-content;
        padding: 2px 5px ;
        border-radius: 1px;
        background-color: rgba(31, 193, 201, 0.1);

        color: rgba(31, 193, 201, 1);
        font-size: 10px;
        text-align: left;
      }
      .red{
        color: rgba(242, 121, 103, 1);
        background-color: rgba(242, 121, 103, 0.1);
      }
      .worker{
        display: flex;
        padding: 5px  0 0;
        .pic{
          width: 26px;
          img{
            width: 24px;
            height: 24px;
            border-radius: 5px;
            border: 1px solid rgba(255, 255, 255, 1);
          }

        }
        .workerName ,.note {
          padding: 0 1px 0 2px;
          color: rgba(141, 146, 158, 1);
          font-size: 12px;
          line-height: 26px;
          text-align: left;
        }
        .workerName{
          flex-shrink:   0 ;

        }

      }

    }
  }
}

</style>
