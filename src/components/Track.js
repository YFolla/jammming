import React from 'react';
import './Track.css';

const Track = ({ track, onAction, actionIcon }) => {
    const { name, artists, album } = track;
    
    return (
        <div className="Track">
            <div className="Track-information">
                <div className="Track-image">
                    <img 
                        src={album.images[2]?.url || '/default-album.png'} 
                        alt={album.name}
                    />
                </div>
                <div className="Track-details">
                    <h3 className="Track-name">{name}</h3>
                    <p className="Track-artist">
                        {artists[0].name}
                    </p>
                    <p className="Track-album">{album.name}</p>
                </div>
            </div>
            <button 
                className="Track-action"
                onClick={onAction}
                aria-label={actionIcon === '+' ? 'Add to playlist' : 'Remove from playlist'}
            >
                {actionIcon}
            </button>
        </div>
    );
};

export default Track;
