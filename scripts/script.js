import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/controls/OrbitControls.js';
import { EXRLoader } from 'https://cdn.jsdelivr.net/npm/three@0.149.0/examples/jsm/loaders/EXRLoader.js';

// Элементы прогресс-бара
const progressBar = document.getElementById('progress-bar');
const progressValue = document.getElementById('progress-value');
const progressContainer = document.getElementById('progress-container');
const sceneContainer = document.getElementById('scene-container');

// Функция для обновления прогресс-бара
function updateProgressBar(percent) {
  progressBar.value = percent;
  progressValue.textContent = `${percent}%`;

}

// Инициализация Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
sceneContainer.appendChild(renderer.domElement);

camera.position.set(0, 0, 5);  // Устанавливаем фиксированную позицию камеры
camera.rotation.set(0, 0, 0);  // Камера не должна вращаться
camera.zoom = 1;  // Камера не должна приближаться или отдаляться
camera.updateProjectionMatrix();  // Обновляем проекцию камеры

// Освещение
const ambientLight = new THREE.AmbientLight(0x404040, 5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Загрузка EXR-файла для фона
const exrLoader = new EXRLoader();
let backgroundMaterial;

exrLoader.load('./texture/sky.exr.exr', (texture) => {
  const geometry = new THREE.SphereGeometry(50, 64, 64);
  backgroundMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide,
  });
  const backgroundSphere = new THREE.Mesh(geometry, backgroundMaterial);
  scene.add(backgroundSphere);
  console.log("EXR-текстура успешно загружена и установлена как фон");
});

// Переменные для отслеживания положения мыши
let mouseX = 0;
let mouseY = 0;

// Обработчик движения мыши
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 0.1;
  mouseY = -(event.clientY / window.innerHeight - 0.5) * 0.1;
});

// Загрузка модели digital_watch.glb
const loader = new GLTFLoader();
let model;

loader.load(
  './model/digital_watch.glb',
  function (gltf) {
    model = gltf.scene;
    model.scale.set(70, 70, 70);
    model.position.z = 0;
    scene.add(model);
    updateProgressBar(100);
    progressContainer.remove();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false; // Отключаем панорамирование
    controls.enableZoom = false; // Отключаем зум
    controls.enableRotate = false; // Отключаем вращение

    animate();
  },
  function (xhr) {
    const percent = (xhr.loaded / xhr.total) * 100;
    updateProgressBar(percent);
  },
  function (error) {
    console.error('Ошибка загрузки модели:', error);
  }
);

// Модальное окно и диалог
var modal = document.getElementById("myModal");
var dialogText = document.getElementById("dialog-text");
var nextButton = document.getElementById("next-button");
var noButton = document.getElementById("no-button"); // Кнопка "Нет"
var closeButton = document.getElementsByClassName("close")[0];

// Массив фраз для диалога
var dialogue = [
  "Ваше будущее в ваших руках...",
  "Готовы увидеть, как ваши действия могут изменить судьбу?",
  "Ваш выбор?.."
];

// Переменная для отслеживания текущей фразы
var currentPhrase = 0;
var typingSpeed = 55;
var pauseDuration = 1300;

// Функция для печати текста
function typeWriter(text, callback) {
  let i = 0;
  dialogText.innerHTML = "";
  function type() {
    if (i < text.length) {
      dialogText.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, typingSpeed);
    } else {
      callback();
    }
  }
  type();
}

// Функция для отображения диалога
function showDialogue() {
  modal.style.display = "block";
  nextButton.style.display = "none"; // Скрыть кнопку "Да"
  noButton.style.display = "none"; // Скрыть кнопку "Нет"
  typeWriter(dialogue[currentPhrase], showNextPhrase);
}

function showNextPhrase() {
  currentPhrase++;
  if (currentPhrase < dialogue.length) {
    setTimeout(() => {
      typeWriter(dialogue[currentPhrase], function() {
        nextButton.style.display = "inline-block"; // Показываем кнопку "Да"
        noButton.style.display = "inline-block"; // Показываем кнопку "Нет"
      });
    }, pauseDuration);
  } else {
    nextButton.style.display = "none"; 
    noButton.style.display = "none"; 
  }
}

// Обработчик для кнопки "Да"
nextButton.addEventListener("click", function() {
  loadSecondModel();
  loadThirdModel();
  hideModelAndDialog();
  loadFourthModel(); // Вызов при клике
  loadFifthModel();
  loadSixthModel();
});

// Обработчик для кнопки "Согласен"
document.getElementById('agree-button').addEventListener("click", function() {
  loadSecondModel();
  loadThirdModel();
  hideModelAndDialog();
  loadFourthModel(); // Вызов при клике
  loadFifthModel();
  loadSixthModel();
});

