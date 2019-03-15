// components/search/index.js
import {KeywordModel} from '../../models/keyword.js'
import {paginationBev} from '../behaviors/pagination'
const keywordModel = new KeywordModel()
Component({
  behaviors: [paginationBev],
  /**
   * 组件的属性列表
   */
  properties: {
    more: {
      type: String,
      observer: 'loadMore'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    historyWords: [],
    hotWords: [],
    searching: false,
    q: '',
    loadingCenter: false
  },
  attached() {
    this.setData({
      historyWords: keywordModel.getHistory()
    })
    keywordModel.getHot().then(res => {
      this.setData({
        hotWords: res.data.hot
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    loadMore() {
      if (!this.data.q) return
      if (this.isLocked()) return
      if (this.hasMore()) {
        this.locked()
        keywordModel.search(this.getCurrentStart(), this.data.q).then(
          res => {
            this.setMoreData(res.data.books)
            this.unLocked()
          },
          () => {
            this.unLocked()
          }
        )
      }
    },
    onCancel(event) {
      this.initialize()
      this.triggerEvent('cancelSearch', {}, {})
    },
    onConfirm(event) {
      this._showLoadingCenter()
      const q = event.detail.value || event.detail.text
      this._showResult()
      this.initialize()
      keywordModel.search(0, q).then(res => {
        this.setMoreData(res.data.books)
        this.setTotal(res.data.total)
        this.setData({
          q: q
        })
        keywordModel.addToHistory(q)
        this._hideLoadingCenter()
      })
    },
    clearInput(event) {
      this._closeResult()
    },
    _showResult() {
      this.setData({
        searching: true
      })
    },
    _closeResult() {
      this.initialize()
      this.setData({
        searching: false,
        q: ''
      })
    },
    _showLoadingCenter() {
      this.setData({
        loadingCenter: true
      })
    },
    _hideLoadingCenter() {
      this.setData({
        loadingCenter: false
      })
    }
  }
})
