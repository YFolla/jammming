import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from './components/Playlist';
import Auth, { getAccessToken } from './components/Auth';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken());
    const [searchResults, setSearchResults] = useState([]);
    const [playlistName, setPlaylistName] = useState('New Playlist');
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLogin = useCallback((token) => {
        setIsAuthenticated(true);
    }, []);

    const addTrack = useCallback((track) => {
        if (playlistTracks.some(savedTrack => savedTrack.id === track.id)) return;
        setPlaylistTracks(prev => [...prev, track]);
    }, [playlistTracks]);

    const removeTrack = useCallback((track) => {
        setPlaylistTracks(prev => 
            prev.filter(savedTrack => savedTrack.id !== track.id)
        );
    }, []);

    const updatePlaylistName = useCallback((name) => {
        setPlaylistName(name);
    }, []);

    const savePlaylist = async () => {
        if (!playlistTracks.length) return;

        setIsSaving(true);
        try {
            const token = getAccessToken();
            
            // Get user ID
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userResponse.json();

            // Create playlist
            const createResponse = await fetch(
                `https://api.spotify.com/v1/users/${userData.id}/playlists`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: playlistName,
                        public: true
                    })
                }
            );
            const playlistData = await createResponse.json();

            // Add tracks to playlist
            await fetch(
                `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: playlistTracks.map(track => track.uri)
                    })
                }
            );

            // Reset playlist
            setPlaylistName('New Playlist');
            setPlaylistTracks([]);
        } catch (error) {
            console.error('Error saving playlist:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) {
        return <Auth onLogin={handleLogin} />;
    }

    return (
        <div className="App">
            <Header />
            <div className="App-content">
                <div className="App-search-section">
                    <SearchBar 
                        onSearch={setSearchResults}
                        isSearching={isSearching}
                        setIsSearching={setIsSearching}
                    />
                    <SearchResults 
                        searchResults={searchResults}
                        onAdd={addTrack}
                        isLoading={isSearching}
                    />
                </div>
                <div className="App-playlist-section">
                    <Playlist
                        playlistName={playlistName}
                        playlistTracks={playlistTracks}
                        onNameChange={updatePlaylistName}
                        onRemove={removeTrack}
                        onReorder={setPlaylistTracks}
                        onSave={savePlaylist}
                        isSaving={isSaving}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
