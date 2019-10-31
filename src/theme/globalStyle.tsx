import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
    body {
        display: flex;
        flex-direction: column;
        margin: 0;
        min-height: 100vh;
        font-family: "Open Sans", BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        background-color: #fcfcfc;
    }
`

export default GlobalStyle

export const theme = {
  fonts: {
    fontFamily: `'Open Sans', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', sans-serif`,
    fontFamilyCode: `source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace`,
  },
  colors: {
    primary: '#00ba9c',
    secondary: '#e72e9d',
    submitted: '#1ca8f8',
    success: '#79d076',
    textCommon: '#444',
    textLight: '#999',
  },
  mainMenu: {
    active: '#000',
    color: '#666',
  },
  table: {
    tdColor: '#000',
    thColor: '#999',
  },
  cards: {
    backgroundColor: '#fff',
    border: 'solid 1px #f3f3f3',
    borderRadius: '3px',
    boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.03)',
    paddingHorizontal: '20px',
    paddingVertical: '15px',
    textColor: '#000',
    textColorSecondary: '#333',
    titleColor: '#000',
  },
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 1px 10px 0 rgba(0, 0, 0, 0.08)',
    color: '#000',
    height: '60px',
  },
  footer: {
    color: '#303b3e',
  },
  themeBreakPoints: {
    lg: '992px',
    md: '768px',
    sm: '480px',
    xl: '1024px',
    xs: '320px',
    xxl: '1280px',
    xxxl: '1366px',
  },
  borders: {
    borderColor: '#d9d9d9',
    commonBorderRadius: '5px',
  },
  separation: {
    blockBottomMargin: '25px',
    blockVerticalSeparation: '16px',
    gridSeparation: '20px',
  },
  paddings: {
    mainPadding: '15px',
  },
  textfield: {
    borderColor: '#d9d9d9',
    color: '#333',
    fontSize: '15px',
    fontWeight: '500',
    placeholderColor: '#666',
  },
  status: {
    error: '#954949',
    submitted: '#1576ad',
    success: '#4c904a',
  },
  taskStatus: {
    failed: '#d07676',
    submitted: '#1ca8f8',
    success: '#79d076',
  },
  modalStyle: {
    content: {
      backgroundColor: '#fff',
      borderColor: '#f3f3f3',
      borderRadius: '3px',
      bottom: 'auto',
      boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.03)',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: '0',
      height: 'auto',
      left: 'auto',
      maxHeight: '100%',
      maxWidth: '100%',
      minHeight: 'fit-content',
      overflow: 'hidden',
      padding: '15px 20px',
      position: 'relative',
      right: 'auto',
      top: 'auto',
      width: '1280px',
    },
    overlay: {
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.35)',
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto',
      padding: '10px',
      zIndex: '12345',
    },
  },
}
