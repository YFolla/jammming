import React, { useState } from 'react';
import Track from './Track';
import './Tracklist.css';

const Tracklist = ({ 
    tracks, 
    onTrackAction, 
    actionIcon, 
    isSearchResults,
    onReorder 
}) => {
    const [sortKey, setSortKey] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const getSortedTracks = () => {
        if (!sortKey || isSearchResults) return tracks;

        return [...tracks].sort((a, b) => {
            switch (sortKey) {
                case 'title':
                    return a.name.localeCompare(b.name);
                case 'artist':
                    return a.artists[0].name.localeCompare(b.artists[0].name);
                default:
                    return 0;
            }
        });
    };

    const handleSort = (key) => {
        setSortKey(key === sortKey ? null : key);
    };

    const handleDragStart = (e, index) => {
        if (isSearchResults) return;
        setDraggedIndex(index);
        e.currentTarget.classList.add('dragging');
        // Set drag image and data
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (isSearchResults || draggedIndex === null) return;

        const items = Array.from(tracks);
        const [reorderedItem] = items.splice(draggedIndex, 1);
        items.splice(dropIndex, 0, reorderedItem);

        setDraggedIndex(null);
        e.currentTarget.classList.remove('dragging');
        onReorder(items);
    };

    const handleDragEnd = (e) => {
        setDraggedIndex(null);
        e.currentTarget.classList.remove('dragging');
    };

    if (!tracks || tracks.length === 0) {
        return (
            <div className="Tracklist-empty">
                {isSearchResults 
                    ? 'No tracks found'
                    : 'Add some tracks to your playlist'
                }
            </div>
        );
    }

    const sortedTracks = getSortedTracks();

    return (
        <div className="Tracklist">
            {!isSearchResults && (
                <div className="Tracklist-controls">
                    <button 
                        className={`sort-button ${sortKey === 'title' ? 'active' : ''}`}
                        onClick={() => handleSort('title')}
                    >
                        Sort by Title
                    </button>
                    <button 
                        className={`sort-button ${sortKey === 'artist' ? 'active' : ''}`}
                        onClick={() => handleSort('artist')}
                    >
                        Sort by Artist
                    </button>
                </div>
            )}
            
            <div className="Tracklist-tracks">
                {sortedTracks.map((track, index) => (
                    <div
                        key={track.id}
                        className="track-wrapper"
                        draggable={!isSearchResults}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                    >
                        <Track
                            track={track}
                            onAction={() => onTrackAction(track)}
                            actionIcon={actionIcon}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracklist;
