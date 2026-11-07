// ========================================
// 1. LOVE MESSAGES
// ========================================

const messages = [
    "I see a future with you.",
    "I think about you every time.",
    "I love you, my love.",
    "I have a future with you.",
    "My love, you are my everything.",
    "I love you more than you think.",
    "I think about you every time."
];

const message = document.getElementById("loveMessage");

let messageIndex = 0;
let direction = 1;


// ========================================
// 2. HEART CANVAS
// ========================================

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");

let W, H, particles = [];
let time = 0;
let lastTime = 0;

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createHeart();
}


// ========================================
// 3. HEART MATHEMATICAL FORMULA
// ========================================

function heartShape(t) {

    const x = 16 * Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return { x, y };
}


// ========================================
// 4. CREATE GLOWING PARTICLES
// ========================================

function createHeart() {

    particles = [];

    const count = W < 600 ? 420 : 750;

    const scale = Math.min(W / 43, H / 39);

    const centerX = W / 2;
    const centerY = H / 2;

    for (let i = 0; i < count; i++) {

        const t = Math.random() * Math.PI * 2;

        const heart = heartShape(t);

        // Fill the heart instead of creating only an outline.

        const fill = Math.sqrt(Math.random());

        const x =
            centerX + heart.x * fill * scale;

        const y =
            centerY - heart.y * fill * scale;

        particles.push({

            x: Math.random() * W,
            y: Math.random() * H,

            targetX: x,
            targetY: y,

            size: Math.random() * 1.8 + .6,

            alpha: Math.random() * .6 + .35,

            speed: Math.random() * 2 + .5,

            phase: Math.random() * Math.PI * 2,

            drift: Math.random() * 15 + 5,

            color: Math.random() > .5
                ? "190, 210, 255"
                : "180, 125, 255"

        });
    }
}


// ========================================
// 5. ANIMATE THE HEART
// ========================================

function animate(timestamp) {

    requestAnimationFrame(animate);

    const dt = Math.min(
        (timestamp - (lastTime || timestamp)) / 1000,
        .04
    );

    lastTime = timestamp;

    time += dt;

    ctx.clearRect(0, 0, W, H);

    // Heart breathing effect.

    const pulse = 1 + Math.sin(time * 2) * .025;

    // Heart dissolving and reforming effect.

    const dissolve = Math.pow(
        Math.max(0, Math.sin(time * .8)),
        5
    );

    particles.forEach(p => {

        const wave = Math.sin(
            time * p.speed + p.phase
        );

        const spread = dissolve * p.drift;

        const targetX =
            W / 2 +
            (p.targetX - W / 2) * pulse;

        const targetY =
            H / 2 +
            (p.targetY - H / 2) * pulse;

        const movingX =
            targetX +
            Math.cos(p.phase + time) * spread;

        const movingY =
            targetY +
            Math.sin(p.phase + time) * spread;

        // Smooth movement.

        p.x += (movingX - p.x) * Math.min(1, dt * 4);

        p.y += (movingY - p.y) * Math.min(1, dt * 4);

        // Glowing particles.

        const opacity =
            p.alpha *
            (.65 + .35 * Math.sin(time * 2 + p.phase));

        const size =
            p.size * (1 + Math.max(0, wave) * .3);

        ctx.beginPath();

        ctx.fillStyle =
            `rgba(${p.color}, ${opacity})`;

        ctx.shadowBlur = 12;

        ctx.shadowColor =
            `rgba(${p.color}, .95)`;

        ctx.arc(
            p.x,
            p.y,
            size,
            0,
            Math.PI * 2
        );

        ctx.fill();

    });

    ctx.shadowBlur = 0;
}


// ========================================
// 6. REVERSE MESSAGE CYCLE
// ========================================

function changeMessage() {

    message.classList.add("fade");

    setTimeout(() => {

        messageIndex += direction;

        if (messageIndex >= messages.length - 1) {

            messageIndex = messages.length - 1;

            direction = -1;

        } else if (messageIndex <= 0) {

            messageIndex = 0;

            direction = 1;
        }

        message.textContent = messages[messageIndex];

        message.classList.remove("fade");

    }, 700);
}


// Change message every 4 seconds.

setInterval(changeMessage, 4000);


// ========================================
// 7. BACKGROUND MUSIC
// ========================================

const audio = document.getElementById("backgroundMusic");

const musicButton = document.getElementById("musicButton");

const musicIcon = document.getElementById("musicIcon");

audio.loop = true;


// Try automatic playback when the page opens.

async function startMusic() {

    try {

        await audio.play();

        musicIcon.textContent = "Ⅱ";

        musicButton.setAttribute(
            "aria-label",
            "Pause music"
        );

    } catch (error) {

        // Browser may block automatic audio.
        // The visitor can start it with the button.

        musicIcon.textContent = "▶";

        musicButton.setAttribute(
            "aria-label",
            "Play music"
        );
    }
}


// Pause and play control.

musicButton.addEventListener("click", async () => {

    if (audio.paused) {

        try {

            await audio.play();

            musicIcon.textContent = "Ⅱ";

            musicButton.setAttribute(
                "aria-label",
                "Pause music"
            );

        } catch (error) {

            musicIcon.textContent = "▶";
        }

    } else {

        audio.pause();

        musicIcon.textContent = "▶";

        musicButton.setAttribute(
            "aria-label",
            "Play music"
        );
    }

});


// Backup: restart music if the track ends.

audio.addEventListener("ended", () => {

    audio.currentTime = 0;

    audio.play().catch(() => {

        musicIcon.textContent = "▶";

    });

});


// ========================================
// 8. START THE PROJECT
// ========================================

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

requestAnimationFrame(animate);

startMusic();