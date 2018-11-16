var ApiRootUrl = 'http://peixun-9.58jz.com.cn/';
var historyUrl = 'https://www.58jz.com.cn/';

module.exports = {
  ApiRootUrl: ApiRootUrl,
  historyUrl: historyUrl,
  Wxlogin: ApiRootUrl + "wxapp/wxlogin", //微信登录
  Theme: ApiRootUrl + "wxapp/theme",
  Meeting: ApiRootUrl + "wxapp/meeting",
  companyInfo: ApiRootUrl + "wxapp/companyInfo",
  //setting.js
  updateBind: ApiRootUrl + 'wxapp/self_update_bind',
  companyUnbind: ApiRootUrl + 'wxapp/company_unbind',
  //changpwd.js
  companyChangePsw: ApiRootUrl + 'wxapp/company_change_psw',
  //changephone.js
  telValidateCheck: ApiRootUrl + 'wxapp/tel_validate_check',
  telValidateSend: ApiRootUrl + 'wxapp/tel_validate_send',
  //changephonenext.js
  telCheck: ApiRootUrl + 'wxapp/tel_check',
  telSend: ApiRootUrl + 'wxapp/tel_send',
  //personmanage.js
  bdWxusers: ApiRootUrl + 'wxapp/bd_wxusers',
  bdDel: ApiRootUrl + 'wxapp/bd_del',
  //m_register.js
  allSigns: ApiRootUrl + 'wxapp/all_signs',
  //registering.js
  liveSign: ApiRootUrl + 'wxapp/live_sign',
  //infomanage
  manageInfo: ApiRootUrl + 'wxapp/self_manage_info',
  addPeople: ApiRootUrl + 'wxapp/self_add_people', 
  delPeople: ApiRootUrl + 'wxapp/self_people_del', 
  updatePeople: ApiRootUrl + 'wxapp/self_update_people', 
  delComapny: ApiRootUrl + 'wxapp/self_comapny_del', //删除公司发票信息
  //editcominfo.js
  updateCompany: ApiRootUrl + 'wxapp/self_update_company', //更新公司发票信息
  //addcominfo.js
  addCompany: ApiRootUrl + 'wxapp/self_add_company', //添加公司发票信息
  //bmlog.js bmlogdetail.js
  myPeixuns: ApiRootUrl + 'wxapp/mypeixuns', //返回所有报名数据
  myPxscancle: ApiRootUrl + 'wxapp/mypxscancle', //取消报名
  //login.js
  Company_Loginsms: ApiRootUrl + "wxapp/company_login_sms", //公司账号手机登入
  Company_Login: ApiRootUrl + "wxapp/company_login_psw", //公司账号密码登录
  Companysms_Login: ApiRootUrl + "wxapp/sms_login", //公司账号手机登入请求验证码
  //reset.js
  smsForgetPwd2: ApiRootUrl + 'wxapp/sms_forgetPwd_2',
  smsForgetPwd1: ApiRootUrl + 'wxapp/sms_forgetPwd_1',
  //reset2.js
  smsForgetPwd3: ApiRootUrl + 'wxapp/sms_forgetPwd_3',
  //sign.js
  Companysms_Register: ApiRootUrl + "wxapp/sms_register", //公司账号注册请求手机验证码
  CompanyRegister: ApiRootUrl + "wxapp/company_register", //公司账号注册
  //balance.js
  moneyChange: ApiRootUrl + 'wxapp/money_change', //充值的金钱改变
  //discount.js
  buyCard: ApiRootUrl + 'wxapp/buyCard', //购买套餐
}