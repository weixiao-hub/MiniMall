// 上传图片
/** 
 * 调用小程序内置的选择图片的api
 * 获取图片的路径 数组
 * 把图片的路径存到data中
 * 页面根据data数组循环显示
 * 
 * 点击图片的删除
 * 获取被点击的图片的索引
 * 获取图片的数组
 * 根据索引删除对应的元素
 * 把数组重新设置
 * 
 * 点击提交
 * 获取文本域的容
 * data中 定义变量 触发事件存储文本域中的值
 * 
 * 对这些内容进行合法校验
 * 验证通过用户选择的图片，上传到专门的图片服务器 返回图片外网的链接
 * 文本域和图片路径一起提交到服务器
 * 清空当前页面
 * */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
      id: 0,
      value: "体验问题",
      isActive: true
    },
    {
      id: 1,
      value: "投诉",
      isActive: false
    }],
    // 上传的图片路径数组
    chooseImage: [],
    // 文本域的内容
    textVal: ''
  },
  UpLoadImages: [],
  currentIndex(e) {
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })

  },
  // 上传图片
  handleChooseImg() {
    // 1.调用小程序内置的api
    wx.chooseImage({
      // 同时可以选中的数量
      count: 9,
      // 图片的格式 1.原图格式  2. 压缩过的
      sizeType: ['original', 'compressed'],
      // 图片来源：相册      相机
      sourceType: ['album', 'camera'],
      // 成功回调
      success: res => {
        this.setData({
          // 图片数组拼接
          chooseImage: [...this.data.chooseImage, ...res.tempFilePaths]
        })
      }
    })
  },
  // 删除图片
  handleRemoveImg(e) {
    const { index } = e.currentTarget.dataset
    let { chooseImage } = this.data
    chooseImage.splice(index, 1)
    this.setData({
      chooseImage
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击事件
  handleFormSubmit() {
    let { textVal, chooseImage } = this.data

    // 合法验证
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      })
    }
    // 准备上传图片，上传到专门的图片服务器
    // 上传文件的api里，不支持多个文件同时上传，遍历数组挨个上传
    // 显示正在等待图标
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })

    // 判断有没有需要上传的图片
    if (chooseImage.length !== 0) {
      chooseImage.forEach((v, i) => {
        wx.uploadFile({
          // 被上传文件的路径
          filePath: v,
          // 文件名称，要和后台定好
          name: 'file',
          // 要上传到哪里
          url: '	http://images.ac.cn/api/upload',
          // 附带的文本信息
          formData: {},
          success: res => {
            let url = JSON.parse(res.data)

            this.UpLoadImages.push(url)

            //  所有的图片都上传完毕触发
            if (i === chooseImage.length - 1) {
              // 关闭上传提示
              wx.hideLoading({})
              console.log('把数据提交到后台');
              // 提交成功后，重置页面
              this.setData({
                textVal: '',
                chooseImage: []
              })
              wx.navigateBack({
                delta: 1
              })
            }

          }
        })

      })
    } else {
      console.log('只提交文本');
      wx.hideLoading({})
    }
    wx.navigateBack({
      delta: 1
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})