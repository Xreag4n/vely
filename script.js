document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTOS
  // ===============================
  const audio = document.getElementById("audioPlayer");
  const currentDisc = document.getElementById("currentDisc");
  const musicItems = document.querySelectorAll(".music-item");
  const images = document.querySelectorAll(".gallery-item");

  if (!audio || !currentDisc) {
    console.error("No se encontró audioPlayer o currentDisc en el HTML");
    return;
  }

  // ===============================
  // ESTADO
  // ===============================
  let isPlaying = false;
  let rotationAngle = 0;
  let lastTime = null;
  let animationId = null;
  let currentItem = null;

  const ROTATION_SPEED = 90;

  // ===============================
  // CONFIGURAR CANCIÓN INICIAL
  // ===============================
  // Tomamos el PRIMER vinilo del menú automáticamente
  if (musicItems.length > 0) {

    const firstItem = musicItems[0];
    const initialAudio = firstItem.getAttribute("data-audio");
    const initialImage = firstItem.getAttribute("src");

    // Cargar canción e imagen
    audio.src = initialAudio;
    currentDisc.src = initialImage;

    // Ocultar ese vinilo del menú
    firstItem.style.display = "none";
    currentItem = firstItem;
  }

  // ===============================
  // ROTACIÓN SUAVE
  // ===============================
  function rotateDisc(timestamp) {
    if (!isPlaying) return;

    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    rotationAngle += ROTATION_SPEED * deltaTime;
    rotationAngle = rotationAngle % 360;

    currentDisc.style.transform = `rotate(${rotationAngle}deg)`;
    animationId = requestAnimationFrame(rotateDisc);
  }

  // ===============================
  // PLAY / PAUSE
  // ===============================
  function playMusic() {
    if (!audio.src) return;

    audio.play().catch(() => {});
    isPlaying = true;
    lastTime = null;
    animationId = requestAnimationFrame(rotateDisc);
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;

    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // ===============================
  // CLICK EN DISCO PRINCIPAL
  // ===============================
  currentDisc.addEventListener("click", () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  });

  // ===============================
  // CLICK EN VINILOS DEL MENÚ
  // ===============================
  musicItems.forEach(item => {
    item.addEventListener("click", () => {

      const newSrc = item.getAttribute("data-audio");
      const newImg = item.getAttribute("src");

      // Mostrar el anterior en el menú
      if (currentItem) {
        currentItem.style.display = "";
      }

      // Ocultar el nuevo seleccionado
      item.style.display = "none";
      currentItem = item;

      // Cambiar disco principal
      currentDisc.src = newImg;

      // Cambiar audio
      audio.src = newSrc;

      // Reiniciar rotación
      rotationAngle = 0;
      currentDisc.style.transform = "rotate(0deg)";

      playMusic();
    });
  });

  // ===============================
  // CUANDO TERMINA LA CANCIÓN
  // ===============================
  audio.addEventListener("ended", () => {
    pauseMusic();
  });

  // ===============================
  // GALERÍA
  // ===============================
  let currentTextBlock = null;

  images.forEach(img => {
    img.addEventListener("click", () => {

      const text = img.getAttribute("data-text");
      const card = img.parentElement;

      if (currentTextBlock && currentTextBlock.parentElement === card) {
        currentTextBlock.remove();
        currentTextBlock = null;
        return;
      }

      if (currentTextBlock) {
        currentTextBlock.remove();
        currentTextBlock = null;
      }

      const textDiv = document.createElement("div");
      textDiv.classList.add("photo-inline-text");
      textDiv.textContent = text;

      card.appendChild(textDiv);
      currentTextBlock = textDiv;
    });
  });

});


// ===============================
// AUTO-SCROLL HORIZONTAL POR BORDES
// ===============================

const musicMenu = document.querySelector(".music-menu");

let scrollSpeed = 0;
const maxSpeed = 6;      // velocidad máxima
const edgeZone = 80;     // tamaño del área sensible en los bordes

musicMenu.addEventListener("mousemove", (e) => {
    const rect = musicMenu.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    // Borde izquierdo
    if (mouseX < edgeZone) {
        const intensity = (edgeZone - mouseX) / edgeZone;
        scrollSpeed = -maxSpeed * intensity;
    }
    // Borde derecho
    else if (mouseX > rect.width - edgeZone) {
        const intensity = (mouseX - (rect.width - edgeZone)) / edgeZone;
        scrollSpeed = maxSpeed * intensity;
    }
    else {
        scrollSpeed = 0;
    }
});

musicMenu.addEventListener("mouseleave", () => {
    scrollSpeed = 0;
});

function autoScrollMenu() {
    if (scrollSpeed !== 0) {
        musicMenu.scrollLeft += scrollSpeed;
    }
    requestAnimationFrame(autoScrollMenu);
}

autoScrollMenu();


item.addEventListener("mouseenter", () => item.play());
