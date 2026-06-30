async function runAgent() {
    const outputDiv = document.getElementById('output');
    const btn = document.getElementById('run-btn');
    const input = document.getElementById('prompt-input').value;
    const apiKey = localStorage.getItem('openai_key');

    if (!apiKey) return alert("Save your API key first!");

    // Set Loading State
    btn.disabled = true;
    btn.innerText = "Processing...";
    outputDiv.innerHTML = '<div class="animate-pulse">Agent is thinking...</div>';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [{ role: "user", content: input }]
            })
        });

        const data = await response.json();
        outputDiv.innerText = data.choices[0].message.content;
    } catch (err) {
        outputDiv.innerText = "Error: Check your connection or API key.";
    } finally {
        // Reset Button
        btn.disabled = false;
        btn.innerText = "Run Automation";
    }
}
