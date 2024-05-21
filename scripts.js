const app = Vue.createApp({
    el: '#app',
    data() {
        return {
            songName: 'Loading...',
            oldSongName: '',
            timestamp: '',
            albumName: '',
            artistName: '',
            username: 'devonbarks',
            picture: '',
            oldPicture: '',
            songLength: '',
            countSec: 0,
            countMin: 0,
            songCount: 0,
            songMin: 0,
            songSec: 0,
            military: true,
            api_key: "092d316884d8385f35ad8b84f5f42ef8",
            link: "",
        }
    },
    created() {
        this.nowPlaying();
        setInterval(() => {
          this.getNow();
        }, 1000),
        setInterval(() => {
            this.nowPlaying();
          }, 10000)
    },
    
    methods: {
        getNow: function() {
            const today = new Date();
            var minutes = (today.getMinutes()<10?'0':'') + today.getMinutes()
            var seconds = (today.getSeconds()<10?'0':'') + today.getSeconds()
            var hours = this.military ? today.getHours() : ((today.getHours() > 12) ? today.getHours()-12 : today.getHours())
            const time = hours + ":" + minutes + ":" + seconds;
            this.timestamp = time;

            if (this.songCount < (Number(this.songLength) / 1000) ) {
                this.songCount =  this.songCount + 1
                if (this.countSec < 59) {
                    this.countSec = this.countSec + 1
                } else {
                    this.countMin = this.countMin + 1
                    this.countSec = 0
                }
            } else {
                this.songCount = 0
                this.countSec = 0
                this.countMin = 0
            }
        },
        async nowPlaying() {
            const res = await fetch(`http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.username}&api_key=${this.api_key}&format=json&limit=1`)
            const results = await res.json()
            const track1 = results.recenttracks.track[0]
            if (track1["@attr"] !== undefined) {
                this.oldSongName = this.songName
                this.songName = track1.name
                this.albumName = track1.album.name
                this.artistName = `by ${track1.artist["#text"]}`
                this.oldPicture = this.picture
                this.picture = track1.image[3]["#text"]
                this.link = `song.php?track=${this.songName}&artist=${track1.artist["#text"]}&user=${this.username}`

                if (this.picture === "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png") {
                    this.picture = ""
                }

                if (this.oldPicture !== this.picture || this.oldSongName !== this.songName) { //new song
                    this.countSec = 0
                    this.countMin = 0
                    this.songCount = 0
                    this.link = `song.php?track=${this.songName}&artist=${track1.artist["#text"]}&user=${this.username}`
                    const res2 = await fetch(`http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${this.api_key}&artist=${results.recenttracks.track[0].artist["#text"]}&track=${this.songName}&format=json`)
                    const results2 = await res2.json()
                    if (results2.track.duration === '0' || results2.track.duration === undefined) {
                        this.songLength = '180000'
                        this.songMin = '3'
                        this.songSec = '25'
                    } else {
                        this.songLength = results2.track.duration
                        this.songMin = (Math.floor(Number(this.songLength) / 60000))
                        this.songSec = ((this.songLength - (this.songMin * 60000))/1000)
                    }
                }
            } else {
                this.songName = "Nothing playing"
                this.albumName = ''
                this.artistName = ''
                this.picture = ''
                this.songLength = '0'
            }
        }
    }
})

app.mount('#app')


document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.terminal .content p.typewriter'); // Target only <p> tags with class 'typewriter' within .terminal .content
    elements.forEach(el => {
        let text = el.textContent;
        el.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        typeWriter();
    });
});