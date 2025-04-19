  <div align="center"><img width="350" alt="image" src="https://github.com/user-attachments/assets/d2e439ae-8161-4ce8-8c40-7e8e882d95b1" href="kanbany.vercel.app" /></div>

<p align="center">
  <a href="https://kanbany.vercel.app">
    <img src="https://img.shields.io/badge/demo-live-blue?logo=vercel" alt="Live Demo" />
  </a>
  <a href="https://github.com/maxverwiebe/kanbany/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/maxverwiebe/kanbany/ci.yml?branch=main&logo=github" alt="CI status" />
  </a>
  <a href="https://github.com/maxverwiebe/kanbany/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/maxverwiebe/kanbany" alt="MIT License" />
  </a>
  <a href="https://github.com/maxverwiebe/kanbany/stargazers">
    <img src="https://img.shields.io/github/stars/maxverwiebe/kanbany?style=social" alt="GitHub stars" />
  </a>
</p>

<details>
  <summary><strong>🚀 Table of Contents</strong></summary>

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)

</details>

## 🎯 About

Kanbany is a minimalist Trello-clone and Kanban board built with React and Next.js. Organize tasks via an intuitive drag-and-drop interface, with full state persistence using the browser's local storage.

## 📸 Screenshots

<img width="400" alt="image" src="https://github.com/user-attachments/assets/e143f261-6a84-4c2c-941d-ceaf6ec99f5b" />
<details>
  <summary>Card Editor</summary>
  
  ![Card Modal](https://github.com/user-attachments/assets/021e31a6-0743-4f02-809c-95ee96f4a9d3)
  
</details>

<details>
  <summary>Label Manager</summary>
  
  ![Label Manager](https://github.com/user-attachments/assets/e4a296e8-043d-4115-a96c-b280c8b4e4ac)
  
</details>

<details>
  <summary>Column Manager</summary>
  
  ![Column Manager](https://github.com/user-attachments/assets/e6f12ae9-bff2-4b07-9e5d-0aa2a6ace5a5)
  
</details>

<details>
  <summary>Menu</summary>
  
  ![Responsive View](https://github.com/user-attachments/assets/993c5126-bb57-466d-b1b7-f8171539ba53)
  </details>

## Features

- **Drag & Drop**: Smooth card movement between columns.
- **Persistent Storage**: Automatic saving to Local Storage.
- **Custom Labels**: Create, assign, and manage labels for tasks.
- **Column Management**: Add, remove, and reorder columns.
- **Dark Mode**: Switch between light and dark themes for comfortable viewing.
- **Card Checklists**: Break tasks into smaller steps and track progress.
- **Responsive Design**: Mobile-friendly and adapts to any screen size.
- **Data Import/Export**: Backup or transfer your board via JSON.

## 🔗 Demo

Try it live at [kanbany.vercel.app](https://kanbany.vercel.app).

## 🏗️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14+
- npm or Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/maxverwiebe/kanbany.git
cd kanbany

# Install dependencies
npm install  # or yarn install

# Start development server
npm run dev  # or yarn dev
```

Visit `http://localhost:3000` to view the app locally.

## 💡 Usage

- **Add Cards**: Click **+** in any column.
- **Edit Cards**: Click a card to open the editor modal, update details, labels, or move it.
- **Move via. Drag and Drop**: Easily move cards with Drag and Drop.
- **Manage Columns & Labels**: Access the menu icon in the header.
- **Export/Import Data**: Use the menu to download/upload JSON backups. But don't worry, your data is automatically saved to the LocalStorage of your Browser.

## 🛠️ Technologies

- **React** & **Next.js**
- **Tailwind CSS**
- **Local Storage** for persistence
- **React Context API** for global state
- **React Icons** for icons lol
- **marked** for Markdown integration in the description field

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "feat: Your feature"`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request
