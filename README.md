# 🔧 IronClad Hardware · Billing System

IronClad is a modern, high-performance Point of Sale (POS) and Billing application designed specifically for hardware retail stores. Built with a stunning "glassmorphism" UI, it provides a premium experience for managing sales, inventory, and customers.



## ✨ Features

* **Glassmorphism UI:** A sleek, dark-themed interface with real-time blur effects and gold accents.
* **Dual Entry Modes:** Browse products via the visual **Catalog** or use **SKU/Barcode** entry for rapid billing.
* **Smart Cart Management:** Real-time calculation of totals, taxes, and change during the checkout process.
* **Customer Directory:** Save and manage customer profiles (Retail vs. Trade) with instant search.
* **Thermal Receipt Ready:** Specialized CSS media queries optimized for **58mm thermal printers**.
* **PWA Enabled:** Fully installable as a standalone app on Windows, Android, and iOS via the `manifest.json`.
* **Data Persistence:** Uses browser `LocalStorage` to ensure your inventory and history stay on your device.

## 🚀 Getting Started

### 1. Prerequisites
You only need a modern web browser (Chrome, Edge, or Safari). No complex server setup is required for basic use.

### 2. Installation & Setup
1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/JoshuaGashan/Hardware-Billing-System.git](https://github.com/JoshuaGashan/Hardware-Billing-System.git)
    ```
2.  **Open in VS Code:** Open the folder and ensure you have the **Live Server** extension installed.
3.  **Go Live:** Click the "Go Live" button in the bottom right corner of VS Code to launch the app.

### 3. File Structure
* `index.html` - The core HTML5 structure and UI components.
* `style.css` - Custom CSS3 with glassmorphism effects and print layouts.
* `script.js` - JavaScript business logic, cart functions, and inventory tracking.
* `manifest.json` - Progressive Web App (PWA) configuration for installation.



## 🛠 Usage

1.  **Inventory Setup:** Open `script.js` to modify the initial `inv` array with your actual hardware products.
2.  **Making a Sale:**
    * Search or click products to add to the cart.
    * Enter the customer name/phone if required.
    * Click **Process Payment**.
3.  **Printing:** After a sale, click the print icon. The system will automatically format the bill for a thermal receipt printer.
4.  **Install as App:** Open your live URL in Chrome and click the "Install" icon in the address bar to use it as a desktop app.

## 💾 Data Management (PC & Server)

* **Local Use:** The app runs on your PC's CPU. Data is saved to your hard drive via the browser's `LocalStorage`.
* **Server Use:** This project is ready to be hosted on **GitHub Pages** or **Netlify** for access from any device in your shop.
* **Backup:** It is recommended to periodically export your `LocalStorage` or sync with a cloud database like Firebase for multi-device synchronization.

## 📤 How to Push Changes to GitHub

Whenever you make changes to your code in VS Code (like adding new products or changing styles), use these commands in your terminal to update your live website:

1.  **Stage your changes:**
    ```bash
    git add .
    ```
2.  **Commit the update:**
    ```bash
    git commit -m "Describe what you changed (e.g., Updated price list)"
    ```
3.  **Push to the cloud:**
    ```bash
    git push origin main
    ```



## 📄 License
This project is open-source and available under the **MIT License**.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
*Developed for hardware professionals who value speed and design.*
