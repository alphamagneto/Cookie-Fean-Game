// Main Game Logic with Audio and Powerup System

class CookieFeanGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Game state
        this.state = GAME_STATES.PLAYING;
        this.score = INITIAL_SCORE;
        this.lives = INITIAL_LIVES;
        this.level = INITIAL_LEVEL;
        this.combo = 0;
        this.comboTimeout = null;
        this.totalCatches = 0; // Track total catches for audio milestones

        // Entities
        this.player = new Player(PLAYER_START_X, PLAYER_START_Y);
        this.cookies = [];
        this.powerups = [];

        // Audio system
        this.audioCache = {};
        this.initializeAudio();

        // Input handling
        this.keys = {};
        this.setupEventListeners();

        // Game loop
        this.gameLoopId = null;
        this.lastFrameTime = Date.now();
    }

    initializeAudio() {
        // Pre-load audio files
        Object.keys(AUDIO_FILES).forEach(key => {
            const audio = new Audio();
            audio.src = AUDIO_FILES[key];
            audio.onerror = () => {
                console.log(`Audio file not found: ${AUDIO_FILES[key]}`);
            };
            this.audioCache[key] = audio;
        });
    }

    playSound(soundKey) {
        if (this.audioCache[soundKey]) {
            const audio = this.audioCache[soundKey].cloneNode();
            audio.play().catch(err => {
                console.log(`Could not play sound: ${soundKey}`, err);
            });
        }
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;

        // Handle Space key based on game state
        if (e.key === ' ') {
            e.preventDefault();
            
            if (this.state === GAME_STATES.GAME_OVER) {
                this.restart();
            } else if (this.state === GAME_STATES.PLAYING || this.state === GAME_STATES.PAUSED) {
                this.togglePause();
            }
        }

        // Quit game
        if (e.key === 'Escape') {
            this.endGame();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    togglePause() {
        if (this.state === GAME_STATES.PLAYING) {
            this.state = GAME_STATES.PAUSED;
            document.getElementById('pauseOverlay').classList.add('active');
        } else if (this.state === GAME_STATES.PAUSED) {
            this.state = GAME_STATES.PLAYING;
            document.getElementById('pauseOverlay').classList.remove('active');
        }
    }

    update() {
        if (this.state !== GAME_STATES.PLAYING) return;

        // Update player input
        this.player.stop();
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.player.moveLeft();
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.player.moveRight();
        }

        // Update player
        this.player.update();

        // Spawn cookies
        if (Math.random() < COOKIE_SPAWN_RATE && this.cookies.length < COOKIE_MAX_ON_SCREEN) {
            const x = Math.random() * (CANVAS_WIDTH - COOKIE_SIZE);
            const speedMultiplier = 1 + (this.level - 1) * 0.2;
            this.cookies.push(new Cookie(x, 0, speedMultiplier));
        }

        // Spawn powerups (less frequently than cookies)
        if (Math.random() < POWERUP_SPAWN_RATE && this.powerups.length < 5) {
            const x = Math.random() * (CANVAS_WIDTH - POWERUP_SIZE);
            const speedMultiplier = 1 + (this.level - 1) * 0.2;
            this.powerups.push(new Powerup(x, 0, speedMultiplier));
        }

        // Update cookies
        for (let i = this.cookies.length - 1; i >= 0; i--) {
            this.cookies[i].update();

            // Check collision with player
            if (this.player.collidesWith(this.cookies[i])) {
                this.catchCookie(i);
                continue;
            }

            // Check if cookie fell off screen
            if (this.cookies[i].isOffScreen()) {
                this.missedCookie();
                this.cookies.splice(i, 1);
            }
        }

        // Update powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            this.powerups[i].update();

            // Check collision with player
            if (this.player.collidesWith(this.powerups[i])) {
                this.catchPowerup(i);
                continue;
            }

            // Check if powerup fell off screen
            if (this.powerups[i].isOffScreen()) {
                this.powerups.splice(i, 1);
            }
        }

        // Update level based on score
        const newLevel = Math.floor(this.score / SCORE_PER_LEVEL) + 1;
        if (newLevel !== this.level) {
            this.level = newLevel;
        }

        // Check game over
        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    catchCookie(index) {
        this.cookies.splice(index, 1);
        this.totalCatches++;

        // Calculate points
        let points = COOKIE_POINTS;

        // Apply combo multiplier
        if (this.combo > 0) {
            points = Math.floor(points * (1 + this.combo * 0.1));
        }

        this.score += points;
        this.combo++;

        // Play catch sound
        this.playSound('CATCH');

        // Check audio milestones
        if (this.totalCatches % FEAN_LAUGH_MILESTONE === 0) {
            this.playSound('FEAN_LAUGH');
        }
        if (this.totalCatches % OOH_COOKIES_MILESTONE === 0) {
            this.playSound('OOH_COOKIES');
        }

        // Reset combo timeout
        clearTimeout(this.comboTimeout);
        this.comboTimeout = setTimeout(() => {
            this.combo = 0;
            this.updateComboDisplay();
        }, COMBO_TIMEOUT);

        this.updateComboDisplay();
    }

    catchPowerup(index) {
        this.powerups.splice(index, 1);

        // Add bonus points
        this.score += POWERUP_POINTS;

        // Play powerup sound
        this.playSound('POWERUP');

        // Bonus effect: add extra life or bonus combo
        this.combo += 2;
        this.updateComboDisplay();
    }

    missedCookie() {
        this.lives--;
        this.combo = 0;
        this.updateComboDisplay();

        // Play miss sound
        this.playSound('MISS');
    }

    updateComboDisplay() {
        const comboDisplay = document.getElementById('comboDisplay');
        const comboValue = document.getElementById('combo');

        if (this.combo > 0) {
            comboDisplay.style.display = 'block';
            comboValue.textContent = this.combo;
        } else {
            comboDisplay.style.display = 'none';
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = COLORS.BACKGROUND;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#0a0a14');
        gradient.addColorStop(1, '#1e1e28');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw cookies
        for (let cookie of this.cookies) {
            cookie.draw(this.ctx);
        }

        // Draw powerups
        for (let powerup of this.powerups) {
            powerup.draw(this.ctx);
        }

        // Draw player (on top)
        this.player.draw(this.ctx);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }

    gameOver() {
        this.state = GAME_STATES.GAME_OVER;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('gameOverOverlay').classList.add('active');
    }

    endGame() {
        cancelAnimationFrame(this.gameLoopId);
        this.state = GAME_STATES.GAME_OVER;
    }

    restart() {
        // Reset game state
        this.state = GAME_STATES.PLAYING;
        this.score = INITIAL_SCORE;
        this.lives = INITIAL_LIVES;
        this.level = INITIAL_LEVEL;
        this.combo = 0;
        this.totalCatches = 0;
        this.cookies = [];
        this.powerups = [];

        // Reset player
        this.player = new Player(PLAYER_START_X, PLAYER_START_Y);

        // Hide overlays
        document.getElementById('gameOverOverlay').classList.remove('active');
        document.getElementById('pauseOverlay').classList.remove('active');

        // Update UI
        this.updateUI();

        // Start game loop
        this.start();
    }

    start() {
        this.gameLoop();
    }

    gameLoop = () => {
        this.update();
        this.draw();
        this.updateUI();
        this.gameLoopId = requestAnimationFrame(this.gameLoop);
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new CookieFeanGame(canvas);
    game.start();
});
