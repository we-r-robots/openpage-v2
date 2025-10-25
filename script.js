// Terminal state
let commandHistory = [];
let historyIndex = -1;
let isIntroPlaying = true;
let currentView = 'welcome';

// DOM elements
const output = document.getElementById('output');
const input = document.getElementById('input');
const prompt = document.getElementById('prompt');
const terminalTitle = document.getElementById('terminal-title');

// View elements
const welcomeView = document.getElementById('welcome-view');
const aboutView = document.getElementById('about-view');
const hobbiesView = document.getElementById('hobbies-view');
const workoutsView = document.getElementById('workouts-view');

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
    ╔═══════════════════════════════════════╗
    ║   ╔═╗╦═╗╔═╗╔═╗╔═╗╔═╗╦╔╦╗              ║
    ║   ║  ╠╦╝║ ║╚═╗╚═╗╠╣ ║ ║               ║
    ║   ╚═╝╩╚═╚═╝╚═╝╚═╝╚  ╩ ╩               ║
    ╚═══════════════════════════════════════╝
`;

// Available commands
const commands = {
    help: {
        description: 'Display available commands',
        action: showHelp
    },
    about: {
        description: 'Learn more about me',
        action: () => switchView('about')
    },
    hobbies: {
        description: 'View my hobbies and projects',
        action: () => switchView('hobbies')
    },
    projects: {
        description: 'Alias for hobbies',
        action: () => switchView('hobbies')
    },
    workouts: {
        description: 'View CrossFit workout stats',
        action: () => switchView('workouts')
    },
    crossfit: {
        description: 'Alias for workouts',
        action: () => switchView('workouts')
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
    buildPages();
}

// Build full-screen pages
function buildPages() {
    buildAboutPage();
    buildHobbiesPage();
    buildWorkoutsPage();
}

// Build About page
function buildAboutPage() {
    aboutView.innerHTML = `
        <div class="page-header">
            <div class="page-header-title">📋 ABOUT</div>
            <div class="page-header-hint">Press <span class="key">ESC</span> to return</div>
        </div>

        <div class="page-section">
            <div class="page-section-title">👤 PERSONAL INFO</div>
            <div class="info-grid">
                <div class="info-label">Name:</div>
                <div class="info-value">Your Name</div>

                <div class="info-label">Location:</div>
                <div class="info-value">Earth 🌍</div>

                <div class="info-label">Role:</div>
                <div class="info-value">Developer & Creator</div>

                <div class="info-label">Interests:</div>
                <div class="info-value">Coding, CrossFit, Building Cool Stuff</div>

                <div class="info-label">Current Focus:</div>
                <div class="info-value">Creating interactive web experiences</div>
            </div>
        </div>

        <div class="page-section">
            <div class="page-section-title">💭 BIO</div>
            <div class="btop-container">
                <p style="color: var(--fg); line-height: 1.8; margin: 0;">
                    Hey there! 👋<br><br>
                    I'm a developer passionate about creating unique web experiences.
                    This terminal-style page is a reflection of my love for clean,
                    efficient interfaces and the command line aesthetic.<br><br>
                    I believe in building tools that are both powerful and beautiful,
                    combining functionality with an engaging user experience.<br><br>
                    <span style="color: var(--white);">Fun fact: This entire site runs on vanilla JavaScript!</span>
                </p>
            </div>
        </div>

        <div class="page-section">
            <div class="page-section-title">🛠️ SKILLS</div>
            <div class="btop-container">
                <div class="graph">
                    <div class="graph-bar">
                        <span class="graph-label">JavaScript</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 90%">
                                <span class="graph-value">Advanced</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">HTML/CSS</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 95%">
                                <span class="graph-value">Advanced</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Web Design</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 85%">
                                <span class="graph-value">Proficient</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Terminal Fu</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 88%">
                                <span class="graph-value">Advanced</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Build Hobbies page
