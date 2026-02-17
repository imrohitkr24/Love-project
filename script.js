// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- Variables ---
const musicBtn = document.getElementById('music-toggle');
const musicIcon = musicBtn.querySelector('i');
const bgMusic = document.getElementById('bg-music');
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const body = document.body;

// --- Date We Met (CONFIGURABLE) ---
const meetDate = new Date("2020-01-01T00:00:00"); // CHANGE THIS DATE

// --- Countdown Timer Removed for Simplicity ---

// --- Music Control ---
let isPlaying = false;
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-music');
        musicIcon.style.animation = 'none';
    } else {
        bgMusic.play().catch(e => alert("Please interact with the page first or check if audio file exists!"));
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
        musicIcon.style.animation = 'spin 4s linear infinite';
    }
    isPlaying = !isPlaying;
});

// --- Theme Toggle ---
themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});

// --- Heart Trail Cursor ---
document.addEventListener('mousemove', (e) => {
    const heart = document.createElement('div');
    heart.classList.add('heart-trail');
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';

    // Randomize size and rotation
    const size = Math.random() * 20 + 10;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    heart.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.getElementById('cursor-trail').appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 1000);
});

// --- Background Floating Hearts ---
function createFloatingHearts() {
    const container = document.getElementById('bg-hearts');
    const heartCount = 20;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.classList.add('bg-heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        container.appendChild(heart);
    }
}
createFloatingHearts();

// --- GSAP Animations ---

// 1. Hero Entrance
const tl = gsap.timeline();
tl.from(".hero-title", { opacity: 0, y: -50, duration: 1.5, ease: "power4.out" })
    .from(".hero-subtitle", { opacity: 0, y: 20, duration: 1 }, "-=1")
    .from("#enter-btn", { scale: 0, opacity: 0, rotation: 180, duration: 1, ease: "back.out(1.7)" }, "-=0.5");

// 2. Button Click Transition
document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('love-letter').scrollIntoView({ behavior: 'smooth' });

    // Trigger typewriter after scroll
    setTimeout(startTypewriter, 1000);
});

// 3. Typewriter Effect
const loveMessage = `The day you came into my life, everything changed.
You are my peace, my happiness, my favorite person.
I made this just to remind you how special you are to me.
Every moment with you is a treasure I hold dear.`;

function startTypewriter() {
    const textContainer = document.getElementById('typewriter-text');
    if (textContainer.innerText.length > 0) return; // Recently run

    let i = 0;
    const speed = 50;

    function type() {
        if (i < loveMessage.length) {
            textContainer.innerHTML += loveMessage.charAt(i) === '\n' ? '<br>' : loveMessage.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// 4. Scroll Reveal Sections
gsap.utils.toArray('.content-section').forEach(section => {
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
        },
        opacity: 1,
        y: 0,
        duration: 1
    });
});

// 5. Flip Cards Interaction
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        // Small burst effect
        confetti({
            particleCount: 50,
            spread: 70,
            origin: {
                x: card.getBoundingClientRect().left / window.innerWidth,
                y: card.getBoundingClientRect().top / window.innerHeight
            },
            colors: ['#ff69b4', '#ffb7c5']
        });
    });
});

// 6. Final Surprise
const surpriseBtn = document.getElementById('surprise-btn');
const finalMsg = document.getElementById('final-message');

surpriseBtn.addEventListener('click', () => {
    surpriseBtn.style.display = 'none';
    finalMsg.style.display = 'block';

    gsap.fromTo(finalMsg,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "elastic.out(1, 0.3)" }
    );

    // Fireworks
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
});

// 7. Multi-step Final Button Interaction
const yesBtn = document.getElementById('final-yes-btn');
let clickStep = 0;
const messages = [
    "Are you sure? 🤔",
    "Really sure? 🤨",
    "Think again! 🙄",
    "Last chance! 😬",
    "Okay, press this! 💖"
];

yesBtn.addEventListener('click', () => {
    if (clickStep < messages.length) {
        // Change text and animate button
        yesBtn.innerText = messages[clickStep];
        gsap.from(yesBtn, { scale: 1.2, duration: 0.2, ease: "back.out(1.7)" });

        // Move button slightly to make it playful
        const randomX = (Math.random() - 0.5) * 50;
        const randomY = (Math.random() - 0.5) * 20;
        gsap.to(yesBtn, { x: randomX, y: randomY, duration: 0.2 });

        clickStep++;
    } else {
        // Final Success State
        yesBtn.innerText = "YAY! I KNEW IT! 😍";
        gsap.to(yesBtn, { scale: 1.5, rotate: 360, duration: 0.5, ease: "elastic.out(1, 0.3)" });

        // Massive Confetti Explosion
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 10,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
            });
            confetti({
                particleCount: 10,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Sweet Alert (using standard alert for now as requested, but delayed slightly for effect)
        setTimeout(() => {
            alert("I Love You So Much! 💖 Thank you for being mine!");
        }, 500);
    }
});

/* Easter Egg: Click heart 5 times */
let heartClickCount = 0;
document.querySelector('.heart-pulse').addEventListener('click', () => {
    heartClickCount++;
    if (heartClickCount === 5) {
        alert("You found a secret! I love you infinitely! ♾️💖");
        heartClickCount = 0;
    }
});
