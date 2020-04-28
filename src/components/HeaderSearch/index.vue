<template>
  <div :class="{'show':show}" class="header-search">
    <!-- svg-icon的使用 配置自己找，使用方式icon-class值对应svg文件名即可-->
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
    <!-- 此搜索属于远程搜索-输入关键字查找。需要将filterable和remote设置为true，同时传入一个remote-method。
    remote-method为一个Function，它会在输入值发生变化时调用，参数为当前输入值。需要注意的是，
    如果el-option是通过v-for指令渲染出来的，此时需要为el-option添加key属性 -->
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option v-for="item in options" :key="item.path" :value="item" :label="item.title.join(' > ')" />
    </el-select>
  </div>
</template>

<script>
// fuse is a lightweight fuzzy-search module//fuse是一个轻量级的模糊搜索模块
// make search results more in line with expectations//
import Fuse from 'fuse.js'
import path from 'path'

export default {
  name: 'HeaderSearch',
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    // routes() {
    //   this.searchPool = this.generateRoutes(this.routes)
    // },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.close)
      } else {
        document.body.removeEventListener('click', this.close)
      }
    }
  },
  mounted() {
    //
    this.searchPool = this.generateRoutes(this.routes)
    console.log('select数据:[{path:"",title:[]}]', this.searchPool)
  },
  methods: {
    click() {
      this.show = !this.show
      if (this.show) {
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.options = []
      this.show = false
    },
    change(val) {
      // console.log(val)
      this.$router.push(val.path)
      this.search = ''
      this.options = []
      // this.$nextTick(() => {
      this.show = false
      // })
    },
    // -------------------------------------------------------------------------------------
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true, // 是否按分数对结果列表进行排序
        threshold: 0.4, // 匹配算法在什么时候放弃。阈值0.0要求完全匹配（字母和位置均需匹配），阈值1.0要求匹配任何内容
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1, // 仅返回长度超过该值的匹配项。（例如，如果您要忽略结果中的单个字符匹配，请将其设置为2）。
        keys: [{ // 搜索权重
          name: 'title',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    },
    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    generateRoutes(routes, basePath = '/', prefixTitle = []) {
      // console.log('routes数组处理作为select数据',routes)
      let res = []

      for (const router of routes) {
        // skip hidden router
        if (router.hidden) { continue }
        // 引入的path插件与node中的path功能一致

        const data = {
          path: path.resolve(basePath, router.path), // 例如，导航path /shangjinhui，没有meta但有一个children，它的
          // path是index，所以下面走了this.generateRoutes(router.children, '/shangjinhui', [])
          // 接入得出res数组的一个元素{path:'/shangjinhui/index',title:'[Shangjinhui]'}
          title: [...prefixTitle] //
        }

        if (router.meta && router.meta.title) { //
          data.title = [...data.title, router.meta.title]

          if (router.redirect !== 'noRedirect') {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            // console.log('data',data)
            res.push(data)
          }
        }

        // recursive child routes
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.path, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      console.log(query, 'sousuo')
      if (query !== '') {
        // 模糊查询，找出符合要求的数组
        this.options = this.fuse.search(query)
        // console.log(this.options);
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    /deep/ .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
