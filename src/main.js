const { invoke } = window.__TAURI__.tauri;

/* let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});
 */


/* Create a cache object */
var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : '973bb76de3c689a06216411f7e21b57d',
  apiSecret : 'afcbf26fab3098359e564f05e679a19b',
  cache     : cache
});

var album = document.getElementById('album-input');
var artist = document.getElementById('artist-input');

var ntrack = 0;
var totalTracks = 0;
var average = 0;

document.getElementById('search-button').addEventListener('click', async (event) => { 
  event.preventDefault(); 
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
      ntrack = 0;
    }, 
    error: function(message){ 
      console.log(message); 
    } 
  }); 
}); 


document.getElementById('get-marks-button').addEventListener('click', async (event) => {
  event.preventDefault(); 
  var marks = [];
  for (var i = 1; i <= totalTracks; i++) {
    var markSlider = document.getElementById('mark-' + i);
    marks.push(parseInt(markSlider.value));
    console.log('Track ' + i + ' mark: ' + markSlider.value);
  }
  invoke('process_album_marks', { marks: marks }).then(function(avg) {
    average = avg;
    console.log('Average: ' + average);
  })
});

//[TODO] escribir en un archivo de texto, el promedio de las calificaciones de las canciones del album
// para eso igual mejor utilizar rust que soporta mejor archivos locales???
// considerar escribir en csv o json

