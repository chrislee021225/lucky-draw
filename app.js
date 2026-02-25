// Lucky Draw System - Main Application
// State Management
let state = {
    availableTickets: [],
    drawHistory: [],
    totalTickets: 0,
    selectedColor: 'Purple',  // Default to Purple
    selectedLetter: 'D',      // Default to D
    showFullFormat: true,     // Show Color-Letter-Number
    enableAnimation: true,    // Enable draw animation
    iconMode: false           // Text mode by default
};

// DOM Elements
const setupModal = document.getElementById('setupModal');
const mainApp = document.getElementById('mainApp');
const ticketInput = document.getElementById('ticketInput');
const generateSampleBtn = document.getElementById('generateSampleBtn');
const startDrawBtn = document.getElementById('startDrawBtn');
const setupError = document.getElementById('setupError');

// Setup elements
const numberFrom = document.getElementById('numberFrom');
const numberTo = document.getElementById('numberTo');
const addRangeBtn = document.getElementById('addRangeBtn');
const add100Btn = document.getElementById('add100Btn');
const clearTicketsBtn = document.getElementById('clearTicketsBtn');

const poolCount = document.getElementById('poolCount');
const prizeName = document.getElementById('prizeName');
const numWinners = document.getElementById('numWinners');
const increaseWinners = document.getElementById('increaseWinners');
const decreaseWinners = document.getElementById('decreaseWinners');
const drawBtn = document.getElementById('drawBtn');
const drawError = document.getElementById('drawError');
const winnersDisplay = document.getElementById('winnersDisplay');
const winnersList = document.getElementById('winnersList');
const historyList = document.getElementById('historyList');

