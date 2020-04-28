<template>
  <div class="components-container">
    <aside>This is based on
      <a class="link-type" href="//github.com/dai-siki/vue-image-crop-upload"> vue-image-crop-upload</a>.
      Since I was using only the vue@1 version, and it is not compatible with mockjs at the moment, I modified it myself, and if you are going to use it, it is better to use official version.
    </aside>
    <aside>
      本来应该用vue-image-crop-upload组件的，作者这里对其做了修改，没直接用该组件,等于自己写了一个。但有些功能没有实现，
      所以我又用了下那个插件
    </aside>

    <pan-thumb :image="image" />

    <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imagecropperShow=true">
      Change Avatar
    </el-button>

    <!-- <image-cropper
      v-show="imagecropperShow"
      :key="imagecropperKey"
      :width="300"
      :height="300"
      url="https://httpbin.org/post"
      lang-type="en"
      @close="close"
      @crop-upload-success="cropSuccess"
    /> -->
    <my-upload
      v-model="imagecropperShow"
      :width="200"
      :height="200"
      img-format="png"
      size="2.1"
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
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

import myUpload from 'vue-image-crop-upload'

export default {
  name: 'AvatarUploadDemo',
  components: { ImageCropper, PanThumb, 'my-upload': myUpload },
  data() {
    return {
      imagecropperShow: false,
      imagecropperKey: 0,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191'
    }
  },
  methods: {
    // cropSuccess(resData) {
    //   this.imagecropperShow = false
    //   this.imagecropperKey = this.imagecropperKey + 1
    //   this.image = resData.files.avatar
    // },
    // close() {
    //   this.imagecropperShow = false
    // },
    // ----------
    cropSuccess(imgDataUrl, field) {
      // console.log('-------- crop success --------',imgDataUrl, field);
    },
    // 上传成功回调
    cropUploadSuccess(jsonData, field) {
      console.log(this.image)
      console.log('-------- upload success --------', jsonData, field)
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
      this.image = jsonData.files.avatar
      console.log(this.image)
    },
    // 上传失败回调
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------', status, field)
    }
  }
}
</script>

<style scoped>
  .avatar{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
</style>

