let pose_results;

let nose_x = 0;
let nose_y = 0;

let left_x = 0;
let left_y = 0;

let right_x = 0;
let right_y = 0;

let right_shoulder_x = 0;
let left_shoulder_x = 0;

let left_elbow = 0;
let right_elbow = 0;

let img; // basketの画像
let img1; // basket1の画像
let img2; // basket2の画像
let img3; // basket3の画像
let img4; // basket4の画像
let img5; // basket5の画像
let img6; // basket6の画像

let apple; // itemの画像
let apple_gold; // itemの画像
let kiken; // 注意画像
let hachi; // ハチの画像
let syoutotu; // ぶつかりエフェクト

let itemNum = 0; // itemの出現確率
let enemyNum = 0; // 敵の出現確率

let leftBasketX; // basketの左上x座標
let leftBasketY; // basketの左上y座標
let leftBasketW; // basketの幅
let leftBasketH; // basketの高さ
let rightBasketX; // basketの左上x座標
let rightBasketY; // basketの左上y座標
let rightBasketW; // basketの幅
let rightBasketH; // basketの高さ

let hitLeft; // 左のbasketとitemの当たり判定

let itemX; // itemの左上x座標
let itemY; // itemの左上y座標
let itemW = 60; // itemの幅
let itemH = 60; // itemの高さ
let itemState = 0; // itemの状態

let enemyTime = 10000; // 敵が出現する時間間隔
let lastEnemyTime = 0; // 前回敵が出現した時間
let currentTime = 0; // 現在時刻

//ゲームのスコアと制限時間
let score = 0;
let catchNum = 0; // 捕まえた数
const timeLimit = 60000; // 60秒


function preload() {
  img = loadImage('./images/basket.png');
  img1 = loadImage('./images/basket1.png');
  img2 = loadImage('./images/basket2.png');
  img3 = loadImage('./images/basket3.png');
  img4 = loadImage('./images/basket4.png');
  img5 = loadImage('./images/basket5.png');
  img6 = loadImage('./images/basket6.png');


  apple = loadImage('./images/apple.png');
  apple_gold = loadImage('./images/apple_gold.png');
  kiken = loadImage('./images/kiken.png');
  hachi = loadImage('./images/hachi.png');
  syoutotu = loadImage('./images/syoutotu.png');
}

function setup() {
  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');

  // お手々が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．
  gotPoses = function (results) {
    pose_results = results;
    adjustCanvas();
  }

  enemyNum = int(random(1, 3));

}

