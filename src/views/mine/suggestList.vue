<template>
  <div class="suggest-list">
    <my-header title="建议与反馈">
      <div>
        <router-link
          v-if="role === '2' && orderStatus === 'true'"
          :to="{
            path: '/mine/suggest',
            query: { orderId: $route.query.orderId }
          }"
          slot="right"
        >
          <img
            src="../../assets/imgs/suggest@2x.png"
            height="16px"
            width="16px"
          />
        </router-link>
        <router-link
          v-if="role === '6' || role === '8'"
          :to="{ path: '/mine/suggest' }"
          slot="right"
        >
          <img
            src="../../assets/imgs/suggest@2x.png"
            height="20px"
            width="20px"
          />
        </router-link>
      </div>
    </my-header>
    <div class="suggests">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="notScroll"
      >
        <li class="mt10 rel" v-for="(item, index) in suggestList" :key="index">
          <div class="fl img">
            <img
              v-if="item.suggestUserImg"
              :src="item.suggestUserImg"
              @error="_imageError"
            />
            <img v-else src="@/assets/imgs/noHead@2x.png" />
          </div>
          <div class="item">
            <div class="iteminfo">
              <span class="fl text-grey font16">{{
                item.suggestUserName
              }}</span>
              <div v-if="role === '7' || role === '3'" class="ml5 fl">
                <mt-badge
                  size="small"
                  :style="bgFormat(item.suggestUserRole)"
                  >{{ roleFormat(item.suggestUserRole) }}</mt-badge
                >
              </div>
            </div>
            <div class="mt10 clearfix">{{ item.note }}</div>
            <div v-if="item.imgList.length > 0" class="mtb10">
              <my-imagegallery :data="item.imgList" :imagegalleryIndex="'imagegallery'+index"></my-imagegallery>
            </div>
            <div class="mt5 text-grey rel font12">
              {{ dateFormat(item.suggestTime) }}
              <img
                v-if="role === '7' || role === '3'"
                @click="!item.replyUserName ? showReply(item.id) : ''"
                :src="
                  require(item.replyUserName
                    ? '../../assets/imgs/replied@2x.png'
                    : '../../assets/imgs/reply@2x.png')
                "
              />
              <!-- <a> -->
              <img
                v-if="
                  (role === '7' || role === '3') && item.suggestUserTelephone
                "
                @click="showTelephone(item.suggestUserTelephone)"
                src="../../assets/imgs/tel@2x.png"
              />
              <!-- </a> -->
            </div>
            <ul v-if="item.replyUserName">
              <li class="mt15">
                <span class="text-grey">{{ item.replyUserName }}</span>
                <mt-badge
                  v-if="item.replyUserRole === 3 || item.replyUserRole === 7"
                  size="small"
                  class="ml10"
                  >{{ roleFormat(item.replyUserRole) }}</mt-badge
                >
              </li>
              <li class="mt10">{{ item.replyNote }}</li>
              <li class="mt5 text-grey font12">
                {{ dateFormat(item.replyTime) }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <reply-popup
        :visible.sync="show"
        :id="currentId"
        @remarkOk="remarkOk"
      ></reply-popup>
      <div v-show="loading" class="loading">
        <mt-spinner
          style="float: left"
          type="fading-circle"
          :size="20"
        ></mt-spinner>
        <span class="word">加载中...</span>
      </div>
      <div
        v-show="!loading && suggestList.length === 0"
        class="noSuggest center"
      >
        <img src="../../assets/imgs/noSuggest@2x.png" alt />
      </div>
    </div>
  </div>
</template>
<script>
import { mineApi } from '@/assets/api'
import utils from '@/utils/myUtils'
import SDK from '@/utils/SDK'
import replyPopup from './popup/replyPopup'
export default {
  name: 'suggestList',
  data () {
    return {
      show: false, // 表示回复组件的展示与关闭
      currentId: -1,
      role: utils.getItem('role'),
      orderId: null,
      orderStatus: null,
      suggestList: [],
      loading: false,
      notScroll: true,
      page: {
        pageSize: 10,
        pageNo: 0
      }
    }
  },
  components: { replyPopup },
  created () {
    if (
      !/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) ||
      this.$route.query.fromWechat === '1'
    ) {
      SDK.getWXConfig()
    }
    this.orderId = this.$route.query.orderId
    this.orderStatus = this.$route.query.orderStatus
    // 初始化列表
    this.suggestInit()
    this.loadMore()
  },
  methods: {
    showTelephone (telephone) {
      console.log('callPhone')
      window.TS_Common.nativeCall('callPhone', { telPhone: telephone })
    },
    remarkOk (ret) {
      const curIndex = this.suggestList.findIndex(
        (m) => m.id === this.currentId
      )
      this.suggestList[curIndex].replyNote = ret.replyNote
      this.suggestList[curIndex].replyUserName = ret.replyUserName
      this.suggestList[curIndex].replyUserRole = ret.replyUserRole
      this.suggestList[curIndex].replyTime = ret.replyTime
      this.$Toast('回复成功')
    },
    // 展示回复弹框
    showReply (id) {
      this.currentId = id
      this.show = true
    },
    // 初始化最新反馈数据
    suggestInit () {
      mineApi.getRecentSuggest(this.orderId).then((resp) => {
        let ret = resp.data.data
        if (this.role !== '2') {
          if (ret.id) window.localStorage.setItem('suggestId', ret.id)
          if (ret.replyTime) {
            window.localStorage.setItem('replyTime', ret.replyTime)
          }
        } else {
          let orderMap =
            utils.jsonToMap(window.localStorage.getItem('orderMap')) ||
            new Map()
          orderMap.set('order_' + this.orderId, ret.replyTime || 0)
          window.localStorage.setItem('orderMap', utils.mapToJson(orderMap))
        }
      })
    },
    suggestListInit () {
      this.page.pageNo = ++this.page.pageNo
      mineApi
        .getSuggestList(this.page.pageSize, this.page.pageNo, this.orderId)
        .then((resp) => {
          if (
            resp.data.data &&
            resp.data.data.list &&
            resp.data.data.list.length > 0
          ) {
            this.suggestList.push(...resp.data.data.list)
          } else {
            this.page.pageNo = --this.page.pageNo
          }
          if (resp.data.data.list.length === this.page.pageSize) {
            this.notScroll = false
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    dateFormat (time) {
      return new Date(time).Format('yyyy年MM月dd日 hh:mm')
    },
    loadMore () {
      this.loading = true
      this.notScroll = true
      this.suggestListInit()
    },
    bgFormat (role) {
      switch (role) {
        case 1:
          return {}
        case 2:
          return { 'background-color': 'rgba(112, 155, 222, 1)' }
        case 3:
          return { 'background-color': 'rgba(215, 184, 113, 1)' }
        case 4:
          return {}
        case 5:
          return {}
        case 6:
          return { 'background-color': 'rgba(215, 184, 113, 1)' }
        case 7:
          return { 'background-color': 'rgba(215, 184, 113, 1)' }
        case 8:
          return { 'background-color': 'rgba(215, 184, 113, 1)' }
        default:
          return {}
      }
    },
    roleFormat (role) {
      switch (role) {
        case 1:
          return ''
        case 2:
          return '病患'
        case 3:
          return '项目经理'
        case 4:
          return '护工主管'
        case 5:
          return '护工'
        case 6:
          return '护士长'
        case 7:
          return '运维管家'
        case 8:
          return '护士'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.suggest-list {
  .suggests {
    ul {
      overflow: hidden;
      li {
        background-color: #fff;
        .img {
          padding: 15px 0 0 15px;
          width: 52px;
          height: 100%;
          img {
            height: 42px;
            width: 42px;
            border-radius: 100px;
          }
        }
        .item {
          padding: 17px 15px 15px 67px;
          .iteminfo {
            height: 22px;
            line-height: 22px;
            .ml5 {
              height: 19px;
              line-height: 19px;
              .mint-badge.is-size-small {
                height: 12px;
                line-height: 12px;
                padding: 2px 5px;
              }
            }
          }
          .mt15 {
            padding-left: 9px;
            position: relative;
            &:before {
              background-color: rgba(31, 193, 201, 1);
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              margin-top: -6px;
              width: 4px;
              height: 12px;
            }
          }
          .font12 {
            img {
              float: right;
              height: 18px;
              width: 18px;
            }
            img:first-child {
              margin-left: 30px;
            }
            // a {
            //   img {
            //     margin-right: 30px;
            //   }
            // }
          }
        }
      }
    }
  }
  .reply {
    padding: 10px 5px 10px 15px;
    background-color: #fff;
    height: 42px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    .flex();
    textarea {
      padding: 10px 15px;
      border: 1px solid rgba(241, 241, 251, 1);
    }
    button:disabled {
      background-color: rgba(199, 199, 204, 1);
    }
  }
  .loading {
    text-align: center;
    width: 100px;
    margin: @m10 auto 0 auto;
    .word {
      vertical-align: 0;
      margin-left: @m5;
    }
  }
  .noSuggest {
    margin-top: 178px;
    img {
      width: 50%;
      max-width: 378px;
    }
    .word {
      padding-top: @m15;
      color: rgba(141, 146, 158, 0.5);
    }
  }
}
</style>
