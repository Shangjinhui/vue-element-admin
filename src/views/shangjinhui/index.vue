<template>
  <div class="sjh-text">
    hello add tab  num={{ sjhnum }}
    <div @click="changenum('+')">+</div>
    <div @click="changenum('-')">-</div>
    <!-- component用法1，在sidebar-link那里已经用过，生成标签 -->
    <component v-bind="{is:'a',href:'www.taobao.com'}">component</component>
    <!-- component用法2，直接is 绑定组件名/emmmm跟直接使用组件一样，哈哈哈-->
    <component :is="currentRole" />
    <admin />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import admin from './admin'
import notadmin from './editor'

export default {
  name: 'Dashboard',
  components: { admin, notadmin },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  computed: {
    ...mapGetters([
      'roles',
      'sjhnum'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'notadmin'
    }
  },
  methods: {
    changenum(type) {
      console.log('this.$store', this.$store)// 从里面的_mutations可以看出你dispatch的时候到带上命名
      this.$store.dispatch('shangjinhui/changenum', { type })
    }
  }
}
</script>
