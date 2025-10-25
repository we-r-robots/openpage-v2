// Terminal state
let commandHistory = [];
let historyIndex = -1;
let isIntroPlaying = true;

// DOM elements
const output = document.getElementById('output');
const input = document.getElementById('input');
const prompt = document.getElementById('prompt');

// ASCII Art
const ASCII_LOGO = `
    ╔═══════════════════════════════════════════╗
    ║                                           ║
    ║     ██████╗ ██████╗ ███████╗███╗   ██╗   ║
    ║    ██╔═══██╗██╔══██╗██╔════╝████╗  ██║   ║
    ║    ██║   ██║██████╔╝█████╗  ██╔██╗ ██║   ║
    ║    ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║   ║
    ║    ╚██████╔╝██║     ███████╗██║ ╚████║   ║
    ║     ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝   ║
    ║                                           ║
    ║           P  A  G  E                      ║
    ║                                           ║
    ╚═══════════════════════════════════════════╝
`;

const CROSSFIT_ASCII = `
    ┌─────────────────────────────────────┐
    │    ╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗╦╔╦╗           │
    │    ║  ╠╦╝║ ║╚═╗╚═╗╠╣ ║ ║            │
    │    ╚═╝╩╚═╚═╝╚═╝╚═╝╚  ╩ ╩            │
    └─────────────────────────────────────┘
`;

// Available commands
const commands = {
    help: {
        description: 'Display available commands',
        action: showHelp
    },
    about: {
        description: 'Learn more about me',
        action: showAbout
    },
    hobbies: {
        description: 'View my hobbies and projects',
        action: showHobbies
    },
    projects: {
        description: 'Alias for hobbies',
        action: showHobbies
    },
    workouts: {
        description: 'View CrossFit workout stats',
        action: showWorkouts
    },
    crossfit: {
        description: 'Alias for workouts',
        action: showWorkouts
    },
    clear: {
        description: 'Clear the terminal',
        action: clearTerminal
    },
    history: {
        description: 'Show command history',
        action: showHistory
    },
    banner: {
        description: 'Display the welcome banner',
        action: showBanner
    }
};

// Initialize terminal
function init() {
    input.disabled = true;
    playIntro();
}

// Intro sequence
async function playIntro() {
    await typeText('[SYSTEM] Initializing OpenPage v2.0...', 'boot-text', 30);
    await sleep(300);
    await typeText('[  OK  ] Starting terminal interface...', 'boot-ok', 20);
    await sleep(200);
    await typeText('[  OK  ] Loading user profile...', 'boot-ok', 20);
    await sleep(200);
    await typeText('[  OK  ] Establishing connection...', 'boot-ok', 20);
    await sleep(400);
    await typeText('[INFO] System ready. Welcome!', 'boot-info', 30);
    await sleep(500);

    isIntroPlaying = false;
    input.disabled = false;
    showBanner();
    input.focus();
}

// Type text with animation
function typeText(text, className = '', speed = 30) {
    return new Promise(resolve => {
        const line = document.createElement('div');
        line.className = `output-line ${className}`;
        output.appendChild(line);

        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                line.textContent += text[i];
                i++;
                scrollToBottom();
            } else {
                clearInterval(interval);
                resolve();
            }
        }, speed);
    });
}

// Sleep utility
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Add output line
function addOutput(text, className = '') {
    const line = document.createElement('div');
    line.className = `output-line ${className}`;
    line.innerHTML = text;
    output.appendChild(line);
    scrollToBottom();
}

// Add command to output
function addCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'command-line';
    line.innerHTML = `<span class="prompt">${prompt.textContent}</span><span class="command">${escapeHtml(cmd)}</span>`;
    output.appendChild(line);
    scrollToBottom();
}

