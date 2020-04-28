<template>
  <!-- layout的子路由，即内容区appmain -->
  <section class="app-main">
    <!--内置过渡动画：name动画方式； mode控制离开进入的先后顺序，默认同时 -->
    <transition name="fade" mode="out-in">
      <!-- 在vue项目中,难免会有列表页面或者搜索结果列表页面,点击某个结果之后,返回回来时,如果不对结果页面进行缓存,
      那么返回列表页面的时候会回到初始状态,但是我们想要的结果是返回时这个页面还是之前搜索的结果列表,这时候就需要用
      到vue的keep-alive技术了。你可以试下，不应keep-alive的话再回来会重新执行一样 -->
      <!-- include字符串或正则表达，只有匹配的组件会被缓存； exclude字符串或正则表达式，任何匹配的组件都不会被缓存-->
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      // console.log('在面包屑组件里处理的，每次路由切换都会判断是否村store里',this.$store.state.tagsView.cachedViews)
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
