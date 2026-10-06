# 832401109_calculator_frontend

## 1. 项目简介

本项目是“前后端分离计算器系统”的 Web 前端，仅负责用户交互、表达式输入、请求发送、结果显示和历史记录展示。所有核心计算均由后端完成，前端不会把表达式本地求值后冒充后端结果。

## 2. 功能特性

- 计算器按钮输入表达式
- 支持加、减、乘、除、小数、括号和一元负数
- 支持键盘输入、退格、清空和回车计算
- 将表达式发送给后端计算接口
- 显示后端返回的结果或错误信息
- 从后端数据库读取计算历史
- 删除指定历史记录
- 清空全部历史记录
- 后端不可用时显示连接失败提示
- 响应式布局，适配桌面和较窄屏幕

## 3. 技术栈

| 分类 | 技术 |
|---|---|
| 页面结构 | HTML5 |
| 页面样式 | CSS3 Grid、Flexbox、响应式布局 |
| 页面逻辑 | 原生 JavaScript（ES6+） |
| 网络请求 | Fetch API |
| 数据格式 | JSON |
| 后端接口 | Flask + SQLite |
| 部署方式 | GitHub Pages  |


## 4. 目录结构

832401109_calculator_frontend/
├── index.html      # 页面结构
├── style.css       # 页面样式
├── script.js       # 交互逻辑和后端 API 请求
├── README.md       # 项目说明
└── codestyle.md    # 前端代码规范


## 5. 运行环境

- Chrome、Edge等浏览器
- 可访问后端服务的网络环境
- 本地联调建议配合 Python 3.10+ 后端运行

## 6. 本地启动方法

### 方法一：Python 静态服务器

在后端目录启动后端：

```bash
python app.py
```

在前端目录启动静态服务器：

```bash
python -m http.server 8000
```

访问：

```text
http://127.0.0.1:8000/
```

### 方法二：Visual Studio Code

安装 Live Server 插件后，右键 `index.html`，选择“Open with Live Server”。

## 7. 配置说明

后端地址在 `script.js` 顶部的 `API_BASE` 常量中配置。

本地联调：

```javascript
const API_BASE = "http://127.0.0.1:5000";
```

当前部署后端：

```javascript
const API_BASE = "https://kersied.pythonanywhere.com";
```

如需更换后端，只需要修改这一处配置。

## 8. 前后端连接方式

前端通过以下接口与后端通信：

| 前端动作 | 请求方法 | 后端路径 |
|---|---|---|
| 提交表达式 | `POST` | `/api/calculate` |
| 加载历史 | `GET` | `/api/history` |
| 删除一条历史 | `DELETE` | `/api/history/<id>` |
| 清空历史 | `DELETE` | `/api/history` |

计算请求体：

```json
{"expression":"(1+2)*3"}
```

计算成功后，前端将 `data.result` 显示在计算器中，并重新加载历史记录。

## 9. 部署到 GitHub Pages

1. 将 `index.html`、`style.css`、`script.js`、`README.md` 和 `codestyle.md` 推送到前端仓库。
2. 打开 GitHub 仓库页面。
3. 进入“Settings” → “Pages”。
4. Source 选择“Deploy from a branch”。
5. 分支选择 `main`，目录选择 `/(root)`。
6. 保存后等待部署完成。
7. 访问 GitHub 给出的 Pages 地址。

按当前仓库名，地址为：

text
https://fu-yi-hang.github.io/832401109_calculator_frontend/



## 10. 测试方法

### 10.1 基本运算

依次点击 `1`、`2`、`+`、`8`、`=`，显示器应显示 `20`。

### 10.2 运算符优先级

依次点击 `1`、`+`、`2`、`×`、`3`、`=`，显示器应显示 `7`。

### 10.3 括号

依次点击 `(`、`1`、`+`、`2`、`)`、`×`、`3`、`=`，显示器应显示 `9`。

### 10.4 一元负数

依次点击 `3`、`×`、`−`、`2`、`=`，显示器应显示 `−6`。

### 10.5 小数与除法

依次点击 `1`、`0`、`÷`、`4`、`=`，显示器应显示 `2.5`。

### 10.6 非法表达式

依次点击 `1`、`+`、`+`、`=`，页面应显示“表达式语法错误”。

### 10.7 除数为零

依次点击 `1`、`÷`、`0`、`=`，页面应显示“除数不能为零”。

### 10.8 历史记录

完成一次成功计算后，右侧“计算历史”应出现表达式、结果和时间。刷新页面后历史记录仍应存在。

### 10.9 删除历史

点击某条记录右侧的 `✕`，该条记录应消失，其他记录保留。

### 10.10 后端离线验证

停止后端服务后点击 `=`，页面不应自行给出新计算结果，而应提示“无法连接后端服务，请确认后端已启动”。

## 10. 浏览器兼容性

页面使用 Fetch API、CSS Grid、Flexbox 和 ES6 语法。现代主流浏览器均可运行。



## 11. 相关仓库

- 前端仓库：<https://github.com/fu-yi-hang/832401109_calculator_frontend>
- 后端仓库：<https://github.com/fu-yi-hang/832401109_calculator_backend>
- 后端服务：<https://kersied.pythonanywhere.com>