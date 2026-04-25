import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, setAuthToken, clearAuthToken } from '../utils/apiClient';
import { AUTH_ENDPOINTS, PROFILE_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async (token) => {
        try {
            // FIX: Set token BEFORE calling the API so the headers are included
            setAuthToken(token); 
            const data = await apiClient.get(PROFILE_ENDPOINTS.get);
            setUser(data.user || data);
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            clearAuthToken();
            setUser(null);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchProfile(token).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [fetchProfile]);

    const login = async (email, password) => {
        setError(null);
        try {
            const data = await apiClient.post(AUTH_ENDPOINTS.login, { email, password });
            
            if (data.token) {
                setAuthToken(data.token);
                setUser(data.user);
                return { success: true, user: data.user };
            }
            
            if (data.requiresVerification) {
                return { needsVerification: true, userId: data.userId };
            }
            
            throw new Error(data.message || 'Login failed');
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        }
    };

    const signup = async (userData) => {
        setError(null);
        console.log('[AuthContext] signup called with:', userData);
        try {
            const data = await apiClient.post(AUTH_ENDPOINTS.signup, userData);
            console.log('[AuthContext] signup response:', data);
            
            if (data.success && data.otpSent) {
                // FIX: Added success: true so AuthModal knows to proceed to OTP mode
                return { success: true, needsVerification: true, userId: data.userId };
            }
            
            if (data.success) {
                return { success: true };
            }
            
            throw new Error(data.message || 'Signup failed');
        } catch (err) {
            console.error('[AuthContext] signup error:', err);
            setError(err.message || 'Signup failed');
            throw err;
        }
    };

    const verifyOtp = async (userId, otp) => {
        setError(null);
        try {
            const data = await apiClient.post(AUTH_ENDPOINTS.verifyOtp(userId), { otp });
            
            if (data.token) {
                setAuthToken(data.token);
                setUser(data.user);
                return { success: true, user: data.user };
            }
            
            throw new Error(data.message || 'Verification failed');
        } catch (err) {
            setError(err.message || 'Verification failed');
            throw err;
        }
    };

    const resendOtp = async (userId) => {
        setError(null);
        try {
            const data = await apiClient.get(AUTH_ENDPOINTS.resendOtp(userId));
            return { success: true, message: data.message };
        } catch (err) {
            setError(err.message || 'Failed to resend OTP');
            throw err;
        }
    };

    const logout = async () => {
        try {
            await apiClient.post(AUTH_ENDPOINTS.logout);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            clearAuthToken();
            setUser(null);
        }
    };

    const updateProfile = async (updates) => {
        setError(null);
        try {
            const data = await apiClient.put(PROFILE_ENDPOINTS.update, updates);
            setUser(data.user || data);
            return { success: true, user: data.user || data };
        } catch (err) {
            setError(err.message || 'Failed to update profile');
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        signup,
        verifyOtp,
        resendOtp,
        logout,
        updateProfile,
        isLoggedIn: !!user,
        isStreamer: user?.role === 'streamer',
        isBlogger: user?.role === 'blogger'
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
