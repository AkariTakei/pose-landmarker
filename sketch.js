const GAME_STATE_TITLE = 0; // タイトル
const GAME_STATE_PLAYING = 1; // プレイ中
const GAME_STATE_GAMEOVER = 2; // ゲームオーバー

let StartTime = 0;
let timer = 60;

let gameState; // ゲームの状態
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
let Score_Time; // スコア画像
let apple_BG; // リンゴの背景画像 

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

let complete1;
let complete2;
let complete3;

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

let itemMaxTime = 3000; // itemが出現する時間間隔
let itemMinTime = 500; // itemが出現する時間間隔
let nextItemTime = 0; // 次のitemが出現する時間
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

//サウンド関係
let bgm_playing;
let bgm_title;
let bgm_gameover;
let get_item;
let damage;
let arart;
let IsArart = false;


function preload() {
  start = loadImage('./images/start.png');
  Score_Time = loadImage('./images/Score_Time.png');
  apple_BG = loadImage('./images/apple_BG.png');

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

  complete1 = loadImage('./images/complete1.png');
  complete2 = loadImage('./images/complete2.png');
  complete3 = loadImage('./images/complete3.png');

  bgm_playing = loadSound('./sound/bgm_play.mp3');
  bgm_title = loadSound('./sound/title.mp3');
  bgm_gameover = loadSound('./sound/complete.mp3');
  get_item = loadSound('./sound/poka03.mp3');
  damage = loadSound('./sound/damage.mp3');
  arart = loadSound('./sound/arart.mp3');
}

function setup() {
  bgm_playing.setVolume(0.5);
  bgm_title.setVolume(0.5);
  bgm_gameover.setVolume(0.5);
  get_item.setVolume(0.3);
  arart.setVolume(0.7);
  damage.setVolume(0.3);

  let p5canvas = createCanvas(400, 400);
  p5canvas.parent('#canvas');
  adjustCanvas();

  // お手々が見つかると以下の関数が呼び出される．resultsに検出結果が入っている．
  gotPoses = function (results) {
    pose_results = results;
    adjustCanvas();
  }

  enemyNum = int(random(1, 3));
  frameRate(30);
  translate(0, 0);

  document.addEventListener('cameraButtonClick', () => {
    // カメラボタンがクリックされた際の処理をここに記述
    // 例えば、以下のようにコンソールにメッセージを表示する場合
    console.log('カメラボタンがクリックされました！');
    gameState = GAME_STATE_TITLE;
    bgm_title.play();
  });




}

function draw() {
  clear();  // これを入れないと下レイヤーにあるビデオが見えなくなる
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

  if (gameState === GAME_STATE_TITLE) {

    drawTitleScreen();

  }

  if (gameState === GAME_STATE_PLAYING) {

    image(Score_Time, width / 4 * 3 - width, 0, Score_Time.width * width * 0.0008, Score_Time.height * width * 0.0008);
    fill(255);
    textSize(width * 0.038);
    text(score, width / 9 * 8 - width, width / 16); // スコアを表示する
    textSize(width * 0.05);
    fill(107, 68, 21);

    text(timer - int((currentTime - startTime) / 1000), width / 13 * 11.3 - width, width / 5.7); // スコアを表示する

    if (startTime + 60000 < currentTime) {
      gameState = GAME_STATE_GAMEOVER;
      bgm_playing.stop();
      bgm_gameover.play();
    }
    console.log(timer - int((currentTime - startTime) / 1000));


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
            // circle(-nose_x, nose_y, 20);
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
            // circle(-left_x, left_y, 20);
            LeftDrawbasket();
          }

          if (landmark == landmarks[16]) {
            right_x = landmark.x * width;
            right_y = landmark.y * height;
            // circle(-right_x, right_y, 20);
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
  if (currentTime > nextItemTime) {
    let newItem = new Item(random(width), 0, int(random(10)));
    items.push(newItem);
    SpawnTime();
  }

  for (let i = items.length - 1; i >= 0; i--) {

    if (items[i].color !== 1) { // 通常のリンゴ
      image(apple, -items[i].x, items[i].y, width / 10, width / 10);
    }

    if (items[i].color == 1) { // 金のリンゴ
      image(apple_gold, -items[i].x, items[i].y, width / 10, width / 10);
    }


    if (items[i].y <= height) {
      items[i].y += 5;
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
      get_item.play();
    }
  }

  console.log(leftBasketX + leftBasketY + leftBasketW + leftBasketH + itemX + itemY + itemW);
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


  if (currentTime - lastEnemyTime > enemyTime - 3000 && enemies.length == 0) { // 敵の出現
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
    enemyTime = random(8000, 13000);
    enemyNum = int(random(1, 3));

  }




  for (let i = enemies.length - 1; i >= 0; i--) { // 敵の移動と当たり判定

    if (currentTime - lastEnemyTime >= 3000) {
      IsArart = false;
      image(hachi, -enemies[i].x, enemies[i].y, width / 8, width / 8);
      if (enemies[i].a == 1) {
        enemies[i].x -= 8;
      }

      else if (enemies[i].a == 2) {
        enemies[i].y += 8;
      }

      if (enemies[i].x < 0 || enemies[i].y > height) {
        enemies.splice(i, 1);
      }
    }



    if (enemies[i] !== undefined) {
      if (enemies[i].a == 1 && currentTime - lastEnemyTime < 3000) { // 注意マークの描画
        image(kiken, -width, enemies[i].y - width / 24, width / 12, width / 12);
        if (IsArart == false) {
          arart.play();
          IsArart = true;
        }
      }

      if (enemies[i].a == 2 && currentTime - lastEnemyTime < 3000) {
        image(kiken, -enemies[i].x - width / 24, 0, width / 12, width / 12);
        if (IsArart == false) {
          arart.play();
          IsArart = true;
        }
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
      enemies.splice(i, 1);
      damage.play();
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
    if (gameState === GAME_STATE_TITLE) {
      bgm_playing.play();
    }
    gameState = GAME_STATE_PLAYING;
    bgm_title.stop();
    lastEnemyTime = currentTime;
    startTime = currentTime;
  }

}

function drawGameOverScreen() {
  bgm_playing.stop();
  fill(255);
  rect(-width, 0, width, height);
  image(apple_BG, -width, 0, width, width);
  imageMode(CENTER);
  if (score < 100) {
    image(complete1, width / 2 - width, width * 0.4, complete1.width * width * 0.0015, complete1.height * width * 0.0015);
  }

  if (score >= 100 && score < 500) {
    image(complete2, width / 2 - width, width * 0.4, complete1.width * width * 0.0015, complete1.height * width * 0.0015);
  }

  if (score >= 500) {
    image(complete3, width / 2 - width, width * 0.4, complete1.width * width * 0.0015, complete1.height * width * 0.0015);
  }
  imageMode(CORNER);
  textSize(width * 0.04);
  textAlign(CENTER);
  text(score, width * 0.5 - width, width * 0.53); // スコアを表示する

}

function SpawnTime() {
  nextItemTime = currentTime + int(random(itemMinTime, itemMaxTime));
}



