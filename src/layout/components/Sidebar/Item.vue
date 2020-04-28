<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon}/>)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
<!-- 注意：
  为什么用这种函数模板渲染组件
  因为用template的话又要多套一层div，会导致el-menu组件的折叠功能出问题------------------------------------
-->
<!--<template>
<div>
  <svg-icon :icon-class='icon'/>
  <span slot='title'>{{title}}</span>
</div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  mounted(){
    //console.log(`${this.icon}+${this.title}`)
  }
}
</script>-->
