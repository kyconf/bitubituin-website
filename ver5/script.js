document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("interaction-overlay");
    const header = document.getElementById("ui-header");
    const phone = document.querySelector(".phone");
    const audio = document.getElementById("incoming-call-audio");
    const uiIcon = document.getElementById("ui-icon");
    
    const progressBar = document.querySelector('.progress-bar');
    const timeDisplay = document.querySelector('.time-stamps span:first-child');
    const remainingDisplay = document.querySelector('.time-stamps span:last-child');
    
    const btnLeft = document.getElementById("ui-btn"); 
    const btnRight = document.getElementById("ui-footer"); 

    let hasInteracted = false;

    // 1. Initial State: Start blinking and vibrating immediately
    header.classList.add("blinking");
    phone.classList.add("vibrating");

    overlay.addEventListener("click", () => {
        if (hasInteracted) return;
        hasInteracted = true;

        overlay.style.opacity = "0";
        setTimeout(() => overlay.style.display = "none", 500);

        // Stop vibration but KEEP header blinking
        phone.classList.remove("vibrating");
        
        header.innerText = "- PLAYING -";
        header.classList.add("blinking"); // Re-apply class after text change
        uiIcon.classList.add("blinking"); // Make the reel-to-reel icon blink too

        audio.play().catch(e => console.log("Audio play blocked", e));
        btnLeft.innerText = "PAUSE";
    });

    // 2. Progress Bar Sync
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progress}%`;
            timeDisplay.textContent = formatTime(audio.currentTime);
            remainingDisplay.textContent = `-${formatTime(audio.duration - audio.currentTime)}`;
        }
    });

    // 3. Play/Pause Logic
    btnLeft.addEventListener('click', () => {
        if (!hasInteracted) return;

        if (audio.paused) {
            audio.play();
            btnLeft.innerText = "PAUSE";
            header.innerText = "- PLAYING -";
            header.classList.add("blinking");
            uiIcon.classList.add("blinking");
        } else {
            audio.pause();
            btnLeft.innerText = "PLAY";
            header.innerText = "- PAUSED -";
            header.classList.remove("blinking"); // Stop blinking when paused
            uiIcon.classList.remove("blinking");
        }
    });

    audio.addEventListener('ended', () => {
        btnLeft.innerText = "REPLAY";
        header.innerText = "- END OF MSG -";
        header.classList.remove("blinking");
        uiIcon.classList.remove("blinking");
        progressBar.style.width = "100%";
    });

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
});