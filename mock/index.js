import Mock from 'mockjs'
import { param2Obj } from '../src/utils'

import user from './user'
import role from './role'
import article from './article'
import search from './remote-search'

const mocks = [
  ...user,
  ...role,
  ...article,
  ...search
]
console.warn(mocks,'mocks')

// for front mock正面模拟
// please use it cautiously, it will redefine XMLHttpRequest,请谨慎使用，它将重新定义XMLHttpRequest
// which will cause many of your third-party libraries to be invalidated(like progress event).这将导致许多第三方库失效（如进度事件）
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function() {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function(options) {
      let result = null
      if (respond instanceof Function) {
        const { body, type, url } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url)
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }
// 参照官方文档，在mock.js文件中引入Mock之后，根据数据模板生成模拟数据：
//Mock.mock( rurl?, rtype?, template|function( options ))

// rurl：可选。表示需要拦截的 URL，可以是 URL 字符串或 URL 正则，如/index.js => /^/index.js$/
// rtype：可选。表示需要拦截的 Ajax 请求类型。例如 GET、POST、PUT、DELETE 等。
// template：可选。表示数据模板，可以是对象或字符串。例如 { 'id|1-10':[{}] }。
// function(options)：可选。表示用于生成响应数据的函数。options 指向本次请求的 Ajax 选项集，
//含有 url、type 和 body 三个属性。
  for (const i of mocks) {
    console.log('i.response',i.response)
    Mock.mock(new RegExp(i.url), i.type || 'get', XHR2ExpressReqWrap(i.response))
  }
}

export default mocks
