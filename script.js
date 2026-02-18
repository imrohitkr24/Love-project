// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- Variables ---
const musicBtn = document.getElementById('music-toggle');
const musicIcon = musicBtn.querySelector('i');
const bgMusic = document.getElementById('bg-music');
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');
const body = document.body;

// --- Music Control ---
let isPlaying = false;
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-music');
        musicIcon.style.animation = 'none';
    } else {
        bgMusic.play().catch(e => alert("Interact first!"));
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

// --- Starry Background (Canvas) ---
const canvas = document.getElementById('stars');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let stars = [];
    const numStars = 100;

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = (Math.random() - 0.5) * 0.2; // Slow movement
            this.speedY = (Math.random() - 0.5) * 0.2;
            this.alpha = Math.random();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            this.alpha += (Math.random() - 0.5) * 0.02;
            if (this.alpha < 0.1) this.alpha = 0.1;
            if (this.alpha > 0.8) this.alpha = 0.8;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initStars() {
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }
    }
    initStars();

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.update();
            star.draw();
        });
        requestAnimationFrame(animateStars);
    }
    animateStars();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// --- Envelope Logic ---
const envelope = document.getElementById('envelope');
const openBtn = document.getElementById('open-btn');

function openEnvelope() {
    if (!envelope) return;
    envelope.classList.add('open');

    // Smooth scroll to letter after animation
    setTimeout(() => {
        document.getElementById('love-letter').scrollIntoView({ behavior: 'smooth' });
        // Start typing effect slightly after scroll
        setTimeout(() => startTypewriter(), 800);
    }, 1500);
}

if (envelope) envelope.addEventListener('click', openEnvelope);
if (openBtn) openBtn.addEventListener('click', openEnvelope);


// --- 3D Carousel Logic ---
const carousel = document.querySelector('.carousel');
const items = document.querySelectorAll('.carousel-item');

if (carousel && items.length > 0) {
    const itemCount = items.length;
    const angle = 360 / itemCount;
    let currAngle = 0;

    // Arrange items in a circle
    items.forEach((item, index) => {
        item.style.transform = `rotateY(${index * angle}deg) translateZ(300px)`; // Increased Z for better spacing
    });

    // Auto Rotation
    let autoRotate = setInterval(() => {
        currAngle -= 0.2;
        carousel.style.transform = `rotateY(${currAngle}deg)`;
    }, 20);

    // Interaction (Drag/Swipe) to rotate
    let isDragging = false;
    let startX, currentRotate;

    const container = document.querySelector('.carousel-container');

    container.addEventListener('mousedown', (e) => {
        clearInterval(autoRotate); // Stop auto rotate on interaction
        isDragging = true;
        startX = e.pageX;
        currentRotate = currAngle;
        carousel.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        if (carousel) carousel.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.pageX - startX;
        currAngle = currentRotate + (dx * 0.5);
        carousel.style.transform = `rotateY(${currAngle}deg)`;
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        clearInterval(autoRotate);
        startX = e.touches[0].pageX;
        currentRotate = currAngle;
    });

    container.addEventListener('touchmove', (e) => {
        const dx = e.touches[0].pageX - startX;
        currAngle = currentRotate + (dx * 0.5);
        carousel.style.transform = `rotateY(${currAngle}deg)`;
    });
}


// --- Typewriter Effect (Improved) ---
const loveMessage = `My Dearest Love,

From the moment you stepped into my life, everything became brighter. Your smile is my sunshine, and your laughter is my favorite song.

I never knew what true happiness was until I found you. You are my peace in the chaos, my calm in the storm, and the love I've always dreamed of.

I promise to cherish every moment with you, to support your dreams, and to love you more with every passing day.

You are not just my love; you are my best friend, my soulmate, and my forever.`;

function startTypewriter() {
    const textContainer = document.getElementById('typewriter-text');
    if (!textContainer || textContainer.dataset.typingStarted === "true") return;
    textContainer.dataset.typingStarted = "true";

    let i = 0;
    const speed = 30;

    function type() {
        if (i < loveMessage.length) {
            textContainer.innerHTML += loveMessage.charAt(i) === '\n' ? '<br>' : loveMessage.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            gsap.to(".love-quote", {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.5,
                ease: "power2.out"
            });
        }
    }
    type();
}

ScrollTrigger.create({
    trigger: "#love-letter",
    start: "top 70%",
    onEnter: startTypewriter
});

// --- Scroll Animations ---
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

// --- Flip Cards (Reasons) ---
document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        confetti({
            particleCount: 30,
            spread: 50,
            origin: {
                x: card.getBoundingClientRect().left / window.innerWidth,
                y: card.getBoundingClientRect().top / window.innerHeight
            },
            colors: ['#ff69b4', '#ffb7c5']
        });
    });
});

// --- Final Surprise ---
const surpriseBtn = document.getElementById('surprise-btn');
const finalMsg = document.getElementById('final-message');

if (surpriseBtn) {
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

        function randomInRange(min, max) { return Math.random() * (max - min) + min; }

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    });
}

// --- Yes Button ---
const yesBtn = document.getElementById('final-yes-btn');
let clickStep = 0;
const messages = ["Are you sure? 🤔", "Really sure? 🤨", "Think again! 🙄", "Last chance! 😬", "Okay, press this! 💖"];

if (yesBtn) {
    yesBtn.addEventListener('click', () => {
        if (clickStep < messages.length) {
            yesBtn.innerText = messages[clickStep];
            gsap.from(yesBtn, { scale: 1.2, duration: 0.2, ease: "back.out(1.7)" });
            const randomX = (Math.random() - 0.5) * 50;
            const randomY = (Math.random() - 0.5) * 20;
            gsap.to(yesBtn, { x: randomX, y: randomY, duration: 0.2 });
            clickStep++;
        } else {
            yesBtn.innerText = "YAY! I KNEW IT! 😍";
            gsap.to(yesBtn, { scale: 1.5, rotate: 360, duration: 0.5, ease: "elastic.out(1, 0.3)" });

            // Final Confetti
            const duration = 3000;
            const end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 10, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff0000', '#ffa500'] });
                confetti({ particleCount: 10, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff0000', '#ffa500'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());

            setTimeout(() => alert("I Love You So Much! 💖 Thank you for being mine!"), 500);
        }
    });
}
