import React, { useEffect } from 'react';
import './Auth.css';

const CLIENT_ID = 'e0c62a3bf89b4897a846285f2ecd4a21';
const REDIRECT_URI = 'http://localhost:3001';
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPES = [
    "playlist-modify-public",
    "playlist-modify-private",
    "playlist-read-private"
];

const Auth = ({ onLogin }) => {
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const token = hash
                .substring(1)
                .split("&")
                .find(elem => elem.startsWith("access_token"))
                ?.split("=")[1];

            if (token) {
                // Clear the URL hash
                window.history.pushState("", document.title, window.location.pathname);
                localStorage.setItem("spotify_access_token", token);
                onLogin(token);
            }
        }
    }, [onLogin]);

    const handleLogin = () => {
        const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES.join("%20")}&response_type=token&show_dialog=true`;
        window.location.href = authUrl;
    };

    return (
        <div className="Auth">
            <button className="Auth-login" onClick={handleLogin}>
                <div className="Auth-icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.241-3.021-1.85-6.82-2.27-11.3-1.24-.418.1-.842-.16-.94-.57-.101-.421.159-.84.579-.94 4.91-1.121 9.021-.67 12.439 1.439.39.241.5.721.27 1.07zm1.471-3.279c-.301.459-.921.6-1.381.3-3.459-2.13-8.731-2.76-12.821-1.51-.539.171-1.08-.13-1.25-.659-.17-.529.131-1.08.66-1.25 4.671-1.409 10.471-.72 14.461 1.74.448.28.6.91.29 1.37zm.129-3.36c-4.11-2.439-10.92-2.67-14.841-1.48-.629.189-1.289-.17-1.479-.79-.189-.621.17-1.289.79-1.479 4.509-1.369 12-.989 16.75 1.7.57.34.749 1.08.409 1.65-.341.57-1.079.75-1.649.41z"/>
                    </svg>
                </div>
                Login with Spotify
            </button>
        </div>
    );
};

// Utility functions for token management
export const getAccessToken = () => {
    return localStorage.getItem("spotify_access_token");
};

export const refreshToken = async () => {
    // Remove the expired token
    localStorage.removeItem("spotify_access_token");
    // Redirect to login
    window.location = window.location.pathname;
};

export default Auth;
