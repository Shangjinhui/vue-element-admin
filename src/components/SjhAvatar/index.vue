<template>
  <div id="sjh">
    <my-upload
      v-model="show"
      :width="width"
      :height="height"
      img-format="png"
      :size="size"
      lang-type="zh"
      :no-rotate="false"
      @crop-success="cropSuccess"
      field="avatar"
      @crop-upload-success="cropUploadSuccess"
      url="https://httpbin.org/post"
      @crop-upload-fail="cropUploadFail"
    />
  </div>
</template>
<script>
import myUpload from 'vue-image-crop-upload'
export default {
  // computed:{
  //     //计算属性的对象型写法
  //     show2:{
  //         get(){
  //         },
  //         set(val){
  //         }
  //     }
  // },
  components: {
    'my-upload': myUpload
  },
  props: {
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      size: 2.1
    }
  },
  methods: {
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------', imgDataUrl, field)
    },
    // 上传成功回调
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      this.imgDataUrl = jsonData.files.Avatar1
      console.log(jsonData)
      console.log('field: ' + field)
      this.$emit('crop-upload-success', jsonData)
    },
    // 上传失败回调
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log('上传失败状态' + status)
      console.log('field: ' + field)
    }
  }

}
</script>
