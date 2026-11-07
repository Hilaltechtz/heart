const gift = document.getElementById("gift");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

const openButton = document.getElementById("openGift");
const welcome = document.getElementById("welcome");
const surprise = document.getElementById("surprise");
const replay = document.getElementById("replay");

const starsContainer = document.getElementById("stars");
const heartsContainer = document.getElementById("hearts");

// CREATE BACKGROUND STARS
function createStars() {
    for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");

        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";

        const size = Math.random() * 3 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        star.style.animationDelay = Math.random() * 3 + "s";

        starsContainer.appendChild(star);
    }
}

// FLOATING HEARTS
function createHearts() {
    const emojis = ["💜", "💖", "✨", "💕", "🤍", "🌸"];

    const heart = document.createElement("span");

    heart.className = "heart";

    heart.textContent =
        emojis[Math.floor(Math.random() * emojis.length)];

    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = Math.random() * 20 + 15 + "px";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 6500);
}

// UPDATE MUSIC BUTTON
function updateMusicButton() {
    musicToggle.textContent = bgMusic.paused
        ? "🎵 PLAY MUSIC"
        : "🎵 PAUSE MUSIC";
}

// START MUSIC
function startMusic() {
    bgMusic.play()
        .then(() => {
            updateMusicButton();
        })
        .catch(error => {
            console.log("Music playback failed:", error);
            updateMusicButton();
        });
}

// OPEN THE GIFT
function openTheGift() {

    openButton.disabled = true;
    openButton.textContent = "OPENING YOUR SURPRISE...";

    gift.classList.add("open");

    // START THE BACKGROUND MUSIC
    startMusic();

    setTimeout(() => {

        welcome.classList.add("hidden");
        surprise.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // CELEBRATION HEARTS
        for (let i = 0; i < 30; i++) {
            setTimeout(createHearts, i * 120);
        }

    }, 1300);
}

// PLAY OR PAUSE MUSIC
function toggleMusic() {

    if (bgMusic.paused) {
        startMusic();
    } else {
        bgMusic.pause();
        updateMusicButton();
    }
}

// CLOSE GIFT AND RETURN TO WELCOME SCREEN
function closeGift() {

    // STOP MUSIC AND RESET TO BEGINNING
    bgMusic.pause();
    bgMusic.currentTime = 0;

    updateMusicButton();

    // HIDE THE SURPRISE
    surprise.classList.add("hidden");
    welcome.classList.remove("hidden");

    // RESET GIFT BOX
    gift.classList.remove("open");

    // RESET OPEN BUTTON
    openButton.disabled = false;
    openButton.innerHTML = 'OPEN YOUR GIFT <span>✦</span>';

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// BUTTON CONNECTIONS
openButton.addEventListener("click", openTheGift);

musicToggle.addEventListener("click", toggleMusic);

replay.addEventListener("click", closeGift);

// START WEBSITE
createStars();

// FLOATING HEARTS
setInterval(createHearts, 1800);