window.onload = updateHistoryUI;

function saveKey() {
    const key = document.getElementById('api-key').value;
    localStorage.setItem('openai_key', key);
    alert('API Key saved securely to your browser.');
}

function loadTemplate() {
    document.getElementById('prompt-input').value = document.getElementById('prompt-select').value;
}

async function runAgent() {
    const outputDiv = document.getElementById('output');
    const btn = document.getElementById('run-btn');
    const input = document.getElementById('prompt-input').value;
    const apiKey = localStorage.getItem('openai_key');

    if (!apiKey) return alert("Please save your API key first!");

    btn.disabled = true;
    btn.innerText = "Processing...";
    outputDiv.innerHTML = '<div class="animate-pulse">Agent is thinking...</div>';

    try {
        // 1. Get AI Response
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are an expert business assistant. Provide professional, structured output." },
                    { role: "user", content: input }
                ]
            })
        });

        const data = await response.json();
        const result = data.choices[0].message.content;
        
        // 2. Render Output
        outputDiv.innerHTML = marked.parse(result);
        
        // 3. Persist to Google Sheets (Make.com Webhook)
        // Replace 'YOUR_MAKE_WEBHOOK_URL' with your actual Make.com URL
        await fetch('YOUR_MAKE_WEBHOOK_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                input: input,
                output: result
            })
        }).catch(err => console.error("Logging to sheet failed:", err));
        
        // 4. Update History
        let history = JSON.parse(localStorage.getItem('agent_history') || '[]');
        history.unshift(result.substring(0, 50) + "...");
        if (history.length > 5) history.pop();
        localStorage.setItem('agent_history', JSON.stringify(history));
        updateHistoryUI();
        
    } catch (err) {
        outputDiv.innerText = "Error: Check your connection or API key.";
    } finally {
        btn.disabled = false;
        btn.innerText = "Run Automation";
    }
}

function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem('agent_history') || '[]');
    document.getElementById('history-list').innerHTML = history.map(item => `<li>${item}</li>`).join('');
}
