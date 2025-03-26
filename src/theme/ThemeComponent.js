import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeComponent = props => {
    const { settings, children } = props

    const theme = createTheme({
        palette: {
        mode: settings.mode,
        primary: {
            main: settings.primaryColor
        }
        },
        components: {
        MuiAppBar: {
            defaultProps: {
            elevation: 0
            }
        }
        }
    })

    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        </ThemeProvider>
    )
}

export default ThemeComponent 