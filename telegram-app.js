// Telegram Mini App Integration
const TelegramApp = {
    // Store the Telegram WebApp instance
    webApp: window.Telegram.WebApp,
    
    // Initialize the Telegram Mini App
    init() {
        // Expand the WebApp to take the full screen height
        this.webApp.expand();
        
        // Set up theme handling
        this.handleTheme();
        
        // Set up back button handling
        this.setupBackButton();
        
        // Initialize main button (hidden by default)
        this.setupMainButton();
        
        // Set up viewport settings for proper mobile display
        this.setViewportSettings();
        
        // Set up visibility change detection
        this.setupVisibilityChangeDetection();
        
        // Log initialization
        console.log('Telegram Mini App initialized');
        console.log('User:', this.getUser());
        
        // Notify Telegram that the Mini App is ready
        this.webApp.ready();
    },
    
    // Get user data if available
    getUser() {
        return this.webApp.initDataUnsafe?.user || {};
    },
    
    // Handle theme changes and apply appropriate styles
    handleTheme() {
        // Add a class to the body based on the color scheme
        document.body.classList.add(
            this.webApp.colorScheme === 'dark' ? 'dark-theme' : 'light-theme'
        );
        
        // Update theme when it changes
        this.webApp.onEvent('themeChanged', () => {
            document.body.classList.remove('dark-theme', 'light-theme');
            document.body.classList.add(
                this.webApp.colorScheme === 'dark' ? 'dark-theme' : 'light-theme'
            );
        });
    },
    
    // Set up the Telegram back button
    setupBackButton() {
        this.webApp.BackButton.onClick(() => {
            // You can add custom logic here before closing
            // For example, show a confirmation dialog
            if (confirm('Are you sure you want to exit?')) {
                this.webApp.close();
            }
        });
    },
    
    // Configure and set up the main button
    setupMainButton(text = 'Continue', color = '#2481cc', textColor = '#ffffff') {
        const mainButton = this.webApp.MainButton;
        
        mainButton.setText(text);
        mainButton.setParams({
            color: color,
            text_color: textColor,
            is_active: true,
            is_visible: false
        });
    },
    
    // Show the main button with custom text and callback
    showMainButton(text, callback) {
        const mainButton = this.webApp.MainButton;
        
        if (text) {
            mainButton.setText(text);
        }
        
        if (callback && typeof callback === 'function') {
            // Remove previous listeners to avoid duplicates
            mainButton.offClick();
            mainButton.onClick(callback);
        }
        
        mainButton.show();
    },
    
    // Hide the main button
    hideMainButton() {
        this.webApp.MainButton.hide();
    },
    
    // Trigger haptic feedback
    hapticFeedback(type) {
        if (this.webApp.HapticFeedback) {
            try {
                switch(type) {
                    case 'success':
                        this.webApp.HapticFeedback.notificationOccurred('success');
                        break;
                    case 'warning':
                        this.webApp.HapticFeedback.notificationOccurred('warning');
                        break;
                    case 'error':
                        this.webApp.HapticFeedback.notificationOccurred('error');
                        break;
                    case 'selection':
                        this.webApp.HapticFeedback.selectionChanged();
                        break;
                    case 'impact':
                        this.webApp.HapticFeedback.impactOccurred('medium');
                        break;
                    default:
                        this.webApp.HapticFeedback.impactOccurred('light');
                }
            } catch (e) {
                console.warn('Haptic feedback error:', e);
            }
        }
    },
    
    // Set viewport settings for better mobile experience
    setViewportSettings() {
        // Prevent zooming
        document.addEventListener('touchmove', function(event) {
            if (event.scale !== 1) {
                event.preventDefault();
            }
        }, { passive: false });
    },
    
    // Show a native Telegram popup
    showPopup(title, message, buttons = []) {
        if (!buttons.length) {
            buttons = [{ text: 'OK' }];
        }
        
        this.webApp.showPopup({
            title: title,
            message: message,
            buttons: buttons
        });
    },
    
    // Show a native Telegram alert
    showAlert(message) {
        this.webApp.showAlert(message);
    },
    
    // Show a native Telegram confirmation dialog
    showConfirm(message, callback) {
        this.webApp.showConfirm(message, callback);
    },
    
    // Send data to the Telegram bot
    sendData(data) {
        if (typeof data !== 'string') {
            data = JSON.stringify(data);
        }
        this.webApp.sendData(data);
    },
    
    // Close the Mini App
    close() {
        this.webApp.close();
    },
    
    // Set up visibility change detection
    setupVisibilityChangeDetection() {
        // Create a custom event for timer reset
        this.timerResetEvent = new Event('timerReset');
        
        // Listen for visibility change events from Telegram WebApp
        this.webApp.onEvent('viewportChanged', (event) => {
            // Check if the app was minimized (isStateStable will be false when minimizing)
            if (!event.isStateStable) {
                console.log('App minimized, triggering timer reset');
                // Dispatch the timer reset event
                document.dispatchEvent(this.timerResetEvent);
                // Provide haptic feedback
                this.hapticFeedback('impact');
            }
        });
    },
    
    // Reset the timer (can be called from outside)
    resetTimer() {
        document.dispatchEvent(this.timerResetEvent);
    }
};

// Export the TelegramApp object
window.TelegramApp = TelegramApp;

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    TelegramApp.init();
});