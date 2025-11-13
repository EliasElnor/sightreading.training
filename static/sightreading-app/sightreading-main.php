<?php
/**
 * PianoMode Sight Reading Game - WordPress Integration COMPLETE
 * File: static/sightreading-app/sightreading-main.php
 * Version: 2.0.0 - COMPLETE FUNCTIONAL IMPLEMENTATION
 *
 * @package PianoModeSightReading
 * @author PianoMode Development Team
 * @license GPL-2.0+
 *
 * Complete sight reading application with:
 * - Loading screen with progress bar and "Let's Play!" button
 * - Full interface (toolbar, control bar, staff, piano)
 * - Settings and Statistics panels (left/right)
 * - Grand Staff by default (treble + bass)
 * - Virtual Piano 88 keys (A0-C8)
 * - MIDI support (Web MIDI API)
 * - Audio engine (Tone.js + Salamander Piano)
 * - Multiple game modes (Wait, Scroll, Free)
 * - Exercise generators (Random, Scales, Chords, Progressions)
 * - Stats tracking and achievements system
 */

// Security check
if (!defined('ABSPATH')) {
    exit;
}

class PianoMode_SightReading_Game {

    private $version = '2.5.0';
    private $assets_loaded = false;

    // PianoMode color palette EXACTE
    private $colors = array(
        'gold' => '#C59D3A',
        'gold_light' => '#D4A942',
        'gold_dark' => '#B08A2E',
        'black' => '#0B0B0B',
        'white' => '#FFFFFF',
        'success' => '#4CAF50',
        'error' => '#F44336',
        'info' => '#2196F3',
        'warning' => '#FF9800'
    );

    // Notation systems for note names
    private $notation_systems = array(
        'international' => array(
            'C' => 'C', 'C#' => 'C#', 'Db' => 'Db', 'D' => 'D', 'D#' => 'D#', 'Eb' => 'Eb',
            'E' => 'E', 'F' => 'F', 'F#' => 'F#', 'Gb' => 'Gb', 'G' => 'G', 'G#' => 'G#',
            'Ab' => 'Ab', 'A' => 'A', 'A#' => 'A#', 'Bb' => 'Bb', 'B' => 'B'
        ),
        'latin' => array(
            'C' => 'Do', 'C#' => 'Do#', 'Db' => 'Réb', 'D' => 'Ré', 'D#' => 'Ré#', 'Eb' => 'Mib',
            'E' => 'Mi', 'F' => 'Fa', 'F#' => 'Fa#', 'Gb' => 'Solb', 'G' => 'Sol', 'G#' => 'Sol#',
            'Ab' => 'Lab', 'A' => 'La', 'A#' => 'La#', 'Bb' => 'Sib', 'B' => 'Si'
        )
    );

    // Game difficulty levels COMPLETS
    private $difficulty_levels = array(
        'beginner' => array(
            'name' => 'Beginner',
            'description' => 'Single notes, C position, one staff',
            'range' => array('C3', 'G4'),
            'notes_count' => 1,
            'use_accidentals' => false,
            'tempo_range' => array(40, 80),
            'key_signatures' => array('C'),
            'time_signatures' => array('4/4'),
            'note_types' => array('whole', 'half', 'quarter'),
            'use_grand_staff' => false,
            'staff_preference' => 'treble'
        ),
        'elementary' => array(
            'name' => 'Elementary',
            'description' => 'Extended range, simple rhythms',
            'range' => array('A2', 'C5'),
            'notes_count' => 1,
            'use_accidentals' => false,
            'tempo_range' => array(50, 100),
            'key_signatures' => array('C', 'G', 'F'),
            'time_signatures' => array('4/4', '3/4'),
            'note_types' => array('whole', 'half', 'quarter', 'eighth'),
            'use_grand_staff' => true,
            'staff_preference' => 'both'
        ),
        'intermediate' => array(
            'name' => 'Intermediate',
            'description' => 'Two hands, accidentals, chords',
            'range' => array('C2', 'C6'),
            'notes_count' => 2,
            'use_accidentals' => true,
            'tempo_range' => array(60, 120),
            'key_signatures' => array('C', 'G', 'D', 'A', 'F', 'Bb', 'Eb'),
            'time_signatures' => array('4/4', '3/4', '6/8', '2/4'),
            'note_types' => array('whole', 'half', 'quarter', 'eighth', 'sixteenth', 'dotted'),
            'use_grand_staff' => true,
            'staff_preference' => 'both'
        ),
        'advanced' => array(
            'name' => 'Advanced',
            'description' => 'Complex chords, all keys',
            'range' => array('A1', 'C7'),
            'notes_count' => 3,
            'use_accidentals' => true,
            'tempo_range' => array(80, 140),
            'key_signatures' => array('C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'),
            'time_signatures' => array('4/4', '3/4', '6/8', '2/4', '5/4', '7/8'),
            'note_types' => array('whole', 'half', 'quarter', 'eighth', 'sixteenth', 'dotted', 'triplet'),
            'use_grand_staff' => true,
            'staff_preference' => 'both'
        ),
        'expert' => array(
            'name' => 'Expert',
            'description' => 'Professional level, complex polyrhythms',
            'range' => array('A0', 'C8'),
            'notes_count' => 4,
            'use_accidentals' => true,
            'tempo_range' => array(100, 180),
            'key_signatures' => array('C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'),
            'time_signatures' => array('4/4', '3/4', '6/8', '2/4', '5/4', '7/8', '9/8', '12/8'),
            'note_types' => array('whole', 'half', 'quarter', 'eighth', 'sixteenth', 'thirty-second', 'dotted', 'triplet', 'quintuplet'),
            'use_grand_staff' => true,
            'staff_preference' => 'both'
        )
    );

