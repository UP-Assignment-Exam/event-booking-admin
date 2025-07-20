import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from './global';
import './i18n/config'
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeProvider from './components/providers/ThemeProvider';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Montserrat, sans-serif",
          },
          components: {},
        }}
      >
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
