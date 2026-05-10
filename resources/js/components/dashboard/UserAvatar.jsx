import React from 'react';
import { DICEBEAR_BASE_URL } from '@/constants';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * UserAvatar Component
 *
 * Renders a user's avatar with support for uploaded photos and Dicebear fallbacks.
 * Ensures consistent aesthetic across the application.
 *
 * @param {Object} user - The user object from props.auth.user
 * @param {string} size - Tailwind classes for size (e.g., "h-10 w-10")
 * @param {string} className - Additional CSS classes
 */
export default function UserAvatar({
    user,
    size = 'h-10 w-10',
    className = '',
}) {
    const { isDark } = useTheme();
    const avatar = user?.avatar;
    const name = user?.name || 'Executive';

    // Determine the source URL
    // If it starts with / or http, assume it's a direct path/URL
    // Otherwise, treat it as a Dicebear style identifier
    const src =
        avatar?.startsWith('/') || avatar?.startsWith('http')
            ? avatar
            : `${DICEBEAR_BASE_URL}/${avatar || 'adventurer'}/svg?seed=${name}&backgroundColor=${isDark ? '111827' : 'F3F4F6'}`;

    return (
        <div
            className={`${size} overflow-hidden rounded-xl shadow-lg ring-2 ring-[var(--color-gold)]/30 ${className}`}
            style={{ boxShadow: '0 0 20px rgba(212,175,55,0.15)' }}
        >
            <img
                src={src}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
        </div>
    );
}
