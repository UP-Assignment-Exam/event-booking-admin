// themeConfig.js
import { theme } from 'antd';

// Your brand colors
const brandColors = {
  primary: '#667eea',
  primaryHover: '#5a67d8',
  primaryActive: '#4c51bf',
  secondary: '#764ba2',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff'
};

// Light theme configuration
export const lightTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Brand Colors
    colorPrimary: brandColors.primary,
    colorPrimaryHover: brandColors.primaryHover,
    colorPrimaryActive: brandColors.primaryActive,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    colorInfo: brandColors.info,

    // Background Colors
    colorBgContainer: 'rgba(255, 255, 255, 0.95)',
    colorBgElevated: 'rgba(255, 255, 255, 0.98)',
    colorBgLayout: 'transparent',
    colorBgSpotlight: 'rgba(255, 255, 255, 0.9)',
    colorBgMask: 'rgba(0, 0, 0, 0.45)',

    // Text Colors
    colorText: '#2c3e50',
    colorTextSecondary: '#64748b',
    colorTextTertiary: '#94a3b8',
    colorTextQuaternary: '#cbd5e1',

    // Border Colors
    colorBorder: 'rgba(255, 255, 255, 0.2)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',

    // Typography
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // Layout
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.15)',
    boxShadowTertiary: '0 8px 32px rgba(0, 0, 0, 0.1)',

    // Motion
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Layout: {
      bodyBg: 'transparent',
      headerBg: 'rgba(255, 255, 255, 0.95)',
      siderBg: 'rgba(255, 255, 255, 0.95)',
      triggerBg: brandColors.primary,
      triggerColor: '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: '#2c3e50',
      itemHoverBg: 'rgba(102, 126, 234, 0.1)',
      itemHoverColor: brandColors.primary,
      itemSelectedBg: brandColors.gradient,
      itemSelectedColor: '#ffffff',
      subMenuItemBg: 'rgba(102, 126, 234, 0.05)',
      groupTitleColor: brandColors.primary,
    },
    Button: {
      primaryColor: '#ffffff',
      primaryBg: brandColors.primary,
      primaryHoverBg: brandColors.primaryHover,
      primaryActiveBg: brandColors.primaryActive,
      defaultBg: 'rgba(102, 126, 234, 0.1)',
      defaultColor: brandColors.primary,
      defaultBorderColor: 'rgba(102, 126, 234, 0.3)',
      defaultHoverBg: 'rgba(102, 126, 234, 0.2)',
      defaultHoverColor: brandColors.primaryHover,
      defaultHoverBorderColor: brandColors.primary,
      dangerColor: '#ffffff',
      dangerBg: brandColors.error,
    },
    Card: {
      colorBgContainer: 'rgba(255, 255, 255, 0.9)',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.2)',
      headerBg: 'rgba(255, 255, 255, 0.95)',
      colorTextHeading: brandColors.primary,
    },
    Table: {
      colorBgContainer: 'rgba(255, 255, 255, 0.9)',
      headerBg: 'rgba(102, 126, 234, 0.05)',
      headerColor: brandColors.primary,
      rowHoverBg: 'rgba(102, 126, 234, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    Modal: {
      headerBg: 'rgba(255, 255, 255, 0.98)',
      contentBg: 'rgba(255, 255, 255, 0.95)',
      titleColor: brandColors.primary,
    },
    Form: {
      labelColor: '#2c3e50',
      verticalLabelPadding: '0 0 8px',
    },
    Input: {
      colorBgContainer: 'rgba(255, 255, 255, 0.8)',
      colorBorder: 'rgba(102, 126, 234, 0.2)',
      colorBorderHover: brandColors.primary,
      colorBorderFocus: brandColors.primary,
      controlOutline: 'rgba(102, 126, 234, 0.2)',
    },
    Select: {
      colorBgContainer: 'rgba(255, 255, 255, 0.8)',
      colorBgElevated: 'rgba(255, 255, 255, 0.95)',
      colorBorder: 'rgba(102, 126, 234, 0.2)',
      colorBorderHover: brandColors.primary,
      optionSelectedBg: 'rgba(102, 126, 234, 0.1)',
      optionSelectedColor: brandColors.primary,
    },
    Tabs: {
      cardBg: 'rgba(255, 255, 255, 0.9)',
      itemColor: '#64748b',
      itemSelectedColor: brandColors.primary,
      itemHoverColor: brandColors.primaryHover,
      inkBarColor: brandColors.primary,
    },
    Badge: {
      colorPrimary: brandColors.primary,
      colorBgContainer: brandColors.primary,
    },
    Switch: {
      colorPrimary: brandColors.primary,
      colorPrimaryHover: brandColors.primaryHover,
    },
    Tag: {
      defaultBg: 'rgba(102, 126, 234, 0.1)',
      defaultColor: brandColors.primary,
    },
    Tooltip: {
      colorBgSpotlight: 'rgba(0, 0, 0, 0.85)',
      colorTextLightSolid: '#ffffff',
    },
    Divider: {
      colorSplit: 'rgba(102, 126, 234, 0.2)',
    },
    Drawer: {
      colorBgElevated: 'rgba(255, 255, 255, 0.95)',
      colorBgMask: 'rgba(0, 0, 0, 0.45)',
    },
    Checkbox: {
      colorPrimary: brandColors.primary,
      colorPrimaryHover: brandColors.primaryHover,
      colorBgContainer: 'rgba(255, 255, 255, 0.8)',
      colorBorder: 'rgb(217, 217, 217)', // default
      controlInteractiveSize: 16,
      lineWidth: 1,
      lineType: 'solid',
      colorError: brandColors.error, // used by status="error"
    }
  }
};

