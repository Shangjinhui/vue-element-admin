<template>
  <div class="app-container">
    <aside>
      The guide page is useful for some people who entered the project for the first time. You can briefly introduce the
      features of the project. Demo is based on
      <a href="https://github.com/kamranahmedse/driver.js" target="_blank">driver.js.</a>
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      Show Guide
    </el-button>
  </div>
</template>

<script>
// driver.js页面分页引导的插件
// 我滴孩ia，真香
// step = [
//   {
//     element: '#hamburger-container',  //dom类名活id名
//     popover: {
//       title: 'Hamburger',             //引导展示标题
//       description: 'Open && Close sidebar',   //引导展示描述
//       position: 'bottom'                  //引导提示框位置
//     }
//   }
// ]
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver({
      doneBtnText: '完成', // 结束按钮的文字
      stageBackground: '#f23f40', // 突出显示元素的背景颜色
      nextBtnText: '下一步', // 下一步按钮的文字
      prevBtnText: '上一步', // 上一步按钮的文字
      closeBtnText: '关闭', // 关闭按钮的文字
      onHighlightStarted: (Element) => {}, // 元素即将突出显示时调用
      onHighlighted: (Element) => {}, // 元素完全突出显示时调用
      onDeselected: (Element) => {}, // 取消选择元素时调用
      onReset: (Element) => {}, // 当要清除叠加时调用
      onNext: (Element) => {}, // 在任何步骤中移动到下一步时调用
      onPrevious: (Element) => {}// 在任何步骤中移动到上一步时调用

    })
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
