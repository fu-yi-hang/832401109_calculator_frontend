const API_BASE = "http://127.0.0.1:5000";   

const display = document.getElementById("display");
const statusEl = document.getElementById("status");

const historyList = document.getElementById("history-list");
const refreshBtn = document.getElementById("refresh-history");

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

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;");
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
        loadHistory();         计算成功后从后端重新拉取历史
    } catch (err) {
        setStatus("无法连接后端服务，请确认后端已启动");
    }
}

/* ---------- 计算历史（始终从后端读取，不做前端缓存） ---------- */
function renderHistory(items) {
    if (!items.length) {
        historyList.innerHTML = '<li class="history-empty">暂无历史记录</li>';
        return;
    }
    historyList.innerHTML = items.map((item) => `
        <li class="history-item">
            <div class="history-content">
                <div class="history-main">
                    <span>${toDisplayText(escapeHtml(item.expression))}</span>
                    <span class="history-equals">=</span>
                    <span class="history-result">${escapeHtml(String(item.result))}</span>
                </div>
                <div class="history-time">${escapeHtml(item.created_at)}</div>
            </div>
        </li>`).join("");
}

async function loadHistory() {
    try {
        const response = await fetch(`${API_BASE}/api/history`);
        if (!response.ok) throw new Error("bad response");
        const data = await response.json();
        renderHistory(data.history || []);
    } catch (err) {
        historyList.innerHTML = '<li class="history-error">无法连接后端，历史记录加载失败</li>';
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
    const keyMap = { "*": "*", "+": "+", "-": "-", "/": "/", ".": ".", "(": "(", ")": ")" };
    if (/^[0-9]$/.test(event.key)) appendToken(event.key);
    else if (keyMap[event.key]) appendToken(keyMap[event.key]);
    else if (event.key === "Enter" || event.key === "=") calculate();
    else if (event.key === "Backspace") backspace();
    else if (event.key === "Escape") clearAll();
});

refreshBtn.addEventListener("click", loadHistory);

loadHistory();   // v3：每次打开/刷新页面都从后端数据库读取历史
updateDisplay();
