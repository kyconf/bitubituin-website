document.addEventListener('DOMContentLoaded', () => {
    const previewBtn = document.getElementById('preview-btn');
    const progressBar = document.querySelector('.progress-container');
    let isPlaying = false;
    let progressInterval;

    // Simulate clicking the play button
    previewBtn.addEventListener('click', () => {
        if (!isPlaying) {
            previewBtn.innerHTML = '⏸ PAUSE';
            isPlaying = true;
            
            // Fill the progress bar visually
            let width = 0;
            progressBar.style.backgroundColor = 'var(--screen-dark)';
            
            progressInterval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(progressInterval);
                    previewBtn.innerHTML = '▶ PREVIEW';
                    isPlaying = false;
                    progressBar.style.width = '90%';
                } else {
                    width++;
                    progressBar.style.width = `${width}%`;
                }
            }, 50); // Speed of the progress bar
        } else {
            previewBtn.innerHTML = '▶ PREVIEW';
            isPlaying = false;
            clearInterval(progressInterval);
        }
    });

    // Add haptic-style console logs for the numpad keys
    const keys = document.querySelectorAll('.num-key, .action-key, .nav-key');
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            // Get the primary text of the button clicked
            const keyText = key.childNodes[0].nodeValue.trim();
            console.log(`Key pressed: ${keyText}`);
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("interaction-overlay");
    const header = document.getElementById("ui-header");
    const phone = document.querySelector(".phone");
    const audio = document.getElementById("incoming-call-audio");
    const uiIcon = document.getElementById("ui-icon");
    
    const btnLeft = document.getElementById("ui-btn");
    const btnRight = document.getElementById("ui-footer");

    let hasInteracted = false;
    let missedCallTimer; // Variable to store the 3s timer

    // 1. Initial State (Before Interaction)
    phone.classList.add("vibrating");
    header.classList.add("blinking");

// 2. The Main Interaction (The "Gate")
    overlay.addEventListener("click", () => {
        if (hasInteracted) return;
        hasInteracted = true;


        if (navigator.vibrate) {
        // Pattern logic: 
        // 1000ms (1s) Vibrate
        // 2000ms (2s) Pause
        // Repeat 3 times to cover 9 seconds total
        navigator.vibrate([1000, 2000, 1000, 2000, 1000]);
    }
        // Fade and Remove Overlay
        overlay.style.opacity = "0";
        setTimeout(() => {
            overlay.style.display = "none";
        }, 500);

        // Start Ringtone
        audio.play().catch(e => console.log("Audio play blocked", e));

        // 9 second timer: 
        // This allows the full 7s of audio + the 2s fade out 
        // before switching the UI.
        missedCallTimer = setTimeout(() => {
            switchToMissedCallUI();
        }, 9000); 
    });
    // 3. The UI Switcher
    function switchToMissedCallUI() {
        // Clear the timer so it doesn't run twice if triggered by a button
        clearTimeout(missedCallTimer);

    
        audio.pause();
        audio.currentTime = 0;

        phone.classList.remove("vibrating");
        header.classList.remove("blinking");

        header.innerText = "- 1 MISSED CALL -";
        header.classList.add("missed-call-text");
        
        uiIcon.classList.add("missed");
        

        btnLeft.innerText = "VIEW";
        btnRight.innerText = "BACK";
    }

 
    btnLeft.addEventListener('click', () => {
        if (hasInteracted) switchToMissedCallUI();
    });

    btnRight.addEventListener('click', () => {
        if (hasInteracted) switchToMissedCallUI();
    });
});