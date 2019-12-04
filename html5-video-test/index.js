const videoPlayer = document.getElementById('video-player')
const videoPlayerContainer = document.getElementById('video-player-wrapper')
const playPause = document.getElementById('play-pause')
const playPauseImage = playPause.querySelector('i')
const fsBtn = document.getElementById('fs-btn')
const fullScreenImage = fsBtn.querySelector('i')
const muteBtn = document.getElementById('mute')
const muteBtnImage = muteBtn.querySelector('i')
const volumeBar = document.getElementById('volume-bar')
const seekBar = document.getElementById('seek-bar')
const timeLabelStart = document.getElementById('time-label-start')
const timeLabelEnd = document.getElementById('time-label-end')

const ONE_MINUTE = 60
const ONE_HOUR = ONE_MINUTE * ONE_MINUTE

videoPlayer.controls = false

playPause.addEventListener('click', playManager)
fsBtn.addEventListener('click', fullScreenManager)
muteBtn.addEventListener('click', muteManager)
volumeBar.addEventListener('click', volumeBarOnClick)
seekBar.addEventListener('click', seekBarOnClick)
videoPlayer.addEventListener('play', pauseIconChange)
videoPlayer.addEventListener('pause', playIconChange)
videoPlayer.addEventListener('volumechange', volumeChangeManager)
videoPlayer.addEventListener('timeupdate', videoTimeUpdateManager)
videoPlayer.addEventListener('progress', videoBufferingManager)
videoPlayer.addEventListener('canplay', onCanPlayManager)

videoPlayer.volume = 0.5

function onCanPlayManager() {
    const duration = timeFormat(videoPlayer.duration)
    timeLabelEnd.innerHTML = duration
}

function videoBufferingManager() {
    const buffered = seekBar.querySelector('.buffered')
    const duration = videoPlayer.duration
    const buffer = videoPlayer.buffered;
    const buff_length = buffer.length;
    for (var i = buff_length - 1; i >= 0; i--) {
        if (buffer.start(i) < videoPlayer.currentTime) {
            buffered.style.width = (buffer.end(i) / duration) * 100 + "%";
            break;
        }
    }
}

function videoTimeUpdateManager() {
    const currentTime = timeFormat(videoPlayer.currentTime)
    timeLabelStart.innerHTML = currentTime
    const progressBar = videoPlayer.currentTime / videoPlayer.duration * 100
    seekBar.querySelector('.progress').style.width = `${progressBar}%`
}

function seekBarOnClick(evt) {
    const x = evt.offsetX
    videoPlayer.currentTime = videoPlayer.duration * x / seekBar.offsetWidth;
}


function playManager() {
    if (videoPlayer.paused) {
        videoPlayer.play()
    } else {
        videoPlayer.pause()
    }
}

function pauseIconChange() {
    playPauseImage.classList.remove('fa-play')
    playPauseImage.classList.add('fa-pause')
}

function playIconChange() {
    playPauseImage.classList.remove('fa-pause')
    playPauseImage.classList.add('fa-play')
}

function fullScreenManager() {
    if (!document.fullscreenElement) {
        requestFullScreen()
    } else {
        requestExitScreen()
    }
}

function requestFullScreen() {
    if (videoPlayerContainer.requestFullscreen) {
        videoPlayerContainer.requestFullscreen();
    } else if (videoPlayerContainer.mozRequestFullScreen) { /* Firefox */
        videoPlayerContainer.mozRequestFullScreen();
    } else if (videoPlayerContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        videoPlayerContainer.webkitRequestFullscreen();
    } else if (videoPlayerContainer.msRequestFullscreen) { /* IE/Edge */
        videoPlayerContainer.msRequestFullscreen();
    }
    fullScreenImage.classList.remove('fa-expand')
    fullScreenImage.classList.add('fa-compress')
}

function requestExitScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
    fullScreenImage.classList.remove('fa-compress')
    fullScreenImage.classList.add('fa-expand')
}

function muteManager() {
    videoPlayer.muted = !videoPlayer.muted
}

function volumeChangeManager() {
    updateVolumeBar()
    if (videoPlayer.muted || videoPlayer.volume == 0) {
        muteBtnImage.classList.remove('fa-volume-up', 'fa-volume-down')
        muteBtnImage.classList.add('fa-volume-off')
    } else if (videoPlayer.volume < 0.6) {
        muteBtnImage.classList.remove('fa-volume-up', 'fa-volume-off')
        muteBtnImage.classList.add('fa-volume-down')
    } else {
        muteBtnImage.classList.remove('fa-volume-off', 'fa-volume-down')
        muteBtnImage.classList.add('fa-volume-up')
    }
}

function volumeBarOnClick(evt) {
    const x = evt.offsetX
    videoPlayer.volume = x / volumeBar.offsetWidth;
}

function updateVolumeBar() {
    const progresBar = videoPlayer.muted ? 0 : videoPlayer.volume * 100
    volumeBar.querySelector('.progress').style.width = `${progresBar}%`
}

function timeFormat(seconds) {
    let hours = Math.floor(seconds / ONE_HOUR)
    let minutes = Math.floor((seconds - hours * ONE_HOUR) / ONE_MINUTE)
    seconds = Math.floor(seconds - minutes * ONE_MINUTE - hours * ONE_HOUR)

    hours = toTwoDigits(hours)
    minutes = toTwoDigits(minutes)
    seconds = toTwoDigits(seconds)
    if (seconds >= ONE_HOUR) {
        return `${hours}:${minutes}:${seconds}`
    } else {
        return `${minutes}:${seconds}`
    }
}

function toTwoDigits(input) {
    return ('0' + input).slice(-2)
}