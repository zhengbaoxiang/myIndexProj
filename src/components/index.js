import MyImageGallery from './imageGallery'
const component = {
  install: function (Vue) {
    Vue.component(MyImageGallery.name, MyImageGallery) // 照片墙
  }
}
export default component
