# LLove Bug Chat

LLove Bug Chat is a desktop application for macOS that provides a user-friendly interface for interacting with your local or remote Ollama instances. It allows you to easily connect to an Ollama server, select a model, and have conversations in a clean, modern chat interface.

## How It Works

The application is built using Electron.

-   **Main Process:** The main process, written in Node.js (`src/main.js`), is responsible for all interactions with the Ollama API. It handles creating the application window and all backend logic, such as connecting to the Ollama instance and sending/receiving messages. This ensures that Node.js-specific modules and sensitive operations are kept separate from the user interface.

-   **Renderer Process:** The user interface is a web page (`src/index.html` and `src/renderer.js`) that runs in a sandboxed renderer process. It is responsible for displaying the chat interface, handling user input, and communicating with the main process.

-   **Inter-Process Communication (IPC):** To maintain security and performance, the renderer process communicates with the main process using Electron's IPC mechanism. A preload script (`src/preload.js`) securely exposes specific functions from the main process to the renderer process via the `contextBridge`. This allows the UI to request actions (like sending a message) without having direct access to the `ollama` library or other Node.js modules.

## Features

-   **Connect to any Ollama Instance:** Simply enter the URL of your Ollama instance to connect.
-   **Model Selection:** Automatically populates a dropdown list with all available models from your Ollama instance.
-   **Real-time Chat Interface:** A clean and intuitive chat interface for conversing with your selected model.
-   **Modern UI:** A dark-themed, modern user interface with chat bubbles for a more engaging experience.
-   **Markdown Rendering:** Replies from the Ollama instance are rendered with Markdown, supporting headings, bold/italic text, and line breaks.
-   **Idle State Animation:** An animation is displayed while waiting for the model to reply, providing visual feedback.
-   **Dark Mode Toggle:** Easily switch between light and dark themes for a personalized experience.
-   **System Prompt Customization:** Configure and save multiple system prompts to guide the model's behavior.

## Getting Started

To run the application locally or contribute to its development, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ollama_query
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application in development mode:**
    ```bash
    npm start
    ```

4.  **Build the application for distribution:**
    ```bash
    npm run make
    ```
    This will create a distributable `.app` file in the `out` directory.

## Roadmap

This project is under active development. Here are some of the features planned for future releases:

-   [ ] **Conversation History:** Save and load previous conversations.
-   ] **Multiple Conversations:** Support for multiple, tabbed conversations simultaneously.
-   [ ] **Model Management:** Pull and delete models directly from within the application.
-   [x] **System Prompt Customization:** The ability to set a custom system prompt for the model.
-   [ ] **Streaming Responses:** Display responses from the model as they are generated, rather than waiting for the full response.
-   [ ] **Cross-Platform Support:** Build and release versions for Windows and Linux.
-   [x] **UI/UX Enhancements:** Further improvements to the user interface and experience, including loading indicators and error handling.