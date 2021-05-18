// variables
const player = document.querySelector('.player')
        toggleSongList = document.querySelector('.player .toggle-list')
        list = document.querySelector('.player .player-list .list')
        playerList = document.querySelector('.player-list')


const main = {
    audio: document.querySelector('.player .main audio'),
    thumbnail: document.querySelector('.player .main img'),
    seekbar: document.querySelector('.player .main input'),
    songName: document.querySelector('.details h2'),
    artistName: document.querySelector('.details p'),
    prevControl: document.querySelector('.player .main .controls .prev-control'),
    playPauseControl: document.querySelector('.player .main .controls .play-pause-control'),
    nextControl: document.querySelector('.player .main .controls .next-control'),
    volume : document.querySelector('.volume-value'),
    shuffle : document.querySelector('.shuffle')
}
// eventListener
function eventListener() {
    toggleSongList.addEventListener('click', toggle)
    main.prevControl.addEventListener('click',prevMusic)
    main.nextControl.addEventListener('click',nextMusic)
    main.playPauseControl.addEventListener('click',playPauseMusic)
    main.seekbar.addEventListener('change',seekBar)
    main.volume.addEventListener('change',volume)
    playerList.addEventListener('wheel',handleScroll)
    main.shuffle.addEventListener('click',shuffle)

}

eventListener()
// functions


// scrolling in player list show overflow
function handleScroll(){
    playerList.style.overflowY = 'scroll'
    toggleSongList.addEventListener('click',(e)=>{
        if(e.target.classList.contains('toggle-list') || e.target.classList.contains('fa-angle-up')){
            playerList.style.overflowY = 'hidden'
        }
    })


}
// music menu ,toggling class
function toggle() {
    player.classList.toggle('activeSongList')
}
// create element and add to menu toggling
list.innerHTML = songList.map((song,songIndex) => {
    return `
        <div class="item" songIndex="${songIndex}">
            <div class="thumbnail">
                 <img src="${song.thumbnail}" alt="">
             </div>
             <div class="details">
               <h2>${song.songName}</h2>
               <p>${song.artistName}</p>
             </div>
         </div>
    `
}).join('');
// get songs
const songListItems = document.querySelectorAll('.player .player-list .list .item')
let currentSongIndex = 0;
for (let i=0;i<songListItems.length;i++){
    songListItems[i].addEventListener('click',function (){
        console.log(songListItems[i].getAttribute('songIndex'))
        currentSongIndex = songListItems[i].getAttribute('songIndex')
        loadSong(currentSongIndex)
        player.classList.remove('activeSongList')
    });
}
// load song
function loadSong(songIndex){
    songList = songList.sort()
    console.log(songList)
    const song = songList[songIndex]
    main.thumbnail.setAttribute('src',song.thumbnail)
    document.querySelector('.cover').style.backgroundImage = `url(${song.thumbnail})`
    main.songName.innerText = song.songName
    main.artistName.innerText = song.artistName
    main.audio.setAttribute('src','./public/'+song.audio)
    main.seekbar.setAttribute('value','0')
    main.seekbar.setAttribute('min','0')
    main.seekbar.setAttribute('max','0')
    main.audio.addEventListener('canplay',function (){
        main.audio.play();
        if(!main.audio.paused){
            main.playPauseControl.classList.remove('paused')
        }
        main.seekbar.setAttribute('max',parseInt(main.audio.duration))
        main.audio.onended = (()=> main.nextControl.click())


    })
}
setInterval(()=>{
    // console.log(`value: ${main.seekbar.value} `)
    // console.log(`current: ${main.audio.currentTime}`)
    main.seekbar.value = parseInt(main.audio.currentTime)
},1000)
// prevent music
function prevMusic(){
    currentSongIndex--;
    if (currentSongIndex < 0){
        currentSongIndex += songList.length
    }
    loadSong(currentSongIndex)
}
// next music
function nextMusic(){
    currentSongIndex = (currentSongIndex+1) % songList.length
    loadSong(currentSongIndex)
}
// play and pause
function playPauseMusic(){
    if (main.audio.paused){
        main.playPauseControl.classList.remove('paused')
        main.audio.play()
    }else {
        main.playPauseControl.classList.add('paused')
        main.audio.pause()
    }
}
// change value seekbar
function seekBar(){
    main.audio.currentTime = main.seekbar.value
}
// change volume
function volume(e){
    main.audio.volume = e.target.value /10

}
// // shuffle music

function shuffle() {
    // toggling class
    main.shuffle.classList.toggle('add-shuffle')
    document.querySelector('.fa-random').classList.toggle('add-shuffle')
    // if is shuffled
    if(!songList.isShuffled){
        console.log('isShuffle')

        songList.isShuffled = true;

        songList.unshuffled = songList.slice(0);
        let m = songList.length, t, i;


        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * m--);

            // And swap it with the current element.
            t = songList[m];
            songList[m] = songList[i];
            songList[i] = t;


        }

        return songList;
    }
    // if is  unShuffle
    else{
        console.log('unshuffling');
        songList.isShuffled = false;
        songList = songList.unshuffled.sort()
        console.log(songList)
        return songList;
    }
}
// load song
loadSong(currentSongIndex)
