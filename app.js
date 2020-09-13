let pomodoroApp = null;

const timerStartedText = "Timer Started";
const timerStoppedText = "Timer Stopped";
const defaultText = "Focus Timer";

const btnStartTimer = document.getElementById("btnStartTimer");
const btnStopTimer = document.getElementById("btnResetTimer");
const sessionLength = document.querySelector('.session-length');
const breakLength = document.querySelector('.break-length');
const decrementBreakBtn = document.querySelector('.decrement-break');
const incrementBreakBtn = document.querySelector('.increment-break');
const decrementSessionBtn = document.querySelector('.decrement-session');
const incrementSessionBtn = document.querySelector('.increment-session');
const statsTextElem = document.querySelector('#stats');

function Main() {
    pomodoroApp = new Pomodoro('.clock', {onTick: handleOnClockTick});
    pomodoroApp.initializeSession();

    updateSessionBreakInView();

    btnStartTimer.addEventListener('click', handleStartStopButtonClick);
    btnStopTimer.addEventListener('click', handleResetButtonClick);

    incrementBreakBtn.addEventListener('click', () => {
        pomodoroApp.updateBreakDuration(1);
        updateSessionBreakInView();
    })

    incrementSessionBtn.addEventListener('click', () => {
        pomodoroApp.updateSessionDuration(1);
        updateSessionBreakInView();
    })

    decrementBreakBtn.addEventListener('click', () => {
        pomodoroApp.updateBreakDuration(-1);
        updateSessionBreakInView();
    })

    decrementSessionBtn.addEventListener('click', () => {
        pomodoroApp.updateSessionDuration(-1);
        updateSessionBreakInView();
    })

    // Setup splash animation of buttons
    document.querySelectorAll('.splashable').forEach(node => {
        node.addEventListener('mousedown', () => {
            if (node.classList.contains("animateOnce")) {
                node.classList.remove("animateOnce");
            }
        });

        node.addEventListener('mouseup', () => {
            node.classList.add("animateOnce");
        });
    });
}

function handleOnClockTick(minutesElapsed, secondsElapsed) {
    if (pomodoroApp.isSession()) {
        statsTextElem.innerText = minutesElapsed > 0 ? `Session in progress. Keep focusing! only ${minutesElapsed} more minutes to go!` : `Almost there! Less than a minute left to break!`;
    } else {
        statsTextElem.innerText = minutesElapsed > 0 ? `Great Job! You deserve a break. Next session starting in ${minutesElapsed} minutes!` : `Prepare yourself! Session starting in a minute!`;
    }
}

function updateSessionBreakInView() {
    sessionLength.innerText = pomodoroApp.getSessionLength();
    breakLength.innerText = pomodoroApp.getBreakLength();
}

function handleStartStopButtonClick(ev) {
    if (ev.currentTarget.dataset.mode === "start") {
        pomodoroApp.start();
        btnStartTimer.dataset.mode = "stop";
        btnStartTimer.innerHTML = '<i class="las la-pause"></i>';
    } else {
        pomodoroApp.stop();
        btnStartTimer.dataset.mode = "start";
        btnStartTimer.innerHTML = '<i class="las la-play"></i>';
    }
}

function handleResetButtonClick(ev) {
    pomodoroApp.reset();

    btnStartTimer.dataset.mode = "start";
    btnStartTimer.innerHTML = '<i class="las la-play"></i>';

    statsTextElem.innerText = `Lets Start focusing!`;
}

// Start Pomodoro Application
$(Main);