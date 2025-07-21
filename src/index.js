import './index.css';
import './i18n/config';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './global';
import { App as AntdApp, ConfigProvider } from 'antd'; // ✅ rename Ant Design App
import ThemeProvider from './components/providers/ThemeProvider';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import Website from './App'; // ✅ rename to avoid conflict with antd's App
import { BrowserRouter } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Montserrat, sans-serif',
          },
          components: {},
        }}
      >
        <AntdApp> {/* ✅ correct usage of Ant Design's App context */}
          <BrowserRouter>
            <ThemeProvider>
              <Website /> {/* ✅ your actual app entry */}
            </ThemeProvider>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
