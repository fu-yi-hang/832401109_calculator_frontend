const API_BASE = "http://127.0.0.1:5000";   

const display = document.getElementById("display");
const statusEl = document.getElementById("status");

let expression = "";   // 内部表达式，用 * / 表示乘除
let justCalculated = false;

/* ---------- 工具函数 ---------- */
function toDisplayText(expr) {
    return expr.replace(/\//g, "÷").replace(/\*/g, "×").replace(/-/g, "−");
}

function updateDisplay() {
    display.textContent = expression === "" ? "0" : toDisplayText(expression);
}

function setStatus(msg) {
    statusEl.textContent = msg;
}

/* ---------- 输入处理 ---------- */
function appendToken(token) {
    if (justCalculated) {          // 上一次刚算完：输入数字则清空重来，输入运算符则接着算
        if (/[0-9.]/.test(token)) expression = "";
        justCalculated = false;
    }
    expression += token;
    setStatus("");
    updateDisplay();
}

function clearAll() {
    expression = "";
    justCalculated = false;
    setStatus("");
    updateDisplay();
}

function backspace() {
    if (justCalculated) { clearAll(); return; }
    expression = expression.slice(0, -1);
    setStatus("");
    updateDisplay();
}

/* ---------- 核心：请求后端计算 ---------- */
async function calculate() {
    if (!expression) return;
    setStatus("计算中…");

    try {
        const response = await fetch(`${API_BASE}/api/calculate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expression: expression }),
        });
        const data = await response.json();

        if (!response.ok) {
            setStatus("错误：" + (data.error || "请求失败"));
            justCalculated = false;
            return;
        }

        expression = String(data.result);
        justCalculated = true;
        setStatus("");
        updateDisplay();
    } catch (err) {
        setStatus("无法连接后端服务，请确认后端已启动");
    }
}

/* ---------- 键盘 & 按钮事件 ---------- */
document.querySelector(".keys").addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;

    const { token, action } = btn.dataset;
    if (token) { appendToken(token); return; }

    switch (action) {
        case "clear":   clearAll(); break;
        case "back":    backspace(); break;
        case "equals":  calculate(); break;
    }
});

document.addEventListener("keydown", (event) => {
    // 键盘也支持输入括号
    const keyMap = { "*": "*", "+": "+", "-": "-", "/": "/", ".": ".", "(": "(", ")": ")" };
    if (/^[0-9]$/.test(event.key)) appendToken(event.key);
    else if (keyMap[event.key]) appendToken(keyMap[event.key]);
    else if (event.key === "Enter" || event.key === "=") calculate();
    else if (event.key === "Backspace") backspace();
    else if (event.key === "Escape") clearAll();
});

updateDisplay();
