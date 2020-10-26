<template >
<div class='navtoolbar'>
  <span @click="showNav=!showNav">导航栏</span>
  <nav v-show="showNav">
    <ul>
      <li @click="goto(item.routeName)" class="link" v-for="(item,index) in linkList" :key="index">
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
          title: '留言板',
          routeName: 'message'
        },
        {
          title: '留言板3',
          routeName: 'message3'
        },
        {
          title: '留言板2',
          routeName: 'message2'
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
      this.$router.push({
        name: name,
        path: name,
        query: { id: 1 },
        params: { index: 2 }
      }
      )
      // this.$route.query
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

    }

  }
}
</style>
