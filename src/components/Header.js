import React, { useState, useEffect } from 'react';
import { getAccessToken, refreshToken } from './Auth';
import './Header.css';

const Header = ({ onLogout }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = getAccessToken();
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        await refreshToken();
                        return;
                    }
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('spotify_access_token');
        if (onLogout) {
            onLogout();
        }
        window.location.reload();
    };

    return (
        <header className="Header">
            <div className="Header-content">
                <div className="Header-left">
                    <h1>Jammming</h1>
                </div>
                <div className="Header-right">
                    {!isLoading && user && (
                        <div className="Header-user">
                            {user.images?.[0]?.url && (
                                <img 
                                    src={user.images[0].url} 
                                    alt={user.display_name}
                                    className="Header-user-image"
                                />
                            )}
                            <span className="Header-username">
                                {user.display_name}
                            </span>
                            <button 
                                className="Header-logout"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
