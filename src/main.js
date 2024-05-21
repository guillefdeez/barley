const { invoke } = window.__TAURI__.tauri;

/* Create a cache object */
// var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : '973bb76de3c689a06216411f7e21b57d',
  apiSecret : 'afcbf26fab3098359e564f05e679a19b',
  // cache     : cache
});


// Global variables

var album = document.getElementById('album-input');
var artist = document.getElementById('artist-input');

var ntrack = 0;
var totalTracks = 0;
var average = 0;

// Load album info

document.getElementById('search-button').addEventListener('click', async (event) => { 
  event.preventDefault(); // so it doesn't refresh the page
  lastfm.album.getInfo({artist: artist.value, album: album.value}, {
    success: function(data){
      var trackList = document.getElementById('track-list');
      trackList.innerHTML = ''; // Clear the track list
      data.album.tracks.track.forEach(function(track) {
        ntrack++;

        var newTrack = document.createElement('li');
        newTrack.textContent = track.name;

        var markSlider = document.createElement('input');
        markSlider.min = '0';
        markSlider.max = '10';
        markSlider.step = '1';
        markSlider.id = 'mark-' + ntrack;
        
        trackList.appendChild(newTrack);
        trackList.appendChild(markSlider);
      });
      totalTracks = ntrack;
      ntrack = 0; // Reset the track counter
      // create album cover object and load medium size album cover image
      var albumCover = document.getElementById('album-cover');
      albumCover.src = data.album.image[2]['#text'];
      console.log(data);
    }, 
    error: function(message){ 
      console.log(message); 
    } 
  }); 
}); 


document.getElementById('get-marks-button').addEventListener('click', async (event) => {
  event.preventDefault(); 
  var marks = []; // Array to store the marks
  for (var i = 1; i <= totalTracks; i++) {
    var markSlider = document.getElementById('mark-' + i);
    marks.push(parseInt(markSlider.value)); // Add the mark to the array
  }
  invoke('process_album_marks', {title: album.value, artist: artist.value, marks: marks }) // invoke rust function
})



