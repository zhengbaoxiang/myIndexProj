# my_index

## 一、项目启动

### 安装 git，拉取代码

```
git@github.com:zhenggenshuo/myIndexProj.git
https://github.com/zhenggenshuo/myIndexProj.git

git config --global http.sslVerify "false"
```

### 安装 Node.js,安装依赖

```
1 npm install
2 手动启动点击server521.bat
3 将 vue-server-selfstart.放于下方目录可实现开机自启动，
C:\ProgramData\Microsoft\Windows\Start Menu\Programs\StartUp
```

### 本地开发

```
npm run start / npm run serve
```

### 打包部署

```
npm run build
```

### VScode 配置，保存即格式化

先安装扩展如 prettier, eslint, vetur 等，然后 file - preferences - settings - 右上角打开 json 配置，配置如下，复制粘贴:

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

-   UI 框架参考 mint-ui ： https://mint-ui.github.io/docs/#/zh-cn2

-   vue-cli 3.4.0 配置指南 ： https://cli.vuejs.org/config/
