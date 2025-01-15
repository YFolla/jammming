import React, { useState } from 'react';
import { getAccessToken, refreshToken } from './Auth';
import './SearchBar.css';

const SearchBar = ({ onSearch, isSearching, setIsSearching }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchSuggestions = async (query) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        try {
            const token = await getAccessToken();
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    await refreshToken();
                    return searchSuggestions(query);
                }
                throw new Error('Search failed');
            }

            const data = await response.json();
            setSuggestions(data.tracks.items);
        } catch (error) {
            console.error('Suggestion search error:', error);
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (track) => {
        setSearchTerm(track.name);
        setShowSuggestions(false);
        onSearch([track]);
    };

    const searchSpotify = async (query) => {
        setIsSearching(true);
        try {
            const token = await getAccessToken();
            
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    await refreshToken();
                    return searchSpotify(query);
                }
                throw new Error('Search failed');
            }

            const data = await response.json();
            onSearch(data.tracks.items);
        } catch (error) {
            console.error('Search error:', error);
            // You might want to handle this error in the UI
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchSpotify(searchTerm);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(true);
        if (value.trim()) {
            searchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleBlur = () => {
        // Delay hiding suggestions to allow for clicks
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <div className="SearchBar">
            <form onSubmit={handleSubmit}>
                <div className="SearchBar-input-container">
                    <input
                        type="text"
                        placeholder="Enter a song, album, or artist"
                        value={searchTerm}
                        onChange={handleChange}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={handleBlur}
                        className="SearchBar-input"
                        disabled={isSearching}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="SearchBar-suggestions">
                            {suggestions.map((track) => (
                                <div
                                    key={track.id}
                                    className="SearchBar-suggestion"
                                    onClick={() => handleSuggestionClick(track)}
                                >
                                    <img 
                                        src={track.album.images[2]?.url} 
                                        alt="" 
                                        className="suggestion-image"
                                    />
                                    <div className="suggestion-info">
                                        <div className="suggestion-name">{track.name}</div>
                                        <div className="suggestion-artist">
                                            {track.artists[0].name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button 
                    type="submit" 
                    className={`SearchBar-submit ${isSearching ? 'loading' : ''}`}
                    disabled={isSearching}
                >
                    {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
