const GAME_STATE_TITLE = 0; // タイトル
const GAME_STATE_PLAYING = 1; // プレイ中
const GAME_STATE_GAMEOVER = 2; // ゲームオーバー

let StartTime = 0;
let timer = 60;

let gameState = GAME_STATE_TITLE; // ゲームの状態
let pose_results;

let angle = 0; // スタート画面の画像の回転角度

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

let start; // スタート画面の画像

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

let enemyX; // 敵の左上x座標
let enemyY; // 敵の左上y座標
let enemyW = 60; // 敵の幅
let enemyH = 60; // 敵の高さ

let enemyTime = 10000; // 敵が出現する時間間隔
let lastEnemyTime = 0; // 前回敵が出現した時間
let currentTime = 0; // 現在時刻

//ゲームのスコアと制限時間
let score = 0;
let catchNum = 0; // 捕まえた数
const timeLimit = 60000; // 60秒


function preload() {
  start = loadImage('./images/start.png');

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
  translate(width, 0);

  // translate(width / 2, height / 2);
  // // キャンバスを反転させる
  // scale(-1, 1);
  // // キャンバスの中心から元の位置に戻す
  // translate(-width / 2, -height / 2);

  currentTime = millis();
  if (gameState === GAME_STATE_GAMEOVER) {
    drawGameOverScreen();
  }

  // 描画処理
  clear();  // これを入れないと下レイヤーにあるビデオが見えなくなる
  if (gameState === GAME_STATE_TITLE) {
    drawTitleScreen();
  }

  if (gameState === GAME_STATE_PLAYING) {

    if (startTime + 60000 < currentTime) {
      gameState = GAME_STATE_GAMEOVER;
    }
    console.log(timer - int((currentTime - startTime) / 1000));


    textSize(20);
    text(-score, width / 5 * 4, height / 10); // スコアを表示する

    itemDraw();
    enemyDraw();

    // 各頂点座標を表示する
    // 各頂点座標の位置と番号の対応は以下のURLを確認
    // https://developers.google.com/mediapipe/solutions/vision/pose_landmarker

    if (pose_results) {
      for (let landmarks of pose_results.landmarks) {
        for (let landmark of landmarks) {

          fill(255);
          noStroke();
          // circle(-landmark.x * width, landmark.y * height, 20)

          if (landmark == landmarks[0]) {
            nose_x = landmark.x * width;
            nose_y = landmark.y * height;
            circle(-nose_x, nose_y, 20);
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
            circle(-left_x, left_y, 20);
            LeftDrawbasket();
          }

          if (landmark == landmarks[16]) {
            right_x = landmark.x * width;
            right_y = landmark.y * height;
            circle(-right_x, right_y, 20);
            // RightDrawbasket();
          }

        }
      }
    }

  }

  translate(-width, 0);



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
      image(img, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5), img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 3 && catchNum < 6) {
      imageMode(CENTER);
      image(img1, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 6 && catchNum < 9) {
      imageMode(CENTER);
      image(img2, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 9 && catchNum < 12) {
      imageMode(CENTER);
      image(img3, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 12 && catchNum < 15) {
      imageMode(CENTER);
      image(img4, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 15 && catchNum < 18) {
      imageMode(CENTER);
      image(img5, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }

    if (catchNum >= 18) {
      imageMode(CENTER);
      image(img6, (-(left_x - (left_x - right_x) / 2)), left_y - 50, img.width / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5), img1.height / (img1.width / (left_shoulder_x - right_shoulder_x) * 0.5));
      imageMode(CORNER);
    }


    leftBasketW = img.width / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの幅
    leftBasketH = img.height / (img.width / (left_shoulder_x - right_shoulder_x) * 0.5); // basketの高さ
    leftBasketX = - (left_x - (left_x - right_x) / 2 + leftBasketW / 2); // basketの左上x座標
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
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
  }
}

let items = [];

function itemDraw() {
  itemNum = int(random(200));
  if (itemNum == 1 && items.length < 10) {
    let newItem = new Item(random(width), 0, int(random(10)));
    items.push(newItem);
  }

  for (let i = items.length - 1; i >= 0; i--) {

    if (items[i].color !== 1) { // 通常のリンゴ
      image(apple, -items[i].x, items[i].y, width / 10, width / 10);
    }

    if (items[i].color == 1) { // 金のリンゴ
      image(apple_gold, -items[i].x, items[i].y, width / 10, width / 10);
    }


    if (items[i].y <= height) {
      items[i].y += height / 250;
    }

    if (items[i].y > height) {
      items.splice(i, 1);
    }

    if (items[i] !== undefined) {

      itemX = -items[i].x; // itemの左上x座標
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
        if (catchNum < 3) { score += 3; }
        if (catchNum >= 3 && catchNum < 6) { score += 6; }
        if (catchNum >= 6 && catchNum < 9) { score += 12; }
        if (catchNum >= 9 && catchNum < 12) { score += 24; }
        if (catchNum >= 12 && catchNum < 15) { score += 48; }
        if (catchNum >= 15 && catchNum < 18) { score += 32 * 3; }
        if (catchNum >= 18) { score += 64 * 3; }
        catchNum += 1;
      }
      else {
        if (catchNum < 3) { score += 1; }
        if (catchNum >= 3 && catchNum < 6) { score += 2; }
        if (catchNum >= 6 && catchNum < 9) { score += 4; }
        if (catchNum >= 9 && catchNum < 12) { score += 8; }
        if (catchNum >= 12 && catchNum < 15) { score += 16; }
        if (catchNum >= 15 && catchNum < 18) { score += 32; }
        if (catchNum >= 18) { score += 64; }
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
      let newEnemy = new Enemy(width + 50, nose_y - 100, enemyNum);
      enemies.push(newEnemy);
      // image(kiken, 0, nose_y - 100, width / 12, width / 12);
    }

    if (enemyNum == 2) {
      let newEnemy = new Enemy(nose_x, 0 - 50, enemyNum);
      enemies.push(newEnemy);
      // image(kiken, nose_x - width / 50, 0, width / 12, width / 12);
    }

    lastEnemyTime = currentTime;
    //enemyTime = random(10000, 20000);
    enemyTime = random(500, 1000);
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
      image(hachi, -enemies[i].x, enemies[i].y, width / 8, width / 8);
      if (enemies[i].a == 1) {
        enemies[i].x -= width / 200;
      }

      else if (enemies[i].a == 2) {
        enemies[i].y += height / 270;
      }

      if (enemies[i].x < 0 || enemies[i].y > height) {
        enemies.splice(i, 1);
      }
    }



    if (enemies[i] !== undefined) {
      if (enemies[i].a == 1 && currentTime - lastEnemyTime < 3000) {
        image(kiken, -width, enemies[i].y - width / 24, width / 12, width / 12);
      }

      if (enemies[i].a == 2 && currentTime - lastEnemyTime < 3000) {
        image(kiken, -enemies[i].x - width / 24, 0, width / 12, width / 12);
      }

      enemyX = -enemies[i].x;
      enemyY = enemies[i].y;


      enemyW = width / 8;
      enemyH = width / 8;



    }

    let hit = collideRectCircle(enemyX, enemyY, enemyW, enemyH, -nose_x, nose_y - (left_shoulder_x - right_shoulder_x) * 0.1, (left_shoulder_x - right_shoulder_x) * 0.7, (left_shoulder_x - right_shoulder_x) * 0.7);
    if (hit) {
      image(syoutotu, -nose_x, nose_y - (left_shoulder_x - right_shoulder_x) * 0.1, (left_shoulder_x - right_shoulder_x) * 0.7, (left_shoulder_x - right_shoulder_x) * 0.7);
      if (catchNum > 0) {
        catchNum = 0;
      }
      console.log("Game Over");
    }
  }

}

function drawTitleScreen() {
  let y = height / 100 * sin(angle); // スタート画面の画像を上下に揺らす
  imageMode(CENTER);
  image(start, -width / 2, height / 6 * 5 + y, start.width * width * 0.001, start.height * width * 0.001);
  imageMode(CORNER);
  angle += 0.03;
  console.log("title");
  if (pose_results != null) {
    for (let landmarks of pose_results.landmarks) {
      for (let landmark of landmarks) {
        // fill(255);
        // noStroke();
        // circle(landmark.x * width, landmark.y * height, 20)

        if (landmark == landmarks[0]) {
          nose_x = -landmark.x * width;
          nose_y = landmark.y * height;
        }


        if (landmark == landmarks[15]) {
          left_x = -landmark.x * width;
          left_y = landmark.y * height;
          // LeftDrawbasket();
        }

        if (landmark == landmarks[16]) {
          right_x = -landmark.x * width;
          right_y = landmark.y * height;
          // RightDrawbasket();
        }
      }

    }
  }

  if (left_y < nose_y && right_y < nose_y) {
    gameState = GAME_STATE_PLAYING;
    lastEnemyTime = currentTime;
    startTime = currentTime;
  }

}



