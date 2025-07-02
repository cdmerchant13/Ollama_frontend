document.addEventListener('DOMContentLoaded', () => {
    const ollamaUrlInput = document.getElementById('ollama-url');
    const modelSelect = document.getElementById('model-select');
    const connectBtn = document.getElementById('connect-btn');
    const chatContainer = document.getElementById('chat-container');
    const chatHistory = document.getElementById('chat-history');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    connectBtn.addEventListener('click', async () => {
        const url = ollamaUrlInput.value;
        if (url) {
            const models = await window.electronAPI.connectToOllama(url);
            if (models.error) {
                alert(models.error);
            } else {
                modelSelect.innerHTML = '';
                models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model.name;
                    option.textContent = model.name;
                    modelSelect.appendChild(option);
                });
                chatContainer.style.display = 'block';
            }
        }
    });

    sendBtn.addEventListener('click', async () => {
        const message = messageInput.value;
        const selectedModel = modelSelect.value;
        if (message && selectedModel) {
            appendMessage('You', message);
            messageInput.value = '';

            const response = await window.electronAPI.sendMessage({ model: selectedModel, message });
            if (response.error) {
                alert(response.error);
            } else {
                appendMessage(selectedModel, response);
            }
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message-bubble');
        if (sender === 'You') {
            messageElement.classList.add('user-message');
        } else {
            messageElement.classList.add('model-message');
        }
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});