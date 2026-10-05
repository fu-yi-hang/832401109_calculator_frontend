const API_BASE = "https://kersied.pythonanywhere.com";

const display = document.getElementById("display");
const statusEl = document.getElementById("status");
const apiInfo = document.getElementById("api-info");
apiInfo.textContent = API_BASE;

const historyList = document.getElementById("history-list");
const refreshBtn = document.getElementById("refresh-history");
const clearBtn = document.getElementById("clear-history");

let expression = "";
let justCalculated = false;

function toDisplayText(expr) {
    return expr.replace(/\//g, "÷").replace(/\*/g, "×").replace(/-/g, "−");
}

function updateDisplay() {
    display.textContent = expression === "" ? "0" : toDisplayText(expression);
}

function setStatus(msg) {
    statusEl.textContent = msg;
}

function appendToken(token) {
    if (justCalculated) {
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
    if (justCalculated) {
        clearAll();
        return;
    }
    expression = expression.slice(0, -1);
    setStatus("");
    updateDisplay();
}

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
        loadHistory();
    } catch (err) {
        setStatus("无法连接后端服务，请确认后端已启动");
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;");
}

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
            <button class="history-delete" data-id="${item.id}" title="删除此记录">✕</button>
        </li>
    `).join("");
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

async function deleteHistory(id) {
    try {
        const response = await fetch(`${API_BASE}/api/history/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("delete failed");
    } catch (err) {
        historyList.innerHTML = '<li class="history-error">删除失败：无法连接后端</li>';
        return;
    }
    loadHistory();
}

async function clearHistory() {
    if (!confirm("确定要清空全部计算历史吗？")) return;

    try {
        const response = await fetch(`${API_BASE}/api/history`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("clear failed");
    } catch (err) {
        historyList.innerHTML = '<li class="history-error">清空失败：无法连接后端</li>';
        return;
    }
    loadHistory();
}

/* 事件监听只注册一次 */
document.querySelector(".keys").addEventListener("click", (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;

    const { token, action } = btn.dataset;
    if (token) {
        appendToken(token);
        return;
    }

    switch (action) {
        case "clear":
            clearAll();
            break;
        case "back":
            backspace();
            break;
        case "equals":
            calculate();
            break;
    }
});

document.addEventListener("keydown", (event) => {
    const keyMap = {
        "*": "*",
        "+": "+",
        "-": "-",
        "/": "/",
        ".": ".",
        "(": "(",
        ")": ")",
    };

    if (/^[0-9]$/.test(event.key)) {
        appendToken(event.key);
    } else if (keyMap[event.key]) {
        appendToken(keyMap[event.key]);
    } else if (event.key === "Enter" || event.key === "=") {
        calculate();
    } else if (event.key === "Backspace") {
        backspace();
    } else if (event.key === "Escape") {
        clearAll();
    }
});

historyList.addEventListener("click", (event) => {
    const btn = event.target.closest(".history-delete");
    if (!btn) return;
    deleteHistory(Number(btn.dataset.id));
});

refreshBtn.addEventListener("click", loadHistory);
clearBtn.addEventListener("click", clearHistory);

loadHistory();
updateDisplay();