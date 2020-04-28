<template>
  <div :class="{fullscreen:fullscreen}" class="tinymce-container" :style="{width:containerWidth}">
    <textarea :id="tinymceId" class="tinymce-textarea" />
    <div class="editor-custom-btn-container">
      <!-- editorImage组件本地图片文件的上传 -->
      <editorImage color="#1890ff" class="editor-upload-btn" @successCBK="imageSuccessCBK" />
    </div>
  </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import editorImage from './components/EditorImage'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'

// 为什么使用cdn的方式, detail see https://github.com/PanJiaChen/tinymce-all-in-one
// 现在tinymce的cdn，所有插件都是单独下载的，但是有很多插件。因此初始化很慢。
// 因此，该项目将tinymce.min.js通过Offical Build将所有插件构建到其中，从而加快了初始化速度
const tinymceCDN = 'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: function() {
        // 转换为时间戳的方式1.+new Date()2.new Date().getTime()3.new Date().valueOf()4.new Date()*1
        return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
      }
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table sjh'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    }
  },
  data() {
    return {
      hasChange: false,
      hasInit: false,
      tinymceId: this.id,
      fullscreen: false,
      languageTypeList: {
        'en': 'en',
        'zh': 'zh_CN',
        'es': 'es_MX',
        'ja': 'ja'
      }
    }
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() =>
          window.tinymce.get(this.tinymceId).setContent(val || ''))
      }
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    if (window.tinymce) {
      this.initTinymce()
    }
  },
  deactivated() {
    this.destroyTinymce()
  },
  destroyed() {
    this.destroyTinymce()
  },
  methods: {
    // 这个添加js写的好麻烦啊
    // init() {
    //   // dynamic load tinymce from cdn
    //   load(tinymceCDN, (err) => {
    //     if (err) {
    //       this.$message.error(err.message)
    //       return
    //     }
    //     this.initTinymce()
    //   })
    // },
    init() {
      const that = this
      if (!document.getElementById(tinymceCDN)) {
        const script = document.createElement('script')
        script.src = tinymceCDN
        script.id = tinymceCDN
        document.body.appendChild(script)
        // IE的 script 元素支持onreadystatechange事件，不支持onload事件。
        // FF的script 元素不支持onreadystatechange事件，只支持onload事件。
        if ('onload' in script) {
          script.onload = function() {
            this.onerror = this.onload = null
            that.initTinymce()
          }
          script.onerror = function() {
            this.onerror = this.onload = null
            that.$message.error('Failed to load ' + tinymceCDN)
            return
          }
        } else {
          script.onreadystatechange = function() {
            if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
            this.onreadystatechange = null
            that.initTinymce()
          }
        }
      } else {
        that.initTinymce()
      }
    },
    initTinymce() {
      const _this = this
      // 初始化富文本
      window.tinymce.init({
        selector: `#${this.tinymceId}`, // 容器
        language: this.languageTypeList['zh'], // 菜单及工具栏语言
        height: this.height,
        // body_class: 'panel-body',
        // object_resizing，您可以打开/关闭Firefox / Mozilla中的表格和图像的内联大小调整控件。这些是默认启用的。
        // object_resizing: false, //没感觉
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar, // 配置工具栏上的可用按钮
        menubar: this.menubar, // 菜单栏配置
        // 注意：每个菜单栏（menubar）会包含默认的下拉菜单（menu）。例如：编辑会加载默认的撤销、重做、剪切、复制、粘贴和全选
        // 如果要加入自己的菜单栏的话，默认的就会没有了，需要menu重新配置，如下
        // menu: {
        //   file: {title:'文件',items: 'newdocument'},
        //   sjh: {title:'我的菜单',items: 'copy paste'}
        // },
        plugins: plugins, // 指定哪些插件被用在当前编辑器实例中
        // end_container_on_empty_block: true,
        powerpaste_word_import: 'clean', // 此设置控制如何过滤从Microsoft Word粘贴的内容
        // code_dialog_height: 550,   //暂无发现作用
        // code_dialog_width: 1000,
        // advlist_bullet_styles: 'square',
        // advlist_number_styles: 'default',
        // imagetools_cors_hosts由于浏览器对所谓的跨域HTTP请求施加了安全性措施，因此Image Tools无法使用来自其他域的图像。为了克服这些限制，必须在指定的域上显式启用跨域资源共享（CORS）
        // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
        // default_link_target: '_blank', //没必要，插入链接的时候可选
        // link_title: false,
        // nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
        init_instance_callback: editor => {
          // 实例完成后调用
          if (_this.value) {
            editor.setContent(_this.value)
          }
          _this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => { // 编辑器添加事件
            this.hasChange = true
            _this.$emit('input', editor.getContent())
          })
        },
        setup(editor) { // 渲染实例前的回调
          editor.on('FullscreenStateChanged', (e) => {
            _this.fullscreen = e.state
          })
        },
        // 整合七牛上传-----------插入本地上传的图片（base64）时触发，参数时插入文本的img标签
        images_dataimg_filter(img) {
          console.log('images_dataimg_filter', img)
          // setTimeout(() => {
          //   const $image = $(img);
          //   $image.removeAttr('width');
          //   $image.removeAttr('height');
          //   if ($image[0].height && $image[0].width) {
          //     $image.attr('data-wscntype', 'image');
          //     $image.attr('data-wscnh', $image[0].height);
          //     $image.attr('data-wscnw', $image[0].width);
          //     $image.addClass('wscnph');
          //   }
          // }, 0);
          // return img
        }
        // images_upload_handler(blobInfo, success, failure, progress) {
        //   progress(0);
        //   const token = _this.$store.getters.token;
        //   getToken(token).then(response => {
        //     const url = response.data.qiniu_url;
        //     const formData = new FormData();
        //     formData.append('token', response.data.qiniu_token);
        //     formData.append('key', response.data.qiniu_key);
        //     formData.append('file', blobInfo.blob(), url);
        //     upload(formData).then(() => {
        //       success(url);
        //       progress(100);
        //     })
        //   }).catch(err => {
        //     failure('出现未知问题，刷新页面，或者联系程序员')
        //     console.log(err);
        //   });
        // },
      })
    },
    destroyTinymce() {
      const tinymce = window.tinymce.get(this.tinymceId)
      if (this.fullscreen) {
        tinymce.execCommand('mceFullScreen')
      }

      if (tinymce) {
        tinymce.destroy()
      }
    },
    setContent(value) {
      window.tinymce.get(this.tinymceId).setContent(value)
    },
    getContent() {
      window.tinymce.get(this.tinymceId).getContent()
    },
    imageSuccessCBK(arr) {
      // window.tinymce.get(_this.tinymceId)利用容器id获取容器实例
      // setContent重置文本内容，insertContent插入文本内容
      const _this = this
      arr.forEach(v => {
        window.tinymce.get(_this.tinymceId).insertContent(`<img class="wscnph" src="${v.url}" >`)
        _this.$emit('input', window.tinymce.get(_this.tinymceId).getContent())
      })
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
}
.tinymce-container>>>.mce-fullscreen {
  z-index: 10000;
}
.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}
.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}
.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}
.editor-upload-btn {
  display: inline-block;
}

</style>
