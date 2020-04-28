<template>
  <div>
    <div style="margin-bottom:15px;">
      Your roles: {{ roles }}
    </div>
    Switch roles:
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script>
// 就是获取v-model值而已
export default {
  // data(){
  //   return {
  //     roles: this.$store.getters.roles,
  //     switchRoles: this.$store.getters.roles[0]
  //   }
  // },
  // 方法一
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('user/changeRoles', val).then(() => {
          this.$emit('change')
        })
      }
    }
  }
  // //方法二
  // watch:{
  //   switchRoles(val){
  //     this.$store.dispatch('user/changeRoles', val).then(() => {
  //       this.$emit('change')
  //     })
  //   }
  // },
  // //方法三
  // methods:{
  //   change(val){
  //     this.$store.dispatch('user/changeRoles', val).then(() => {
  //       this.$emit('change')
  //     })
  //   }
  // }
}
</script>
