import {
    ColorScheme,
    ColorSchemeProvider,
    Global,
    MantineProvider,
} from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { DefaultLayout } from './sections';

export default function App() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: 'mantine-color-scheme',
        defaultValue: 'light',
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

    useHotkeys([['mod+J', () => toggleColorScheme()]]);

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{
                    colorScheme,
                    fontFamily: '"Roboto", "Montserrat"',
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <Global
                    styles={() => ({
                        '*, *::before, *::after': {
                            boxSizing: 'border-box',
                            // transition:
                            //     'all 250ms cubic-bezier(0.6, 0.05, 0.01, 0.99)',
                        },
                    })}
                />
                <Notifications limit={3} autoClose={3000} />
                <DefaultLayout />
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
