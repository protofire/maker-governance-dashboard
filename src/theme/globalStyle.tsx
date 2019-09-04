import { createGlobalStyle } from 'styled-components'
const GlobalStyle = createGlobalStyle`
    body {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        margin: 0;
        font-family: "Open Sans", BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        background-color: #fcfcfc;
    }
`
export default GlobalStyle
