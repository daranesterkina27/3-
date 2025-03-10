let scene, camera, renderer, model;

// Инициализация сцены, камеры и рендерера
function init() {
    // Создаем сцену
    scene = new THREE.Scene();

    // Настраиваем камеру
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5; // Отодвигаем камеру назад

    // Создаем рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Добавляем свет
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Мягкий окружающий свет
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Направленный свет
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Загружаем 3D-модель
    const loader = new THREE.GLTFLoader();
    loader.load('assets/models/model.glb', function (gltf) {
        model = gltf.scene;
        scene.add(model); // Добавляем модель на сцену
    }, undefined, function (error) {
        console.error('Ошибка загрузки модели:', error);
    });

    // Добавляем OrbitControls для вращения модели
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Плавное вращение
    controls.dampingFactor = 0.05;

    // Обработка изменения размера окна
    window.addEventListener('resize', onWindowResize, false);
}

// Анимация
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera); // Рендерим сцену
}

// Обработчик изменения размера окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Запуск
init();
animate();