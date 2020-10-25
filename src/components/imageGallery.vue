<template>
  <div class="img-gallery">
    <li
      v-for="(url, indexs) in data"
      :key="indexs"
    >
      <img
        v-if="role !== '2' && url"
        v-gallery="imagegalleryIndex"
        :src="computedUrl(url, true)"
        :data-large="computedUrl(url)"
        @error="_imageError"
      />
      <img
        v-else
        @click="preview(url)"
        :src="computedUrl(url, true)"
        @error="_imageError"
      />
      <i class="myicon icon-close" @click.stop="delImg(url,indexs)" v-if="deleteFlag"></i>

    </li>
  </div>
</template>
<script>
/**
 *
 * my-imagegallery
 * @module components/imagegallery
 * @desc 图片点击预览
 * @example
 * <my-imagegallery :data="imgList"></my-imagegallery>
 *
 */
import MyUtils from '@/utils/myUtils'
// import { myApi } from '@/assets/api'

export default {
  name: 'my-imagegallery',
  data () {
    return {
      isNativeCall: MyUtils.getItem('default') === 'worker',
      role: MyUtils.getItem('role'),
      path: window.myConfig.imgURL, // picFile
      listPath: window.myConfig.imgdomain // imgFile
    }
  },
  props: {
    data: {
      default: Array
    },
    imagegalleryIndex: {
      type: String,
      default: 'imageGallery' // 单页存在多个gallery时的分组name
    },
    id: {
      default: -1
    },
    deleteFlag: {
      default: false

    },
    componentId: {
      default: null
    }
  },
  methods: {
    // 图片点击预览方法，已失效
    preview (url) {
      if (!url) {
        return false
      }
      return this.computedUrl(url)
    },
    computedUrl (url, isThumbnail) {
      if (url.match(/(http|https):\/\/([\w.]+\/?)\S*/)) {
        return url
      }
      // return this.listPath + (isThumbnail ? 'thumbnail_' : '') + url
      let lastUrl
      if (this.componentId === 'teamWorkerDetail') {
        lastUrl = this.path + url
      } else if (this.componentId === 'serviceLogWechat') {
        lastUrl = this.listPath + url
      } else {
        lastUrl = this.listPath + (isThumbnail ? 'thumbnail_' : '') + url
      }
      return lastUrl
    },
    // 删除照片
    delImg (fileName, index) {
      this.data.splice(index, 1)
      console.log('删除图片', index, fileName)
      // const params = { id: this.id, fileName: fileName }
      // const paramsStr = `?id=${this.id}&fileName=${fileName}`
      // myApi
      //   .deletePhoto(paramsStr)
      //   .then(resp => {
      //     console.log('delete', resp)
      //     // 刷新缓存，返回列表页可以重新上传
      //     this.$store.state.refreshNext.serviceTrack = true
      //   })
    }

  }
}
</script>

<style lang="less">
.img-gallery {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  li {
    width: calc(93% / 3);
    height: calc(93% / 3);
    padding-top: calc(93% / 3);
    margin-right: 3.5%;
    margin-bottom: 0;
    position: relative;
    list-style: none;
    .icon-close {
      position: absolute;
      right: -6px;
      top: -6px;
    }
    img {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  li:nth-of-type(3n) {
    margin-right: 0;
  }
  li:nth-last-of-type(n + 4) {
    margin-bottom: 3.5%;
  }
}
.bigphotosList .img-gallery {
  display: block;
  li {
    display: block;
    border-radius: 10px;
    overflow: hidden;
    padding-top: 0;
    margin-bottom: 3.5%;

    width:100%;
    height: 100%;

    img {
      position: relative;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
.teamworkInfo  .img-gallery li {
  border-radius: 5px;
  overflow:hidden;
}

</style>
