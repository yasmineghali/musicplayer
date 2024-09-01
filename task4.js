const container = document.querySelector(".container"),
    musicImg = container.querySelector(".imag img"),
    musicName = container.querySelector(".song_det .name"),
    musicArt = container.querySelector(".song_det .artist"),
    mainAudio = container.querySelector("#main_aud"),
    playPauseBtn = container.querySelector(".play_pause i"),
    nextBtn = container.querySelector("#next"),
    prevBtn = container.querySelector("#prev"),
    prog = container.querySelector(".prog"),
    progBar = container.querySelector(".prog_bar"),
    musicList = container.querySelector(".music_list"),
    moreMusicBtn = container.querySelector("#more_music"),
    closeMusicBtn = container.querySelector("#close");

let musicIndex = 1;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
});

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArt.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}`;
    mainAudio.src = `Music/${allMusic[indexNumb - 1].src}.mp3`;
}

function playMusic() {
    container.classList.add("paused");
    playPauseBtn.classList.remove("fa-play");
    playPauseBtn.classList.add("fa-pause");
    mainAudio.play();
}

function pauseMusic() {
    container.classList.remove("paused");
    playPauseBtn.classList.remove("fa-pause");
    playPauseBtn.classList.add("fa-play");
    mainAudio.pause();
}

function nextMusic() {
    musicIndex++;
    if (musicIndex > allMusic.length) musicIndex = 1;
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
}

function prevMusic() {
    musicIndex--;
    if (musicIndex < 1) musicIndex = allMusic.length;
    loadMusic(musicIndex);
    playMusic();
    playingSong(); 
}

playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
    nextMusic();
});

prevBtn.addEventListener("click", () => {
    prevMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progWidth = (currentTime / duration) * 100;
    progBar.style.width = `${progWidth}%`;

    const currentTimeElement = container.querySelector(".current_time");
    const durationElement = container.querySelector(".max_time");

    currentTimeElement.innerText = formatTime(currentTime);
    if (!isNaN(duration)) {
        durationElement.innerText = formatTime(duration);
    }
});

progBar.parentElement.addEventListener("click", (e) => {
    const progressBarWidth = progBar.parentElement.clientWidth;
    const clickX = e.offsetX;
    const duration = mainAudio.duration;

    mainAudio.currentTime = (clickX / progressBarWidth) * duration;
});

moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

closeMusicBtn.addEventListener("click", () => {
    moreMusicBtn.click();
});

document.addEventListener("DOMContentLoaded", () => {
    const ulTag = document.querySelector(".music_list ul");

    for (let i = 0; i < allMusic.length; i++) {
        const music = allMusic[i];
        let liTag = `
            <li li-index="${i + 1}">
                <div class="row">
                    <img src="images/${music.img}" alt="${music.name}" class="album-art" />
                    <div class="music-info">
                        <span>${music.name}</span>
                        <p>${music.artist}</p>
                    </div>
                </div>
                <audio src="Music/${music.src}.mp3" id="${music.src}"></audio>
                <span class="audio_dur" id="duration_${music.src}">Loading...</span>
            </li>
        `;

        ulTag.insertAdjacentHTML("beforeend", liTag);

        let audioElement = ulTag.querySelector(`#${music.src}`);
        let durationElement = ulTag.querySelector(`#duration_${music.src}`);

        audioElement.addEventListener("loadeddata", () => {
            const duration = audioElement.duration;
            durationElement.innerText = formatTime(duration);
        });
    }

    const allLiTags = ulTag.querySelectorAll("li");

    function playingSong() {
        for (let j = 0; j < allLiTags.length; j++) {
            if (parseInt(allLiTags[j].getAttribute("li-index")) === musicIndex) {
                allLiTags[j].classList.add("playing");
            } else {
                allLiTags[j].classList.remove("playing");
            }
            allLiTags[j].addEventListener("click", function() {
                clicked(this);
            });
        }
    }

    function clicked(element) {
        let getLiIndex = parseInt(element.getAttribute("li-index"));
        musicIndex = getLiIndex;
        loadMusic(musicIndex);
        playMusic();
        playingSong(); // Update the UI after song selection
    }

    playingSong(); // Call it here to attach event listeners after loading the list
});

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}
