import {HTTP} from '../util/http'

class ClassicModel extends HTTP {
  getLatest(callback) {
    this.request({
      url: 'classic/latest',
      success: res => {
        callback(res)
        this._setLatestIndex(res.data.index)
        let key = this._getKey(res.data.index)
        wx.setStorageSync(key, res.data)
      }
    })
  }

  getClassic(index, nextOrPrevious, callback) {
    let key =
      nextOrPrevious === 'next'
        ? this._getKey(index + 1)
        : this._getKey(index - 1)
    let classic = wx.getStorageSync(key)
    if (!classic) {
      this.request({
        url: `classic/${index}/${nextOrPrevious}`,
        success: res => {
          wx.setStorageSync(this._getKey(res.data.index), res.data)
          callback(res)
        }
      })
    } else {
      callback(classic)
    }
  }

  isFirst(index) {
    return index === 1 ? true : false
  }

  isLatest(index) {
    let latestIndex = this._getLatestIndex()
    return latestIndex == index ? true : false
  }

  getMyFavor(success) {
    const params = {
      url: 'classic/favor',
      success: success
    }
    this.request(params)
  }

  _setLatestIndex(index) {
    wx.setStorageSync('latest', index)
  }

  _getLatestIndex() {
    const index = wx.getStorageSync('latest')
    return index
  }

  _getKey(index) {
    const key = `classic_${index}`
    return key
  }
}

export {ClassicModel}
