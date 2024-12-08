
<p align="center">
<img src="https://i.imgur.com/aRPLSVk.png" width="150px">
</p>

# 🐍 PyBox: Browser-Based Python IDE

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/oct4pie/pybox.svg)](https://github.com/oct4pie/pybox/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/oct4pie/pybox.svg)](https://github.com/oct4pie/pybox/issues)
[![GitHub forks](https://img.shields.io/github/forks/oct4pie/pybox.svg)](https://github.com/oct4pie/pybox/network)

## 🌟 Overview

PyBox is an web-based Python development environment that enables users to write, run, and manage Python code directly in the browser. Using technologies like **Pyodide** and **Wasmer**, PyBox offers a seamless coding experience with robust file management, package installation, and experimental integrated terminal support.

## ✨ Features

### 🔧 Core Features
- **Python Editor**: Write and edit Python scripts with syntax highlighting and intelligent autocompletion
- **File Explorer**: Manage project files and directories with drag-and-drop support
- **Resizable Panels**: Customize your workspace layout with adjustable file explorer and output panels
- **Shortcuts**: Essential shortcuts like `Ctrl+R` to run code and `Ctrl+S` to save files
- **Theme Support**: Switch between light and dark modes for a comfortable coding environment

### 📦 Package Management
- **Package Installation**: Install Python packages using the built-in package manager
- **Manage Packages List**: View all installed packages directly within the IDE

### 🖥 Terminal Integration
- **Bash Terminal**: Access a functional Bash shell within the IDE for command-line operations
- **File System Access**: Navigate and manipulate project files through the terminal interface
- **Environment**: Use a Wasmer powered virtualized terminal for secure execution

### 🐍 Python REPL
- **Interactive Console**: Execute Python commands in real-time and view immediate results
- **History & Autocompletion**: Navigate through previous commands and utilize tab completion for faster coding
- **Filesystem**: Interaction with the virtual filesystem from the REPL is unified and synchronized with the editor

### 📊 Visualization Support
- **Matplotlib Integration**: Render and view plots and graphs generated by your Python scripts directly within the IDE
- **HTML5 Integration**: Display HTML graph, images, SVGs, and styled text in the visual container
- **Custom Visualization**: Possible to extend the visualization capabilities with custom rendering and display options

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **Yarn** or **npm**

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/oct4pie/pybox.git
   cd pybox
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```
   or
   ```bash
   npm install
   ```

3. **Launch Development Server**
   ```bash
   yarn dev
   ```
   or
   ```bash
   npm run dev
   ```

4. **Access PyBox**
   Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

## 📂 File Management

### Creating a New File
- Click the **Add File** button or use the keyboard shortcut `Ctrl + N` (Windows/Linux) or `Cmd + N` (macOS)
- Enter the file name and press **Enter**

### Renaming
- Click the rename icon next to the file tab or right-click the file in the File Explorer and select **Rename**
- Enter the new name and press **Enter**

### Deleting
- Click the delete icon next to the file tab or right-click the file in the File Explorer and select **Delete**

### Uploading Files and Directories
- Drag and drop files or directories into the File Explorer panel
- Alternatively, use the upload button in the File Explorer to select files from your system

### Exporting
- Click the **Export** button in the File Explorer to download your entire project as a ZIP archive

## ⌨️ Keyboard Shortcuts (under dev)

| Action                  | Shortcut                             |
|-------------------------|--------------------------------------|
| Run Code                | `Ctrl + R` (Windows/Linux) <br> `Cmd + R` (macOS) |
| Save File               | `Ctrl + S` (Windows/Linux) <br> `Cmd + S` (macOS) |
| New File                | `Ctrl + N` (Windows/Linux) <br> `Cmd + N` (macOS) |
| Toggle Bottom Panel     | `Ctrl + B` (Windows/Linux) <br> `Cmd + B` (macOS) |
| Open Package Manager    | `Ctrl + Shift + P` (Windows/Linux) <br> `Cmd + Shift + P` (macOS) |

## 🛠 Available Scripts

- **Development**
  ```bash
  yarn dev
  ```
  or
  ```bash
  npm run dev
  ```
  Runs the app in development mode with hot-reloading.

- **Production Build**
  ```bash
  yarn build
  ```
  or
  ```bash
  npm run build
  ```
  Builds the app for production to the `build` folder.

- **Preview Production Build**
  ```bash
  yarn preview
  ```
  or
  ```bash
  npm run preview
  ```
  Serves the production build locally for previewing.

- **Linting**
  ```bash
  yarn lint
  ```
  or
  ```bash
  npm run lint
  ```
  Runs ESLint to analyze code for potential errors and enforce coding standards.

## 📝 To-Do List

- [ ] Implement real-time collaboration features.
- [ ] Add support for additional programming languages.
- [ ] Enhance debugging tools and capabilities.
- [ ] Integrate version control systems like Git.
- [ ] Improve accessibility for users with disabilities.
- [ ] Expand package manager functionalities.

## 📄 License

PyBox is open-sourced under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/YourFeature
   ```
3. **Commit Your Changes**
   ```bash
   git commit -m "Add Your Feature"
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**

Please ensure your contributions adhere to the project's coding standards and include relevant tests.

## 🆘 Issues

If you encounter any issues or have questions, feel free to open an issue on [GitHub Issues](https://github.com/oct4pie/pybox/issues)

---