    // Achievements system
    private $achievements = array(
        'first_note' => array(
            'name' => 'First Steps',
            'description' => 'Play your first note correctly',
            'icon' => '🎵',
            'points' => 10
        ),
        'perfect_streak' => array(
            'name' => 'Perfect Streak',
            'description' => 'Play 10 notes correctly in a row',
            'icon' => '⭐',
            'points' => 50
        ),
        'sight_reader' => array(
            'name' => 'Sight Reader',
            'description' => 'Complete 100 notes in sight reading mode',
            'icon' => '👁️',
            'points' => 100
        ),
        'speed_demon' => array(
            'name' => 'Speed Demon',
            'description' => 'Complete a session at 140+ BPM',
            'icon' => '⚡',
            'points' => 150
        ),
        'grand_master' => array(
            'name' => 'Grand Master',
            'description' => 'Reach expert level',
            'icon' => '🏆',
            'points' => 500
        )
    );

    // Scale patterns for note generation
    private $scale_patterns = array(
        'major' => array(0, 2, 4, 5, 7, 9, 11),
        'natural_minor' => array(0, 2, 3, 5, 7, 8, 10),
        'harmonic_minor' => array(0, 2, 3, 5, 7, 8, 11),
        'melodic_minor' => array(0, 2, 3, 5, 7, 9, 11),
        'dorian' => array(0, 2, 3, 5, 7, 9, 10),
        'mixolydian' => array(0, 2, 4, 5, 7, 9, 10)
    );

    // Chord progressions for advanced levels
    private $chord_progressions = array(
        'I-V-vi-IV' => array(0, 7, 9, 5),
        'ii-V-I' => array(2, 7, 0),
        'I-vi-ii-V' => array(0, 9, 2, 7),
        'vi-IV-I-V' => array(9, 5, 0, 7),
        'I-IV-V-I' => array(0, 5, 7, 0)
    );

    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_shortcode('sightreading_game', array($this, 'render_shortcode'));