// Обработчик для кнопки "Нет"
noButton.addEventListener("click", function() {
  modal.style.display = "none"; // Закрыть модальное окно
  alert("Вы выбрали 'Нет'");

  // Показать вирус с анимацией
  document.getElementById('virus').style.display = 'block';

  // Через 1 секунду вирус исчезает, а текст диалога обновляется
  setTimeout(function() {
    document.getElementById('virus').style.display = 'none';

    // Дать второй шанс — показать новую фразу
    modal.style.display = "block"; // Открываем модальное окно снова
    currentPhrase = 2; // Устанавливаем новую фразу (третья по счету)
    typeWriter(dialogue[currentPhrase], function() {

      // Если фраза "Сопротивляться бесполезно", показываем новые кнопки
      if (dialogue[currentPhrase] === "Ваш выбор?..") { 
        // Скрываем старые кнопки
        nextButton.style.display = "none";
        noButton.style.display = "none";
        
        // Показываем новые кнопки "Согласен" и "Не согласен"
        document.getElementById('agree-button').style.display = 'inline-block';
        document.getElementById('disagree-button').style.display = 'inline-block';
      }
    });
  }, 1000);
});


// Обработчик для кнопки "Согласен"
document.getElementById('agree-button').addEventListener("click", function() {
  // Действия при нажатии на "Согласен"
  alert("Вы выбрали 'Согласен'");
  // Добавьте здесь нужные действия, например, переход к следующему этапу.
});

// Обработчик для кнопки "Не согласен"
document.getElementById('disagree-button').addEventListener("click", function() {
  // Действия при нажатии на "Не согласен"
  alert("Вы выбрали 'Не согласен'");
  // Добавьте здесь нужные действия, например, отмену действий.
});




// Функция для загрузки второй модели (sci-fi_watch.glb)
let secondModel = null;
function loadSecondModel() {
  const loader = new GLTFLoader();
  loader.load(
    './model/sci-fi_watch.glb',
    function (gltf) {
      secondModel = gltf.scene;
      secondModel.scale.set(110, 110, 110);
      secondModel.position.z = -0.2;

      // Поворачиваем модель вниз
      secondModel.rotation.x = Math.PI / 2;
      secondModel.rotation.y = 0;
      secondModel.rotation.z = 0;

      scene.add(secondModel);
      console.log("Вторая модель sci-fi_watch загружена");
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total) * 100;
      updateProgressBar(percent);
    },
    function (error) {
      console.error('Ошибка загрузки второй модели:', error);
    }
  );
}

// Функция для скрытия текущей модели и модального окна
function hideModelAndDialog() {
  if (model) {
    model.visible = false;
  }
  modal.style.display = "none";
}

// Функция для открытия модального окна
var scrollText = document.getElementById("scroll-down-text");
scrollText.onclick = function() {
  showDialogue();
}

// Функция для загрузки третьей модели (hand_watch_high_poly.glb)
let thirdModel = null;
function loadThirdModel() {
  const loader = new GLTFLoader();
  loader.load(
    './model/hand_watch_high_poly.glb',
    function (gltf) {
      thirdModel = gltf.scene;

      // Проверяем реальный размер модели
      const box = new THREE.Box3().setFromObject(thirdModel);
      const size = box.getSize(new THREE.Vector3());
      console.log("Размер третьей модели:", size);

      // Вычисляем коэффициент масштабирования
      const maxDimension = Math.max(size.x, size.y, size.z);
      const scaleFactor = 4 / maxDimension;

      thirdModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
      thirdModel.position.set(4.9, -2, 0.8);

      thirdModel.rotation.y = Math.PI / 0.03; // 90 градусов

      thirdModel.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          child.material.opacity = 1;
          child.material.needsUpdate = true;
        }
      });

      scene.add(thirdModel);
      console.log("Третья модель добавлена в сцену");
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total) * 100;
      updateProgressBar(percent);
    },
    function (error) {
      console.error('Ошибка загрузки третьей модели:', error);
    }
  );
}


let fourthModel = null;
function loadFourthModel() {
  const loader = new GLTFLoader();
  loader.load(
    './model/moroccan.glb',
    function (gltf) {
      fourthModel = gltf.scene;
      console.log(fourthModel);

      fourthModel.position.set(11, 0.3, 0.7);
      fourthModel.scale.set(0.5, 0.5, 0.5);  

      scene.add(fourthModel);
      console.log("Четвертая модель добавлена в сцену");
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total) * 100;
      updateProgressBar(percent);
    },
    function (error) {
      console.error('Ошибка загрузки четвертой модели:', error);
    }
  );
}





let fifthModel = null;

