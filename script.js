/* ============================================
   OPENPAGE AI TERMINAL — Chat Engine
   ============================================ */

// --- Configuration ---
const CONFIG = {
    apiEndpoint: '',       // Set to API Gateway URL when backend is ready
    mockMode: true,        // Use mock responses until backend is live
    streamSpeed: 18,       // ms per character when streaming text
    bootSpeed: 25,         // ms per character during boot sequence
};

// --- State ---
const state = {
    sessionId: crypto.randomUUID(),
    messages: [],          // Conversation history: { role, content }
    isProcessing: false,
    isBooting: true,
    commandHistory: [],
    historyIndex: -1,
};

// --- DOM References ---
const terminalBody = document.getElementById('terminalBody');
const userInput = document.getElementById('userInput');
const statusIndicator = document.getElementById('statusIndicator');

// --- Initialization ---
window.addEventListener('load', init);

async function init() {
    await playBootSequence();
    showWelcome();
    state.isBooting = false;
    userInput.disabled = false;
    userInput.focus();
    setupEventListeners();
}

// --- Boot Sequence ---
async function playBootSequence() {
    const steps = [
        { text: '[system] Initializing openpage terminal v2.0...', delay: 400 },
        { text: '[system] Loading knowledge bases...  ', delay: 300, append: 'done' },
        { text: '[system] Connecting to AI backend...  ', delay: 500, append: 'done' },
        { text: '[system] System ready.', delay: 200 },
    ];

    for (const step of steps) {
        const line = document.createElement('div');
        line.className = 'boot-line';
        terminalBody.appendChild(line);

        // Type main text
        for (let i = 0; i < step.text.length; i++) {
            line.textContent += step.text[i];
            await sleep(CONFIG.bootSpeed);
        }

        if (step.append) {
            await sleep(step.delay);
            const doneSpan = document.createElement('span');
            doneSpan.className = 'done';
            doneSpan.textContent = step.append;
            line.appendChild(doneSpan);
        }

        await sleep(step.delay);
        scrollToBottom();
    }

    await sleep(300);
}

// --- Welcome Message ---
function showWelcome() {
    // ASCII Banner
    const banner = document.createElement('pre');
    banner.className = 'ascii-banner';
    banner.textContent =
`  ___  ___  ___ _  _ ___  _   ___ ___
 / _ \\| _ \\| __| \\| | _ \\/_\\ / __| __|
| (_) |  _/| _|| .\` |  _/ _ \\ (_ | _|
 \\___/|_|  |___|_|\\_|_|/_/ \\_\\___|___|`;
    terminalBody.appendChild(banner);

    // Welcome text
    const welcome = document.createElement('div');
    welcome.className = 'welcome-text';
    welcome.innerHTML = `Welcome! I'm an AI assistant that knows all about this site's creator.\nAsk me about their <span style="color:var(--cyan)">skills</span>, <span style="color:var(--green)">workouts</span>, <span style="color:var(--magenta)">projects</span>, or <span style="color:var(--yellow)">blog posts</span>.`;
    terminalBody.appendChild(welcome);

    // Suggested prompts
    showSuggestedPrompts();

    scrollToBottom();
}

function showSuggestedPrompts() {
    const existing = terminalBody.querySelector('.suggested-prompts');
    if (existing) existing.remove();

    const suggestions = [
        'What are your top skills?',
        'How have workouts been going?',
        'Tell me about your projects',
        'What\'s your tech stack?',
    ];

    const container = document.createElement('div');
    container.className = 'suggested-prompts';

    suggestions.forEach(text => {
        const btn = document.createElement('button');
        btn.className = 'suggested-prompt';
        btn.textContent = `$ ${text.toLowerCase()}`;
        btn.addEventListener('click', () => {
            container.remove();
            sendMessage(text);
        });
        container.appendChild(btn);
    });

    terminalBody.appendChild(container);
    scrollToBottom();
}

// --- Event Listeners ---
function setupEventListeners() {
    userInput.addEventListener('keydown', handleInputKeydown);

    // Keep focus on input
    document.addEventListener('click', (e) => {
        if (!state.isBooting && !state.isProcessing && !e.target.closest('.suggested-prompt')) {
            userInput.focus();
        }
    });
}

