import { useMemo, useState, ReactNode } from 'react'
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from 'shared/lib/Theme/ThemeContext';

interface ThemeProviderProps {
    children?: ReactNode;
}

const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme || Theme.LIGHT;

export default function ThemeProvider ({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    const defaultProps = useMemo(() => ({
        theme,
        setTheme
    }), [theme]);

    return (
        <ThemeContext.Provider value={defaultProps}>
            {children}
        </ThemeContext.Provider>
    )
}