function buildHobbiesPage() {
    hobbiesView.innerHTML = `
        <div class="page-header">
            <div class="page-header-title">🎨 HOBBIES & PROJECTS</div>
            <div class="page-header-hint">Press <span class="key">ESC</span> to return</div>
        </div>

        <div class="page-section">
            <div class="page-section-title">⚙️ CURRENT PROJECTS</div>

            <div class="card">
                <div class="card-title">Terminal-Style Portfolio</div>
                <div class="card-description">
                    An interactive, terminal-inspired personal website that mimics the look
                    and feel of modern terminal applications like btop. Features full keyboard
                    navigation, command history, and smooth animations.
                </div>
                <div class="card-tags">
                    <span class="tag">JavaScript</span>
                    <span class="tag">CSS</span>
                    <span class="tag">UI/UX</span>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Web Development</div>
                <div class="card-description">
                    Building modern, interactive applications with focus on user experience
                    and performance. Always exploring new frameworks and technologies.
                </div>
                <div class="card-tags">
                    <span class="tag">React</span>
                    <span class="tag">Node.js</span>
                    <span class="tag">API Design</span>
                </div>
            </div>

            <div class="card">
                <div class="card-title">Open Source Contributions</div>
                <div class="card-description">
                    Contributing to the developer community through open source projects,
                    bug fixes, and documentation improvements.
                </div>
                <div class="card-tags">
                    <span class="tag">GitHub</span>
                    <span class="tag">Collaboration</span>
                </div>
            </div>
        </div>

        <div class="page-section">
            <div class="page-section-title">🎮 FOR FUN</div>

            <div class="btop-container">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div>
                        <div style="color: var(--cyan); font-weight: bold; margin-bottom: 5px;">📚 Reading</div>
                        <div style="color: var(--fg); font-size: 13px;">Sci-fi novels, tech books, and programming blogs</div>
                    </div>
                    <div>
                        <div style="color: var(--cyan); font-weight: bold; margin-bottom: 5px;">🎮 Gaming</div>
                        <div style="color: var(--fg); font-size: 13px;">Strategy games, puzzles, and indie titles</div>
                    </div>
                    <div>
                        <div style="color: var(--cyan); font-weight: bold; margin-bottom: 5px;">📸 Photography</div>
                        <div style="color: var(--fg); font-size: 13px;">Capturing moments and exploring composition</div>
                    </div>
                    <div>
                        <div style="color: var(--cyan); font-weight: bold; margin-bottom: 5px;">🖥️ Terminal Customization</div>
                        <div style="color: var(--fg); font-size: 13px;">Making the CLI look beautiful and efficient</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Build Workouts page
function buildWorkoutsPage() {
    workoutsView.innerHTML = `
        <div class="page-header">
            <div class="page-header-title">💪 CROSSFIT STATS</div>
            <div class="page-header-hint">Press <span class="key">ESC</span> to return</div>
        </div>

        <pre class="ascii-art" style="margin-bottom: 20px;">${CROSSFIT_ASCII}</pre>

        <div class="page-section">
            <div class="page-section-title">📊 THIS WEEK'S STATS</div>
            <div class="btop-container">
                <div class="btop-row">
                    <span class="btop-label">Workouts Completed:</span>
                    <span class="btop-value">5 / 6 days</span>
                </div>
                <div class="btop-row">
                    <span class="btop-label">Total Volume:</span>
                    <span class="btop-value">12,450 lbs</span>
                </div>
                <div class="btop-row">
                    <span class="btop-label">Avg Heart Rate:</span>
                    <span class="btop-value">156 bpm</span>
                </div>
                <div class="btop-row">
                    <span class="btop-label">Calories Burned:</span>
                    <span class="btop-value">3,240 kcal</span>
                </div>
                <div class="btop-row">
                    <span class="btop-label">Weekly Consistency:</span>
                    <span class="btop-value" style="color: var(--green);">83%</span>
                </div>
            </div>
        </div>

        <div class="page-section">
            <div class="page-section-title">🏋️ PERSONAL RECORDS (1RM)</div>
            <div class="btop-container">
                <div class="graph">
                    <div class="graph-bar">
                        <span class="graph-label">Back Squat</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 79%">
                                <span class="graph-value">315 lbs</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Deadlift</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 81%">
                                <span class="graph-value">405 lbs</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Bench Press</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 70%">
                                <span class="graph-value">245 lbs</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Clean & Jerk</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 75%">
                                <span class="graph-value">225 lbs</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Snatch</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 74%">
                                <span class="graph-value">185 lbs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="page-section">
            <div class="page-section-title">⏱️ BENCHMARK WOD TIMES</div>
            <div class="btop-container">
                <div class="graph">
                    <div class="graph-bar">
                        <span class="graph-label">Fran</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 85%">
                                <span class="graph-value">4:23</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Murph</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 72%">
                                <span class="graph-value">38:15</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Grace</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 88%">
                                <span class="graph-value">3:45</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Cindy (rounds)</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 77%">
                                <span class="graph-value">23 rds</span>
                            </div>
                        </div>
                    </div>
                    <div class="graph-bar">
                        <span class="graph-label">Helen</span>
                        <div class="graph-bar-container">
                            <div class="graph-bar-fill" style="width: 80%">
                                <span class="graph-value">9:12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div style="text-align: center; color: var(--white); font-size: 12px; margin-top: 20px;">
            Note: These are example stats. Replace with your actual data!
        </div>
    `;
}

// Switch views
function switchView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Update current view
    currentView = viewName;

    // Show the requested view and update title
    switch(viewName) {
        case 'welcome':
            welcomeView.classList.add('active');
            terminalTitle.textContent = 'user@openpage ~ %';
            input.focus();
            break;
        case 'about':
            aboutView.classList.add('active');
            terminalTitle.textContent = 'user@openpage ~/about %';
            break;
        case 'hobbies':
            hobbiesView.classList.add('active');
            terminalTitle.textContent = 'user@openpage ~/hobbies %';
            break;
        case 'workouts':
            workoutsView.classList.add('active');
            terminalTitle.textContent = 'user@openpage ~/workouts %';
            break;
    }
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
    welcomeView.scrollTop = welcomeView.scrollHeight;
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
    addOutput('<span class="info">Tip: Press ESC to return from any page</span>');
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
        addOutput('');
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

// Global escape key handler
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentView !== 'welcome' && !isIntroPlaying) {
        switchView('welcome');
    }
});

// Keep focus on input when on welcome view
document.addEventListener('click', () => {
    if (!isIntroPlaying && currentView === 'welcome') {
        input.focus();
    }
});

// Initialize on load
window.addEventListener('load', init);
