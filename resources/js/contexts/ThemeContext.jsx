import { createContext, useContext, useState, useEffect } from 'react';
import { themes, defaultTheme } from '@/config/themes';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Theme state: which theme is selected
    const [themeName, setThemeName] = useState(() => {
        return localStorage.getItem('theme') || defaultTheme;
    });

    // Light/Dark mode within the theme
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('themeMode');
        if (saved !== null) return saved === 'dark';
        // Default: if the theme is dark by default, set to dark, else light
        return themes[themeName]?.isDark ?? true;
    });

    // Apply theme CSS variables
    const applyTheme = (name, dark) => {
        const theme = themes[name];
        if (!theme) return;

        const colors = dark ? theme.colors : theme.lightColors;
        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Toggle dark class for Tailwind
        if (dark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        // Save to localStorage
        localStorage.setItem('theme', name);
        localStorage.setItem('themeMode', dark ? 'dark' : 'light');
    };

    // Apply theme on change
    useEffect(() => {
        applyTheme(themeName, isDark);
    }, [themeName, isDark]);

    // Initialize on mount
    useEffect(() => {
        applyTheme(themeName, isDark);
    }, []);

    const setTheme = (name) => {
        setThemeName(name);
        // When switching themes, if the new theme has lightMode, we keep current mode, else force dark
        if (!themes[name]?.lightMode && !themes[name]?.isDark) {
            setIsDark(false);
        }
    };

    const toggleTheme = (e) => {
        const isSwitchingToDark = !isDark;

        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            setIsDark(isSwitchingToDark);
            return;
        }

        // Get click coordinates for the center of the wipe
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y),
        );

        // Start the View Transition
        document.documentElement.classList.add('theme-transitioning');

        const transition = document.startViewTransition(() => {
            setIsDark(isSwitchingToDark);
        });

        // Animate the clip-path once the transition is ready
        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
                {
                    clipPath: clipPath,
                },
                {
                    duration: 600,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                },
            );

            transition.finished.finally(() => {
                document.documentElement.classList.remove(
                    'theme-transitioning',
                );
            });
        });
    };

    return (
        <ThemeContext.Provider
            value={{ themeName, setTheme, isDark, toggleTheme, themes }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
