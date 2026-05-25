// Game Constants and Configuration

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

// Player (Fean) Constants
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 60;
const PLAYER_SPEED = 6;
const PLAYER_START_X = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
const PLAYER_START_Y = CANVAS_HEIGHT - 100;

// Cookie Constants
const COOKIE_SIZE = 30;
const COOKIE_SPEED_BASE = 3;
const COOKIE_SPAWN_RATE = 0.02; // Probability per frame
const COOKIE_MAX_ON_SCREEN = 30;

// Powerup Constants
const POWERUP_SIZE = 40;
const POWERUP_SPAWN_RATE = 0.005; // Less frequent than cookies
const POWERUP_POINTS = 50;

// Game Constants
const INITIAL_LIVES = 3;
const INITIAL_LEVEL = 1;
const INITIAL_SCORE = 0;

// Combo System
const COMBO_TIMEOUT = 2000; // Milliseconds before combo resets
const COMBO_MULTIPLIER = 1.5;

// Level Progression
const SCORE_PER_LEVEL = 500;
const LEVEL_SPEED_MULTIPLIER = 1.1;

// Scoring
const COOKIE_POINTS = 10;
const COMBO_BONUS = 5;

// Audio Milestones
const FEAN_LAUGH_MILESTONE = 5; // Play after 5 catches
const OOH_COOKIES_MILESTONE = 8; // Play after 8 catches

// Colors
const COLORS = {
    PLAYER: '#FF1493',
    PLAYER_OUTLINE: '#FFB6D9',
    COOKIE: '#FFD700',
    COOKIE_OUTLINE: '#FFA500',
    POWERUP: '#00FF00',
    POWERUP_OUTLINE: '#00CC00',
    BACKGROUND: '#0a0a14',
    TEXT: '#00ffff',
    COMBO: '#ffff00'
};

// Game States
const GAME_STATES = {
    PLAYING: 'playing',
    PAUSED: 'paused',
    GAME_OVER: 'gameOver'
};

// Audio Files
const AUDIO_FILES = {
    CATCH: 'audio/catch.mp3',
    MISS: 'audio/miss.mp3',
    LEVEL_UP: 'audio/level-up.mp3',
    BACKGROUND_MUSIC: 'audio/background-music.mp3',
    FEAN_LAUGH: 'audio/fean_laugh.mp3',
    OOH_COOKIES: 'audio/ooh_cookies.mp3',
    POWERUP: 'audio/powerup.mp3'
};

// Image Files
const IMAGE_FILES = {
    PLAYER: 'images/player.jpg',
    COOKIE: 'images/cookie.jpg',
    POWERUP: 'images/powerup.jpg',
    BACKGROUND: 'images/background.jpg'
};
