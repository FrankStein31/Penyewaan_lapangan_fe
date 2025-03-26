import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        primary: {
        main: '#1976d2',
        },
    },
});

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
        </ThemeProvider>
    );
}

export default MyApp;