import React from 'react';
import logo from './logo.svg';
import './App.css';
import { SearchBar } from './../SearchBar/searchBar.js';
import { SearchResults } from './../SearchResults/searchResults.js';
import { Playlist } from './../Playlist/playlist.js';
import Spotify from './../../util/Spotify.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
    playlistName: 'New Playlist',
    playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);

  }

  // search Spotify database for song, ablum or artist
  search(term) {
    Spotify.search(term).then(info => {
      this.setState({searchResults: info});
    });
  }

  // adding a song from the search results track list to the user’s custom playlist. The user can trigger the .addTrack() method by clicking the + sign from the search results list.
  addTrack(track) {
    let tracks = this.state.playlistTracks
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      tracks.push(track);
    }

    this.setState({ playlistTracks: tracks});
  }

  // removes a song from a user’s custom playlist when the user selects the - sign inside of a rendered track.
  removeTrack(track) {
    let tracks = this.state.playlistTracks
    tracks = tracks.filter(playlistTrack => playlistTrack.id !== track.id);

    this.setState({ playlistTracks: tracks});
  }

  // hange the name of their playlist, and save the updated value to the App component’s state
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  // save the custom playlist, push to Spotify and empty search results, custom playlist and refresh the name of the custom playlist
    savePlaylist() {

      let trackURIs = [];
      this.state.playlistTracks.forEach(playlistTrack => {
        trackURIs.push(playlistTrack.uri);
      });
      Spotify.savePlaylist(
        this.state.playlistName, trackURIs
      );
      this.setState({
        playlistTracks:[],
        playlistName: 'New Playlist',
        searchResults:[]
      });
    }


  render () {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
