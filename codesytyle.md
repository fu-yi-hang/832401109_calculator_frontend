# 前端代码规范（codestyle.md）

## 规范来源

本规范以 Google 的 [**JavaScript Style Guide**](https://google.github.io/styleguide/jsguide.html) 为基础，结合 MDN Web Docs 对 [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)、[DOM API](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model) 的建议以及本项目“无构建步骤的原生 JavaScript”特点制定。若项目规则与 Google 规范冲突，以本文件为准。

## 1. 基础格式

1. 使用 UTF-8 编码。
2. 本项目统一使用 4 个空格缩进，不使用 Tab。
3. 使用 Unix 风格换行符（LF）。
4. 语句末尾使用分号。
5. 每行建议不超过 100 个字符。
6. 字符串默认使用双引号；字符串内部出现双引号时改用反引号或单引号。
7. 不保留注释掉的死代码。

## 2. 命名

| 对象 | 规则 | 示例 |
|---|---|---|
| 变量 | `camelCase` | `historyList` |
| 函数 | `camelCase` | `loadHistory()` |
| 常量 | `UPPER_SNAKE_CASE` | `API_BASE` |
| 布尔值 | 使用 `is`、`has`、`can` 等前缀 | `justCalculated` |
| DOM 变量 | 可使用 `El` 后缀 | `statusEl` |
| 文件 | 小写字母，可用连字符 | `script.js` |

名称必须清楚表达用途，不使用 `a`、`x1`、`test2` 等模糊命名。

## 3. 语言特性

1. 使用 `const` 声明不需要重新赋值的变量，使用 `let` 声明需要重新赋值的变量。
2. 不使用 `var`。
3. 优先使用箭头函数处理回调。
4. 使用模板字符串拼接 URL 和多行文本。
5. 使用 `async` / `await` 处理异步请求，并用 `try...catch` 捕获网络错误。
6. 不直接执行用户输入，不通过 `innerHTML` 插入未经转义的数据。
7. 原生能力可以满足需求时，不引入大型第三方框架。

## 4. DOM 与事件

1. 入口脚本先获取所需 DOM 元素，并检查元素是否存在。
2. 同一事件只注册一次，避免重复绑定。
3. 对容器使用事件委托，减少大量按钮的重复监听。
4. 按钮、输入框和交互区域应提供可识别的 `title`、`aria-label` 或可读文本。
5. 页面加载后需要自动请求数据时，必须处理后端不可用的情况。

## 5. 网络请求

1. 后端地址集中定义为 `API_BASE`，不得在多个函数中硬编码域名。
2. 请求 JSON 时必须设置 `Content-Type: application/json`。
3. 每个请求都应检查 `response.ok`。
4. 后端返回的错误信息优先直接展示给使用者。
5. 网络不可达时必须显示明确提示，不得静默失败。
6. 成功修改历史后，应重新调用查询接口刷新界面，保证页面显示与数据库一致。

示例：

```javascript
const response = await fetch(`${API_BASE}/api/calculate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ expression: expression }),
});
const data = await response.json();
if (!response.ok) {
  setStatus("错误：" + (data.error || "请求失败"));
  return;
}
```

## 6. 安全

1. 对来自后端的表达式、结果和时间等字段使用文本转义后再插入 HTML。
2. 不保存敏感信息到 LocalStorage。
3. 不通过前端缓存冒充后端历史；刷新历史必须调用后端 API。
4. 不把计算结果写回数据库；数据库写入必须由后端完成。
5. 不加载来源不明的脚本或样式。

## 7. 样式规则

1. 页面结构使用语义化 HTML。
2. 选择器保持简单，优先使用类选择器。
3. 不使用 `!important` 解决普通优先级问题。
4. 颜色、间距和圆角尽量保持统一。
5. 移动端必须检查按钮可点击区域和面板换行效果。
6. CSS 属性和选择器按布局、盒子模型、字体、颜色、动效的顺序分组书写。

## 8. 注释

1. 公共函数和复杂逻辑必须有注释或文档说明。
2. 注释解释设计意图，不重复代码表面含义。
3. 安全限制、后端约定和浏览器兼容处理必须注释。
4. 本项目注释使用中文，风格保持一致。

## 9. 项目约定

1. 乘法按钮显示 `×`，内部表达式使用 `*`。
2. 除法按钮显示 `÷`，内部表达式使用 `/`。
3. 显示层可以使用 Unicode 负号 `−`，发送给后端时仍使用 ASCII `-`。
4. 成功计算后把后端返回的 `data.result` 转为字符串显示。
5. 错误计算不写入历史记录。
6. 删除单条记录后必须重新加载历史列表。