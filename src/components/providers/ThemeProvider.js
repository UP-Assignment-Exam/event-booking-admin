// components/ThemeProvider.jsx
import React, { useEffect, useState } from 'react';
import { App, ConfigProvider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getThemeConfig, generateCSSVariables } from '../../theme/themeConfig';
import { setDarkMode } from '../../global/slices/ThemeSlice';

const ThemeProvider = ({ children }) => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const [initialized, setInitialized] = useState(false);

    // First-time initialization: localStorage or system preference
    useEffect(() => {
        const saved = localStorage.getItem('userTheme');

        let preferDark = false;
        if (saved) {
            preferDark = saved === 'dark';
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            preferDark = true;
        }

        dispatch(setDarkMode(preferDark));
        setInitialized(true);
    }, [dispatch]);

    // Persist to localStorage when changed
    useEffect(() => {
        if (initialized) {
            localStorage.setItem('userTheme', isDarkMode ? 'dark' : 'light');
        }
    }, [isDarkMode, initialized]);

    // Inject CSS variables
    useEffect(() => {
        if (!initialized) return;

        const cssVars = generateCSSVariables(isDarkMode);
        const styleTagId = 'theme-css-variables';
        let styleTag = document.getElementById(styleTagId);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleTagId;
            document.head.appendChild(styleTag);
        }

        styleTag.innerHTML = cssVars;
    }, [isDarkMode, initialized]);

    const themeConfig = getThemeConfig(isDarkMode);

    if (!initialized) return children; // prevent flash of default theme

    return (
        <ConfigProvider theme={themeConfig}>
            {children}
        </ConfigProvider>
    );
};

export default ThemeProvider;
