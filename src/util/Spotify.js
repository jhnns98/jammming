let clientId = '3d9d154962884d8fb22eb244782faf67';
let redirectURI = 'http://johannes_super_jammming.surge.sh';

let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatches = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpiresMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatches && tokenExpiresMatch) {
      accessToken = accessTokenMatches[1];
      const tokenExpires = Number(tokenExpiresMatch[1]);
      window.setTimeout(() => accessToken = '', tokenExpires * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const userRedirect = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = userRedirect;
    }
  },

  search(term) {
    let accessToken = this.getAccessToken();
    if (!accessToken) {
      console.log('No accessToken!');
      return;
    };

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => { return response.json()
    }).then(jsonResponse => {
        if (!jsonResponse.tracks) {
          return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });
  },

savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
}

export default Spotify;
