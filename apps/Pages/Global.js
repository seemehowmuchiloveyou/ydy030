/**
 * 用于存储一些常用变量，服务器ip及端口,用户信息，自动登录状态
 * @author xph
 * xph@sectong.com
 */
var Global = {
    "serverip": "http://192.168.12.101:8080",
    "userinfo": "",
    "username":"用户名",
    "loginflag": 0,
    "refreshinfo": { "startid": 0, "data": [] }
};
module.exports = Global;