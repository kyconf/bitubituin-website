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

// Update your Overlay Click Event
overlay.addEventListener("click", () => {
    if (hasInteracted) return;
    hasInteracted = true;

    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.display = "none", 500);

    phone.classList.remove("vibrating");
    
    header.innerText = "- PLAYING -";
    btnLeft.innerText = "PAUSE";

    // SYNC BOTH HERE
    syncBlinking([header, uiIcon]);

    audio.play().catch(e => console.log("Audio play blocked", e));
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

// Update your Play/Pause Button Logic
btnLeft.addEventListener('click', () => {
    if (!hasInteracted) return;

    if (audio.paused) {
        audio.play();
        btnLeft.innerText = "PAUSE";
        header.innerText = "- PLAYING -";
        
        // SYNC BOTH HERE ON RESUME
        syncBlinking([header, uiIcon]);
    } else {
        audio.pause();
        btnLeft.innerText = "PLAY";
        header.innerText = "- PAUSED -";
        header.classList.remove("blinking");
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

// Add this helper function at the bottom of your script
function syncBlinking(elements) {
    elements.forEach(el => {
        el.classList.remove("blinking");
        void el.offsetWidth; // This "magic" line forces the browser to reset the animation
        el.classList.add("blinking");
    });
}