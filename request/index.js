let ajaxTimes = 0

export const request = (config) => {
  // 判断 url中是否带有 /my/ 请求的是私有的路径 带上header token
  let header = { ...config.header };
  if (config.url.includes("/my/")) {
    // 拼接header 带上token
    header["Authorization"] = wx.getStorageSync("token");
  }
  ajaxTimes++
  // 显示加载中效果
  wx.showLoading({
    title: '加载中',
    // mask，遮挡板，用户无法操作
    mask: true
  })
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...config,
      header:header,
      url: baseUrl + config.url,
      success: (res) => {
        resolve(res.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--
        if (ajaxTimes === 0)
          //关闭加载中的效果
          wx.hideLoading()
      }
    })
  })
}