function handleInputKeydown(e) {
    if (state.isBooting) { e.preventDefault(); return; }

    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = userInput.value.trim();
        if (text && !state.isProcessing) {
            // Remove suggested prompts on first message
            const prompts = terminalBody.querySelector('.suggested-prompts');
            if (prompts) prompts.remove();
            sendMessage(text);
        }
    }

    // Command history navigation
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.historyIndex > 0) {
            state.historyIndex--;
            userInput.value = state.commandHistory[state.historyIndex];
        }
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.historyIndex < state.commandHistory.length - 1) {
            state.historyIndex++;
            userInput.value = state.commandHistory[state.historyIndex];
        } else {
            state.historyIndex = state.commandHistory.length;
            userInput.value = '';
        }
    }
}

// --- Send Message ---
async function sendMessage(text) {
    state.isProcessing = true;
    setStatus('processing', 'thinking...');
    userInput.value = '';
    userInput.disabled = true;

    // Add to history
    state.commandHistory.push(text);
    state.historyIndex = state.commandHistory.length;

    // Render user message
    renderUserMessage(text);

    // Store in conversation
    state.messages.push({ role: 'user', content: text });

    // Show typing indicator
    const typingEl = showTypingIndicator();

    // Small delay for feel
    await sleep(400);

    try {
        let response;
        if (CONFIG.mockMode) {
            response = await getMockResponse(text);
        } else {
            response = await callApi(text);
        }

        // Remove typing indicator
        typingEl.remove();

        // Render bot response
        await renderBotResponse(response);

        // Store in conversation
        state.messages.push({ role: 'assistant', content: response });

    } catch (err) {
        typingEl.remove();
        renderErrorMessage('Something went wrong. Please try again.');
        console.error('Chat error:', err);
    }

    state.isProcessing = false;
    setStatus('ready', 'ready');
    userInput.disabled = false;
    userInput.focus();
}

// --- Render Messages ---
function renderUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg-user';
    msg.innerHTML = `<span class="msg-user-prompt">$ </span><span class="msg-user-text">${escapeHtml(text)}</span>`;
    terminalBody.appendChild(msg);
    scrollToBottom();
}

async function renderBotResponse(response) {
    const msg = document.createElement('div');
    msg.className = 'msg-bot';
    const content = document.createElement('div');
    content.className = 'msg-bot-content';
    msg.appendChild(content);
    terminalBody.appendChild(msg);

    for (const part of response.parts) {
        if (part.type === 'text') {
            await streamTextInto(content, part.content);
        } else if (part.type === 'viz') {
            const vizEl = renderVisualization(part);
            content.appendChild(vizEl);
            scrollToBottom();
            await sleep(100); // Brief pause after viz
        }
    }

    scrollToBottom();
}

function renderErrorMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg-bot';
    msg.innerHTML = `<div class="msg-bot-content" style="color:var(--red)">${escapeHtml(text)}</div>`;
    terminalBody.appendChild(msg);
    scrollToBottom();
}

function showTypingIndicator() {
    const el = document.createElement('div');
    el.className = 'typing-indicator';
    el.innerHTML = `
        <div class="typing-dots"><span></span><span></span><span></span></div>
        <span>thinking...</span>
    `;
    terminalBody.appendChild(el);
    scrollToBottom();
    return el;
}

// --- Stream Text ---
async function streamTextInto(container, text) {
    // Parse text into segments (plain text and line breaks)
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        if (i > 0) {
            container.appendChild(document.createElement('br'));
        }

        const line = lines[i];
        if (!line) continue;

        // Create a span for this line's text
        const span = document.createElement('span');
        container.appendChild(span);

        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'streaming-cursor';
        container.appendChild(cursor);

        // Stream characters
        for (let j = 0; j < line.length; j++) {
            span.textContent += line[j];
            scrollToBottom();
            await sleep(CONFIG.streamSpeed);
        }

        // Remove cursor
        cursor.remove();
    }
}

// --- Visualization Renderer ---
function renderVisualization(part) {
    const viz = document.createElement('div');
    viz.className = 'viz';

    const header = document.createElement('div');
    header.className = 'viz-header';
    header.textContent = part.title || '';
    viz.appendChild(header);

    const body = document.createElement('div');
    body.className = 'viz-body';
    viz.appendChild(body);

    switch (part.vizType) {
        case 'stat_grid':
            body.appendChild(buildStatGrid(part.data));
            break;
        case 'progress_bars':
            body.appendChild(buildProgressBars(part.data, part.fillClass));
            break;
        case 'table':
            body.appendChild(buildTable(part.columns, part.data));
            break;
        case 'cards':
            body.appendChild(buildCards(part.data));
            break;
        case 'bar_chart':
            body.appendChild(buildBarChart(part.data, part.colorClass));
            break;
        case 'timeline':
            body.appendChild(buildTimeline(part.data));
            break;
        default:
            body.textContent = JSON.stringify(part.data);
    }

    return viz;
}

