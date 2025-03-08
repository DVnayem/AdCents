document.addEventListener('DOMContentLoaded', () => {
    // Use our TelegramApp module
    const tg = window.TelegramApp.webApp;
    
    // Elements
    const progressBar = document.getElementById('progress');
    const timerElement = document.getElementById('timer');
    const secretContainer = document.getElementById('secret-container');
    const secretWord = document.getElementById('secret-word');
    const copyBtn = document.getElementById('copy-btn');
    
    // Set countdown duration (60 seconds = 1 minute)
    const countdownDuration = 60;
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
            // Add pulse animation to timer when time is running low
            timerElement.classList.add('button-clicked');
            setTimeout(() => {
                timerElement.classList.remove('button-clicked');
            }, 400);
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
        timerElement.style.color = 'var(--tg-theme-text-color, #ffffff)';
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
            secretContainer.style.opacity = '0';
            
            // Force a reflow to ensure the animation works
            void secretContainer.offsetWidth;
            
            // Reset any transform that might be interfering
            secretContainer.style.transform = '';
            
            // Character-by-character reveal animation for the secret word
            const secretCode = secretWord.textContent;
            secretWord.textContent = '';
            secretWord.style.opacity = '1';
            secretWord.style.transform = 'translateY(0)';
            
            // Create and append each character with staggered animation
            [...secretCode].forEach((char, index) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.classList.add('character-reveal');
                charSpan.style.animationDelay = `${index * 0.1}s`;
                secretWord.appendChild(charSpan);
            });
            
            // Provide haptic feedback when secret is revealed
            TelegramApp.hapticFeedback('success');
            
            // Notify Telegram that the app is ready
            TelegramApp.showMainButton('Done', () => TelegramApp.close());
        }, 400);
    }
    
    // Copy button functionality
    copyBtn.addEventListener('click', () => {
        // Get the text content from all spans inside secretWord
        const textToCopy = secretWord.textContent;
        
        // Create a temporary textarea element to copy text
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Add button click animation
        copyBtn.classList.add('button-clicked');
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('button-clicked');
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
    
    // No ad space needed
});