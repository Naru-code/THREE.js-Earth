window.addEventListener("load", init);

function init() {
  //サイズ指定
  const width = 960;
  const height = 540;
  // 回転
  let rot = 0;

  // シーン作成
  const scene = new THREE.Scene();

  // カメラ作成
  const camera = new THREE.PerspectiveCamera(45, width/height);
  // camera.position.z = 1000;

  //レンダラー作成
  // レンダリングを行う
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
  });
  // サイズ指定
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 球体生成
  const geometry = new THREE.SphereGeometry(300, 30, 30);

  // マテリアル作成、材質
  const material = new THREE.MeshStandardMaterial({
    // 画像をはりつける
    map: new THREE.TextureLoader().load('textures/earthmap1k.jpg'),
  });

  // メッシュ作成
  const earth = new THREE.Mesh(geometry,material);
  scene.add(earth);

  // 光源
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.9);
  // 座標指定
  directionalLight.position.set(1,1,1);
  scene.add(directionalLight);

  // 地球の周りを回っている光源
  const pointLight = new THREE.PointLight( 0xffffff, 2, 1000 );
  scene.add(pointLight);
  // 光をHelp
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  // 周囲の星追加
  createStarField();

  // 周囲の星生成の関数
  function createStarField(){
    // x,y,z座標の値がランダムに入った配列を生成
    const vertices = [];
    for(let i = 0; i < 500; i++){
      const x = 3000 * (Math.random() - 0.5);
      const y = 3000 * (Math.random() - 0.5);
      const z = 3000 * (Math.random() - 0.5);

      vertices.push(x,y,z);
    }

    // 周囲の星の形状
    const geometry = new THREE.BufferGeometry();
    // 属性
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices,3)
    );

    // 材質
    const material = new THREE.PointsMaterial({
      size: 8,
      color: 0xffffff,
    });

    // メッシュ
    const stars = new THREE.Points(geometry,material);
    scene.add(stars);
  }

  // フレームごとに呼び出される関数
  function tick() {
    // 角度を0.5ずつ増やす
    rot += 0.5;

    // ラジアン変換
    const radian = (rot * Math.PI) / 180;

    // 角度に応じてカメラの位置を変更する
    camera.position.x = 1000 * Math.sin(radian);
    camera.position.z = 2000 * Math.cos(radian);

    // カメラの見る位置固定する
    camera.lookAt(new THREE.Vector3(0, 0, -400));

    // ライトを周回させる
    // 引数x,y,z座標を指定する
    pointLight.position.set(
      500 * Math.sin(Date.now() / 500),
      500 * Math.sin(Date.now() / 1000),
      500 * Math.cos(Date.now() / 500)
    );

    // レンダリング
    renderer.render(scene,camera);
    requestAnimationFrame(tick);
    }

    tick();
}

