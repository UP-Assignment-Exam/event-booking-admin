# 📊 Event Booking Admin

A simple and modular **React** frontend for the Event Booking platform.

## 🔧 Requirements

- **Node.js** v20.18.3
- A running **backend** server (`http://localhost:8098/web`)
- Internet connection (for fonts or external APIs)

## 📁 Folder Structure

```
.
├── public/                     # Static public assets
└── src/
    ├── assets/
    │   ├── fonts/              # Custom fonts
    │   ├── icons/              # Icon sets
    │   └── images/             # Images used in UI
    ├── constants/              # Application-wide constants
    ├── global/                 # Global styles, themes, variables
    ├── i18n/                   # Internationalization setup
    ├── middlewares/           # Axios interceptors or request handlers
    ├── pages/                 # Main page components and routes
    └── utils/                 # Reusable utility functions
```

## ⚙️ Example `.env` File

Create a `.env` file in the root of the project and add:

```
REACT_APP_API_ENDPOINT=http://localhost:8098/web
REACT_APP_API_TOKEN=JXkWxYaqpvV90S-Z@sIoJxQyxS-ESI
```

> **Note**: Ensure the backend server is running and accessible at the `REACT_APP_API_ENDPOINT`.

## 💼 Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/your-username/event-booking-admin.git
cd event-booking-admin
npm install -f
```

## 🚀 Start the Application

```bash
npm start
```

The application will be available at:  
**http://localhost:3000**

## 🌐 Internationalization

This project supports multi-language translation using `react-i18next`. Translation files are located in the `src/i18n` directory.

## 📦 Build for Production

```bash
npm run build
```

The optimized static files will be generated in the `build/` directory.

---

### 📝 Notes

- Make sure the backend is up and running.
- API requests will use the `REACT_APP_API_ENDPOINT` and include the `REACT_APP_API_TOKEN` if required.
- Font files must be licensed appropriately if custom fonts are used.
- Axios interceptors and other HTTP middleware can be managed in the `src/middlewares` directory.
