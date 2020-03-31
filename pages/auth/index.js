import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import { login } from '../../utils/utilsWx.js'
Page({
  // 1.获取用户信息
  async handleGetUserInfo(e) {
    try {
      const { encryptedData, rawDate, iv, signature } = e.detail
      //2. 获取小程序登录后的code
      const { code } = await login()
      // 3. 发送请求 获取用户的token
      const loginParams = { encryptedData, rawDate, iv, signature }
      const { token } = await request({ url: "/users/wxlogin", data: loginParams, methods: "post" })
      //4.把token存入缓存中，同时跳回上一个页面
      wx.setStorageSync('token', token)
      wx.navigateBack({ delta: 1 })
    } catch (error) {
      console.log(error);
      
    }
  }
})