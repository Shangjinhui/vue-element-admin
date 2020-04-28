
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(to)">
    <slot />
  </component>
  <!--<div>
    <a v-if="flag" :href="to" target="_blank" rel="noopener"><slot /></a>
    <router-link v-else :to="to"><slot /></router-link>
  </div>-->
</template>

<script>
// component标签的用法     v-bind值为对象，属性is对应生成的标签名，其它属性都为标签上的属性
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      flag: !!isExternal(this.to)
    }
  },
  methods: {
    linkProps(url) {
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
