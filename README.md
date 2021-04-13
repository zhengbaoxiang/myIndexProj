# my_index

## 一、项目启动
### 安装git，拉取代码
```
git@github.com:zhenggenshuo/myWebProj.git
https://github.com/zhenggenshuo/myWebProj.git
https://github.com.cnpmjs.org/zhenggenshuo/myWebProj.git
```
### 安装Node.js,安装依赖
```
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
### VScode配置，保存即格式化

先安装扩展如prettier, eslint, vetur等，然后file - preferences - settings - 右上角打开json配置，配置如下，复制粘贴:
```
    {
      "window.zoomLevel": 1,
      "prettier.semi": false, // 去掉代码结尾的分号
      "prettier.singleQuote": true, // 单引号
      "prettier.trailingComma": "none", // 去掉不必须的逗号
      "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
      }
    }
```


## 二、参考文档

  * UI框架参考 mint-ui ：  https://mint-ui.github.io/docs/#/zh-cn2

  * vue-cli 3.4.0 配置指南 ：  https://cli.vuejs.org/config/


