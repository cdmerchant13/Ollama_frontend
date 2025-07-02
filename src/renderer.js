const showdown = require('showdown');

document.addEventListener('DOMContentLoaded', () => {
    const ollamaUrlInput = document.getElementById('ollama-url');
    const modelSelect = document.getElementById('model-select');
    const connectBtn = document.getElementById('connect-btn');
    const chatContainer = document.getElementById('chat-container');
    const chatHistory = document.getElementById('chat-history');
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const systemPromptSelect = document.getElementById('system-prompt-select');
    const systemPromptName = document.getElementById('system-prompt-name');
    const systemPromptText = document.getElementById('system-prompt-text');
    const savePromptBtn = document.getElementById('save-prompt-btn');
    const deletePromptBtn = document.getElementById('delete-prompt-btn');
    const converter = new showdown.Converter();

    let systemPrompts = {};

    function loadSystemPrompts() {
        const storedPrompts = localStorage.getItem('systemPrompts');
        if (storedPrompts) {
            systemPrompts = JSON.parse(storedPrompts);
            updateSystemPromptSelect();
        }
    }

    function updateSystemPromptSelect() {
        systemPromptSelect.innerHTML = '';
        for (const name in systemPrompts) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            systemPromptSelect.appendChild(option);
        }
    }

    function saveSystemPrompt() {
        const name = systemPromptName.value;
        const text = systemPromptText.value;
        if (name && text) {
            systemPrompts[name] = text;
            localStorage.setItem('systemPrompts', JSON.stringify(systemPrompts));
            updateSystemPromptSelect();
            systemPromptName.value = '';
            systemPromptText.value = '';
        }
    }

    function deleteSystemPrompt() {
        const selectedPrompt = systemPromptSelect.value;
        if (selectedPrompt) {
            delete systemPrompts[selectedPrompt];
            localStorage.setItem('systemPrompts', JSON.stringify(systemPrompts));
            updateSystemPromptSelect();
        }
    }

    loadSystemPrompts();

    savePromptBtn.addEventListener('click', saveSystemPrompt);
    deletePromptBtn.addEventListener('click', deleteSystemPrompt);

    systemPromptSelect.addEventListener('change', () => {
        const selectedPrompt = systemPromptSelect.value;
        if (selectedPrompt) {
            systemPromptName.value = selectedPrompt;
            systemPromptText.value = systemPrompts[selectedPrompt];
        }
    });

    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });

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

            const selectedSystemPrompt = systemPromptSelect.value;
            const systemPrompt = systemPrompts[selectedSystemPrompt] || null;

            showIdleAnimation();

            const response = await window.electronAPI.sendMessage({ model: selectedModel, message, systemPrompt });

            hideIdleAnimation();

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
            messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        } else {
            messageElement.classList.add('model-message');
            const htmlContent = converter.makeHtml(message);
            messageElement.innerHTML = `<strong>${sender}:</strong> ${htmlContent}`;
        }
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function showIdleAnimation() {
        const idleElement = document.createElement('div');
        idleElement.id = 'idle-animation';
        idleElement.classList.add('message-bubble', 'model-message');
        idleElement.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>';
        chatHistory.appendChild(idleElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function hideIdleAnimation() {
        const idleElement = document.getElementById('idle-animation');
        if (idleElement) {
            idleElement.remove();
        }
    }
});