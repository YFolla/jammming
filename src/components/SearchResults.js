import React from 'react';
import Tracklist from './Tracklist';
import Loader from './Loader';
import './SearchResults.css';

const SearchResults = ({ searchResults, onAdd, isLoading }) => {
    return (
        <div className="SearchResults">
            <h2 className="SearchResults-title">Search Results</h2>
            {isLoading ? (
                <div className="SearchResults-loading">
                    <Loader />
                </div>
            ) : searchResults.length === 0 ? (
                <p className="SearchResults-empty">
                    Search for songs to add to your playlist
                </p>
            ) : (
                <Tracklist 
                    tracks={searchResults}
                    onTrackAction={onAdd}
                    actionIcon="+"
                    isSearchResults={true}
                />
            )}
        </div>
    );
};

export default SearchResults;
