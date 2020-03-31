import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 侧边栏菜单数据：
    leftMenuList: [],
    // 右侧商品数据
    rightGoodsList: [],
    // 被点击的左侧菜单
    currentIndex: 0,
  },
  //接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // web:不管存入的是什么类型的数据，最终都会先转为字符串，在存入
    // 小程序：不存在类型转换
    // 判断本地存储有没有旧的数据
    // 没有则发送网络请求，有则判断数据是否过期
    // 获取本地存储中的数据
    const Cates = wx.getStorageSync('cates')
    // 2.判断Cates是否存在
    if (!Cates) {
      // 发送网络请求
      this.getCates()
    } else {
      // 有旧数据，判断是否过期，定义过期时间 5min
      if (Date.now() - Cates.time > 1000 * 10) {
        //  重新发送请求
        this.getCates()
      } else {
        // 使用旧数据
        this.Cates = Cates.data;
        // 构造左侧的菜单数据
        let leftMenuList = this.Cates.map(item => item.cat_name)
        // 构造右侧商品数据
        let rightGoodsList = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightGoodsList
        })
      }
    }

  },
  // 获取分类数据
  async getCates() {
    // 1. 使用async 和 await 发送请求
    const res = await request({
      url: '/categories'
    })
    this.Cates = res
    // 把接口的数据存入到本地存储中
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    // 构造左侧的菜单数据
    let leftMenuList = this.Cates.map(item => item.cat_name)
    // 构造右侧商品数据
    let rightGoodsList = this.Cates[0].children

    this.setData({
      leftMenuList,
      rightGoodsList
    })
  },
  // 侧边栏点击事件
  handleItemTap(e) {
    // 获取传过来的索引
    let { index } = e.currentTarget.dataset
    // 根据index给商品数据重新赋值,显示不同的数据
    let rightGoodsList = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightGoodsList
    })
  }

})