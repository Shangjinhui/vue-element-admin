<template>
  <div :class="{'has-logo':showLogo}">
    <!-- 菜单上面的logo -->
    <logo v-if="true" :collapse="isCollapse" />
    <!-- elementUI官网没有的隐藏组件el-scrollbar，用于修饰滚动条样式属性vertical默认true滚动条方向 -->
    <el-scrollbar>
      <!-- 左侧导航菜单部分 -->
      <!-- default-active当前激活菜单的index，对应el-menu-item的index ；
    collapse是否水平折叠收起菜单，仅在mode="vertical"垂直菜单有效；
    background-color菜单的背景色；
    text-color菜单的文字颜色；
    unique-opened是否只保持一个子菜单的展开，打开一个子菜单，其它都关闭；
    active-text-color激活时文字颜色；
    collapse-transition是否开启折叠动画；
    其中有个router属性，是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转。
    这里为什么没用呢？因为并不是所有导航都是路由跳转，有些可能是a跳到外链了，详情看Link.vue-->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss' // 这个scss中用:export导出了定义的样式变量，这里用来修饰菜单样式了
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // console.log(route,'2222222222')
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
  #app .sidebar-container .el-menu{padding-bottom:39px;}
</style>
