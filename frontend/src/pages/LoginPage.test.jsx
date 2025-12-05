import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock hooks
vi.mock('../hooks/useAuth', () => ({
    useAuth: () => ({
        login: vi.fn(),
    }),
}));

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: {
            language: 'en',
            changeLanguage: vi.fn(),
        },
    }),
}));

// Mock toast to avoid errors
vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('LoginPage', () => {
    it('renders login form correctly', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Check for title (using translation key)
        expect(screen.getByText('auth.welcomeBack')).toBeInTheDocument();

        // Check for inputs
        expect(screen.getByLabelText('auth.username')).toBeInTheDocument();
        expect(screen.getByLabelText('auth.password')).toBeInTheDocument();

        // Check for button
        expect(screen.getByRole('button', { name: 'auth.signIn' })).toBeInTheDocument();
    });

    it('updates input values on change', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const usernameInput = screen.getByLabelText('auth.username');
        const passwordInput = screen.getByLabelText('auth.password');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(usernameInput.value).toBe('testuser');
        expect(passwordInput.value).toBe('password123');
    });
});
