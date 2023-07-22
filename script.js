import { PoseLandmarker, FilesetResolver } from "./vision_bundle.js";

// const messageElement = document.getElementById("message");
const internalCamButton = document.getElementById("internalCamButton");
const externalCamButton = document.getElementById("externalCamButton");
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const cameraButtonClickEvent = new Event('cameraButtonClick');


// messageElement.innerHTML = "準備...";
internalCamButton.disabled = true;
externalCamButton.disabled = true;
internalCamButton.style.display = "none";
externalCamButton.style.display = "none";

let poseLandmarker = undefined;
let runningMode = "IMAGE";
let webcamRunning = false;

const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("./wasm");
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `./models/pose_landmarker_lite.task`,
            delegate: "CPU",
        },
        runningMode: runningMode,
        numPoses: 2,
    });
    // messageElement.innerHTML += "完了！";
    internalCamButton.disabled = false;
    externalCamButton.disabled = false;
    internalCamButton.style.display = "inline";
    externalCamButton.style.display = "inline";
};

createPoseLandmarker();

const hasGetUserMedia = () => !!navigator.mediaDevices && !!navigator.mediaDevices.getUserMedia;

if (!hasGetUserMedia()) {
    console.warn("このブラウザではgetUserMedia()はサポートされていません");
}

internalCamButton.addEventListener("click", () => {
    enableCam("user");
    document.dispatchEvent(cameraButtonClickEvent);
});

externalCamButton.addEventListener("click", () => {
    enableCam("environment");
    document.dispatchEvent(cameraButtonClickEvent);
});

function enableCam(facingMode) {
    if (!poseLandmarker) {
        console.log("待ってください。オブジェクト検出器がまだロードされていません。");
        return;
    }

    webcamRunning = !webcamRunning;

    if (webcamRunning) {
        internalCamButton.innerText = "　";
        externalCamButton.innerText = "　";
    } else {
        internalCamButton.innerText = "1人で遊ぶ";
        externalCamButton.innerText = "2人で遊ぶ";
    }

    const constraints = {
        video: { facingMode: facingMode },
    };

    if (webcamRunning) {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
                video.addEventListener("loadeddata", predictWebcam);
                internalCamButton.style.display = "none"; // ボタンを非表示にする
                externalCamButton.style.display = "none"; // ボタンを非表示にする
            })
            .catch((err) => {
                console.error("カメラにアクセスできませんでした: ", err);
            });
    } else {
        video.srcObject = null;
        video.removeEventListener("loadeddata", predictWebcam);
    }
}


let lastVideoTime = -1;
let results = undefined;

async function predictWebcam() {
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    }

    let startTimeMs = performance.now();

    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = poseLandmarker.detectForVideo(video, startTimeMs);
    }

    gotPoses(results);

    if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
    }
}