        // AJAX handlers pour les statistiques
        add_action('wp_ajax_srt_save_session', array($this, 'ajax_save_session'));
        add_action('wp_ajax_srt_get_stats', array($this, 'ajax_get_stats'));
        add_action('wp_ajax_srt_update_achievement', array($this, 'ajax_update_achievement'));
        add_action('wp_ajax_nopriv_srt_save_session', array($this, 'ajax_save_session'));
        add_action('wp_ajax_nopriv_srt_get_stats', array($this, 'ajax_get_stats'));
        add_action('wp_ajax_nopriv_srt_update_achievement', array($this, 'ajax_update_achievement'));
    }

    public function init() {
        // Register custom post types for saved sessions if needed
        $this->register_post_types();
    }

    private function register_post_types() {
        // Custom post type pour sauvegarder les sessions de pratique
        register_post_type('srt_session', array(
            'labels' => array(
                'name' => 'Sight Reading Sessions',
                'singular_name' => 'Session'
            ),
            'public' => false,
            'show_ui' => false,
            'capability_type' => 'post',
            'supports' => array('title', 'custom-fields')
        ));
    }

    public function enqueue_assets() {
        if (!$this->assets_loaded && $this->should_load_assets()) {

            // Enqueue Tone.js FIRST (critical dependency)
            wp_enqueue_script('tonejs',
                'https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js',
                array(),
                '14.8.49',
                true
            );

            // Enqueue Chart.js for statistics graphs
            wp_enqueue_script('chartjs',
                'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js',
                array(),
                '3.9.1',
                true
            );

            // Enqueue CSS - CORRECTED PATH
            wp_enqueue_style(
                'sightreading-css',
                get_stylesheet_directory_uri() . '/assets/Sightreading-game/sightreading.css',
                array(),
                $this->version
            );

            // Enqueue JavaScript files in correct order - CORRECTED PATHS
            wp_enqueue_script(
                'sightreading-chord-generators',
                get_stylesheet_directory_uri() . '/assets/Sightreading-game/sightreading-chord-generators.js',
                array('jquery'),
                $this->version,
                true
            );

            wp_enqueue_script(
                'sightreading-songs',
                get_stylesheet_directory_uri() . '/assets/Sightreading-game/sightreading-songs.js',
                array('jquery'),
                $this->version,
                true
            );

            wp_enqueue_script(
                'sightreading-engine',
                get_stylesheet_directory_uri() . '/assets/Sightreading-game/sightreading-engine.js',
                array('jquery', 'tonejs', 'chartjs', 'sightreading-chord-generators', 'sightreading-songs'),
                $this->version,
                true
            );

            // Pass data to JavaScript
            wp_localize_script('sightreading-engine', 'srtConfig', array(
                'ajax_url' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('srt_nonce'),
                'user_id' => get_current_user_id(),
                'assets_url' => get_stylesheet_directory_uri() . '/assets/Sightreading-game/',
                'colors' => $this->colors,
                'difficulties' => $this->difficulty_levels,
                'achievements' => $this->achievements,
                'notationSystems' => $this->notation_systems,
                'scalePatterns' => $this->scale_patterns,
                'chordProgressions' => $this->chord_progressions,
                'userSettings' => $this->get_user_settings(),
                'userStats' => $this->get_user_stats(),
                'translations' => $this->get_translations(),
                'debug' => defined('WP_DEBUG') && WP_DEBUG
            ));

            $this->assets_loaded = true;
        }
    }

    private function should_load_assets() {
        // Load assets on sight reading pages or when shortcode is present
        global $post;

        if (is_admin()) {
            return false;
        }

        if (isset($post) && has_shortcode($post->post_content, 'sightreading_game')) {
            return true;
        }

        // Load on specific pages
        $load_pages = array('sight-reading', 'practice', 'games', 'sightreading');
        if (is_page($load_pages)) {
            return true;
        }

        return false;
    }

    // Main shortcode render function
    public function render_shortcode($atts) {
        // Parse attributes
        $atts = shortcode_atts(array(
            'mode' => 'wait',
            'difficulty' => 'elementary',
            'show_piano' => 'true',
            'show_stats' => 'true',
            'fullscreen' => 'false',
            'theme' => 'pianomode'
        ), $atts);

        // Enqueue assets
        $this->enqueue_assets();

        // Start output buffering
        ob_start();

        // Render the game interface
        $this->render_game_interface($atts);

        return ob_get_clean();
    }

    // Render the main game interface
    private function render_game_interface($atts) {
        $user_id = get_current_user_id();
        $user_settings = $this->get_user_settings($user_id);
        $user_stats = $this->get_user_stats($user_id);
        ?>

        <!-- Main Sight Reading Container -->
        <div id="sightReadingGame" class="srt-container" data-config='<?php echo json_encode($atts); ?>'>

            <!-- Loading Screen with Progress Bar and Let's Play Button -->
            <div class="srt-loading-screen" id="srtLoadingScreen" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: linear-gradient(135deg, #0B0B0B 0%, #1A1A1A 100%) !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 999999 !important; visibility: visible !important; opacity: 1 !important;">
                <div class="srt-loader" style="text-align: center; max-width: 700px; padding: 40px; background: rgba(11, 11, 11, 0.95); border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.8);">
                    <div class="srt-loader-logo" style="margin: 0 auto 30px; text-align: center;">
                        <img src="https://pianomode.com/wp-content/uploads/2025/11/cropped-ChatGPT-Image-Nov-10-2025-01_18_37-AM.png" alt="PianoMode" class="srt-logo-img" style="max-width: 200px; height: auto;">
                    </div>
                    <div class="srt-loader-text" style="color: #FFFFFF; font-size: 24px; font-weight: 500; letter-spacing: 0.5px; margin-bottom: 30px;">Loading PianoMode Sight Reading...</div>
                    <div class="srt-loader-progress" style="width: 500px; height: 16px; background: #333; border-radius: 10px; overflow: hidden; margin: 30px auto; border: 2px solid #444;">
                        <div class="srt-loader-bar" id="srtLoadingBar" style="height: 100%; background: linear-gradient(90deg, #B08A2E, #C59D3A, #D4A942); width: 0%; transition: width 0.5s ease-out; border-radius: 10px; box-shadow: 0 0 20px rgba(197, 157, 58, 0.6);"></div>
                    </div>
                    <div class="srt-loader-percentage" id="srtLoadingPercentage" style="color: #C59D3A; font-size: 56px !important; font-weight: 900 !important; text-align: center; margin: 30px 0; text-shadow: 0 3px 15px rgba(197, 157, 58, 0.8), 0 0 30px rgba(197, 157, 58, 0.5); letter-spacing: 2px;">0%</div>
                    <div class="srt-loader-tips" id="srtLoadingTips" style="color: #D4A942; font-size: 20px !important; font-weight: 500; text-align: center; margin: 30px 0; min-height: 60px; line-height: 1.6;">
                        <p style="margin: 0; padding: 0 20px;">💡 Tip: Connect a MIDI keyboard for the best experience</p>
                    </div>
                    <button class="srt-btn srt-btn-primary srt-lets-play-btn" id="srtLetsPlayBtn" style="display: none; margin-top: 30px; padding: 18px 60px; font-size: 24px; font-weight: 700; background: #C59D3A; color: #0B0B0B; border: 2px solid #D4A942; border-radius: 12px; box-shadow: 0 4px 20px rgba(197, 157, 58, 0.4); cursor: pointer; transition: all 0.3s ease; min-width: 280px;">
                        Let's Play
                    </button>
                </div>
            </div>

            <!-- Top Header (hidden by default until app starts) -->
            <div class="srt-header" id="srtHeader" style="display: none;">
                <div class="srt-header-content">
                    <div class="srt-header-left">
                        <img src="https://pianomode.com/wp-content/uploads/2025/11/cropped-ChatGPT-Image-Nov-10-2025-01_18_37-AM.png" alt="PianoMode" class="srt-header-logo">
                        <h1 class="srt-header-title">Sight Reading Training</h1>
                    </div>
                    <div class="srt-header-stats">
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Hits</span>
                            <span class="srt-stat-value" id="srtHeaderHits">0</span>
                        </div>
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Misses</span>
                            <span class="srt-stat-value" id="srtHeaderMisses">0</span>
                        </div>
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Streak</span>
                            <span class="srt-stat-value" id="srtHeaderStreak">0</span>
                        </div>
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Accuracy</span>
                            <span class="srt-stat-value" id="srtHeaderAccuracy">0%</span>
                        </div>
                    </div>
                    <div class="srt-header-controls">
                        <button class="srt-btn srt-btn-compact srt-play-btn" id="srtPlayBtn" title="Play">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            <span>Play</span>
                        </button>
                        <button class="srt-btn srt-btn-compact srt-pause-btn" id="srtPauseBtn" title="Pause" style="display: none;">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                            <span>Pause</span>
                        </button>
                        <button class="srt-btn srt-btn-compact srt-stop-btn" id="srtStopBtn" title="Stop">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M6 6h12v12H6z"/>
                            </svg>
                            <span>Stop</span>
                        </button>
                        <button class="srt-btn srt-btn-compact srt-reset-btn" id="srtResetBtn" title="Reset">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                            </svg>
                            <span>Reset</span>
                        </button>
                        <button class="srt-btn srt-btn-settings" id="srtSettingsBtn" title="Settings">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                            <span>Settings</span>
                        </button>
                        <button class="srt-btn srt-btn-stats" id="srtStatsBtn" title="Statistics">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M9,17H7v-7h2V17z M13,17h-2V7h2V17z M17,17h-2v-4h2V17z M19.5,19.1h-15V5h15V19.1z M19.5,3H4.5 c-0.6,0-1,0.4-1,1v15.1c0,0.6,0.4,1,1,1h15c0.6,0,1-0.4,1-1V4C20.5,3.4,20.1,3,19.5,3z"/>
                            </svg>
                            <span>Stats</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Control Toolbar -->
            <!-- Toolbar (hidden by default until app starts) -->
            <div class="srt-toolbar" id="srtToolbar" style="display: none;">
                <div class="srt-toolbar-content">

                    <!-- Mode Selection -->
                    <div class="srt-toolbar-section srt-mode-section">
                        <label class="srt-toolbar-label">Mode</label>
                        <div class="srt-mode-selector" id="srtModeSelector">
                            <button class="srt-mode-btn active" data-mode="wait">Wait</button>
                            <button class="srt-mode-btn" data-mode="scroll">Scroll</button>
                            <button class="srt-mode-btn" data-mode="free">Free</button>
                        </div>
                    </div>

                    <!-- Tempo Control -->
                    <div class="srt-toolbar-section srt-tempo-section">
                        <label class="srt-toolbar-label">Tempo</label>
                        <div class="srt-tempo-control">
                            <input type="range" id="srtTempoSlider" class="srt-slider" min="40" max="200" value="100" step="5">
                            <div class="srt-tempo-display">
                                <span id="srtTempoValue">100</span>
                                <span class="srt-tempo-unit">BPM</span>
                            </div>
                        </div>
                    </div>

                    <!-- Metronome -->
                    <div class="srt-toolbar-section srt-metronome-section">
                        <button class="srt-metronome-btn" id="srtMetronomeBtn" title="Metronome">
                            <svg class="srt-metronome-icon" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23L13 12.5V7z"/>
                            </svg>
                            <span class="srt-metronome-text">♩</span>
                        </button>
                    </div>

                    <!-- Difficulty -->
                    <div class="srt-toolbar-section srt-difficulty-section">
                        <label class="srt-toolbar-label">Difficulty</label>
                        <select id="srtDifficultySelect" class="srt-select">
                            <option value="beginner">Beginner</option>
                            <option value="elementary" selected>Elementary</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                    </div>

                    <!-- Volume Control -->
                    <div class="srt-toolbar-section srt-volume-section">
                        <label class="srt-toolbar-label">Volume</label>
                        <div class="srt-volume-control">
                            <input type="range" id="srtVolumeSlider" class="srt-slider" min="0" max="100" value="75" step="5">
                            <div class="srt-volume-display">
                                <span id="srtVolumeValue">75</span>
                                <span class="srt-volume-unit">%</span>
                            </div>
                        </div>
                    </div>

                    <!-- MIDI Connection -->
                    <div class="srt-toolbar-section srt-midi-section">
                        <button class="srt-btn srt-midi-btn" id="srtMidiBtn" title="Connect MIDI Keyboard">
                            <svg class="srt-icon" viewBox="0 0 24 24">
                                <path d="M20 8H4V6h16v2zm-2-2h-3V4h3v2zM20 19H4V9h16v10zM2 21h20v-1H2v1z"/>
                            </svg>
                            <span>MIDI</span>
                        </button>
                    </div>

                </div>
            </div>

            <!-- Main Game Area (hidden by default until app starts) -->
            <div class="srt-main-area" id="srtMainArea" style="display: none;">

                <!-- Settings Panel (Left - HIDDEN BY DEFAULT) -->
                <div class="srt-panel srt-panel-left srt-settings-panel" id="srtSettingsPanel" style="display: none; transform: translateX(-100%);" aria-hidden="true">
                    <div class="srt-panel-header">
                        <h3>Settings</h3>
                        <button class="srt-panel-close" id="srtSettingsPanelClose">×</button>
                    </div>
                    <div class="srt-panel-content">

                        <!-- Staff Settings -->
                        <div class="srt-setting-group">
                            <h4>Staff</h4>
                            <div class="srt-staff-options">
                                <button class="srt-staff-btn" data-staff="treble">Treble</button>
                                <button class="srt-staff-btn" data-staff="bass">Bass</button>
                                <button class="srt-staff-btn active" data-staff="grand">Grand</button>
                                <button class="srt-staff-btn" data-staff="alto">Alto</button>
                            </div>
                        </div>

                        <!-- Generator Type -->
                        <div class="srt-setting-group">
                            <h4>Generator</h4>
                            <div class="srt-generator-options">
                                <button class="srt-generator-btn active" data-generator="random">Random</button>
                                <button class="srt-generator-btn" data-generator="scales">Scales</button>
                                <button class="srt-generator-btn" data-generator="triads">Triads</button>
                                <button class="srt-generator-btn" data-generator="chords">Chords</button>
                                <button class="srt-generator-btn" data-generator="progression">Progression</button>
                                <button class="srt-generator-btn" data-generator="arpeggios">Arpeggios</button>
                            </div>
                        </div>

                        <!-- Note Density -->
                        <div class="srt-setting-group">
                            <h4>Notes per Chord</h4>
                            <div class="srt-slider-setting">
                                <input type="range" id="srtNotesSlider" min="1" max="4" value="2" step="1" class="srt-range-slider">
                                <span class="srt-slider-value" id="srtNotesValue">2</span>
                            </div>
                        </div>

                        <!-- Hands -->
                        <div class="srt-setting-group">
                            <h4>Hands</h4>
                            <div class="srt-slider-setting">
                                <input type="range" id="srtHandsSlider" min="1" max="2" value="2" step="1" class="srt-range-slider">
                                <span class="srt-slider-value" id="srtHandsValue">2</span>
                            </div>
                        </div>

                        <!-- Note Range -->
                        <div class="srt-setting-group">
                            <h4>Note Range</h4>
                            <div class="srt-range-setting">
                                <select id="srtRangeMin" class="srt-note-select">
                                    <option value="C2">C2</option>
                                    <option value="C3" selected>C3</option>
                                    <option value="C4">C4</option>
                                </select>
                                <span class="srt-range-separator">to</span>
                                <select id="srtRangeMax" class="srt-note-select">
                                    <option value="C5">C5</option>
                                    <option value="C6" selected>C6</option>
                                    <option value="C7">C7</option>
                                </select>
                            </div>
                        </div>

                        <!-- Key Signature -->
                        <div class="srt-setting-group">
                            <h4>Key Signature</h4>
                            <div class="srt-key-signature-grid">
                                <button class="srt-key-btn active" data-key="C">C</button>
                                <button class="srt-key-btn" data-key="G">G</button>
                                <button class="srt-key-btn" data-key="D">D</button>
                                <button class="srt-key-btn" data-key="A">A</button>
                                <button class="srt-key-btn" data-key="E">E</button>
                                <button class="srt-key-btn" data-key="B">B</button>
                                <button class="srt-key-btn" data-key="F">F</button>
                                <button class="srt-key-btn" data-key="Bb">Bb</button>
                                <button class="srt-key-btn" data-key="Eb">Eb</button>
                                <button class="srt-key-btn" data-key="Ab">Ab</button>
                                <button class="srt-key-btn" data-key="Db">Db</button>
                                <button class="srt-key-btn" data-key="Gb">Gb</button>
                            </div>
                        </div>

                        <!-- Note Name Display -->
                        <div class="srt-setting-group">
                            <h4>Note Names</h4>
                            <div class="srt-note-names-options">
                                <label class="srt-checkbox-label">
                                    <input type="checkbox" id="srtDisplayNotes" checked>
                                    <span class="srt-checkbox"></span>
                                    Display Note Names
                                </label>
                                <select id="srtNotationSystem" class="srt-select">
                                    <option value="international">International (C, D, E...)</option>
                                    <option value="latin">Latin (Do, Ré, Mi...)</option>
                                </select>
                            </div>
                        </div>

                        <!-- MIDI Settings -->
                        <div class="srt-setting-group">
                            <h4>MIDI Configuration</h4>
                            <div class="srt-midi-settings">
                                <select id="srtMidiInput" class="srt-select">
                                    <option value="">No MIDI device connected</option>
                                </select>
                                <button class="srt-btn srt-btn-secondary" id="srtMidiRefreshBtn">Refresh Devices</button>
                                <label class="srt-checkbox-label">
                                    <input type="checkbox" id="srtMidiThrough">
                                    <span class="srt-checkbox"></span>
                                    MIDI Through
                                </label>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Statistics Panel (Right) -->
                <!-- Stats Panel (Right - HIDDEN BY DEFAULT) -->
                <div class="srt-panel srt-panel-right srt-statistics-panel" id="srtStatsPanel" style="display: none; transform: translateX(100%);" aria-hidden="true">
                    <div class="srt-panel-header">
                        <h3>Statistics</h3>
                        <button class="srt-panel-close" id="srtStatsPanelClose">×</button>
                    </div>
                    <div class="srt-panel-content">

                        <!-- Session Stats -->
                        <div class="srt-stat-group">
                            <h4>Current Session</h4>
                            <div class="srt-stat-items">
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Duration</span>
                                    <span class="srt-stat-value" id="srtStatDuration">00:00</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Notes Played</span>
                                    <span class="srt-stat-value" id="srtStatNotesPlayed">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Correct Notes</span>
                                    <span class="srt-stat-value" id="srtStatCorrect">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Incorrect Notes</span>
                                    <span class="srt-stat-value" id="srtStatIncorrect">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Accuracy</span>
                                    <span class="srt-stat-value" id="srtStatAccuracy">0%</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Current Streak</span>
                                    <span class="srt-stat-value" id="srtStatStreak">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Best Streak</span>
                                    <span class="srt-stat-value" id="srtStatBestStreak">0</span>
                                </div>
                            </div>
                        </div>

                        <!-- Overall Stats -->
                        <div class="srt-stat-group">
                            <h4>Overall Performance</h4>
                            <div class="srt-stat-items">
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Total Sessions</span>
                                    <span class="srt-stat-value" id="srtStatTotalSessions">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Total Practice Time</span>
                                    <span class="srt-stat-value" id="srtStatTotalTime">0h 0m</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Average Accuracy</span>
                                    <span class="srt-stat-value" id="srtStatAvgAccuracy">0%</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Level</span>
                                    <span class="srt-stat-value" id="srtStatLevel">1</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Experience Points</span>
                                    <span class="srt-stat-value" id="srtStatXP">0</span>
                                </div>
                            </div>
                        </div>

                        <!-- Progress Chart -->
                        <div class="srt-stat-group">
                            <h4>Progress Chart</h4>
                            <canvas id="srtProgressChart" class="srt-progress-chart"></canvas>
                        </div>

                        <!-- Achievements -->
                        <div class="srt-stat-group">
                            <h4>Recent Achievements</h4>
                            <div class="srt-achievements" id="srtAchievements">
                                <p class="srt-no-achievements">No achievements yet. Start practicing!</p>
                            </div>
                        </div>

                        <div class="srt-stat-actions">
                            <button class="srt-btn srt-btn-danger" id="srtResetStatsBtn">Reset Statistics</button>
                        </div>

                    </div>
                </div>

                <!-- Staff Container - GRAND STAFF PAR DÉFAUT -->
                <div class="srt-staff-container" id="srtStaffContainer">
                    <canvas id="srtScoreCanvas" class="srt-staff-canvas" width="1200" height="400"></canvas>

                    <!-- Playhead for Scroll Mode -->
                    <div class="srt-playhead" id="srtPlayhead" style="display: none;"></div>

                    <!-- Overlay for feedback -->
                    <div class="srt-staff-overlay" id="srtStaffOverlay">
                        <div class="srt-feedback" id="srtFeedback"></div>
                    </div>
                </div>

                <!-- Virtual Piano - 88 keys (A0-C8) -->
                <div class="srt-piano-container" id="srtPianoContainer">

                    <!-- Piano Controls -->
                    <div class="srt-piano-controls">
                        <div class="srt-piano-controls-left">
                            <div class="srt-octave-control">
                                <label class="srt-piano-label">Display</label>
                                <select id="srtOctaveSelect" class="srt-select srt-compact">
                                    <option value="5">5 Octaves</option>
                                    <option value="7" selected>7 Octaves (88 keys)</option>
                                </select>
                            </div>

                            <!-- Note Names Toggle -->
                            <div class="srt-note-names-control">
                                <label class="srt-checkbox-label">
                                    <input type="checkbox" id="srtPianoNoteNames" checked>
                                    <span class="srt-checkbox"></span>
                                    Show Labels
                                </label>
                            </div>
                        </div>

                        <div class="srt-piano-controls-center">
                            <div class="srt-piano-info">
                                <span class="srt-piano-status" id="srtPianoStatus">
                                    Connect MIDI keyboard or use computer keys (A-L) • ALT = Sustain
                                </span>
                            </div>
                        </div>

                        <div class="srt-piano-controls-right">
                            <!-- Sound Selection -->
                            <div class="srt-sound-control">
                                <label class="srt-piano-label">Sound</label>
                                <select id="srtSoundSelect" class="srt-select srt-compact">
                                    <option value="salamander" selected>Grand Piano</option>
                                    <option value="electric">Electric Piano</option>
                                    <option value="organ">Organ</option>
                                    <option value="synth">Synth</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Piano Keyboard - Will be generated by JavaScript -->
                    <div class="srt-piano-keyboard" id="srtPianoKeyboard">
                        <!-- 88 keys will be dynamically generated (A0 to C8, MIDI 21-108) -->
                    </div>

                </div>

            </div>

        </div>

        <!-- Mobile Orientation Notice -->
        <div class="srt-orientation-notice" id="srtOrientationNotice" style="display: none;">
            <div class="srt-orientation-content">
                <div class="srt-orientation-icon">📱</div>
                <h3>Please Rotate Your Device</h3>
                <p>Sight Reading Training works best in landscape orientation.</p>
            </div>
        </div>

        <?php
    }

    // Get user settings with defaults
    private function get_user_settings($user_id = 0) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        $defaults = array(
            'staff_type' => 'grand',
            'difficulty' => 'elementary',
            'tempo' => 100,
            'volume' => 75,
            'metronome_enabled' => false,
            'sound_pack' => 'salamander',
            'notation_system' => 'international',
            'display_notes' => true,
            'octave_count' => 7,
            'key_signature' => 'C',
            'note_range_min' => 'C3',
            'note_range_max' => 'C6',
            'notes_count' => 2,
            'hands_count' => 2,
            'generator_type' => 'random',
            'midi_device' => '',
            'midi_through' => false,
            'mode' => 'wait'
        );

        if ($user_id > 0) {
            $user_settings = get_user_meta($user_id, 'srt_user_settings', true);
            if (is_array($user_settings)) {
                $defaults = array_merge($defaults, $user_settings);
            }
        }

        return $defaults;
    }

    // Get user statistics with defaults
    private function get_user_stats($user_id = 0) {
        if (!$user_id) {
            $user_id = get_current_user_id();
        }

        $defaults = array(
            'total_sessions' => 0,
            'total_notes_played' => 0,
            'total_correct_notes' => 0,
            'total_incorrect_notes' => 0,
            'total_practice_time' => 0,
            'average_accuracy' => 0,
            'best_streak' => 0,
            'level' => 1,
            'experience_points' => 0,
            'achievements' => array(),
            'session_history' => array()
        );

        if ($user_id > 0) {
            $user_stats = get_user_meta($user_id, 'srt_user_stats', true);
            if (is_array($user_stats)) {
                $defaults = array_merge($defaults, $user_stats);
            }
        }

        return $defaults;
    }

    // Get translations (for future internationalization)
    private function get_translations() {
        return array(
            'loading' => 'Loading...',
            'play' => 'Play',
            'pause' => 'Pause',
            'stop' => 'Stop',
            'reset' => 'Reset',
            'correct' => 'Correct!',
            'incorrect' => 'Try Again',
            'well_done' => 'Well Done!',
            'keep_going' => 'Keep Going!',
            'excellent' => 'Excellent!',
            'perfect' => 'Perfect!',
            'lets_play' => "Let's Play!"
        );
    }

    // AJAX handler for saving session data
    public function ajax_save_session() {
        check_ajax_referer('srt_nonce', 'nonce');

        $user_id = get_current_user_id();
        $session_data = json_decode(stripslashes($_POST['session_data']), true);

        if ($user_id > 0 && is_array($session_data)) {
            // Update user stats
            $user_stats = $this->get_user_stats($user_id);

            // Calculate new stats
            $user_stats['total_sessions']++;
            $user_stats['total_notes_played'] += intval($session_data['total_notes']);
            $user_stats['total_correct_notes'] += intval($session_data['correct_notes']);
            $user_stats['total_incorrect_notes'] += intval($session_data['incorrect_notes']);
            $user_stats['total_practice_time'] += intval($session_data['duration']);

            // Update accuracy
            if ($user_stats['total_notes_played'] > 0) {
                $user_stats['average_accuracy'] = ($user_stats['total_correct_notes'] / $user_stats['total_notes_played']) * 100;
            }

            // Update best streak
            if (intval($session_data['best_streak']) > $user_stats['best_streak']) {
                $user_stats['best_streak'] = intval($session_data['best_streak']);
            }

            // Add session to history
            $user_stats['session_history'][] = array(
                'date' => current_time('mysql'),
                'duration' => intval($session_data['duration']),
                'correct_notes' => intval($session_data['correct_notes']),
                'incorrect_notes' => intval($session_data['incorrect_notes']),
                'accuracy' => $session_data['accuracy'],
                'best_streak' => intval($session_data['best_streak']),
                'difficulty' => sanitize_text_field($session_data['difficulty']),
                'mode' => sanitize_text_field($session_data['mode'])
            );

            // Keep only last 50 sessions
            if (count($user_stats['session_history']) > 50) {
                $user_stats['session_history'] = array_slice($user_stats['session_history'], -50);
            }

            // Calculate experience points and level
            $xp_gained = intval($session_data['correct_notes']) * 10 + intval($session_data['best_streak']) * 5;
            $user_stats['experience_points'] += $xp_gained;
            $user_stats['level'] = floor($user_stats['experience_points'] / 1000) + 1;

            // Save updated stats
            update_user_meta($user_id, 'srt_user_stats', $user_stats);

            wp_send_json_success(array(
                'message' => 'Session saved successfully',
                'xp_gained' => $xp_gained,
                'new_level' => $user_stats['level'],
                'stats' => $user_stats
            ));
        }

        wp_send_json_error('Invalid session data');
    }

    // AJAX handler for getting stats
    public function ajax_get_stats() {
        check_ajax_referer('srt_nonce', 'nonce');

        $user_id = get_current_user_id();
        $user_stats = $this->get_user_stats($user_id);

        wp_send_json_success($user_stats);
    }

    // AJAX handler for updating achievements
    public function ajax_update_achievement() {
        check_ajax_referer('srt_nonce', 'nonce');

        $user_id = get_current_user_id();
        $achievement_id = sanitize_text_field($_POST['achievement_id']);

        if ($user_id > 0 && isset($this->achievements[$achievement_id])) {
            $user_stats = $this->get_user_stats($user_id);

            if (!in_array($achievement_id, $user_stats['achievements'])) {
                $user_stats['achievements'][] = $achievement_id;
                $user_stats['experience_points'] += $this->achievements[$achievement_id]['points'];
                $user_stats['level'] = floor($user_stats['experience_points'] / 1000) + 1;

                update_user_meta($user_id, 'srt_user_stats', $user_stats);

                wp_send_json_success(array(
                    'achievement' => $this->achievements[$achievement_id],
                    'xp_gained' => $this->achievements[$achievement_id]['points'],
                    'new_level' => $user_stats['level']
                ));
            }
        }

        wp_send_json_error('Invalid achievement');
    }
}

