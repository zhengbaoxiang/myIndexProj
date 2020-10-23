<template>
  <div class="mine-call">
    <my-header title="呼叫"></my-header>
    <div class="calls">
      <ul
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="10"
        infinite-scroll-disabled="notScroll"
      >
        <li class="mtb15 callitem" v-for="(item, index) in callList" :key="index">
          <div class="call-top">
            <ul>
              <li class="clearfix">
                <span class="fl">床位</span>
                <span class="fr">{{item.bedName}}</span>
              </li>
              <li class="clearfix">
                <span class="fl">病区</span>
                <span class="fr">{{item.districtName}}</span>
              </li>
              <li class="clearfix">
                <span class="fl">医院</span>
                <span class="fr">{{item.campusName}}</span>
              </li>
            </ul>
          </div>
          <div class="call-bottom clearfix">
            <div class="clearfix">
              <span class="fl">{{item.workerManagerName}}</span>
              <span class="fr">{{item.telephone}}</span>
            </div>
            <div class="clearfix mt15">
              <a class="fr" :href="'tel:'+item.telephone">
                <mt-button size="small" type="danger">呼叫</mt-button>
              </a>
            </div>
          </div>
        </li>
      </ul>
      <div v-show="loading" class="loading">
        <mt-spinner style="float: left" type="fading-circle" :size="20"></mt-spinner>
        <span class="word">加载中...</span>
      </div>
    </div>
  </div>
</template>
<script>
import { orderApi } from '@/assets/api'
export default {
  data () {
    return {
      callList: [],
      loading: false,
      notScroll: true,
      page: {
        pageSize: 10,
        pageNo: 0
      }
    }
  },
  created () {
    this.loadList()
  },
  methods: {
    loadMore () {
      this.loading = true
      this.notScroll = true
      this.loadList()
    },
    loadList: function () {
      this.page.pageNo = ++this.page.pageNo
      orderApi
        .callOut(this.page.pageSize, this.page.pageNo)
        .then(response => {
          if (response.data.data.list.length > 0) {
            this.callList.push(...response.data.data.list)
          } else {
            this.page.pageNo = --this.page.pageNo
          }
          if (response.data.data.list.length === this.page.pageSize) {
            this.notScroll = false
          }
        })
        .catch(e => {})
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.calls {
  margin: 51px @m15 0 @m15;
  .callitem {
    margin-top: 15px;
    background-color: @color-white;
    box-shadow: 0px 3px 8px 0px rgba(16, 47, 163, 0.07);
    overflow: hidden;
    .border_radius();
    .call-top {
      padding: @m15;
      color: @color-grey;
      font-size: @font-size-small;
      ul {
        li {
          margin-top: @m5;
        }
      }
    }
    .call-bottom {
      position: relative;
      padding: @m15;
      background-color: @color-white;
      color: @color-default;
      .fl {
        font-size: @font-size-normal;
      }
      .fr {
        font-size: @font-size-small;
      }

      &::before {
        content: "";
        border-top: 0.5px solid @border-color;
        position: absolute;
        top: -1px;
        left: 0;
        width: 100%;
        transform: scaleY(0.5);
      }
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
