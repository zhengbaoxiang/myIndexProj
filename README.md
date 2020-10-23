# my_index

## 一、项目启动
### 安装依赖
``
npm install
```
### 本地开发
```
npm run start / npm run serve
```
### 打包部署
```
npm run build
```
### VScode配置，保存即格式化，

先安装扩展如prettier, eslint, vetur等，然后file - preferences - settings - 右上角打开json配置，配置如下，复制粘贴:

    {
      "window.zoomLevel": 1,
      "prettier.semi": false, // 去掉代码结尾的分号
      "prettier.singleQuote": true, // 单引号
      "prettier.trailingComma": "none", // 去掉不必须的逗号
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      }
    }


## 二、参考文档

  * 设计稿： https://org.modao.cc/app/221m0py6xtjehbp6vwzx0l3h4sxot4j0?tdsourcetag=s_pcqq_aiomsg#screen=s1addad2084156983466400

  * 需求地址： https://www.tapd.cn/50521720/prong/stories/stories_list

  * SVN地址 ： http://192.168.50.15:5443/svn/HCS/trunk

  * 数据库地址：  36.152.29.162:42434 root/iamnts123456

  * UI框架参考 mint-ui ：  https://mint-ui.github.io/docs/#/zh-cn2

  * vue-cli 3.4.0 配置指南 ：  https://cli.vuejs.org/config/


## 	三、微信端本地开发指南

1. 本地改hosts  添加：  127.0.0.1  hcsdemo.tiansu-china.com  ######

2. 修改public/hcsConfig.json中调用接口的地址axiosBaseURL：

    ```
    "axiosBaseURL": "http://192.168.40.190/api/v1/",
    "imgURL": "http://hcsdemo.natapp1.cc/hcs/picFile/",
    "imgdomain": "http://hcsdemo.natapp1.cc/hcs/imgFile/",
    "domain": "http://hcsdemo.natapp1.cc",
    "appId": "wxd4b953286afd7bb5",
    "environment": "test",
    "authoURL": "http://tiansu-hcs.natapp1.cc/api/v1/common/redirect/code"
    ```

3. 部署指定域名下的项目时,重命名hcsConfig+指定域名.json文件 -> hcsConfig.json 替换上去即可

    例: 在tiansu域名下,将hcsConfigTiansu.json修改为hcsConfig.json,替换部署即可

4.  本地调试，`微信开发者工具`:

  * 下载工具: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html 

  * 登录个人微信，并打开如：http://hcsdemo.tiansu-china.com/hcs_wx/?default=user    ######复制到开发者地址栏中。
  
  * 初次使用需要登录微信公众号运营：https://mp.weixin.qq.com/  运营者 扫码登录，luzg@tiansu-china.com
	 
  * 无权限问题：  开发-开发者工具-web开发者工具 - 绑定开发者微信号
	
  * 公众号更多菜单问题： 管理-用户管理-为关注用户打上“研发人员”标签，等两分钟生效。 （菜单的开发postman直接掉微信API提供的接口。）

## 四、对接我要管家开发指南
  
1. URL
  
  * 护理护工图标入口url： http://{domain}/hcs_wx?showtype=APP&corpid=718&token=ASDFGHJKL

  * 消息推送url则不带corpid和token，护工子系统自己带上tenantId和userName，调登录获取token后下一步操作。

2. 图标入口配置

  * 从平台登录，开发联调环境: http://36.152.29.162:50206/login/5152666，
  菜单导航-基础配置-菜单管理-子系统服务，
  选择APP，找到“护理护工”其中一个可修改domain。
  另一个需要找`祁尧`来修改平台的预置脚本。

3. 参考文档：
    \trunk\documents\V2.10\平台对接


//zbx

* 浏览器本地移动端调试地址 
开发环境
   http://localhost:80/?loginName=songyanadmin&role=7&tenantId=718
   http://localhost:80/?loginName=zbxhs&role=8&tenantId=718
   http://localhost:80/?loginName=zbxhg&role=5&tenantId=718
   
   http://localhost:80/?loginName=zbxzg&role=4&tenantId=718
   http://localhost:80/?loginName=zbxgj&role=7&tenantId=718
   
 测试环境
   http://localhost:80/?loginName=zbxzg&role=7&tenantId=787

  本地web端调试，修改environment地址，替换域名
  http://localhost:4200/home
  

1.1	开发环境
Web管理系统登录地址：http://36.152.29.162:50206/login/5152666
微信：贴心陪护 - 我要护工dev

我要管家开发调试登录地址：
http://tiansu-hcs.natapp1.cc/hcs_wx/?role=4&fromChrome=1&tenantId=718&loginName=zbxzg

前端服务器地址：192.168.50.102，eway/123456, /usr/local/tiansu/html
后端服务器地址：192.168.50.102，hcs/123456，/usr/local/tiansu/hcs-wx
数据地址：192.168.50.102:3306/hcs_dev，root/iamnts123456

1.2	测试环境
Web管理系统登录地址：http://36.152.29.162:50206/login/0252101
微信：贴心陪护 - 我要护工DEMO
我要管家开发调试登录地址：
http://hcsdemo.tiansu-china.com/hcs_wx/?role=4&fromChrome=1&tenantId=787&loginName=zbxzg

前端服务器地址：192.168.50.100，eway/123456, /usr/local/tiansu/nginx/html
后端服务器地址：192.168.50.101，hcs/123456，/usr/local/tiansu/hcs-wx
数据地址：192.168.50.102:3306/hcs_test，root/iamnts123456  
