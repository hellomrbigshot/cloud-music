import Taro from '@tarojs/taro'
import { baseUrl } from '../config'
import { HTTP_STATUS } from '../constants/status'
import { logError } from '../utils/error'

export default {
  baseOptions (params, method = 'GET') {
    let { url, data } = params
    let contentType = 'application/json'
    contentType = params.contentType || contentType
    type OptionType = {
      url: string,
      data?: object | string,
      method?: any,
      header: object,
      xhrFields: object,
      success: any,
      error: any
    }
    const option: OptionType = {
      url: `${baseUrl}${url}`,
      data: data,
      method,
      header: {
        'content-type': contentType,
        cookie: Taro.getStorageSync('cookies')
      },
      xhrFields: { withCredentials: true },
      success (res) {
        const { SUCCESS, NOT_FOUND, BAD_GATEWAY, FORBIDDEN, AUTHENTICATE } = HTTP_STATUS
        const { statusCode } = res
        if (statusCode === NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (statusCode === BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (statusCode === FORBIDDEN) {
          return logError('api', '没有访问权限')
        } else if (statusCode === AUTHENTICATE) {
          // 跳转到登录页
          return logError('api', '需要登录')
        } else if (statusCode === SUCCESS) {
          return res.data
        }
      },
      error (e) {
        logError('api', '请求接口出现问题', e)
      }
    }

    return Taro.request(option)
  },
  get (url, data?: object) {
    let option = { url, data }
    console.log(this)
    return this.baseOptions(option)
  },
  post (url, data?: object, contentType?: string) {
    let option = { url, data, contentType }
    return this.baseOptions(option, 'POST')
  },
  put (url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'PUT')
  },
  delete (url, data?: object) {
    let option = { url, data }
    return this.baseOptions(option, 'DELETE')
  }
}
