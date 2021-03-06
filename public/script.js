// 変数定義
// canvas要素と、キャンバスコンテキストを格納する

var canvasElem = $("canvas")[0]; // canvas要素
var context = canvasElem.getContext('2d'); // キャンバスのコンテキストを取得する

/* STEP1 */

// "スナップ" ボタンをクリックしたら、snap_pictureが呼ばれる
$("#snap-button").on("click", snap_picture);

// スナップ写真を撮る
function snap_picture() {
  // ビデオのスナップショットをキャンバスに貼る
  var video = $("video")[0];
  //var video = document.querySelector('video'); // without jQuery
  // WebCamにすると、映像サイズが変わるので、canvasの大きさも
  // それに合わせて変える
  canvasElem.width = video.videoWidth;
  canvasElem.height = video.videoHeight;
  // context に drawImage するのはサイズを変えた後
  context.drawImage(video, 0, 0);
}


/* STEP2 */

// "枠線を描く" ボタンをクリックしたら、draw_wakuが呼ばれる
$("#waku-button").on("click", draw_waku);

// 枠線を描く関数
function draw_waku() {
  // 枠線の色を黄色に指定
  context.strokeStyle = "yellow";

  // 枠線の太さを 25 pixelにする
  context.lineWidth = 25;

  // 枠線を描く
  context.strokeRect(0, 0, canvasElem.width, canvasElem.height);
}

/* STEP3 */

// "フレームを描く" ボタンをクリックしたら、draw_waku_fancyが呼ばれる
$("#fancy-waku-button").on("click", draw_waku_fancy);

// フレームの画像をダウンロードし、キャンバスに描画する関数
function draw_waku_fancy() {
  // Imageオブジェクトを作り、srcに画像ファイルを指定する
  // （画像のダウンロードが始まる）
  var img = new Image();
  img.src = "./files/img/frame_gold.png";

  // 画像ダウンロードが完了すると load イベントが発火するので
  // このタイミングで描画する
  img.onload = function() {
    context.drawImage(img, 0, 0, canvasElem.width, canvasElem.height);
  };
}

/* STEP4 */

// 画像のダウンロード
// サーバー上で動作させる必要がある（localhostでも可）

// "画像を保存する"ボタンをクリックしたら create_download_link が呼ばれる
$("#download").on("click", create_download_link);

// 画像を DataURL に変換し、アンカー要素のhref属性にセットすると、
// ダウンロード出来るようになる
function create_download_link(){
  // キャンバス画像を DataURLに変換
  var url = canvasElem.toDataURL();
  console.log(url);

  // アンカー要素のhref属性にDataURLを指定し、
  // download属性にファイル名を指定する
  $("#download-link").attr({
    href: url,
    download: "picture.png"
  });
  // without jQuery
  //var a = document.getElementById("download-link");
  //a.href = url;
  //a.download = 'picture.png';
}

/* STEP5 (APPENDIX) */

// Webカメラからの取り込み
// サーバー上で動作させる必要がある（localhostでも可）

// "WebCamを使う"がクリックされたら、start_captureが呼ばれる
$("#webcam").on("click", start_capture);

// getUserMediaでカメラから映像を取得する。
// 映像を BlobURL に変換し、Video要素のsrcに指定すると
// 映像が表示される
function start_capture(){
  var video = $('video')[0]; // video要素の取得

  // getUserMedia の crossブラウザ対応
  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia;
  // カメラからの映像ストリーム取得を要求する。成功すると、
  // 第二引数のコールバック関数が呼ばれる
  navigator.getUserMedia({video: true}, function(stream) {
    // 映像ストリームオブジェクトからBlobURLを生成する。
    var bloburl =  window.URL.createObjectURL(stream);
    // BlobURLが何なのかを確認するため、consoleに表示する
    console.log(bloburl);

    // video要素のsrc属性に生成した BlobURL をセットすると
    // カメラ映像が表示されるようになる。
    video.src = bloburl;

    // 自動再生する
    video.play();
  }, function(error) {
    console.log(error);
  });
}
