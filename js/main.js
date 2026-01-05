/**
 * Capybara Vibe Landing Page - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCopyButtons();
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initHeroTerminal();
});

/**
 * Theme Toggle - Dark/Light/Auto Mode
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Theme order: auto -> light -> dark -> auto
    const themes = ['auto', 'light', 'dark'];

    // Get saved theme or default to auto
    const savedTheme = localStorage.getItem('theme') || 'auto';

    // Apply initial theme
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme') || 'auto';
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];

            applyTheme(nextTheme);
            localStorage.setItem('theme', nextTheme);

            // Update tooltip
            themeToggle.title = `Theme: ${nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1)}`;
        });
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'auto') {
            applyTheme('auto');
        }
    });

    function applyTheme(theme) {
        if (theme === 'auto') {
            // Use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.setAttribute('data-theme', 'auto');
            // Apply actual colors based on system preference
            if (prefersDark) {
                html.classList.remove('light-mode');
                html.classList.add('dark-mode');
            } else {
                html.classList.remove('dark-mode');
                html.classList.add('light-mode');
                // For auto mode with light preference, we need to apply light colors
                html.setAttribute('data-theme', 'light');
                html.setAttribute('data-auto', 'true');
            }
        } else {
            html.removeAttribute('data-auto');
            html.setAttribute('data-theme', theme);
            html.classList.remove('light-mode', 'dark-mode');
            html.classList.add(theme + '-mode');
        }
    }
}

/**
 * Copy to clipboard functionality
 */
function initCopyButtons() {
    // Hero install command
    const heroInstallBtn = document.getElementById('copy-install');
    if (heroInstallBtn) {
        heroInstallBtn.addEventListener('click', () => {
            copyToClipboard('pip install capybara-vibe', heroInstallBtn);
        });
    }

    // All other copy buttons with data-copy attribute
    const copyButtons = document.querySelectorAll('.copy-btn[data-copy]');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-copy');
            copyToClipboard(text, btn);
        });
    });
}

/**
 * Copy text to clipboard and show feedback
 */
async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);

        // Visual feedback
        button.classList.add('copied');
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;

        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbar = document.getElementById('navbar');

    if (mobileMenuBtn && navbar) {
        mobileMenuBtn.addEventListener('click', () => {
            navbar.classList.toggle('mobile-open');
        });
    }
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Close mobile menu if open
                const navbar = document.getElementById('navbar');
                if (navbar) {
                    navbar.classList.remove('mobile-open');
                }
            }
        });
    });
}

/**
 * Navbar background on scroll
 */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state
    }
}

/**
 * Hero Terminal Typing Animation
 */
function initHeroTerminal() {
    const commandEl = document.getElementById('typing-command');
    const outputEl = document.getElementById('terminal-output');
    const cursorEl = document.querySelector('.terminal-cursor');

    if (!commandEl || !outputEl) return;

    const scenarios = [
        {
            command: 'capybara',
            output: `<div class="terminal-line"><span class="text-muted">Capybara Vibe v1.0.0</span></div>
<div class="terminal-line user-input"><span class="terminal-prompt text-primary">You:</span> <span>Create a todo app with React</span></div>
<div class="agent-response"><span class="agent-label text-accent">Agent:</span> I'll create a React todo app for you.</div>
<div class="tool-execution"><span class="tool-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></span><span class="tool-name">write_file</span> <span class="tool-arg">src/App.tsx</span></div>`
        },
        {
            command: 'capybara --mode plan',
            output: `<div class="terminal-line"><span class="text-muted">Plan Mode - Read Only</span></div>
<div class="terminal-line user-input"><span class="terminal-prompt text-primary">You:</span> <span>Analyze this codebase structure</span></div>
<div class="agent-response"><span class="agent-label text-accent">Agent:</span> Analyzing project architecture...</div>
<div class="todo-list">
<div class="todo-item done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg><span>Found 12 components</span></div>
<div class="todo-item done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg><span>3 API routes detected</span></div>
</div>`
        },
        {
            command: 'capybara run "Fix the login bug"',
            output: `<div class="terminal-line"><span class="text-muted">Running single prompt...</span></div>
<div class="agent-response"><span class="agent-label text-accent">Agent:</span> Found issue in auth.ts line 42</div>
<div class="tool-execution"><span class="tool-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></span><span class="tool-name">edit_file</span> <span class="tool-arg">src/auth.ts</span></div>
<div class="terminal-line"><span class="text-accent">✓</span> <span>Bug fixed successfully</span></div>`
        }
    ];

    let scenarioIndex = 0;

    async function typeCommand(text) {
        commandEl.textContent = '';
        for (let i = 0; i < text.length; i++) {
            commandEl.textContent += text[i];
            await sleep(50 + Math.random() * 30);
        }
    }

    async function runScenario() {
        const scenario = scenarios[scenarioIndex];

        // Clear
        commandEl.textContent = '';
        outputEl.innerHTML = '';
        if (cursorEl) cursorEl.style.display = 'inline-block';

        // Type command
        await typeCommand(scenario.command);

        // Hide cursor, show output
        if (cursorEl) cursorEl.style.display = 'none';
        await sleep(300);

        // Show output with fade in
        outputEl.innerHTML = scenario.output;
        outputEl.style.opacity = '0';
        outputEl.style.transform = 'translateY(10px)';

        requestAnimationFrame(() => {
            outputEl.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
            outputEl.style.opacity = '1';
            outputEl.style.transform = 'translateY(0)';
        });

        // Wait before next scenario
        await sleep(4000);

        // Next scenario
        scenarioIndex = (scenarioIndex + 1) % scenarios.length;
        runScenario();
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Start after a brief delay
    setTimeout(runScenario, 1000);
}