const undoBtn = document.getElementById('undoBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize App
function init() {
    // Check if there's saved state
    loadState();

    if (state.totalTickets > 0) {
        // Resume from saved state
        setupModal.classList.add('hidden');
        mainApp.classList.remove('hidden');
        updateUI();
    }

    // Event Listeners - Color Buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all color buttons
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');
            // Store selected color
            state.selectedColor = btn.dataset.color;
        });
    });

    // Event Listeners - Letter Buttons
    document.querySelectorAll('.letter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all letter buttons
            document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            btn.classList.add('active');
            // Store selected letter
            state.selectedLetter = btn.dataset.letter;
        });
    });

    // Event Listeners - Setup
    generateSampleBtn.addEventListener('click', generateSampleTickets);
    startDrawBtn.addEventListener('click', startDrawing);
    addRangeBtn.addEventListener('click', addRangeTickets);
    add100Btn.addEventListener('click', add100Tickets);
    clearTicketsBtn.addEventListener('click', clearTickets);
    ticketInput.addEventListener('input', updateTicketCount);

    // Quick Launch Button
    const quickLaunchBtn = document.getElementById('quickLaunchBtn');
    quickLaunchBtn.addEventListener('click', quickLaunch);

    // Advanced Settings Toggle
    const advancedToggleBtn = document.getElementById('advancedToggleBtn');
    const advancedSettings = document.getElementById('advancedSettings');
    advancedToggleBtn.addEventListener('click', () => {
        advancedSettings.classList.toggle('hidden');
        advancedToggleBtn.classList.toggle('active');
    });

    // Event Listeners - Main App
    drawBtn.addEventListener('click', performDraw);
    undoBtn.addEventListener('click', undoLastDraw);
    exportBtn.addEventListener('click', exportToCSV);
    resetBtn.addEventListener('click', resetAll);

    // +/- buttons for winners
    increaseWinners.addEventListener('click', () => {
        const current = parseInt(numWinners.value) || 0;
        numWinners.value = current + 1;
    });

    decreaseWinners.addEventListener('click', () => {
        const current = parseInt(numWinners.value) || 0;
        if (current > 0) {
            numWinners.value = current - 1;
        }
    });

    // Preset buttons (fill both prize name and number)
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            prizeName.value = btn.dataset.prize;
            numWinners.value = btn.dataset.winners;
        });
    });

    // Number preset buttons
    document.querySelectorAll('.num-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            numWinners.value = btn.dataset.num;
        });
    });

    // Display Options Event Listeners
    const showFullFormatToggle = document.getElementById('showFullFormat');
    const enableAnimationToggle = document.getElementById('enableAnimation');
    const iconModeToggle = document.getElementById('iconMode');

    if (showFullFormatToggle) {
        showFullFormatToggle.addEventListener('change', (e) => {
            state.showFullFormat = e.target.checked;
            saveState();
            // Re-render winners if displayed
            if (!winnersDisplay.classList.contains('hidden')) {
                updateDisplayFormat();
            }
            // Re-render history to apply format change
            updateHistory();
        });
    }

    if (enableAnimationToggle) {
        enableAnimationToggle.addEventListener('change', (e) => {
            state.enableAnimation = e.target.checked;
            saveState();
        });
    }

    if (iconModeToggle) {
        iconModeToggle.addEventListener('change', (e) => {
            state.iconMode = e.target.checked;
            saveState();
            // Toggle icon mode class on body
            if (state.iconMode) {
                document.body.classList.add('icon-mode');
            } else {
                document.body.classList.remove('icon-mode');
            }
        });
    }

    // Prevent accidental page close
    window.addEventListener('beforeunload', (e) => {
        if (state.drawHistory.length > 0) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

// Add Range of Tickets with Selected Color/Letter/Number Range
function addRangeTickets() {
    const color = state.selectedColor;
    const letter = state.selectedLetter;
    const from = parseInt(numberFrom.value);
    const to = parseInt(numberTo.value);

    if (!color || !letter) {
        showError(setupError, 'Please select Color and Letter buttons');
        return;
    }

    if (!from || !to) {
        showError(setupError, 'Please enter both From and To numbers');
        return;
    }

    if (from > to) {
        showError(setupError, 'From number must be less than or equal to To number');
        return;
    }

    if (from < 1 || to > 100) {
        showError(setupError, 'Numbers must be between 1 and 100');
        return;
    }

    const tickets = [];
    for (let i = from; i <= to; i++) {
        tickets.push(`${color}-${letter}-${i}`);
    }

    const currentTickets = ticketInput.value.trim();
    if (currentTickets) {
        ticketInput.value = tickets.join('\n') + '\n' + currentTickets;
    } else {
        ticketInput.value = tickets.join('\n');
    }

    updateTicketCount();
    hideError(setupError);

    // Reset number inputs
    numberFrom.value = '';
    numberTo.value = '';
}

// Add 100 Tickets (1-100) with Selected Color/Letter
function add100Tickets() {
    const color = state.selectedColor;
    const letter = state.selectedLetter;

    if (!color || !letter) {
        showError(setupError, 'Please select Color and Letter buttons');
        return;
    }

    const tickets = [];
    for (let i = 1; i <= 100; i++) {
        tickets.push(`${color}-${letter}-${i}`);
    }

    const currentTickets = ticketInput.value.trim();
    if (currentTickets) {
        ticketInput.value = tickets.join('\n') + '\n' + currentTickets;
    } else {
        ticketInput.value = tickets.join('\n');
    }

    updateTicketCount();
    hideError(setupError);
}

// Clear All Tickets
function clearTickets() {
    if (ticketInput.value.trim()) {
        const confirmed = confirm('Clear all tickets?');
        if (confirmed) {
            ticketInput.value = '';
            updateTicketCount();
        }
    }
}

// Update Ticket Count Display
function updateTicketCount() {
    const tickets = ticketInput.value.trim().split('\n').filter(t => t.trim().length > 0);
    const count = tickets.length;
    const countDisplay = document.querySelector('.ticket-count');
    if (countDisplay) {
        countDisplay.textContent = `(${count} ticket${count !== 1 ? 's' : ''})`;
    }
}

// Generate Sample Tickets
function generateSampleTickets() {
    const colors = ['Blue', 'Red', 'Green', 'Purple'];
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const tickets = [];

    // Generate 100 tickets with variety
    for (let i = 1; i <= 100; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const letter = letters[Math.floor(Math.random() * letters.length)];
        tickets.push(`${color}-${letter}-${i}`);
    }

    ticketInput.value = tickets.join('\n');
    updateTicketCount();
}

// Quick Launch - Add Purple-D 1-100 and start immediately
function quickLaunch() {
    // Generate Purple-D-1 through Purple-D-100
    const tickets = [];
    for (let i = 1; i <= 100; i++) {
        tickets.push(`Purple-D-${i}`);
    }

    // Set the tickets
    ticketInput.value = tickets.join('\n');
    updateTicketCount();

    // Automatically proceed to drawing stage
    setTimeout(() => {
        startDrawing();
    }, 300); // Small delay for visual feedback
}

// Start Drawing (Setup Complete)
function startDrawing() {
    const input = ticketInput.value.trim();

    if (!input) {
        showError(setupError, 'Please enter tickets or generate sample tickets');
        return;
    }

    // Parse tickets
    const tickets = input.split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0);

    // Validate format
    const ticketRegex = /^(Blue|Red|Green|Purple)-([A-E])-(\d+)$/i;
    const invalidTickets = tickets.filter(t => !ticketRegex.test(t));

    if (invalidTickets.length > 0) {
        showError(setupError, `Invalid ticket format found. Example: ${invalidTickets[0]}\nExpected format: Color-Letter-Number (e.g., Blue-A-23)`);
        return;
    }

    // Check for duplicates
    const uniqueTickets = [...new Set(tickets)];
    if (uniqueTickets.length !== tickets.length) {
        showError(setupError, `Found ${tickets.length - uniqueTickets.length} duplicate tickets. Please remove duplicates.`);
        return;
    }

    // Initialize state
    state.availableTickets = tickets;
    state.totalTickets = tickets.length;
    state.drawHistory = [];

    // Save state
    saveState();

    // Show main app
    setupModal.classList.add('hidden');
    mainApp.classList.remove('hidden');
    updateUI();
}

// Perform Draw
function performDraw() {
    const prize = prizeName.value.trim();
    const num = parseInt(numWinners.value);

    // Validation
    if (!prize) {
        showError(drawError, 'Please enter a prize name');
        return;
    }

    if (!num || num < 1) {
        showError(drawError, 'Please enter a valid number of winners');
        return;
    }

    if (num > state.availableTickets.length) {
        showError(drawError, `Cannot draw ${num} winners. Only ${state.availableTickets.length} tickets remaining.`);
        return;
    }

    // Clear previous errors
    hideError(drawError);

    // Draw winners randomly
    const winners = drawRandomTickets(state.availableTickets, num);

    // Remove winners from pool
    state.availableTickets = state.availableTickets.filter(t => !winners.includes(t));

    // Add to history
    const draw = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        prizeName: prize,
        numDrawn: num,
        winners: winners,
        remainingPoolSize: state.availableTickets.length
    };

    state.drawHistory.unshift(draw); // Add to beginning

    // Save state
    saveState();

    // Update UI - Display winners first
    displayWinners(winners);

    // Update history based on animation setting
    if (state.enableAnimation) {
        // Calculate total animation time
        const animationDuration = (winners.length * 400) + 750 + 500; // delays + shuffle + reveal
        // Update history after animation completes
        setTimeout(() => {
            updateUI();
        }, animationDuration);
    } else {
        // Update immediately if no animation
        updateUI();
    }

    // Don't clear inputs - keep them for repeated draws
}

