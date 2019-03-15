// components/classic/music/index.js
import {classicBeh} from '../classic-beh.js'

const mMgr = wx.getBackgroundAudioManager()

Component({
  /**
   * 公用mixin
   */
  behaviors: [classicBeh],
  /**
   * 组件的属性列表
   */
  properties: {
    src: String,
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    pauseSrc: './images/player@pause.png',
    palySrc: './images/player@play.png',
    playing: false
  },

  attached() {
    this._recoverStatis()
    this._monitorSwitch()
  },
  detached() {},

  /**
   * 组件的方法列表
   */
  methods: {
    onPlay() {
      if (!this.data.playing) {
        this.setData({
          playing: true
        })
        mMgr.src = this.properties.src
        mMgr.title = this.properties.title
      } else {
        this.setData({
          playing: false
        })
        mMgr.pause()
      }
    },
    _recoverStatis() {
      if (mMgr.paused) {
        this.setData({
          playing: false
        })
        return
      }
      if (mMgr.src === this.properties.src) {
        this.setData({
          playing: true
        })
      }
    },
    _monitorSwitch() {
      mMgr.onPlay(() => {
        this._recoverStatis()
      })
      mMgr.onPause(() => {
        this._recoverStatis()
      })
      mMgr.onStop(() => {
        this._recoverStatis()
      })
      mMgr.onEnded(() => {
        this._recoverStatis()
      })
    }
  }
})
