/**
 * Modern Counter Application
 * Features: Increment, Decrement, Reset, Edit, Statistics, Dark Mode, Local Storage
 * Author: Ayush Singh
 * Version: 2.0.0
 */

// ========================================
// DOM ELEMENTS
// ========================================
let count = 0;
let totalChanges = 0;
let incrementCount = 0;
let decrementCount = 0;

// DOM References
const countElement = document.getElementById('count');
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');
const resetBtn = document.getElementById('reset');
const editBtn = document.getElementById('edit');
const editInput = document.getElementById('editInput');
const totalChangesElement = document.getElementById('totalChanges');
const incrementCountElement = document.getElementById('incrementCount');
const decrementCountElement = document.getElementById('decrementCount');
const darkModeToggle = document.getElementById('darkModeToggle');

// ========================================
// SOUND EFFECTS
// ========================================
function playSound() {
    try {
        const audio = new Audio();
        // Using a simple beep sound (optional)
        // You can uncomment this if you want sound
        // audio.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3';
        // audio.play().catch(err => console.log('Sound disabled:', err));
    } catch (err) {
        console.log('Sound not available');
    }
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Get colors based on theme
    const isDarkMode = document.body.classList.contains('dark-mode');
    const bgColor = isDarkMode ? 'rgba(30, 30, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const textColor = isDarkMode ? '#f0f0f0' : '#333';
    const borderColor = type === 'success' ? '#43e97b' : type === 'error' ? '#f5576c' : '#667eea';
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        border-left: 4px solid ${borderColor};
        backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add animation styles
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// UPDATE DISPLAY & STATS
// ========================================
function updateDisplay() {
    // Update counter with animation
    countElement.style.animation = 'none';
    countElement.offsetHeight; // Trigger reflow
    countElement.style.animation = 'pulse 0.3s ease';
    
    // Color based on value
    if (count > 0) {
        countElement.style.color = 'var(--counter-positive)';
    } else if (count < 0) {
        countElement.style.color = 'var(--counter-negative)';
    } else {
        countElement.style.color = 'var(--counter-color)';
    }
    
    countElement.textContent = count;
    
    // Update statistics
    totalChangesElement.textContent = totalChanges;
    incrementCountElement.textContent = incrementCount;
    decrementCountElement.textContent = decrementCount;
    
    // Save to localStorage
    saveToLocalStorage();
}

// ========================================
// CORE FUNCTIONS
// ========================================
function increaseCount() {
    count++;
    totalChanges++;
    incrementCount++;
    updateDisplay();
    playSound();
    showNotification(`Count increased to ${count} 🎉`, 'success');
    animateButton(increaseBtn);
}

function decreaseCount() {
    count--;
    totalChanges++;
    decrementCount++;
    updateDisplay();
    playSound();
    showNotification(`Count decreased to ${count} 📉`, 'info');
    animateButton(decreaseBtn);
}

function resetCount() {
    if (count !== 0) {
        count = 0;
        updateDisplay();
        playSound();
        showNotification('Counter has been reset to zero 🔄', 'info');
        animateButton(resetBtn);
    } else {
        showNotification('Counter is already zero! 💫', 'info');
    }
}

function editCount() {
    const inputValue = parseInt(editInput.value);
    
    if (isNaN(inputValue)) {
        showNotification('Please enter a valid number! ❌', 'error');
        countElement.classList.add('shake');
        setTimeout(() => countElement.classList.remove('shake'), 300);
        return;
    }
    
    const oldValue = count;
    count = inputValue;
    totalChanges++;
    updateDisplay();
    playSound();
    showNotification(`Count changed from ${oldValue} to ${count} ✏️`, 'success');
    editInput.value = '';
    animateButton(editBtn);
}

// ========================================
// BUTTON ANIMATION
// ========================================
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// ========================================
// DARK MODE TOGGLE - FIXED VERSION
// ========================================
function toggleDarkMode() {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        // Switch to Light Mode
        body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌙';
        darkModeToggle.style.background = 'var(--card-bg)';
        showNotification('Light mode enabled ☀️', 'success');
        localStorage.setItem('darkMode', 'disabled');
    } else {
        // Switch to Dark Mode
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
        darkModeToggle.style.background = 'var(--card-bg)';
        showNotification('Dark mode enabled 🌙', 'success');
        localStorage.setItem('darkMode', 'enabled');
    }
    
    // Save preference
    saveToLocalStorage();
}

// Load dark mode preference
function loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌙';
    }
}

// ========================================
// LOCAL STORAGE
// ========================================
function saveToLocalStorage() {
    const data = {
        count: count,
        totalChanges: totalChanges,
        incrementCount: incrementCount,
        decrementCount: decrementCount,
        lastUpdated: new Date().toISOString(),
        darkMode: document.body.classList.contains('dark-mode')
    };
    localStorage.setItem('counterApp', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('counterApp');
    if (savedData) {
        const data = JSON.parse(savedData);
        count = data.count || 0;
        totalChanges = data.totalChanges || 0;
        incrementCount = data.incrementCount || 0;
        decrementCount = data.decrementCount || 0;
        updateDisplay();
        
        const lastUpdated = new Date(data.lastUpdated).toLocaleString();
        showNotification(`Welcome back! Last session: ${lastUpdated} 👋`, 'success');
    } else {
        showNotification('Welcome to Modern Counter App! 🎯', 'success');
    }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Prevent default for arrow keys to avoid page scrolling
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
            e.key === 'r' || e.key === 'R' || e.key === 'e' || e.key === 'E') {
            e.preventDefault();
        }
        
        switch(e.key) {
            case 'ArrowUp':
                increaseCount();
                break;
            case 'ArrowDown':
                decreaseCount();
                break;
            case 'r':
            case 'R':
                resetCount();
                break;
            case 'e':
            case 'E':
                editInput.focus();
                showNotification('Edit input focused - Enter a number and press Enter', 'info');
                break;
        }
    });
}

// ========================================
// EVENT LISTENERS
// ========================================
function initializeEventListeners() {
    increaseBtn.addEventListener('click', increaseCount);
    decreaseBtn.addEventListener('click', decreaseCount);
    resetBtn.addEventListener('click', resetCount);
    editBtn.addEventListener('click', editCount);
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Enter key support for edit input
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            editCount();
        }
    });
}

// ========================================
// ACCESSIBILITY FEATURES
// ========================================
function setupAccessibility() {
    // Add ARIA labels
    countElement.setAttribute('aria-live', 'polite');
    countElement.setAttribute('aria-label', 'Current counter value');
    
    // Add keyboard navigation hints
    if (!document.querySelector('.keyboard-hints')) {
        const hints = document.createElement('div');
        hints.className = 'keyboard-hints';
        hints.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-size: 12px;
            font-family: monospace;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;
        hints.innerHTML = '⌨️ Shortcuts: ↑ ↓ R E';
        document.body.appendChild(hints);
    }
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
    loadDarkModePreference();  // First load dark mode preference
    loadFromLocalStorage();     // Then load counter data
    initializeEventListeners();
    setupKeyboardShortcuts();
    setupAccessibility();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);