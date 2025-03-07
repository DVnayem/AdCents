document.addEventListener('DOMContentLoaded', () => {
    // Use our TelegramApp module
    const tg = window.TelegramApp.webApp;
    
    // Elements
    const progressBar = document.getElementById('progress');
    const timerElement = document.getElementById('timer');
    const secretContainer = document.getElementById('secret-container');
    const secretWord = document.getElementById('secret-word');
    const copyBtn = document.getElementById('copy-btn');
    
    // Set countdown duration (180 seconds = 3 minutes)
    const countdownDuration = 180;
    let timeRemaining = countdownDuration;
    let countdownInterval;
    
    // Format time function (converts seconds to MM:SS format)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    // Update progress bar and timer
    function updateCountdown() {
        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            progressBar.style.width = '0%';
            timerElement.textContent = '00:00';
            showSecret();
            return;
        }
        
        timeRemaining--;
        
        // Update timer display
        timerElement.textContent = formatTime(timeRemaining);
        
        // Update progress bar
        const progressPercentage = (timeRemaining / countdownDuration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // Add visual effect when time is running low
        if (timeRemaining <= 5) {
            timerElement.style.color = 'var(--tg-theme-destructive-text-color, #ff3b30)';
            progressBar.style.backgroundColor = 'var(--tg-theme-destructive-text-color, #ff3b30)';
        }
    }
    
    // Function to reset the timer
    function resetTimer() {
        // Clear existing interval
        clearInterval(countdownInterval);
        
        // Reset timer values
        timeRemaining = countdownDuration;
        
        // Reset UI elements
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = 'var(--tg-theme-button-color, #2481cc)';
        timerElement.style.color = 'var(--tg-theme-text-color, #000000)';
        timerElement.textContent = formatTime(timeRemaining);
        
        // If secret is already shown, hide it and show countdown again
        if (secretContainer.style.display === 'block') {
            secretContainer.style.display = 'none';
            const countdownContainer = document.querySelector('.countdown-container');
            countdownContainer.style.display = 'block';
            countdownContainer.style.opacity = '1';
            countdownContainer.style.transform = 'scale(1)';
        }
        
        // Restart the countdown
        countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
        
        // Provide haptic feedback
        TelegramApp.hapticFeedback('impact');
    }
    
    // Show secret word function
    function showSecret() {
        // Fade out the countdown container with animation
        const countdownContainer = document.querySelector('.countdown-container');
        countdownContainer.style.opacity = '0';
        countdownContainer.style.transform = 'scale(0.95)';
        
        // After a short delay, hide countdown and show secret
        setTimeout(() => {
            countdownContainer.style.display = 'none';
            
            // Show the secret container with animation
            secretContainer.style.display = 'block';
            
            // Add a subtle entrance animation for the secret word
            const secretWordElem = document.getElementById('secret-word');
            secretWordElem.style.opacity = '0';
            secretWordElem.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                secretWordElem.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
                secretWordElem.style.opacity = '1';
                secretWordElem.style.transform = 'translateY(0)';
            }, 100);
            
            // Provide haptic feedback when secret is revealed
            TelegramApp.hapticFeedback('success');
            
            // Notify Telegram that the app is ready
            TelegramApp.showMainButton('Done', () => TelegramApp.close());
        }, 400);
    }
    
    // Copy button functionality
    copyBtn.addEventListener('click', () => {
        // Create a temporary textarea element to copy text
        const textarea = document.createElement('textarea');
        textarea.value = secretWord.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
        
        // Add a brief highlight effect to the secret word
        secretWord.style.backgroundColor = 'rgba(36, 129, 204, 0.1)';
        setTimeout(() => {
            secretWord.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
        }, 300);
        
        // Haptic feedback if available
        TelegramApp.hapticFeedback('success');
    });
    
    // Listen for timer reset event (triggered when app is minimized)
    document.addEventListener('timerReset', resetTimer);
    
    // Start countdown
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call to set up the UI
    
    // Viewport settings are now handled by TelegramApp module
    
    // Add ad space dynamically (placeholder for actual ad implementation)
    const container = document.querySelector('.container');
    const adSpace = document.createElement('div');
    adSpace.className = 'ad-space';
    adSpace.innerHTML = ''; // Removed the icon and text but kept the container
    container.appendChild(adSpace);
});