// Dark theme configuration
export const darkTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Brand Colors (same as light)
    colorPrimary: brandColors.primary,
    colorPrimaryHover: brandColors.primaryHover,
    colorPrimaryActive: brandColors.primaryActive,
    colorSuccess: brandColors.success,
    colorWarning: brandColors.warning,
    colorError: brandColors.error,
    colorInfo: brandColors.info,

    // Background Colors
    colorBgContainer: 'rgba(30, 30, 45, 0.95)',
    colorBgElevated: 'rgba(30, 30, 45, 0.98)',
    colorBgLayout: 'transparent',
    colorBgSpotlight: 'rgba(30, 30, 45, 0.9)',
    colorBgMask: 'rgba(0, 0, 0, 0.65)',

    // Text Colors
    colorText: '#ffffff',
    colorTextSecondary: '#a0a0a0',
    colorTextTertiary: '#8a8a8a',
    colorTextQuaternary: '#666666',

    // Border Colors
    colorBorder: 'rgba(102, 126, 234, 0.3)',
    colorBorderSecondary: 'rgba(102, 126, 234, 0.2)',

    // Typography (same as light)
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // Layout
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.4)',
    boxShadowTertiary: '0 8px 32px rgba(0, 0, 0, 0.2)',

    // Motion (same as light)
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Layout: {
      bodyBg: 'transparent',
      headerBg: 'rgba(30, 30, 45, 0.95)',
      siderBg: 'rgba(30, 30, 45, 0.95)',
      triggerBg: brandColors.primary,
      triggerColor: '#ffffff',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: '#ffffff',
      itemHoverBg: 'rgba(102, 126, 234, 0.15)',
      itemHoverColor: brandColors.primary,
      itemSelectedBg: brandColors.gradient,
      itemSelectedColor: '#ffffff',
      subMenuItemBg: 'rgba(102, 126, 234, 0.1)',
      groupTitleColor: brandColors.primary,
    },
    Button: {
      primaryColor: '#ffffff',
      primaryBg: brandColors.primary,
      primaryHoverBg: brandColors.primaryHover,
      primaryActiveBg: brandColors.primaryActive,
      defaultBg: 'rgba(102, 126, 234, 0.15)',
      defaultColor: brandColors.primary,
      defaultBorderColor: 'rgba(102, 126, 234, 0.4)',
      defaultHoverBg: 'rgba(102, 126, 234, 0.25)',
      defaultHoverColor: brandColors.primaryHover,
      defaultHoverBorderColor: brandColors.primary,
      dangerColor: '#ffffff',
      dangerBg: brandColors.error,
    },
    Card: {
      colorBgContainer: 'rgba(30, 30, 45, 0.9)',
      colorBorderSecondary: 'rgba(102, 126, 234, 0.3)',
      headerBg: 'rgba(30, 30, 45, 0.95)',
      colorTextHeading: brandColors.primary,
    },
    Table: {
      colorBgContainer: 'rgba(30, 30, 45, 0.9)',
      headerBg: 'rgba(102, 126, 234, 0.1)',
      headerColor: brandColors.primary,
      rowHoverBg: 'rgba(102, 126, 234, 0.08)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
    },
    Modal: {
      headerBg: 'rgba(30, 30, 45, 0.98)',
      contentBg: 'rgba(30, 30, 45, 0.95)',
      titleColor: brandColors.primary,
    },
    Form: {
      labelColor: '#ffffff',
      verticalLabelPadding: '0 0 8px',
    },
    Input: {
      colorBgContainer: 'rgba(30, 30, 45, 0.8)',
      colorBorder: 'rgba(102, 126, 234, 0.3)',
      colorBorderHover: brandColors.primary,
      colorBorderFocus: brandColors.primary,
      controlOutline: 'rgba(102, 126, 234, 0.3)',
      colorText: '#ffffff',
      colorTextPlaceholder: '#8a8a8a',
    },
    Select: {
      colorBgContainer: 'rgba(30, 30, 45, 0.8)',
      colorBgElevated: 'rgba(30, 30, 45, 0.95)',
      colorBorder: 'rgba(102, 126, 234, 0.3)',
      colorBorderHover: brandColors.primary,
      optionSelectedBg: 'rgba(102, 126, 234, 0.2)',
      optionSelectedColor: brandColors.primary,
      colorText: '#ffffff',
    },
    Tabs: {
      cardBg: 'rgba(30, 30, 45, 0.9)',
      itemColor: '#a0a0a0',
      itemSelectedColor: brandColors.primary,
      itemHoverColor: brandColors.primaryHover,
      inkBarColor: brandColors.primary,
    },
    Badge: {
      colorPrimary: brandColors.primary,
      colorBgContainer: brandColors.primary,
    },
    Switch: {
      colorPrimary: brandColors.primary,
      colorPrimaryHover: brandColors.primaryHover,
    },
    Tag: {
      defaultBg: 'rgba(102, 126, 234, 0.2)',
      defaultColor: brandColors.primary,
    },
    Tooltip: {
      colorBgSpotlight: 'rgba(30, 30, 45, 0.95)',
      colorTextLightSolid: '#ffffff',
    },
    Divider: {
      colorSplit: 'rgba(102, 126, 234, 0.3)',
    },
    Drawer: {
      colorBgElevated: 'rgba(30, 30, 45, 0.95)',
      colorBgMask: 'rgba(0, 0, 0, 0.65)',
    },
    Dropdown: {
      colorBgElevated: 'rgba(30, 30, 45, 0.95)',
      controlItemBgHover: 'rgba(102, 126, 234, 0.1)',
      controlItemBgActive: 'rgba(102, 126, 234, 0.15)',
    },
    Checkbox: {
      colorPrimary: brandColors.primary,
      colorPrimaryHover: brandColors.primaryHover,
      colorBgContainer: 'rgba(30, 30, 45, 0.8)',
      colorBorder: 'rgba(102, 126, 234, 0.3)',
      controlInteractiveSize: 16,
      lineWidth: 1,
      lineType: 'solid',
      colorError: brandColors.error,
    },
  }
};

// Theme provider utility
export const getThemeConfig = (isDarkMode) => {
  return isDarkMode ? darkTheme : lightTheme;
};

// CSS custom properties for additional styling
export const generateCSSVariables = (isDarkMode) => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return `
    :root {
    --primary
      --primary-color: ${theme.token.colorPrimary};
      --primary-hover: ${theme.token.colorPrimaryHover};
      --primary-active: ${theme.token.colorPrimaryActive};
      --bg-container: ${theme.token.colorBgContainer};
      --bg-elevated: ${theme.token.colorBgElevated};
      --text-color: ${theme.token.colorText};
      --text-secondary: ${theme.token.colorTextSecondary};
      --border-color: ${theme.token.colorBorder};
      --brand-gradient: ${brandColors.gradient};
      --border-radius: ${theme.token.borderRadius}px;
      --border-radius-lg: ${theme.token.borderRadiusLG}px;
      --box-shadow: ${theme.token.boxShadow};
    }
  `;
};