// Initialize the plugin - Complete initialization
function init_pianomode_sightreading() {
    global $pianomode_sightreading;

    // Créer l'instance seulement si elle n'existe pas
    if (!isset($pianomode_sightreading)) {
        $pianomode_sightreading = new PianoMode_SightReading_Game();

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('PianoMode Sight Reading Game initialized successfully - Version 2.0.0');
        }
    }
}

// Initialize early in WordPress lifecycle
add_action('init', 'init_pianomode_sightreading', 5);

// Force Tone.js to load globally (critical for audio engine)
add_action('wp_enqueue_scripts', function() {
    if (!is_admin()) {
        wp_enqueue_script('tonejs',
            'https://cdn.jsdelivr.net/npm/tone@14.8.49/build/Tone.js',
            array(),
            '14.8.49',
            true
        );
    }
}, 5); // High priority to load first

// Helper functions for external use
function srt_get_user_stats($user_id = 0) {
    global $pianomode_sightreading;
    if ($pianomode_sightreading) {
        return $pianomode_sightreading->get_user_stats($user_id);
    }
    return array();
}

function srt_save_user_setting($key, $value, $user_id = 0) {
    if (!$user_id) {
        $user_id = get_current_user_id();
    }

    if ($user_id > 0) {
        $settings = get_user_meta($user_id, 'srt_user_settings', true) ?: array();
        $settings[$key] = $value;
        update_user_meta($user_id, 'srt_user_settings', $settings);
        return true;
    }

    return false;
}

function srt_get_user_setting($key, $default = null, $user_id = 0) {
    if (!$user_id) {
        $user_id = get_current_user_id();
    }

    if ($user_id > 0) {
        $settings = get_user_meta($user_id, 'srt_user_settings', true) ?: array();
        return isset($settings[$key]) ? $settings[$key] : $default;
    }

    return $default;
}

?>
