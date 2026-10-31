const clickArea = document.getElementById("clickArea");
const clickText = document.getElementById("clickText");
const cpsValue = document.getElementById("cpsValue");
const timeLeft = document.getElementById("timeLeft");
const clickCount = document.getElementById("clickCount")
const bestCPS = document.getElementById("bestCPS");
const resetBtn = document.getElementById("resetBtn");

let duration = 10;
// duration of the game
let clicks = 0;
let startTime = 0;
let endTime = 0;
let timerInterval = null;
let running = false;
let finished = false;
let beat = 0;

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

    clicks = 0;
    running = false;
    finished = false;

    cpsValue.textContent = "0.00";
    clickCount.textContent = "0";
    timeLeft.textContent = duration.toFixed(1) + "s";

    clickText.textContent = "CLICK TO START";
}

function startCPS() {
    running = true;
    finished = false; 
    clicks = 1;

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
        finishedCPS();
    }
}

function finishCPS() {
    clearInterval(timerInterval);

    running = false;
    finished = true;

    const finalCPS = clicks / duration;
    cpsValue.textContent = finalCPS.toFixed(2);
    timeLeft.textContent = "0.0s";

    if (finalCPS > beat) {
        best = finalCPS;
        bestCPS.textContent = best.toFixed(2);
    }

    clickArea.addEventListener("click",() => {
        if (finished) return;

        if (!running) {
            startCPS();
            return;
        }

        clicks++;
        clickCount.tectContext = clicks;

        const elsapsed = Math.max(1, performance.now() - startTime);
        cpsValue.textContext = (clicks / (elapsed / 1000)).toFixed(2);
    });
    resetBtn.addEventListener("click", resetCPS);

    resetCPS();
}