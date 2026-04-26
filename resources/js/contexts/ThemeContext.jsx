import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Default to dark mode
    const [isDark, setIsDark] = useState(true);
    
    // Setup initial class
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = (e) => {
        const isSwitchingToDark = !isDark;
        
        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition) {
            setIsDark(isSwitchingToDark);
            if (isSwitchingToDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return;
        }

        // Get click coordinates for the center of the wipe
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        // Start the View Transition
        document.documentElement.classList.add('theme-transitioning');
        
        const transition = document.startViewTransition(() => {
            setIsDark(isSwitchingToDark);
            if (isSwitchingToDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });

        // Animate the clip-path once the transition is ready
        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];

            document.documentElement.animate(
                {
                    clipPath: clipPath
                },
                {
                    duration: 600,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
            
            transition.finished.finally(() => {
                document.documentElement.classList.remove('theme-transitioning');
            });
        });
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
