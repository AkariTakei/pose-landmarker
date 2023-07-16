let pose_results;

let left_x = 0;
let left_y = 0;

let right_x = 0;
let right_y = 0;

let right_shoulder_x = 0;
let left_shoulder_x = 0;

let left_elbow = 0;
let right_elbow = 0;

let img;
let itemNum = 0;

let leftBasketX; // basketの左上x座標
let leftBasketY; // basketの左上y座標
let leftBasketW; // basketの幅
let leftBasketH; // basketの高さ
let rightBasketX; // basketの左上x座標
let rightBasketY; // basketの左上y座標
let rightBasketW; // basketの幅
let rightBasketH; // basketの高さ

let itemX; // itemの左上x座標
let itemY; // itemの左上y座標
let itemW = 60; // itemの幅
let itemH = 60; // itemの高さ


function preload() {
  img = loadImage('./../images/basket.png');
}

function setup() {
  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');

  // お手々が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．
  gotPoses = function (results) {
    pose_results = results;
    adjustCanvas();
  }

}

function draw() {
  // 描画処理
  clear();  // これを入れないと下レイヤーにあるビデオが見えなくなる

  itemDraw();

  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
  if (pose_results) {
    for (let landmarks of pose_results.landmarks) {
      for (let landmark of landmarks) {
        fill(255);
        noStroke();
        circle(landmark.x * width, landmark.y * height, 20)

        if (landmark == landmarks[11]) {
          left_shoulder_x = landmark.x * width;
        }

        if (landmark == landmarks[12]) {
          right_shoulder_x = landmark.x * width;
        }

        if (landmark == landmarks[13]) {
          left_elbow = landmark.y * height;
        }

        if (landmark == landmarks[14]) {
          right_elbow = landmark.y * height;
        }


        if (landmark == landmarks[15]) {
          left_x = landmark.x * width;
          left_y = landmark.y * height;
          LeftDrawbasket();
        }

        if (landmark == landmarks[16]) {
          right_x = landmark.x * width;
          right_y = landmark.y * height;
          // RightDrawbasket();
        }
      }

    }
  }

}


function windowResized() {
  adjustCanvas();
}

function adjustCanvas() {
  // Get an element by its ID
  var element_webcam = document.getElementById('webcam');
  resizeCanvas(element_webcam.clientWidth, element_webcam.clientHeight);
  //console.log(element_webcam.clientWidth);
}


function LeftDrawbasket() {

  if (left_elbow > left_y && left_x - right_x < (left_shoulder_x - right_shoulder_x) / 2) {
    imageMode(CENTER);
    image(img, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5), img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5));

    leftBasketW = img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの幅
    leftBasketH = img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの高さ
    leftBasketX = left_x - -(left_x - right_x) / 2 - leftBasketW / 2; // basketの左上x座標
    leftBasketY = left_y - 50 - img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5) + leftBasketH / 2; // basketの左上y座標
  }
}

// function RightDrawbasket() {

//   if (right_elbow > right_y) {
//     imageMode(CENTER);
//     image(img, right_x - 50, right_y - 50, img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5), img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5));

//     rightBasketW = img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの幅
//     rightBasketH = img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの高さ
//     rightBasketX = right_x - 50 - rightBasketW / 2; // basketの左上x座標
//     rightBasketY = right_y - 50 - img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5) + rightBasketH / 2; // basketの左上y座標
//   }
// }

class Item {
  constructor(x, y,) {
    this.x = x;
    this.y = y;
  }
}

let items = [];

function itemDraw() {
  itemNum = int(random(200));
  if (itemNum == 1 && items.length < 5) {
    let newItem = new Item(random(width), 0);
    items.push(newItem);
  }

  for (let i = items.length - 1; i >= 0; i--) {
    fill(0, 0, 255);
    rect(items[i].x, items[i].y, 60, 60);
    if (items[i].y <= height) {
      items[i].y += 1;
    }

    if (items[i].y > height) {
      items.splice(i, 1);
    }


    itemX = items[i].x;
    itemY = items[i].y;

    // itemとbasketの当たり判定をチェックする

    itemW = 60; // itemの幅
    itemH = 60; // itemの高さ


    // 当たっている場合はitemを配列から削除する

    // p5.collide2Dの関数を使って四角と四角の当たり判定を行う
    let hitLeft = collideRectRect(itemX, itemY, itemW, itemH, leftBasketX, leftBasketY, leftBasketW, leftBasketH);
    let hitRight = collideRectRect(itemX, itemY, itemW, itemH, rightBasketX, rightBasketY, rightBasketW, rightBasketH);

    if (hitLeft || hitRight) {
      items.splice(i, 1);
    }
  }
}
