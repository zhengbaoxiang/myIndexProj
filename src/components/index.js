import MyActionsheet from './actionsheet'
import MyTabbar from './tabbar'
import MyInputnumber from './inputnumber'
import MyInputsearch from './inputsearch'
import MyRadiogroup from './radiogroup'
import MyLoading from './loading'
import MySelectTips from './selectTips'
import MyVoiceInput from './voiceInput'
import MyHeader from './appHeader'
import MyImageGallery from './imageGallery'
const component = {
  install: function (Vue) {
    Vue.component(MyActionsheet.name, MyActionsheet) // 自定义的actionSheet
    Vue.component(MyHeader.name, MyHeader) // 页头
    Vue.component(MyImageGallery.name, MyImageGallery) // 页头
    Vue.component(MyTabbar.name, MyTabbar) // 自定义的tabbar
    Vue.component(MyInputnumber.name, MyInputnumber) // 自定义的加减数量输入框
    Vue.component(MyInputsearch.name, MyInputsearch) // 自定义的搜索框
    Vue.component(MyRadiogroup.name, MyRadiogroup) // 自定义的单选切换
    Vue.component(MyLoading.name, MyLoading) // 自定义的单选切换
    Vue.component(MySelectTips.name, MySelectTips) // 自定义的单选切换
    Vue.component(MyVoiceInput.name, MyVoiceInput) // 自定义的单选切换
    Vue.component(MyHeader.name, MyHeader) // 自定义的单选切换
    Vue.component(MyImageGallery.name, MyImageGallery) // 照片墙
  }
}
export default component
