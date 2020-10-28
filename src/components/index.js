import MyImageGallery from './imageGallery'
import Mypagination from './myPagination'
const component = {
  install: function (Vue) {
    Vue.component(MyImageGallery.name, MyImageGallery) // 照片墙
    Vue.component(Mypagination.name, Mypagination) // 照片墙
  }
}
export default component
