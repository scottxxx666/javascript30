'use strict'

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snapSound = document.querySelector('.snap-sound');
const snapBtn = document.querySelector('#take-picture');
const filtBtn = document.querySelectorAll('.filt-btn');
let filtVar = { redVideo: false, shadowVideo: false, splitVideo: false };

const videoStream = function videoStreamer (stream) {
    video.src = window.URL.createObjectURL(stream);
    video.play();
}

const showVideo = function showVideoFunction () {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(videoStream)
        .catch(e => console.log(e));
}

const showCanvas = function videoToCanvas (e) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    setInterval(drawCanvas, 160);
}

const drawCanvas = function drawCanvasFunction () {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let pixel = ctx.getImageData(0, 0, canvas.width, canvas.height);

    pixel = rangeFilt(pixel);
    
    if (filtVar.splitVideo) {
        pixel = splitVideo(pixel);
    }

    if (filtVar.redVideo) {
        pixel = redVideo(pixel);
    }

    shadowVideo(filtVar.shadowVideo);

    ctx.putImageData(pixel, 0, 0);

}

const snapVideo = function snapVideoFun () {
    snapSound.currentTime = 0;
    snapSound.play();

    const file = canvas.toDataURL('image/jpeg');
    const snapLink = document.createElement('a');
    const img = document.createElement('img');

    img.setAttribute('src', file);
    snapLink.appendChild(img);
    snapLink.href = file;
    snapLink.setAttribute('download', 'snapshot');
    strip.appendChild(snapLink);
}

const redVideo = function redVideoFunction (newCtx) {
    for (let i = 0; i < newCtx.data.length; i += 4) {
        newCtx.data[i] += 200;
    }
    return newCtx;
}

const shadowVideo = function shadowVideoFun (shadow) {
    if (shadow) {
        ctx.globalAlpha = 0.3;
    } else {
        ctx.globalAlpha = 1;
    }
}

const splitVideo = function splitVideoFun (newCtx) {
    for (let i = 0; i < newCtx.data.length; i += 4) {
        newCtx.data[i - 150] = newCtx.data[i + 0];
        newCtx.data[i + 150] = newCtx.data[i + 1];
        newCtx.data[i + 100] = newCtx.data[i + 2];
    }
    return newCtx;
}

const rangeFilt = function rangeFilter (newCtx) {
    const inputs = document.querySelectorAll('input[type=range]');
    let range = {};
    inputs.forEach(input => {
        const name = input.name;
        range[name] = input.value;
    });

    for (let i = 0; i < newCtx.data.length; i += 4) {

        if (!isInRange(range, newCtx.data[i + 0], newCtx.data[i + 1], newCtx.data[i + 2], newCtx.data[i + 3])) {
            continue;
        }

        newCtx.data[i + 3] = 0;
    }
    return newCtx;
}

const isInRange = function isInRangeFun (range, r, g, b, alpha) {
    if ((r < range.rmin)||(r > range.rmax)) {
        return false;
    }

    if ((g < range.gmin)||(g > range.gmax)) {
        return false;
    }

    if ((b < range.bmin)||(b > range.bmax)) {
        return false;
    }

    return true;
}

showVideo();

video.addEventListener('canplay', showCanvas);
snapBtn.addEventListener('click', snapVideo);
filtBtn.forEach(btn => btn.addEventListener('click', e => {
    const name = e.target.dataset.fun;
    filtVar[name] = !filtVar[name];
}));