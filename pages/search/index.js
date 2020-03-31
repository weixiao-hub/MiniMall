/**
 *  输入框绑定值
 * 获取输入框的值
 * 合法性判断
 * 建议通过 把输入框的值发送给后台
 * 返回的数据显示再页面
 * 
 * 防抖防止重复发送请求 定时器  节流：一般用在页面的上拉下拉
 * 
 */
import { request } from '../../request/index.js'
import regeneratorRuntime, { async } from '../../lib/runtime/runtime.js'
Page({
  data: {
    goods: [],
    // 取消按钮是否显示
    isFocus:false,
    inputValue:null,
  },
  Timer: -1,
  handleInput(e) {
    // 1.获取输入框的值
    const { value } = e.detail
    if (!value.trim()) {
      // 不合法
      this.setData({
        isFocus:false
      })
      return
    }
    this.setData({
      isFocus:true
    })
    //  准备发送请求
    // 清除定时器
    clearTimeout(this.Timer)
    this.Timer = setTimeout(() => {
      this.qsearch(value)

    }, 1000)
  },
  //  发送请求获取搜索建议 数据
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } })
    this.setData({
      goods: res
    })
  },
  // 点击取消按钮
  handleCancel() {
    this.setData({
      inputValue:'',
      isFocus:false,
      goods:[]
    })
  }

})