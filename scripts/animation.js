document.addEventListener('DOMContentLoaded', () => {
    const sceneContainer = document.getElementById('scene-container');
    const scrollDownText = document.getElementById('scroll-down-text');
    const secondScreen = document.getElementById('second-screen');
  
    // Показываем надпись "Scroll Down" через 2 секунды
    setTimeout(() => {
      scrollDownText.classList.remove('hidden');
      scrollDownText.classList.add('visible');
    }, 2000);
  
    // Обработка прокрутки страницы
    window.addEventListener('scroll', () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  
      // Плавное исчезновение 3D-сцены и надписи "Scroll Down"
      sceneContainer.style.opacity = 1 - scrollPercent;
      scrollDownText.style.opacity = 1 - scrollPercent;
  
      // Показываем второй экран, когда прокрутка достигает 50%
      if (scrollPercent > 0.5) {
        secondScreen.classList.remove('hidden');
        secondScreen.classList.add('visible');
      } else {
        secondScreen.classList.remove('visible');
        secondScreen.classList.add('hidden');
      }
    });
  });