function draw() {
  currentTime = millis();
  // 描画処理
  clear();  // これを入れないと下レイヤーにあるビデオが見えなくなる

  textSize(20);
  text(score, width / 5 * 4, height / 10); // スコアを表示する

  itemDraw();
  enemyDraw();

  // 各頂点座標を表示する
  // 各頂点座標の位置と番号の対応は以下のURLを確認
  // https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
  if (pose_results) {
    for (let landmarks of pose_results.landmarks) {
      for (let landmark of landmarks) {
        // fill(255);
        // noStroke();
        // circle(landmark.x * width, landmark.y * height, 20)

        if (landmark == landmarks[0]) {
          nose_x = landmark.x * width;
          nose_y = landmark.y * height;
        }

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
    if (catchNum < 3) {
      imageMode(CENTER);
      image(img, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5), img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 3 && catchNum < 6) {
      imageMode(CENTER);
      image(img1, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 6 && catchNum < 9) {
      imageMode(CENTER);
      image(img2, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 9 && catchNum < 12) {
      imageMode(CENTER);
      image(img3, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 12 && catchNum < 15) {
      imageMode(CENTER);
      image(img4, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 15 && catchNum < 18) {
      imageMode(CENTER);
      image(img5, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 18) {
      imageMode(CENTER);
      image(img6, left_x - (left_x - right_x) / 2, left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }


    leftBasketW = img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの幅
    leftBasketH = img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの高さ
    leftBasketX = left_x - -(left_x - right_x) / 2 - leftBasketW / 2; // basketの左上x座標
    leftBasketY = left_y - 50 - img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5) + leftBasketH / 2; // basketの左上y座標
  }

  if (catchNum > 0 && left_x - right_x >= (left_shoulder_x - right_shoulder_x) / 2) { // お手々が離れたらスコアを加算する
    if (catchNum < 3) { score += catchNum; }
    if (catchNum >= 3 && catchNum < 6) { score += catchNum * 3; }
    if (catchNum >= 6 && catchNum < 9) { score += catchNum * 5; }
    if (catchNum >= 9 && catchNum < 12) { score += catchNum * 7; }
    if (catchNum >= 12 && catchNum < 15) { score += catchNum * 9; }
    if (catchNum >= 15 && catchNum < 18) { score += catchNum * 11; }
    if (catchNum >= 18) { score += catchNum * 13; }
    catchNum = 0;
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
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

let items = [];

function itemDraw() {
  itemNum = int(random(200));
  if (itemNum == 1 && items.length < 5) {
    let newItem = new Item(random(width), 0, int(random(10)));
    items.push(newItem);
  }

  for (let i = items.length - 1; i >= 0; i--) {

    if (items[i].color !== 1) { // 通常のリンゴ
      image(apple, items[i].x, items[i].y, width / 10, width / 10);
    }

    if (items[i].color == 1) { // 金のリンゴ
      image(apple_gold, items[i].x, items[i].y, width / 10, width / 10);
    }


    if (items[i].y <= height) {
      items[i].y += height / 300;
    }

    if (items[i].y > height) {
      items.splice(i, 1);
    }

    if (items[i] !== undefined) {

      itemX = items[i].x; // itemの左上x座標
      itemY = items[i].y; // itemの左上y座標
      itemState = items[i].color; // itemの状態

      // itemとbasketの当たり判定をチェックする

      itemW = width / 10; // itemの幅
    }


    // 当たっている場合はitemを配列から削除する

    // p5.collide2Dの関数を使って四角と円の当たり判定を行う
    if (left_elbow > left_y && left_x - right_x < (left_shoulder_x - right_shoulder_x) / 2) {
      hitLeft = collideRectCircle(leftBasketX, leftBasketY, leftBasketW, leftBasketH, itemX, itemY, itemW);
    }
    else {
      hitLeft = false;
    }
    if (hitLeft) {
      if (itemState == 1) {
        catchNum += 3;
      }
      else {
        catchNum += 1;
      }
      items.splice(i, 1);
    }
  }
}


class Enemy {
  constructor(x, y, a) {
    this.x = x;
    this.y = y;
    this.a = a;
  }
}

let enemies = [];

function enemyDraw() { // 敵の描画


  if (currentTime - lastEnemyTime > enemyTime - 3000 && enemies.length == 0) { // 3秒前に敵の出現を知らせる
    if (enemyNum == 1) {
      let newEnemy = new Enemy(0, nose_y - 100, enemyNum);
      enemies.push(newEnemy);
      // image(kiken, 0, nose_y - 100, width / 12, width / 12);
    }

    if (enemyNum == 2) {
      let newEnemy = new Enemy(nose_x, 0 - 50, enemyNum);
      enemies.push(newEnemy);
      // image(kiken, nose_x - width / 50, 0, width / 12, width / 12);
    }

    lastEnemyTime = currentTime;
    enemyTime = random(10000, 20000);
    enemyNum = int(random(1, 3));

  }

  if (currentTime - lastEnemyTime > enemyTime) { // 敵の出現
    // if (enemyNum == 1) {
    //   let newEnemy = new Enemy(0, nose_y - 100, enemyNum);
    //   enemies.push(newEnemy);
    // }

    // if (enemyNum == 2) {
    //   let newEnemy = new Enemy(nose_x, 0 - 50, enemyNum);
    //   enemies.push(newEnemy);
    // }

    // lastEnemyTime = currentTime;
    // enemyTime = random(10000, 20000);
    // enemyNum = int(random(1, 3));
  }



  for (let i = enemies.length - 1; i >= 0; i--) { // 敵の移動と当たり判定

    if (currentTime - lastEnemyTime >= 3000) {
      image(hachi, enemies[i].x, enemies[i].y, width / 8, width / 8);
      if (enemies[i].a == 1) {
        enemies[i].x += width / 230;
      }

      else if (enemies[i].a == 2) {
        enemies[i].y += height / 270;
      }

      if (enemies[i].x > width || enemies[i].y > height) {
        enemies.splice(i, 1);
      }
    }



    if (enemies[i] !== undefined) {
      if (enemies[i].a == 1 && currentTime - lastEnemyTime < 3000) {
        image(kiken, 0, enemies[i].y - width / 24, width / 12, width / 12);
      }

      if (enemies[i].a == 2 && currentTime - lastEnemyTime < 3000) {
        image(kiken, enemies[i].x - width / 24, 0, width / 12, width / 12);
      }

      enemyX = enemies[i].x;
      enemyY = enemies[i].y;


      enemyW = width / 8;
      enemyH = width / 8;
    }

    let hit = collideRectCircle(enemyX, enemyY, enemyW, enemyH, nose_x, nose_y - (left_shoulder_x - right_shoulder_x) * 0.1, (left_shoulder_x - right_shoulder_x) * 0.7, (left_shoulder_x - right_shoulder_x) * 0.7);
    if (hit) {
      image(syoutotu, nose_x, nose_y - (left_shoulder_x - right_shoulder_x) * 0.1, (left_shoulder_x - right_shoulder_x) * 0.7, (left_shoulder_x - right_shoulder_x) * 0.7);
      if (catchNum > 0) {
        catchNum = 0;
      }
      console.log("Game Over");
    }
  }

}



