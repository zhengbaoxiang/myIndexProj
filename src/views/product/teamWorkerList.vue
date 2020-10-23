<template>
  <div class="teamworker-list">
    <my-header :title="orderId?'服务护工':'金牌团队'"></my-header>
    <ul
      v-infinite-scroll="loadMore"
      infinite-scroll-distance="10"
      infinite-scroll-disabled="notScroll"
    >
      <li class="clearfix" v-for="(item, index) in teamWorkerList" :key="index">
        <div @click="toDetail(item)">
          <div class="fl left">
            <div class="img">
              <img :src="path + item.imgUrl" alt="暂无图片" @error="_imageError" />
            </div>
            <div>
              <div class="strong">
                <span>个人特长</span>
              </div>
            </div>
          </div>
          <div class="fl baseinfo clearfix">
            <div class="fl">
              <span>{{item.name |nameFilters}}</span>
              <mt-badge
                :class="item.rank === 1 ? 'rank rank1':item.rank === 2 ? 'rank rank2': 'rank rank3' "
                size="small"
                v-if="item.rank <= 3 && item.rank >=1"
              >{{rankFormat(item.rank)}}</mt-badge>
            </div>
            <div class="fr font14 text-grey mr15">
              <span>{{item.age}}周岁</span>
            </div>
            <div style="clear:both" class="lable font14">
              <span
                v-for="(ilabel, index) in item.labelArray"
                :key="index"
                :class="['rel fl plr10', {'special-border-right10': index !== item.labelArray.length -1}]"
              >{{ilabel}}</span>
            </div>
            <div class="simpleNote">{{item.note}}</div>
          </div>
        </div>
      </li>
    </ul>
    <div v-show="loading" class="loading pb10">
      <mt-spinner style="float: left" type="fading-circle" :size="20"></mt-spinner>
      <span class="word">加载中...</span>
    </div>
  </div>
</template>

<script>
import { homeApi } from '@/assets/api'
import utils from '@/utils/myUtils'

export default {
  name: 'teamWorkerList',

  data () {
    return {
      role: utils.getItem('role'),
      orderId: this.$route.query.orderId,
      teamWorkerList: [],
      hospitalId: null,
      loading: false,
      notScroll: true,
      page: {
        pageSize: 10,
        pageNo: 0
      },
      path: window.hcsConfig.imgURL
    }
  },
  created () {
    this.notScroll = false
  },
  activated () {},
  methods: {
    toDetail (item) {
      this.notScroll = true
      this.$router.push({
        name: 'careworkerDetail',
        query: { userCode: item.workerCode }
      })
    },
    loadMore () {
      this.loading = true
      this.notScroll = true
      this.loadList()
    },
    loadList: function () {
      this.page.pageNo = ++this.page.pageNo
      let orderId = null
      let hospitalId = null
      if (this.orderId) {
        orderId = this.orderId
      } else {
        hospitalId = this.hospitalId =
          this.$route.query.hospitalId ||
          this.hospitalId ||
          window.localStorage.getItem('hospitalID')
      }
      homeApi
        .teamWorkerList(
          hospitalId,
          this.page.pageNo,
          this.page.pageSize,
          null,
          null,
          orderId
        )
        .then(response => {
          if (response.data.data.list.length > 0) {
            this.teamWorkerList.push(...response.data.data.list)
          } else {
            this.page.pageNo = --this.page.pageNo
          }
          if (response.data.data.list.length === this.page.pageSize) {
            this.notScroll = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    rankFormat: function (rank) {
      return window.hcsConfig.rankList[rank - 1]
    },
    rankColorFormat: function (rank) {
      return window.hcsConfig.rankColorList[rank - 1]
    },
    sexFormat: function (sex) {
      return window.hcsConfig.sexList[sex]
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
@Info-height: 150px;
@gold-color: #d1af65;
.teamworker-list {
  padding-top:15px ;
  li {
    height: @Info-height;
    // width: 92%;
    box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
    border-radius: 5px;
    margin: @m15;
    background-color: @color-white;
  }
  .left {
    height: @Info-height;
    width: 27%;
    text-align: center;
    .img {
      margin-top: @m15;
      margin-left: @m15;
      margin-right: @m10;
      width: 0px;
      height: 47%;
      padding-right: 75%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        border-radius: 5px;
      }
    }
    .strong {
      width: 75%;
      margin-left: @m15;
      margin-top: @m10;
      border-radius: 1px;
      background-color: #e8f8f9;
      color: rgba(31, 193, 201, 1);
      font-size: @font-size-mini;
    }
  }
  .baseinfo {
    width: 73%;
    margin-top: 20px;
    .fl {
      height: 22px;
      text-align: center;
      .rank {
        margin-left: @m10;
        border-radius: 1px;
        background-color: #d1af65;
        font-size: @font-size-mini;
        color: #ffffff;
      }
      .rank1 {
        background: -webkit-linear-gradient(top, #b7cbe8, #a2b5d1);
      }
      .rank2 {
        background: -webkit-linear-gradient(top, #68a6e7, #798ed5);
      }
      .rank3 {
        background: -webkit-linear-gradient(top, #dcbf7a, #d1ae63);
      }
    }
    .lable {
      padding-top: 7px;
      height: 20px;
      margin-left: -10px;
    }
    .simpleNote {
      margin-top: 28px;
      margin-right: @m15;
      color: @color-grey;
      font-size: @font-size-small;
      text-align: left;
      .line-clamp(2);
    }
  }
  .loading {
    text-align: center;
    width: 100px;
    margin: @m5 auto 0 auto;
    .word {
      vertical-align: 0;
      margin-left: @m5;
    }
  }
}
</style>