// Draw Random Tickets
function drawRandomTickets(pool, count) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// Display Winners
function displayWinners(winners) {
    winnersDisplay.classList.remove('hidden');
    winnersList.innerHTML = '';

    if (state.enableAnimation) {
        // Fancy animated reveal
        displayWinnersAnimated(winners);
    } else {
        // Instant display (no animation)
        displayWinnersInstant(winners);
    }

    // Scroll to winners
    winnersDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Instant display (no animation)
function displayWinnersInstant(winners) {
    winners.forEach(ticket => {
        const div = createWinnerElement(ticket);
        div.textContent = formatTicket(ticket);
        winnersList.appendChild(div);
    });
}

// Animated display with shuffling effect
function displayWinnersAnimated(winners) {
    const allTickets = [...state.availableTickets, ...winners];

    winners.forEach((ticket, index) => {
        const div = createWinnerElement(ticket);
        div.style.opacity = '0';
        winnersList.appendChild(div);

        // Delay each winner's animation
        setTimeout(() => {
            animateWinnerReveal(div, ticket, allTickets);
        }, index * 400); // 400ms delay between each
    });
}

// Create winner element
function createWinnerElement(ticket) {
    const div = document.createElement('div');
    div.className = 'winner-ticket';
    div.dataset.fullTicket = ticket;

    if (!state.showFullFormat) {
        div.classList.add('number-only');
    }

    return div;
}

// Animate single winner with shuffling effect
function animateWinnerReveal(element, finalTicket, ticketPool) {
    element.style.opacity = '1';
    element.classList.add('shuffling');

    let shuffleCount = 0;
    const maxShuffles = 15;
    const shuffleSpeed = 50; // ms between shuffles

    const shuffleInterval = setInterval(() => {
        // Show random ticket during shuffle
        const randomTicket = ticketPool[Math.floor(Math.random() * ticketPool.length)];
        element.textContent = formatTicket(randomTicket);
        shuffleCount++;

        if (shuffleCount >= maxShuffles) {
            clearInterval(shuffleInterval);
            // Final reveal
            element.classList.remove('shuffling');
            element.classList.add('revealed');
            element.textContent = formatTicket(finalTicket);
        }
    }, shuffleSpeed);
}

// Format ticket based on display settings
function formatTicket(ticket) {
    if (!state.showFullFormat) {
        // Extract just the number (e.g., "Purple-D-23" -> "23")
        const parts = ticket.split('-');
        return parts[parts.length - 1]; // Return the last part (number)
    }
    return ticket; // Return full format
}

// Update display format for currently shown winners
function updateDisplayFormat() {
    const winnerTickets = winnersList.querySelectorAll('.winner-ticket');
    winnerTickets.forEach(div => {
        const fullTicket = div.dataset.fullTicket;
        div.textContent = formatTicket(fullTicket);

        // Toggle number-only class
        if (!state.showFullFormat) {
            div.classList.add('number-only');
        } else {
            div.classList.remove('number-only');
        }
    });
}

// Undo Last Draw
function undoLastDraw() {
    if (state.drawHistory.length === 0) return;

    const confirmed = confirm('Undo the most recent draw? Winners will be returned to the pool.');
    if (!confirmed) return;

    // Get last draw
    const lastDraw = state.drawHistory.shift();

    // Return winners to pool
    state.availableTickets = [...state.availableTickets, ...lastDraw.winners];

    // Save state
    saveState();

    // Update UI
    updateUI();

    // Hide winners display
    winnersDisplay.classList.add('hidden');
}

// Update UI
function updateUI() {
    // Update pool count with animation effect
    updatePoolCount();

    // Update undo button
    undoBtn.disabled = state.drawHistory.length === 0;

    // Update history
    updateHistory();
}

// Update pool count with counting animation
function updatePoolCount() {
    const targetCount = state.availableTickets.length;
    const currentCount = parseInt(poolCount.textContent) || 0;

    if (state.enableAnimation && Math.abs(targetCount - currentCount) > 0) {
        // Animate the number counting down
        const duration = 500; // 500ms animation
        const steps = Math.min(Math.abs(targetCount - currentCount), 20); // Max 20 steps
        const stepDuration = duration / steps;
        const increment = (targetCount - currentCount) / steps;

        let step = 0;
        const countInterval = setInterval(() => {
            step++;
            const newValue = Math.round(currentCount + (increment * step));
            poolCount.textContent = newValue;

            if (step >= steps) {
                clearInterval(countInterval);
                poolCount.textContent = targetCount; // Ensure final value is exact
            }
        }, stepDuration);
    } else {
        // Instant update
        poolCount.textContent = targetCount;
    }
}

// Update History Display
function updateHistory() {
    if (state.drawHistory.length === 0) {
        historyList.innerHTML = '<p class="no-history">No draws yet</p>';
        return;
    }

    historyList.innerHTML = '';

    state.drawHistory.forEach((draw, index) => {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (index === 0) item.classList.add('latest');

        const date = new Date(draw.timestamp);
        const timeStr = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const numberOnlyClass = !state.showFullFormat ? ' number-only' : '';

        item.innerHTML = `
            <div class="history-item-header">
                <span class="prize-name">${escapeHtml(draw.prizeName)}</span>
                <span class="draw-info">${draw.numDrawn} winner${draw.numDrawn > 1 ? 's' : ''}</span>
            </div>
            <div class="timestamp">${timeStr} | Remaining: ${draw.remainingPoolSize}</div>
            <div class="history-winners">
                ${draw.winners.map(w => `<span class="history-ticket${numberOnlyClass}">${escapeHtml(formatTicket(w))}</span>`).join('')}
            </div>
        `;

        historyList.appendChild(item);
    });
}

// Export to CSV
function exportToCSV() {
    if (state.drawHistory.length === 0) {
        alert('No draws to export');
        return;
    }

    let csv = 'Prize Name,Number of Winners,Winners,Timestamp,Remaining Pool\n';

    // Reverse to show oldest first in export
    [...state.drawHistory].reverse().forEach(draw => {
        const date = new Date(draw.timestamp);
        const dateStr = date.toLocaleString('en-US');
        const winnersStr = draw.winners.join('; ');

        csv += `"${draw.prizeName}",${draw.numDrawn},"${winnersStr}","${dateStr}",${draw.remainingPoolSize}\n`;
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lucky-draw-results-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Reset All
function resetAll() {
    const confirmed = confirm('Reset everything? This will clear all data and start over. This cannot be undone!');
    if (!confirmed) return;

    state = {
        availableTickets: [],
        drawHistory: [],
        totalTickets: 0
    };

    localStorage.removeItem('luckyDrawState');

    mainApp.classList.add('hidden');
    setupModal.classList.remove('hidden');
    ticketInput.value = '';
}

// Save State to LocalStorage
function saveState() {
    try {
        localStorage.setItem('luckyDrawState', JSON.stringify(state));
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

// Load State from LocalStorage
function loadState() {
    try {
        const saved = localStorage.getItem('luckyDrawState');
        if (saved) {
            const loadedState = JSON.parse(saved);
            state = { ...state, ...loadedState }; // Merge with defaults

            // Restore toggle states in UI
            const showFullFormatToggle = document.getElementById('showFullFormat');
            const enableAnimationToggle = document.getElementById('enableAnimation');
            const iconModeToggle = document.getElementById('iconMode');

            if (showFullFormatToggle) showFullFormatToggle.checked = state.showFullFormat !== false;
            if (enableAnimationToggle) enableAnimationToggle.checked = state.enableAnimation !== false;
            if (iconModeToggle) iconModeToggle.checked = state.iconMode === true;

            // Apply icon mode class to body if enabled
            if (state.iconMode) {
                document.body.classList.add('icon-mode');
            }
        }
    } catch (e) {
        console.error('Failed to load state:', e);
    }
}

// Utility Functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    setTimeout(() => hideError(element), 5000);
}

function hideError(element) {
    element.classList.remove('show');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
