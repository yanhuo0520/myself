##### 1、支付模块 #####
# 去支付
android.nongAliPay()   农行 - 支付宝渠道
android.unionPay(data.tn)   银联【云闪付】
android.unionAliPay(data)   银联 - 支付宝渠道
android.unionWxPay(data)  银联 - 微信渠道
android.aliPay(data.body)  支付宝官方渠道
# 支付结束
onPayFinish(info){
    "type": "unionWx",
    "hasResult": false,
    "isSuccess": false
}


##### 2、微信登录 #####
# 唤起微信登录
android.loginWX()

# 微信成功授权并返回用户信息
onWxLogin(info)

# 登录失败
执行onWxLoginFail


#####  3、登录令牌 #####
var code = android.totpCode('LPCS7I5KPSTTYTXF')

#####  4、返回键 #####
window.leftBack = this.leftBack


#####  5、定位 #####
window.locPermissionError = this.locPermissionError  // 权限不足的时候，用户没赋予权限
			window. locServerOff = this. locServerOff // 打开位置服务窗口
			window.locGD = this.locGD
			window.locationGDAll = this.locationGDAll