// --- Visualization Builders ---

function buildStatGrid(items) {
    const grid = document.createElement('div');
    grid.className = 'stat-grid';

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'stat-item';
        el.innerHTML = `
            <span class="stat-label">${escapeHtml(item.label)}</span>
            <span class="stat-value ${item.highlight || ''}">${escapeHtml(item.value)}</span>
        `;
        grid.appendChild(el);
    });

    return grid;
}

function buildProgressBars(items, fillClass) {
    const list = document.createElement('div');
    list.className = 'progress-list';

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'progress-item';
        const cls = item.fillClass || fillClass || '';
        el.innerHTML = `
            <span class="progress-name">${escapeHtml(item.name)}</span>
            <div class="progress-track">
                <div class="progress-fill ${cls}" style="width: 0%"></div>
            </div>
            <span class="progress-pct">${item.pct}%</span>
        `;
        list.appendChild(el);

        // Animate fill after append
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.querySelector('.progress-fill').style.width = item.pct + '%';
            });
        });
    });

    return list;
}

function buildTable(columns, rows) {
    const wrapper = document.createElement('div');
    wrapper.className = 'viz-table';

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cell, i) => {
            const td = document.createElement('td');
            if (typeof cell === 'object' && cell.value !== undefined) {
                td.textContent = cell.value;
                if (cell.highlight) td.className = 'cell-highlight';
            } else {
                td.textContent = cell;
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    wrapper.appendChild(table);

    return wrapper;
}

function buildCards(items) {
    const grid = document.createElement('div');
    grid.className = 'card-grid';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-title">${escapeHtml(item.title)}</div>
            <div class="card-desc">${escapeHtml(item.description)}</div>
            ${item.tags ? `<div class="card-tags">${item.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        `;
        grid.appendChild(card);
    });

    return grid;
}

function buildBarChart(items, colorClass) {
    const chart = document.createElement('div');
    chart.className = 'bar-chart';

    items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'bar-row';
        const cls = item.colorClass || colorClass || 'bar-cyan';
        row.innerHTML = `
            <span class="bar-label">${escapeHtml(item.label)}</span>
            <div class="bar-track">
                <div class="bar-fill ${cls}" style="width: 0%">
                    ${item.barLabel ? `<span class="bar-fill-value">${escapeHtml(item.barLabel)}</span>` : ''}
                </div>
            </div>
            <span class="bar-value">${escapeHtml(String(item.value))}</span>
        `;
        chart.appendChild(row);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                row.querySelector('.bar-fill').style.width = item.pct + '%';
            });
        });
    });

    return chart;
}

function buildTimeline(items) {
    const timeline = document.createElement('div');
    timeline.className = 'timeline';

    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'timeline-item';
        el.innerHTML = `
            <span class="timeline-date">${escapeHtml(item.date)}</span>
            <div class="timeline-marker">
                <div class="timeline-dot"></div>
                <div class="timeline-line"></div>
            </div>
            <div>
                <div class="timeline-content-title">${escapeHtml(item.title)}</div>
                ${item.text ? `<div class="timeline-content-text">${escapeHtml(item.text)}</div>` : ''}
            </div>
        `;
        timeline.appendChild(el);
    });

    return timeline;
}

// --- Status Indicator ---
function setStatus(state, text) {
    const dot = statusIndicator.querySelector('.status-dot');
    const label = statusIndicator.querySelector('.status-text');
    dot.className = 'status-dot';
    if (state === 'processing') dot.classList.add('processing');
    if (state === 'error') dot.classList.add('error');
    label.textContent = text;
}

// --- API Call (for Phase 2+) ---
async function callApi(message) {
    const res = await fetch(CONFIG.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: message,
            session_id: state.sessionId,
            history: state.messages.slice(-10), // Last 10 messages for context
        }),
    });

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    return await res.json();
}

// --- Mock API ---
async function getMockResponse(message) {
    const lower = message.toLowerCase();

    // Simulate network delay
    await sleep(600 + Math.random() * 800);

    // Route to mock handlers based on keywords
    if (matchesAny(lower, ['workout', 'crossfit', 'gym', 'fitness', 'exercise', 'wod', 'lift', 'squat', 'deadlift', 'bench'])) {
        return mockWorkoutResponse();
    }

    if (matchesAny(lower, ['skill', 'tech', 'stack', 'language', 'framework', 'experience', 'resume', 'qualified', 'know'])) {
        return mockSkillsResponse();
    }

    if (matchesAny(lower, ['project', 'built', 'portfolio', 'work', 'hobby', 'hobbies', 'building'])) {
        return mockProjectsResponse();
    }

    if (matchesAny(lower, ['blog', 'write', 'article', 'post', 'written', 'read'])) {
        return mockBlogResponse();
    }

    if (matchesAny(lower, ['about', 'who', 'tell me about', 'yourself', 'introduction', 'bio'])) {
        return mockAboutResponse();
    }

    if (matchesAny(lower, ['hello', 'hi', 'hey', 'sup', 'what\'s up', 'greet'])) {
        return mockGreetingResponse();
    }

    return mockDefaultResponse();
}

