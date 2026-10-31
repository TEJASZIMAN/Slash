const clickArea = document.getElementById("clickArea");
const clickText = document.getElementById("clickText");
const cpsValue = document.getElementById("cpsValue");
const timeLeft = document.getElementById("timeLeft");
const clickCount = document.getElementById("clickCount")
const bestCPS = document.getElementById("bestCPS");
const resetBtn = document.getElementById("resetBtn");

let duration = 10;
let clicks = 0;
let startTime = 0;
let endTime = 0;
let timerInterval = null;
let starting = false;
let running = false;
let finished = false;
let beat = 0;
let countdownInterval = null;
let countdownTimeout = null;

const durationButtons = document.querySelectorAll(".duration");

durationButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (running) return;

        durationButtons.forEach(btn => 
            btn.classList.remove("active"));
            button.classList.add("active");

            duration = Number(button.dataset.time);
            resetCPS();
    });
});

function resetCPS() {
    clearInterval(timerInterval);
    clearInterval(countdownInterval);
    clearTimeout(countdownTimeout);
    starting = false;

    clicks = 0;
    running = false;
    finished = false;

    cpsValue.textContent = "0.00";
    clickCount.textContent = "0";
    timeLeft.textContent = duration.toFixed(1) + "s";

    clickText.textContent = "CLICK TO START";
}

function startCPS() {
    starting = true;

    let count = 3;
    clickText.textContent = count;

    countdownInterval = setInterval(() => {
        count--;

        if (count > 0) {
            clickText.textContent = count;
        } else {
            clearInterval(countdownInterval);
            countdownInterval = null;

            clickText.textContent = "GO!";

            countdownTimeout = setTimeout(() => {
                starting = false;
                beginTest();
            }, 500);
        }
    }, 1000);
}

function beginTest() {
    running = true;
    finished = false;
    clicks = 0;

    startTime = performance.now();
    endTime = startTime + duration * 1000;

    clickText.textContent = "KEEP CLICKING!";
    clickCount.textContent = clicks;

    timerInterval = setInterval(updateTimer, 30);
}

function updateTimer() {
    const now = performance.now();
    const remaining = Math.max(0, endTime - now);
    
    timeLeft.textContent = (remaining / 1000).toFixed(1) + "s";

    const elapsed = Math.min(now - startTime, duration * 1000);

    const currentCPS = clicks / (elapsed / 1000);
    cpsValue.textContent = currentCPS.toFixed(2);

    if (remaining <= 0) {
        finishCPS();
    }
}

function finishCPS() {
    clearInterval(timerInterval);

    running = false;
    finished = true;

    const finalCPS = clicks / duration;
    cpsValue.textContent = finalCPS.toFixed(2);
    timeLeft.textContent = "0.0s";
    clickText.textContent = "TEST ENDED!";

    if (finalCPS > beat) {
        beat = finalCPS;
        bestCPS.textContent = beat.toFixed(2);
    }
}

resetBtn.addEventListener("click", resetCPS);
 clickArea.addEventListener("click",() => {
        if (finished || starting) return;

        if (!running) {
            startCPS();
            return;
        }

        clicks++;
        clickCount.textContent = clicks;

        const elsapsed = Math.max(1, performance.now() - startTime);
        cpsValue.textContent = (clicks / (elsapsed / 1000)).toFixed(2);
        
    });
      resetCPS();