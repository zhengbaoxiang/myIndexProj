<template>
<div class="serviceLog" ref="content">
    <div class="frontPage" ref='frontPage' v-if="true">
      <!-- <my-header title="护理日志"></my-header> -->
      <div class="datemesg">
        <div class="sym">“</div>
        <div class="basic">
          <div class="title"><p>第 <span>{{serviceDateIndex}}</span> 天护理日志</p> </div>
          <div class="text"><span> 亲爱的{{patientName}}，祝您早日出院，加油！</span></div>
        </div>
        <div class="date">
          <div>
          <div class="month">{{this.nowRealDate[0]}}月</div>
          <div class="day">{{this.nowRealDate[1]}}</div>
          </div>
        </div>
      </div>
      <div class="nums normalFont">
        <div>
        <span class="bigFont">{{serviceWorkerNum}}</span>名护理人员，共提供服务
        <span class="bigFont">{{serviceItemNum}}</span>项，累计<span class="bigFont">{{serviceTimes}}</span>次。
        </div>
      </div>
      <div class="timemsg">
        <div>
          <div class="leftpart" ref='leftpart'>
            <div  class="text normalFont">最早的一次开始于 <span  class="starticon"></span> </div>
            <div class=" time lightFont"> <span ref='hour1' class="bigFont">00</span>时
            <i>:</i><span ref='min1' class="bigFont">00</span>分 </div>
          </div>
          <div class="center">
            <span></span>
          </div>
          <div class="rightpart">
            <div class="text normalFont">最晚的一次开始于 <span class="endicon"></span> </div>
            <div class="time lightFont"> <span ref='hour2' class="bigFont">00</span>时
            <i>:</i><span ref='min2' class="bigFont">00</span>分 </div>
          </div>
          <div class="last"></div>
        </div>
      </div>
    </div>

    <div class="blankPage" :style="{'height' : innerHeight-150+'px'}"></div>
    <div class="secondPage" ref='secondPage'>
      <div class="photos" v-if="imgList.length > 0">
        <p class="title ">护理剪影</p>
        <ul  class="bigphotosList">
            <my-imagegallery
              :data="imgList"
              :imagegalleryIndex="'imagegallery'"
              :componentId="'serviceLogWechat'"
            ></my-imagegallery>
        </ul>
      </div>

      <div class="details" v-if="careWorkerLogs.length > 0">
        <p class="title">护理明细</p>
        <div class="detailsList">
          <logCard :careWorkerLogs="careWorkerLogs"></logCard>
        </div>
      </div>
      <evaluate
        :serviceId="serviceId"
        :userSatisfaction="userSatisfaction"
      ></evaluate>
  </div>
</div>

</template>

<script>
import utils from '@/utils/myUtils'
import logCard from './careWorkerLogsCard'
import evaluate from './evaluate'

