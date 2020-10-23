<template>
  <div class="teamworker-detail" v-if="teamWorkerDetail">
    <my-header title="金牌团队"></my-header>
    <div class="teamworkInfo">
      <div class="abs img">
        <my-imagegallery
          :data="[teamWorkerDetail.imgUrl ? path + teamWorkerDetail.imgUrl : '']"
        ></my-imagegallery>
      </div>
      <div class="baseinfo">
        <span class="font16">{{teamWorkerDetail.name |nameFilters}}</span>
        <div class="abs font14">{{teamWorkerDetail.age}}周岁</div>
        <p class="idNo">身份证号 : {{teamWorkerDetail.idNo}}</p>
        <p>
          <span class="lable fl">身份证</span>
          <span class="lable fl">健康证</span>
        </p>
      </div>
    </div>
    <div class="personinfo rel bg-white boxshadow">
      <i class="myicon icon-person fl"></i>
      <span
        v-if="teamWorkerDetail.sex !== 0"
        class="special-border-right10 rel fl plr10 font14"
      >{{sexFormat(teamWorkerDetail.sex)}}
      </span>
      <span
        class="special-border-right10 rel fl plr10 font14"
      >{{rankFormat(teamWorkerDetail.rank) }}护理人
      </span>
      <span class="rel fl plr10 font14">{{teamWorkerDetail.experience}}</span>
    </div>
    <div class="labelinfo rel bg-white boxshadow">
      <i class="myicon icon-rank fl"></i>
      <span
        v-for="(ilabel, index) in teamWorkerDetail.labelArray"
        :key="index"
        :class="['rel fl plr10 font14 text-green', {'special-border-right10': index !== teamWorkerDetail.labelArray.length -1}]"
      >{{ilabel}}</span>
    </div>
    <div class="note-info rel bg-white boxshadow ">
      <i class="myicon icon-note fl"></i>
      <div v-html="teamWorkerDetail.simpleNote||'暂无个人简介'"></div>
      <div class="mt15" v-html="teamWorkerDetail.note||'暂无技能介绍'"></div>
    </div>

    <div class="pic-info rel bg-white boxshadow">
      <i class="myicon icon-pic fl"></i>
      <span>相关证书</span>
      <!-- /hcs/files/get/1600831056007.jpeg -->
      <my-imagegallery
              :data="urlList"
              :imagegalleryIndex="'imagegallery'"
              :componentId="'teamWorkerDetail'"
              class="mt10"
              >
      </my-imagegallery>

    </div>
  </div>
</template>

<script>
import { homeApi } from '@/assets/api'

export default {
  name: 'teamWorkerDetail',
  data () {
    return {
      teamWorkerDetail: null,
      userCode: 0,
      path: window.hcsConfig.imgURL,
      listpath: window.hcsConfig.imgdomain,
      specialUrl: 'http://tiansu-hcs.natapp1.cc/hcs/files/get/',
      urlList: []
    }
  },
  created () {
    this.loadDetail()
  },
  methods: {
    sexFormat: function (sex) {
      return window.hcsConfig.sexList[sex]
    },
    rankFormat: function (rank) {
      return window.hcsConfig.rankList[rank - 1]
    },
    loadDetail: function () {
      // this.teamWorkerDetail = this.$route.params.carer;
      this.userCode = this.$route.query.userCode
      homeApi
        .teamWorkerDetail(this.userCode)
        .then(response => {
          this.teamWorkerDetail = response.data.data
          this.teamWorkerDetail.fileList.forEach(item => {
            this.urlList.push(item.url)
          })
        })
        .catch(e => {
          this.$MessageBox.alert('数据异常，请稍后重试！！').then(() => {
            this.$router.go(-1)
          })
        })
    }
  },
  filters: {
    nameFilters: function (value) {
      return value.length > 6 ? value.substr(0, 6) : value
    }
  }
}
</script>

<style lang="less" scoped>
@color-white: #fff;
@color-grey: #adadad;
@background-grey: #9b9b9b;
@border-color: #f2f2f2;
@Info-height: 110px;
@m5: 5px;
@m15: 15px;
@m10: 10px;
@m40: 40px;
.teamworker-detail {
  .teamworkInfo {
    height: 110px;
    background-color: #2aabba;
    background: @color-green url("../../assets/imgs/bg-servicedetail.png")
      no-repeat;
    background-size: 100% 100%;
    .img {
      top: 20px;
      left: 20px;
      width: 230px;
      height: 70px;
    }
    .baseinfo {
      padding-top: 20px;
      margin-left: 30%;
      color: #fff;
      .idNo {
        padding-top: 3px;
        opacity: 0.5;
        font-size: 12px;
      }
      .abs {
        right: 20px;
        top: 20px;
      }
      .lable {
        margin-top: 11px;
        margin-right: @m5;
        text-align: center;
        border-radius: 1px;
        background-color: rgba(255, 255, 255, 0.9);
        width: 56px;
        height: 17px;
        border-radius: 1px;
        color: rgba(31, 193, 201, 1);
        font-size: @font-size-mini;
      }
    }
  }
  .personinfo , .labelinfo{
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
    box-sizing: border-box;
    padding: 15px 12px 15px 30px;
    min-height: 50px;
  }
  .note-info ,.pic-info{
    padding: 15px 12px 15px 40px;
    color: @color-grey;
    font-size: 14px;
  }
  i {
      position: absolute;
      top: 15px;
      left: 13px;
      background-position: center center;
      background-size: 15px auto;
      background-repeat: no-repeat;
    }
  .icon-rank {
    background-image: url("../../assets/imgs/rankinfo@2x.png");
  }
  .icon-person {
    background-image: url("../../assets/imgs/personinfo@2x.png");
  }
  .icon-note {
    background-image: url("../../assets/imgs/noteinfo@2x.png");
  }
  .icon-pic {
    background-image: url("../../assets/imgs/CertFile@2x.png");
  }
}
</style>
