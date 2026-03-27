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