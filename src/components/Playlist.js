import React from 'react';
import Tracklist from './Tracklist';
import './Playlist.css';

const Playlist = ({ 
    playlistName, 
    playlistTracks, 
    onNameChange, 
    onRemove, 
    onReorder,
    onSave,
    isSaving 
}) => {
    const handleNameChange = (e) => {
        onNameChange(e.target.value);
    };

    return (
        <div className="Playlist">
            <input
                className="Playlist-name"
                value={playlistName}
                onChange={handleNameChange}
                placeholder="New Playlist"
            />
            <Tracklist
                tracks={playlistTracks}
                onTrackAction={onRemove}
                actionIcon="-"
                isSearchResults={false}
                onReorder={onReorder}
            />
            <button 
                className={`Playlist-save ${isSaving ? 'saving' : ''}`}
                onClick={onSave}
                disabled={isSaving || playlistTracks.length === 0}
            >
                {isSaving ? 'SAVING...' : 'SAVE TO SPOTIFY'}
            </button>
        </div>
    );
};

export default Playlist;
