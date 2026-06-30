// Save the API key securely to the browser
function saveKey() {
    const key = document.getElementById('api-key').value;
    localStorage.setItem('openai_key', key);
    alert('API Key saved to your browser local storage.');
}

// Function to call the AI
async function runAgent() {
    const apiKey = localStorage.getItem('openai_key');
    const input = document.getElementById('prompt-input').value;
    
    if (!apiKey) return alert("Please save your API key first!");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: input }]
        })
    });

    const data = await response.json();
    document.getElementById('output').innerText = data.choices[0].message.content;
}