function matchesAny(text, keywords) {
    return keywords.some(kw => text.includes(kw));
}

// --- Mock Response Builders ---

function mockWorkoutResponse() {
    return {
        parts: [
            { type: 'text', content: 'Here\'s a snapshot of recent workout activity:' },
            {
                type: 'viz', vizType: 'stat_grid', title: 'Weekly Overview',
                data: [
                    { label: 'Workouts', value: '5 / 6 days', highlight: 'highlight-green' },
                    { label: 'Total Volume', value: '12,450 lbs' },
                    { label: 'Avg Heart Rate', value: '156 bpm', highlight: 'highlight-yellow' },
                    { label: 'Calories', value: '3,240 kcal' },
                    { label: 'Consistency', value: '83%', highlight: 'highlight-green' },
                    { label: 'Streak', value: '3 weeks' },
                ],
            },
            { type: 'text', content: '\nPersonal records are looking strong across the big lifts:' },
            {
                type: 'viz', vizType: 'progress_bars', title: 'Personal Records (1RM)',
                data: [
                    { name: 'Back Squat', pct: 79 },
                    { name: 'Deadlift', pct: 81 },
                    { name: 'Bench Press', pct: 70 },
                    { name: 'Clean & Jerk', pct: 75 },
                    { name: 'Snatch', pct: 74 },
                ],
            },
            {
                type: 'viz', vizType: 'table', title: 'Benchmark WOD Times',
                columns: ['WOD', 'Time', 'Rx'],
                data: [
                    ['Fran', '4:32', { value: 'Yes', highlight: true }],
                    ['Grace', '3:15', { value: 'Yes', highlight: true }],
                    ['Murph', '38:45', { value: 'Yes', highlight: true }],
                    ['Helen', '9:12', { value: 'Yes', highlight: true }],
                ],
            },
            { type: 'text', content: 'Consistency has been solid. The deadlift PR is the most recent — hit 405 lbs last month.' },
        ],
    };
}

function mockSkillsResponse() {
    return {
        parts: [
            { type: 'text', content: 'Here\'s a breakdown of the technical skill set:' },
            {
                type: 'viz', vizType: 'progress_bars', title: 'Core Skills', fillClass: 'fill-magenta',
                data: [
                    { name: 'Python', pct: 92 },
                    { name: 'JavaScript/TS', pct: 88 },
                    { name: 'AWS', pct: 85 },
                    { name: 'React', pct: 80 },
                    { name: 'SQL/Databases', pct: 82 },
                    { name: 'DevOps/CI-CD', pct: 78 },
                    { name: 'AI/ML', pct: 75 },
                ],
            },
            {
                type: 'viz', vizType: 'bar_chart', title: 'AWS Services Proficiency',
                data: [
                    { label: 'Lambda', pct: 90, value: 'Expert', colorClass: 'bar-orange' },
                    { label: 'Bedrock', pct: 80, value: 'Advanced', colorClass: 'bar-orange' },
                    { label: 'API Gateway', pct: 85, value: 'Advanced', colorClass: 'bar-orange' },
                    { label: 'S3/CloudFront', pct: 92, value: 'Expert', colorClass: 'bar-orange' },
                    { label: 'DynamoDB', pct: 78, value: 'Proficient', colorClass: 'bar-orange' },
                    { label: 'RDS', pct: 75, value: 'Proficient', colorClass: 'bar-orange' },
                ],
            },
            { type: 'text', content: 'The focus lately has been on AI/ML integration, especially connecting LLMs to real data sources via Bedrock Agents. This site is actually a live example of that architecture.' },
        ],
    };
}

