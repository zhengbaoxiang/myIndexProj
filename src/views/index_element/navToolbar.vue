<template >
<div class='navtoolbar'>
  <span @click="showNav=!showNav">导航栏</span>
  <nav v-show="true">
    <ul>
      <li @click="goto(item.routeName)" class="link"
         v-for="(item,index) in linkList"
        :key="index">
        {{item.title}}
      </li>
    </ul>
  </nav>
</div>
</template>
<script>
export default {
  name: 'navtoolbar',
  components: {},
  props: {
  },
  data () {
    return {
      showNav: false,
      linkList: [
        {
          title: '新闻板块',
          routeName: 'newsInfo'
        },
        {
          title: '图书板块',
          routeName: 'booksInfo'
        },
        {
          title: '学习笔记',
          routeName: 'studyNotes'
        },
        {
          title: '图片识别',
          routeName: 'picTotext'
        }
      ]
    }
  },
  created () {
  },
  mounted () { },
  activated () {},
  methods: {
    goto (name) {
      console.log(name)
      // this.$router.push({
      //   name: name,
      //   path: name,
      //   query: { id: 1 },
      //   params: { index: 2 }
      // })
      // console.log(window.location)
      const url = window.location.href + name + ''
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.navtoolbar{
  position: absolute;
  top: 80px;
  right: 52px;
  span{
    background-color: #ff8800;
  }
  nav ul{
    position: fixed;
    right: 0px;
    background-color: #fff;
    transition: all 600ms ease;
    z-index: 11;
    .link {
      height: 40px;
      width: 100px;
      border-bottom: 1px solid grey;
      box-sizing: border-box;
      padding: 5px 5px 5px 10px;
      line-height: 30px;
      cursor: pointer;
    }

  }
}
</style>
