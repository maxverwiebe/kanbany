<img width="817" alt="image" src="https://github.com/user-attachments/assets/d2e439ae-8161-4ce8-8c40-7e8e882d95b1" />

# Kanbany

Kanbany is a minimalist Trello clone and Kanban board application built with React and Next.js. Organize your tasks with an intuitive drag-and-drop interface and manage your board entirely in your browser thanks to local storage persistence.

## Features

- **Drag & Drop**
  - Easily move cards between columns with smooth drag-and-drop interactions.
- **Local Data Storage**
  - All board data is stored locally in your browser, ensuring your work is saved between sessions.
- **Label Management**
  - Assign and manage custom labels to classify your tasks.
- **Column Management**
  - Add, remove, and reorder columns to tailor your workflow.
- **Responsive Design**
  - Enjoy a clean, modern UI that adapts to your device.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/maxverwiebe/kanbany.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd kanbany
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see Kanbany in action!

## Usage

- **Editing Cards:** Click on any card to open a modal where you can update the task title, description, assign labels, and change its column.
- **Creating Cards:** Use the "+ Add" button within each column to quickly add new cards.
- **Managing Columns & Labels:** Access the dropdown menu in the header to open the column or label management modals.
- **Data Portability:** Export your board data to a JSON file and import it later to restore your board state or share it. But don't worry, your data is also being stored in your local storage automatically!

## Technologies Used

- **React & Next.js:** For building a dynamic, server-rendered web application.
- **Tailwind CSS:** For rapid UI development and responsive design.
- **Local Storage:** To maintain your board data across sessions.
- **React Context API:** For managing state across the application.

## Contributing

Contributions are **VERY** welcome! Feel free to fork the repository and submit pull requests with improvements or new features.

## License

This project is open source and available under the [MIT License](LICENSE).