// Scroll to bottom
function scrollToBottom() {
    const terminal = document.getElementById('terminal');
    terminal.scrollTop = terminal.scrollHeight;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show banner
function showBanner() {
    addOutput(`<pre class="ascii-art">${ASCII_LOGO}</pre>`);
    addOutput('');
    addOutput('Welcome to my interactive terminal page!', 'intro-line');
    addOutput('Type <span class="highlight">help</span> to see available commands.', 'info');
    addOutput('');
}

// Show help
function showHelp() {
    addOutput('<div class="section-header">Available Commands</div>');
    addOutput('');

    Object.keys(commands).forEach(cmd => {
        addOutput(`  <span class="help-command">${cmd.padEnd(15)}</span><span class="help-description">${commands[cmd].description}</span>`);
    });

    addOutput('');
    addOutput('<span class="info">Tip: Use ↑/↓ arrow keys to navigate command history</span>');
    addOutput('<span class="info">Tip: Use TAB for command completion</span>');
    addOutput('');
}

// Show about
function showAbout() {
    addOutput('<div class="section-header">About Me</div>');
    addOutput('');
    addOutput('Hey there! 👋', 'success');
    addOutput('');
    addOutput('I\'m a developer passionate about creating unique web experiences.');
    addOutput('This terminal-style page is a reflection of my love for clean,');
    addOutput('efficient interfaces and the command line aesthetic.');
    addOutput('');
    addOutput('<span class="highlight">Location:</span> Earth 🌍');
    addOutput('<span class="highlight">Interests:</span> Coding, CrossFit, Building Cool Stuff');
    addOutput('<span class="highlight">Current Focus:</span> Creating interactive web experiences');
    addOutput('');
    addOutput('<span class="muted">Fun fact: This entire site runs on vanilla JavaScript!</span>');
    addOutput('');
}

// Show hobbies
function showHobbies() {
    addOutput('<div class="section-header">Hobbies & Projects</div>');
    addOutput('');

    addOutput('<span class="highlight">⚙️  Current Projects</span>');
    addOutput('');
    addOutput('<div class="list-item">Terminal-style Portfolio - This very site you\'re looking at!</div>');
    addOutput('<div class="list-item">Web Development - Building modern, interactive applications</div>');
    addOutput('<div class="list-item">Open Source Contributions - Giving back to the community</div>');
    addOutput('');

    addOutput('<span class="highlight">🎨 Creative Pursuits</span>');
    addOutput('');
    addOutput('<div class="list-item">UI/UX Design - Crafting beautiful user experiences</div>');
    addOutput('<div class="list-item">Terminal Customization - Making the CLI look amazing</div>');
    addOutput('<div class="list-item">Photography - Capturing moments in time</div>');
    addOutput('');

    addOutput('<span class="highlight">🎮 For Fun</span>');
    addOutput('');
    addOutput('<div class="list-item">Gaming - Strategy and puzzle games</div>');
    addOutput('<div class="list-item">Reading - Sci-fi and tech books</div>');
    addOutput('<div class="list-item">Exploring new tech - Always learning something new</div>');
    addOutput('');
}

// Show workouts
function showWorkouts() {
    addOutput(`<pre class="ascii-art">${CROSSFIT_ASCII}</pre>`);
    addOutput('');

    // Week overview container
    addOutput('<div class="btop-container">');
    addOutput('  <div class="btop-header">📊 THIS WEEK\'S STATS</div>');
    addOutput('  <div class="btop-row">');
    addOutput('    <span class="btop-label">Workouts Completed:</span>');
    addOutput('    <span class="btop-value">5 / 6 days</span>');
    addOutput('  </div>');
    addOutput('  <div class="btop-row">');
    addOutput('    <span class="btop-label">Total Volume:</span>');
    addOutput('    <span class="btop-value">12,450 lbs</span>');
    addOutput('  </div>');
    addOutput('  <div class="btop-row">');
    addOutput('    <span class="btop-label">Avg Heart Rate:</span>');
    addOutput('    <span class="btop-value">156 bpm</span>');
    addOutput('  </div>');
    addOutput('  <div class="btop-row">');
    addOutput('    <span class="btop-label">Calories Burned:</span>');
    addOutput('    <span class="btop-value">3,240 kcal</span>');
    addOutput('  </div>');
    addOutput('</div>');
    addOutput('');

    // PR Progress
    addOutput('<div class="btop-container">');
    addOutput('  <div class="btop-header">💪 PERSONAL RECORDS (1RM)</div>');
    addOutput('  <div class="graph">');

    const prs = [
        { name: 'Back Squat', weight: 315, max: 400 },
        { name: 'Deadlift', weight: 405, max: 500 },
        { name: 'Bench Press', weight: 245, max: 350 },
        { name: 'Clean & Jerk', weight: 225, max: 300 },
        { name: 'Snatch', weight: 185, max: 250 }
    ];

    prs.forEach(pr => {
        const percentage = (pr.weight / pr.max) * 100;
        addOutput(`    <div class="graph-bar">`);
        addOutput(`      <span class="graph-label">${pr.name}</span>`);
        addOutput(`      <div class="graph-bar-container">`);
        addOutput(`        <div class="graph-bar-fill" style="width: ${percentage}%">`);
        addOutput(`          <span class="graph-value">${pr.weight} lbs</span>`);
        addOutput(`        </div>`);
        addOutput(`      </div>`);
        addOutput(`    </div>`);
    });

    addOutput('  </div>');
    addOutput('</div>');
    addOutput('');

    // WOD Performance
    addOutput('<div class="btop-container">');
    addOutput('  <div class="btop-header">🏃 BENCHMARK WOD TIMES</div>');
    addOutput('  <div class="graph">');

    const wods = [
        { name: 'Fran', time: '4:23', maxTime: 10, timeSeconds: 263 },
        { name: 'Murph', time: '38:15', maxTime: 60, timeSeconds: 2295 },
        { name: 'Grace', time: '3:45', maxTime: 8, timeSeconds: 225 },
        { name: 'Cindy', time: '23 rds', maxTime: 30, timeSeconds: 23 },
        { name: 'Helen', time: '9:12', maxTime: 15, timeSeconds: 552 }
    ];

    wods.forEach(wod => {
        const percentage = wod.name === 'Cindy' ? (wod.timeSeconds / wod.maxTime) * 100 :
                          ((wod.maxTime * 60 - wod.timeSeconds) / (wod.maxTime * 60)) * 100;
        addOutput(`    <div class="graph-bar">`);
        addOutput(`      <span class="graph-label">${wod.name}</span>`);
        addOutput(`      <div class="graph-bar-container">`);
        addOutput(`        <div class="graph-bar-fill" style="width: ${Math.min(percentage, 100)}%">`);
        addOutput(`          <span class="graph-value">${wod.time}</span>`);
        addOutput(`        </div>`);
        addOutput(`      </div>`);
        addOutput(`    </div>`);
    });

    addOutput('  </div>');
    addOutput('</div>');
    addOutput('');

    addOutput('<span class="muted">Note: These are example stats. Replace with your actual data!</span>');
    addOutput('');
}

// Clear terminal
function clearTerminal() {
    output.innerHTML = '';
}

// Show history
function showHistory() {
    if (commandHistory.length === 0) {
        addOutput('No command history yet.', 'muted');
        return;
    }

    addOutput('<div class="section-header">Command History</div>');
    addOutput('');
    commandHistory.forEach((cmd, index) => {
        addOutput(`  <span class="muted">${(index + 1).toString().padStart(3, ' ')}.</span> ${escapeHtml(cmd)}`);
    });
    addOutput('');
}

// Process command
function processCommand(cmd) {
    cmd = cmd.trim().toLowerCase();

    if (!cmd) return;

    // Add to history
    commandHistory.push(cmd);
    historyIndex = commandHistory.length;

    // Display command
    addCommand(cmd);

    // Execute command
    if (commands[cmd]) {
        commands[cmd].action();
    } else {
        addOutput(`Command not found: <span class="error">${escapeHtml(cmd)}</span>`);
        addOutput('Type <span class="highlight">help</span> for available commands.', 'muted');
        addOutput('');
    }
}

// Tab completion
function tabComplete(partial) {
    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));

    if (matches.length === 1) {
        return matches[0];
    } else if (matches.length > 1) {
        addCommand(partial);
        addOutput('');
        addOutput('Possible completions:', 'info');
        matches.forEach(match => {
            addOutput(`  <span class="highlight">${match}</span>`);
        });
        addOutput('');
        return partial;
    }

    return partial;
}

// Event listeners
input.addEventListener('keydown', (e) => {
    if (isIntroPlaying) {
        e.preventDefault();
        return;
    }

    // Enter key
    if (e.key === 'Enter') {
        const cmd = input.value;
        input.value = '';
        processCommand(cmd);
    }

    // Up arrow - previous command
    else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
        }
    }

    // Down arrow - next command
    else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
        } else {
            historyIndex = commandHistory.length;
            input.value = '';
        }
    }

    // Tab completion
    else if (e.key === 'Tab') {
        e.preventDefault();
        const partial = input.value.trim().toLowerCase();
        if (partial) {
            const completed = tabComplete(partial);
            input.value = completed;
        }
    }
});

// Keep focus on input
document.addEventListener('click', () => {
    if (!isIntroPlaying) {
        input.focus();
    }
});

// Initialize on load
window.addEventListener('load', init);
