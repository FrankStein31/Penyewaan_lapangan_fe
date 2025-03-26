import { AuthProvider } from '@/context/AuthContext'
import UserLayout from '@/layouts/UserLayout'
import themeConfig from '@/configs/themeConfig'
import ThemeComponent from '@/theme/ThemeComponent'

function MyApp({ Component, pageProps }) {
    return (
        <ThemeComponent settings={themeConfig}>
            <AuthProvider>
                <UserLayout>
                    <Component {...pageProps} />
                </UserLayout>
            </AuthProvider>
        </ThemeComponent>
    );
}

export default MyApp;