export default {
  name: 'serviceLogWechat',
  props: {
    serviceOrder: {
      default: {}
    }
  },
  data () {
    return {
      role: utils.getItem('role'),
      serviceId: 0,
      screenHeight: document.documentElement.clientHeight,
      startTime: -1,
      sTime: -1,
      eTime: -1,
      nowRealDate: [1, 1],
      serviceDateIndex: 1, // 第几天
      patientName: 'xx', // 被护理人名字
      serviceWorkerNum: 0, // 服务护工人数
      serviceItemNum: 0, // 服务项目数
      serviceTimes: 0, // 服务次数
      hour1: '00', // 最早服务时间
      min1: '00',
      hour2: '00', // 最晚服务时间
      min2: '00',

      imgList: [], // 照片墙
      path: window.hcsConfig.imgdomain,

      careWorkerLogs: [], // 服务记录流水
      userSatisfaction: 0, // 服务评价
      innnerHieght: 0

    }
  },
  components: { logCard, evaluate },
  created () {
    this.innerHeight = window.innerHeight
    console.log(this.innerHeight)
  },
  mounted () {
    this.dataInit(this.serviceOrder)
    // window.addEventListener('scroll', this.handleScroll, true)
  },
  computed: { },
  watch: { },
  methods: {
    dataInit (serviceOrder) {
      let data = serviceOrder
      // console.log('data:', data)

      this.serviceDateIndex = data.serviceDateIndex || 1
      this.patientName = data.patientName || ''
      this.serviceWorkerNum = data.serviceWorkerNum || 0
      this.serviceItemNum = data.serviceItemNum || 0
      this.serviceTimes = data.serviceTimes || 0
      this.serviceId = data.id || 0

      this.hour1 = this.timeFormat(data.firstServiceTime, 'hh:mm').split(':')[0]
      this.min1 = this.timeFormat(data.firstServiceTime, 'hh:mm').split(':')[1]
      this.hour2 = this.timeFormat(data.lastServiceTime, 'hh:mm').split(':')[0]
      this.min2 = this.timeFormat(data.lastServiceTime, 'hh:mm').split(':')[1]

      this.nowRealDate = this.timeFormat(data.selectTime, ' M-dd').split('-')
      // 取到值以后，启动动画
      this.timeAnimate(this.hour1, 'hour1', 3000, 30)
      this.timeAnimate(this.min1, 'min1', 3000, 20)
      this.timeAnimate(this.hour2, 'hour2', 3000, 30)
      this.timeAnimate(this.min2, 'min2', 3000, 20)
      // console.log(107, this.nowRealDate, this.firstServiceTime, this.lastServiceTime)
      // 主管上传的照片
      this.imgList = data.imgList
      // 护工服务的流水
      this.careWorkerLogs = data.careWorkerLogs
      // 满意度调查
      this.userSatisfaction = data.userSatisfaction || 0
    },
    timeFormat (time, fomatStr) {
      if (!time) {
        return '00:00'
      } else {
        return new Date(time).Format(fomatStr)
      }
    },
    timeAnimate (data, name, time1, time2) {
      const domobj = this.$refs[name]
      if (!domobj || !data) return
      domobj.innerHTML = '00'
      let i = 0
      setTimeout(() => {
        const timer = setInterval(() => {
          domobj.innerHTML = (i + '').padStart(2, '0')
          if (domobj.innerHTML === data) {
            clearInterval(timer)
          }
          i++
        }, time2)
      }, time1)
    }
  }
}
</script>
<style lang="less" scoped>
.serviceLog{
  .frontPage {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -999;
    // height: 700px;
    background-image: url("../../../assets/imgs/serviceLog/bg@2x.png");
    background-size: 100%;
    span.bigFont{
      font-size: 24px;
      color: #c1500b;
      // font-weight: bold;
      padding: 0 4px;
      opacity: 1;

    }
    .normalFont{
      font-size: 14px;
      color:rgba(131, 96, 81, 1);
      // font-weight: bold;
    }

    .datemesg {
      position: relative;
      opacity: 0;
      animation: appear 0.7s ease-in 0s  1 forwards;

      height: 105px;
      width: 95%;
      margin: 150px auto 0;
      display: flex;
      // opacity: 0.8; //透明度，无法被覆盖
      border-radius: 5px;
      background-color: rgba(255, 255, 255, 0.6);
      .sym{
        width: 40px;
        opacity: 0.9;
        color: rgba(131, 96, 81, 1);
        font-size: 40px;
        text-align: left;
      }

      .basic{
        flex: 4;
        padding-top: 20px;
        .title{
          &>p{
            height: 40px;
            opacity: 0.9;
            color:rgba(131, 96, 81, 1);
            font-size: 14px;
            //垂直居中？？
            line-height: 40px;
            vertical-align: middle;
            span{
              opacity: 1;
              color:rgba(193, 80, 11, 1);
              font-size: 30px;
              // font-weight: bold;
              padding: 0 3px;
            }
          }
        }
        .text{
          span{
            display: inline-block;
            position: relative;
            height: 20px;
            color:rgba(131, 96, 81, 0.8);
            font-size: 12px;
            &::before{
              content: '';
              display: inline-block;
              height:17px;
              width:17px;
              background-image: url("../../../assets/imgs/serviceLog/thumb.png");
              background-size: contain;
              position: relative;
              top: 2px;
              left: 2px;
            }
          }
        }
      }
      .date{
        flex: 1.3;
        &>div{
          position: relative;
          left: 10px;
          top:24px;
          width: 56px;
          height: 52px;
          // box-shadow: 0px 2px 7px 0px rgba(240, 117, 31, 0.11);
          text-align: center;

          .month{
            height: 20px;
            border-radius: 10px 10px 0 0;
            background-color: #c1500b;
            line-height: 20px;
            color:#fff;
            font-size: 14px;

          }
          .day{
            height: 32px;
            border-radius:0 0 10px 10px;
            background-color: #fff;
            line-height: 32px;
            font-size: 24px;
            color: rgba(142, 110, 96, 1);

          }
        }
      }

    }

    .nums {
      position: relative;
      opacity: 0;
      animation: appear 0.5s ease-in  1s  1 forwards;

      width: 95%;
      margin:30px auto 0;
      &>div{
        padding-left: 15px;
        height: 32px;
        opacity: 0.9;
      }
    }

    .timemsg {
      width: 95%;
      margin:35px auto 0 ;
      position: relative;
      opacity: 0;
      animation: appear 0.5s ease-in  1.8s  1 forwards;

      &>div{
        display: flex;
        padding-left: 15px;
        .leftpart ,.rightpart {
          flex: 3;
          & .text{
            // height: 20px;
            padding: 5px 0;
            opacity: 0.9;
            .starticon , .endicon{
              display:inline-block;
              left: -1px;
              height: 16px;
              width:16px;
              background-size: contain;
              position: relative;
              top: 3px;
            }
            .starticon{
              background-image:url("../../../assets/imgs/serviceLog/start.png");
            }
            .endicon{
              background-image:url("../../../assets/imgs/serviceLog/end.png");
            }
          }

          .time{
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 5px;
            font-size: 12px;
            color: rgba(131, 96, 81, 1);
            text-align: left;
            width: 120px;

            & span{
              opacity: 0.9;
            }
            & i{
              line-height: 36px;
              font-size: 18px;
              display: inline-block;
              padding: 0 3px;
            }
          }
        }
        .center{
          flex:1;
          &>span{
            display:inline-block;
            height: 18px;
            width:16px;
            background-image:url("../../../assets/imgs/serviceLog/arrow.png");
            background-size: contain;
            position: relative;
            top: 38px;
            left: -4px;
          }
        }
        .last{
          flex: 1;
        }
      }
    }

    //定义动画
    @keyframes appear {
      0% {
        opacity: 0;
        top: 20px;
      }
      100% {
        opacity: 1;
        top: 0;
      }
    }

  }
  .blankPage{
    position: relative;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .secondPage{
    position: relative;
    top: 0px;
    padding-top: 30px;
    background: #fff;
    border-top-left-radius: 60px 50px;

    .title{
      height: 22px;
      width: 90%;
      margin: auto;
      padding: 5px 0;
      font-size: 16px;
      font-weight: bold;
      color: rgba(62, 66, 85, 1);
      text-align: left;
      &::before{
        content: '';
        display:inline-block;
        height: 18px;
        width:16px;
        margin-right: 10px;
        background-image:url("../../../assets/imgs/serviceLog/arrow.png");
        background-size: contain;
        position: relative;
        top: 2px;
        left: 0px;

      }
    }
    .bigphotosList{
      width: 90%;
      margin: 20px auto;
      & li{
        border-radius: 4px;
      }
    }

    .detailsList{
      width: 90%;
      margin: 20px auto;
    }
  }

}

</style>
