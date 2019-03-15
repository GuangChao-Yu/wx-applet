import {config} from '../config.js'

const tips = {
  1: '抱歉,出现了一个错误',
  1000: '输入参数错误',
  1001: '输入的json格式不正确',
  1002: '找不到资源',
  1003: '未知错误',
  1004: '禁止访问',
  1005: '不正确的开发者key',
  1006: '服务器内部错误',
  3000: '期刊不存在'
}

class HTTP {
  request({url, data = {}, method = 'GET'}) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method)
    })
  }

  _request(url, resolve, reject, data = {}, method = 'GET') {
    wx.request({
      url: config.api_base_url + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        appkey: config.appkey
      },
      success: res => {
        const code = res.statusCode + ''
        if (code.startsWith('2')) {
          resolve(res)
        } else {
          reject()
          this._show_error(res.data.error_code)
        }
      },
      fail: err => {
        reject()
        this._show_error(1)
      }
    })
  }

  _show_error(err_code) {
    if (!err_code) {
      err_code = 1
    }
    wx.showToast({
      title: `错误:${tips[err_code]}`,
      icon: 'none',
      duration: 2000
    })
  }
}

export {HTTP}
