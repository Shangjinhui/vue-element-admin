<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      upload
    </el-button>
    <!-- :visible.sync控制display:none -->
    <el-dialog :visible.sync="dialogVisible">
      <!-- multiple支持多选文件
       file-list选择文件前已有的文件
       show-file-list是否显示已上传文件列表
       on-remove移除文件时钩子，参数file,fileList
       on-success文件上传成功时的钩子,参数response, file, fileList
       before-upload上传文件之前的钩子，参数为file，若返回 false 或者返回 Promise 且被 reject，则停止上传
       list-type文件列表的类型，有text/picture/picture-card-->
      <!-- 注意action必填，
       1.此network请求传入的是你选择的文件的file，返回的值跟on-success钩子的第一个参数一致
       2.选择后就能展示到本地的过程其实跟network没有任何关系 -->
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action="https://httpbin.org/post"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          Click upload
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        Confirm
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      dialogVisible: false,
      // listObj: {'001': { hasSuccess: true, uid: '', width: 200, height: 200, url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }},
      // fileList: [{ hasSuccess: true, uid: '', width: 200, height: 200, url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }]
      listObj: {},
      fileList: []
    }
  },
  methods: {
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      console.log('handleSuccess', response, file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file // data:image/png;base64类型
          this.listObj[objKeyArr[i]].hasSuccess = true // 该文件上传成功
          return
        }
      }
    },
    handleRemove(file) {
      console.log('handleRemove', file)
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      console.log('fileList', this.fileList)
      console.log('beforeUpload', file)
      const _self = this
      // window对象的URL对象是专门用来将blob或者file读取成一个url的
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        // console.log(_URL.createObjectURL(file));//将file转换成blob:http类型，常用来本地展示
        // var reader = new FileReader();
        // reader.readAsDataURL(file);
        // reader.onload = function(){
        //   console.log(reader.result);//将file转换成data:image/png;base64类型，常作为上传的数据
        // }
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