function loadFifthModel() {
  const loader = new GLTFLoader(); // Теперь GLTFLoader будет определён!

  loader.load(
    './model/superidol.glb',
    function (gltf) {
      fifthModel = gltf.scene;
      console.log("Модель загружена:", fifthModel);

      fifthModel.rotation.x = Math.PI / 12;

      fifthModel.position.set(-10, -0.5, 0.3);
      fifthModel.scale.set(0.56, 0.56, 0.56);

      scene.add(fifthModel);
      console.log("Пятая модель добавлена в сцену");
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total) * 100;
      updateProgressBar(percent);
    },
    function (error) {
      console.error('Ошибка загрузки пятой модели:', error);
    }
  );
}

let sixthModel = null;
function loadSixthModel() {
  const loader = new GLTFLoader();
  loader.load(
    './model/thelast.glb',
    function (gltf) {
      sixthModel = gltf.scene;
      console.log(sixthModel);

      sixthModel.rotation.y = Math.PI / 2;  // 90° влево
      sixthModel.rotation.x = Math.PI / 2;  // 90° влево

      sixthModel.position.set(-4.5, 0, 0.7);
      sixthModel.scale.set(1.3, 1.3, 1.3);  

      scene.add(sixthModel);
      console.log("Шестая модель добавлена в сцену");
    },
    function (xhr) {
      const percent = (xhr.loaded / xhr.total) * 100;
      updateProgressBar(percent);
    },
    function (error) {
      console.error('Ошибка загрузки шестой модели:', error);
    }
  );
}


// Переменные для отслеживания позиции моделей
let modelsOffsetX = 0;
const modelWidth = 10; // Ширина модели
let targetOffsetX = 0; // Целевая позиция прокрутки
const scrollSpeed = 0.1; // Коэффициент интерполяции
const edgeOffset = 14; // Граница выхода (20 пикселей)

// Обработчик события колесика
window.addEventListener('wheel', function (event) {
  event.preventDefault();
  targetOffsetX += event.deltaY * 0.0001;  // Множитель для ускорения прокрутки
}, { passive: false });

// Плавное обновление позиции
function updateScroll() {
  modelsOffsetX += (targetOffsetX - modelsOffsetX) * scrollSpeed;
}

function animate() {
  requestAnimationFrame(animate);



// Переменные для отслеживания движения мыши (Только для первой модели)
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;

// Фиксируем нажатие кнопки мыши
document.addEventListener('mousedown', (event) => {
    isMouseDown = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});

// Отпускаем кнопку мыши
document.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Двигаем **только первую модель** при движении мыши
document.addEventListener('mousemove', (event) => {
    if (isMouseDown && model) { // Проверяем, что первая модель загружена
        let deltaX = event.clientX - prevMouseX;
        let deltaY = event.clientY - prevMouseY;
        
        model.rotation.y += deltaX * 0.00001; // Поворот влево-вправо
        model.rotation.x += deltaY * 0.00001; // Поворот вверх-вниз

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }
});




  if (backgroundMaterial && backgroundMaterial.map) {
    backgroundMaterial.map.offset.x = mouseX;
    backgroundMaterial.map.offset.y = mouseY;
  }

  // Проверка и телепортация моделей при выходе за границы
  function checkBounds(model) {
    if (model) {
      if (model.position.x > edgeOffset) {  // Правая граница
        model.position.x = -edgeOffset; // Перемещаем на левую сторону
      } else if (model.position.x < -edgeOffset) {  // Левая граница
        model.position.x = edgeOffset; // Перемещаем на правую сторону
      }
    }
  }

  // Обновляем позицию моделей с учётом прокрутки
  updateScroll();

  // Проверяем и двигаем модели
  if (secondModel) {
    checkBounds(secondModel); // Проверяем границу для первой модели
    secondModel.position.x += modelsOffsetX; // Сдвигаем модель в зависимости от прокрутки
  }

  if (thirdModel) {
    checkBounds(thirdModel); // Проверяем границу для второй модели
    thirdModel.position.x += modelsOffsetX; // Сдвигаем модель в зависимости от прокрутки
  }

  if (fourthModel) {
    checkBounds(fourthModel); // Проверяем границу для второй модели
    fourthModel.position.x += modelsOffsetX; // Сдвигаем модель в зависимости от прокрутки
  }

  if (fourthModel) {
    checkBounds(fifthModel); // Проверяем границу для второй модели
    fifthModel.position.x += modelsOffsetX; // Сдвигаем модель в зависимости от прокрутки
  }

  if (sixthModel) {
    checkBounds(sixthModel); // Проверяем границу для второй модели
    sixthModel.position.x += modelsOffsetX; // Сдвигаем модель в зависимости от прокрутки
  }

  // Рендеринг сцены
  renderer.render(scene, camera);
}