function mockProjectsResponse() {
    return {
        parts: [
            { type: 'text', content: 'Here are the current projects and interests:' },
            {
                type: 'viz', vizType: 'cards', title: 'Projects',
                data: [
                    {
                        title: 'AI Terminal Portfolio',
                        description: 'This site! A terminal-style personal page powered by AWS Bedrock. Visitors chat with an AI that pulls real data from knowledge bases and databases.',
                        tags: ['AWS Bedrock', 'Lambda', 'Vanilla JS', 'PostgreSQL'],
                    },
                    {
                        title: 'Workout Data Pipeline',
                        description: 'Automated pipeline that takes raw SugarWOD exports, cleans the data, and stores it in PostgreSQL. Powers the workout analytics on this site.',
                        tags: ['Python', 'PostgreSQL', 'ETL', 'Data Engineering'],
                    },
                    {
                        title: 'Open Source Contributions',
                        description: 'Contributing to the developer community through open source projects, bug fixes, and documentation improvements.',
                        tags: ['GitHub', 'Collaboration', 'Community'],
                    },
                ],
            },
            { type: 'text', content: 'The AI terminal project is the main focus right now — building a conversational portfolio that showcases real engineering skills, not just a static resume.' },
        ],
    };
}

function mockBlogResponse() {
    return {
        parts: [
            { type: 'text', content: 'Here are the latest blog entries:' },
            {
                type: 'viz', vizType: 'timeline', title: 'Recent Posts',
                data: [
                    { date: 'Mar 2026', title: 'Building an AI-Powered Portfolio with AWS Bedrock', text: 'How I connected an LLM to my personal data sources for a conversational portfolio experience.' },
                    { date: 'Feb 2026', title: 'From SugarWOD to PostgreSQL: A Workout Data Pipeline', text: 'Cleaning and structuring CrossFit workout data for analytics and AI consumption.' },
                    { date: 'Jan 2026', title: 'Why Your Terminal Should Be Beautiful', text: 'Thoughts on developer experience, terminal customization, and the Omarchy theme.' },
                ],
            },
            { type: 'text', content: 'Blog content is stored in S3 and indexed via a Bedrock Knowledge Base, so you can ask me specific questions about any post and I\'ll pull relevant details.' },
        ],
    };
}

function mockAboutResponse() {
    return {
        parts: [
            { type: 'text', content: 'Here\'s a quick overview:' },
            {
                type: 'viz', vizType: 'stat_grid', title: 'Profile',
                data: [
                    { label: 'Role', value: 'Developer & Creator' },
                    { label: 'Focus', value: 'AI + Cloud Engineering' },
                    { label: 'Fitness', value: 'CrossFit Athlete' },
                    { label: 'Interests', value: 'Building Cool Stuff' },
                ],
            },
            { type: 'text', content: 'A developer passionate about building things that sit at the intersection of AI, cloud infrastructure, and great user experience. This terminal is a working example — it\'s not a static page, it\'s a real AI system backed by AWS Bedrock, Lambda, and PostgreSQL.\n\nOutside of code, CrossFit is a big part of life. The workout data you can ask about is pulled from a real database, not hardcoded.\n\nFeel free to dig into anything — skills, projects, workouts, blog posts, or just ask whatever comes to mind.' },
        ],
    };
}

function mockGreetingResponse() {
    return {
        parts: [
            { type: 'text', content: 'Hey! Welcome to the terminal. I\'m an AI assistant connected to real data about this site\'s creator — workouts, skills, projects, blog posts, and more.\n\nTry asking something like:' },
            {
                type: 'viz', vizType: 'table', title: 'Try Asking',
                columns: ['Topic', 'Example Question'],
                data: [
                    [{ value: 'Workouts', highlight: true }, 'How have workouts been going?'],
                    [{ value: 'Skills', highlight: true }, 'What\'s your tech stack?'],
                    [{ value: 'Projects', highlight: true }, 'What are you building?'],
                    [{ value: 'Blog', highlight: true }, 'What have you written about?'],
                    [{ value: 'About', highlight: true }, 'Tell me about yourself'],
                ],
            },
            { type: 'text', content: 'Or just ask whatever you\'re curious about — I\'ll do my best.' },
        ],
    };
}

function mockDefaultResponse() {
    const responses = [
        {
            parts: [
                { type: 'text', content: 'I\'m not sure I have specific data on that, but I can tell you a lot about:\n\n- Technical skills and experience\n- CrossFit workout stats and progress\n- Current projects and what\'s being built\n- Blog posts and writing\n- General background and interests\n\nWhat would you like to explore?' },
            ],
        },
        {
            parts: [
                { type: 'text', content: 'Interesting question! I\'m best at answering things related to the creator\'s professional skills, workout data, projects, and blog content. Those are the areas where I have access to real data.\n\nWant to try one of those topics?' },
            ],
        },
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

// --- Utilities ---

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
