# flcms-web-v3

## 汽车金融 3.0 
### 中资联汽车金融V1

> 项目经理：董元，立项时间：2018年6月12日

### 开发细节
1. 从dev 检出一个分支 命名为自己的姓名，每一次功能性变动都需要commit，修改完毕之后将自己的分支与dev进行合并
2. 开发规范尽量遵循[vue](https://cn.vuejs.org/)官网中的[风格指南](https://cn.vuejs.org/v2/style-guide/)
3. 项目中文件命名，严格按照公司前端代码命名规范
4. 类名，变量名，方法名等，都应按照统一风格
5. 更新了filter.service.ts 里面的方法 dateFormat 日期格式化 dateTimeFormat 日期时间格式化,
  一律不可以加格式化字符串 如果需要特殊的格式化需要参考 date-fns 里面的dateForamt模块中的格式化字符串.

### 项目参与人员
[黄瑞](hr837@163.com) 薛思梦 杨云龙

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
