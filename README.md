# Jammming - Spotify Playlist Creator

Jammming is a React web application that allows users to search for songs using the Spotify API and create custom playlists that can be saved directly to their Spotify account.

## Features

- **Spotify Authentication**: Secure user authentication with Spotify OAuth
- **Search Songs**: Search Spotify's vast library of tracks with real-time suggestions
- **Create Playlists**: Create and customize playlists with drag-and-drop functionality
- **Save to Spotify**: Save playlists directly to your Spotify account
- **Responsive Design**: Fully responsive interface that works on desktop and mobile devices

## Technologies Used

- React
- Spotify Web API
- CSS3 with Flexbox/Grid
- HTML5 Drag and Drop API
- Local Storage for session management

## Getting Started

### Prerequisites

- Node.js and npm installed
- Spotify account
- Spotify Developer account and registered application

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jammming.git
   ```

2. Install dependencies:
   ```bash
   cd jammming
   npm install
   ```

3. Configure Spotify API:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Set the redirect URI to `http://localhost:3001`
   - Copy your Client ID

4. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3001`

## Usage

1. Click "Login with Spotify" to authenticate
2. Search for songs using the search bar
3. Click "+" to add songs to your playlist
4. Customize your playlist:
   - Rename the playlist
   - Reorder tracks using drag and drop
   - Remove tracks using the "-" button
5. Click "SAVE TO SPOTIFY" to save your playlist

## Project Structure
