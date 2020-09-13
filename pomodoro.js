class Pomodoro {
    sessionLength = 25;
    breakLength = 5;
    clockInstance = null;
    clockDOMSelector = "";
    currentMode = "";
    modesEnum = {
        SESSION: "session",
        BREAK: "break",
        CUSTOM: "custom"
    };
    onTick = null;

    constructor(clockDOMSelector = "", opt) {
        this.clockDOMSelector = clockDOMSelector;
        if (hasKeyInObject(opt, 'onTick')) {
            this.onTick = opt.onTick;
        }
    }

    initializeSession() {
        this.initializeClock({mode: this.modesEnum.SESSION});
        this.currentMode = this.modesEnum.SESSION;
    }

    initializeBreak() {
        this.initializeClock({mode: this.modesEnum.BREAK});
        this.currentMode = this.modesEnum.BREAK;
    }

    initializeClock(opt) {
        try {
            if (this.clockDOMSelector.trim() == ""){
                throw new PomodoroException("Please provide a dom element reference to render clock");
            }
            if (!hasKeyInObject(opt, "mode")){
                throw new PomodoroException("Please enter clock mode. Possible values ['session', 'break', 'custom']");
            }

            let totalDuration = 0;
            switch(opt.mode) {
                case this.modesEnum.SESSION:
                    totalDuration = this.sessionLength*60;
                    break;
                case this.modesEnum.BREAK:
                    totalDuration = this.breakLength*60;
                    break;
                case this.modesEnum.CUSTOM:
                    if (!hasKeyInObject(opt, "duration")) {
                        throw new PomodoroException("Duration of clock required in custom mode");
                    }
                    totalDuration = opt.duration * 60;
                    break;
                default: 
                    throw new PomodoroException("invalid parameter 'mode'");
            }

            if (this.clockInstance !== null) {
                this.clockInstance.stop();
                this.clockInstance = null;
            }

            const interValCallBack = (minutesLeft, secondsLeft) => {
                if (minutesLeft === 0 && secondsLeft <= 1) {
                    debugger
                    this.isSession ? this.initializeBreak() : this.initializeSession();
                    this.start();
                }
                if (this.onTick!== null) {
                    this.onTick(minutesLeft, secondsLeft);
                }
            }

            this.clockInstance = $(this.clockDOMSelector).FlipClock(totalDuration, {
		        clockFace: 'MinuteCounter',
		        countdown: true,
                autoStart: false,
                showSeconds: true,
		        callbacks: {
		        	start: function(){
                        
                    },
                    stop: function(){                        

                    },
                    interval: function() {
                        var time = this.factory.getTime().time;
                        const minutesLeft = parseInt(time/60, 10);
                        const secondsLeft = parseInt(time%60,10);
		        		if(time) {
                            console.log(`Time left: ${minutesLeft} minutes and ${secondsLeft} seconds`);
                            interValCallBack(minutesLeft, secondsLeft);
                        }
                    }
                }
            });

        } catch (error) {
            console.error(error);
        }
    }

    start() {
        this.clockInstance.start();
    }

    stop() {
        this.clockInstance.stop();
    }

    reset() {
        this.initializeSession();
    }

    isSession() {
        return this.currentMode === this.modesEnum.SESSION;
    }

    isBreak() {
        return this.currentMode === this.modesEnum.BREAK;
    }

    updateSessionDuration(valChange) {
        if (this.sessionLength + valChange > 0) {
            this.sessionLength += valChange;
        }
    }

    updateBreakDuration(valChange) {
        if (this.breakLength + valChange > 0) {
            this.breakLength += valChange;
        }
    }

    getSessionLength() {
        return this.sessionLength;
    }

    getBreakLength() {
        return this.breakLength;
    }
}


class PomodoroException {
    message = "";
    innerException = null;
    constructor(message = "", exception = null) {
        this.message = message;
        this.innerException= exception;
    }

    toString() {
        return JSON.stringify({message, InnerException: exception});
    }
}