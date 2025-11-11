<?php
/**
 * PianoMode Sight Reading Training - Phase 1.1 : Loading Screen
 * File: /blocksy-child/assets/Sightreading-game/sightreading-main.php
 * Version: 1.0.0 - Phase 1.1 Complete
 *
 * @package PianoModeSightReading
 * @author PianoMode Development Team
 * @license GPL-2.0+
 *
 * PHASE 1.1 - Écran de chargement:
 * - Overlay avec logo PianoMode
 * - Barre de progression animée (0-100%)
 * - Bouton "Let's Play" activé après chargement
 * - Tips interactifs pendant le chargement
 * - Transition smooth vers l'interface principale
 */

// Security check
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main class for PianoMode Sight Reading Game
 */
class PianoMode_SightReading_Game {

    private $version = '1.0.0';
    private $assets_loaded = false;

    // PianoMode color palette EXACTE
    private $colors = array(
        'gold' => '#C59D3A',
        'gold_light' => '#D4A942',
        'gold_dark' => '#B08A2E',
        'black' => '#0B0B0B',
        'white' => '#FFFFFF',
        'gray' => '#808080'
    );

    // Loading tips for interactive experience
    private $loading_tips = array(
        'Tip: Start by reading notes in the treble clef (right hand)',
        'Tip: Practice recognizing note patterns to improve speed',
        'Tip: Use a MIDI keyboard for the best experience',
        'Tip: The computer keyboard can also be used to play notes',
        'Tip: Focus on steady rhythm rather than speed at first',
        'Tip: Regular practice improves sight-reading skills significantly',
        'Tip: Try different difficulty levels as you progress',
        'Tip: Use Wait Mode to learn, Scroll Mode to practice timing'
    );

    public function __construct() {
        add_action('init', array($this, 'init'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_shortcode('sightreading_game', array($this, 'render_shortcode'));
    }

    /**
     * Initialize the game
     */
    public function init() {
        // Register custom capabilities if needed
    }

    /**
     * Enqueue CSS and JavaScript assets
     */
    public function enqueue_assets() {
        if (!$this->assets_loaded) {
            // Google Fonts - Montserrat
            wp_enqueue_style(
                'srt-google-fonts',
                'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap',
                array(),
                null
            );

            // Main CSS
            wp_enqueue_style(
                'srt-main-css',
                get_stylesheet_directory_uri() . '/assets/Sightreading-game/sightreading.css',
                array(),
                $this->version
            );

            // Tone.js for audio
            wp_enqueue_script(
                'tonejs',
                'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js',
                array(),
                '14.8.49',
                true
            );

            // Main Engine JavaScript
            wp_enqueue_script(
                'srt-engine-js',
                get_stylesheet_directory_uri() . '/assets/Sightreading-game/sightreading-engine.js',
                array('jquery', 'tonejs'),
                $this->version,
                true
            );

            // Localize script with configuration
            wp_localize_script('srt-engine-js', 'srtConfig', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('srt_nonce'),
                'version' => $this->version,
                'colors' => $this->colors,
                'loadingTips' => $this->loading_tips
            ));

            $this->assets_loaded = true;
        }
    }

    /**
     * Render the shortcode
     */
    public function render_shortcode($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(array(
            'mode' => 'wait',
            'difficulty' => 'beginner',
            'tempo' => 100,
            'auto_start' => false
        ), $atts);

        // Ensure assets are loaded
        $this->enqueue_assets();

        // Start output buffering
        ob_start();

        ?>

        <!-- Main Sight Reading Container -->
        <div id="sightReadingGame" class="srt-container" data-config='<?php echo esc_attr(json_encode($atts)); ?>'>

            <!-- ==========================================
                 LOADING SCREEN (Phase 1.1)
                 ========================================== -->
            <div class="srt-loading-screen" id="srtLoadingScreen">
                <div class="srt-loader">

                    <!-- Logo PianoMode -->
                    <div class="srt-loader-logo">
                        <img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/images/Logo-def_NOIR.png'); ?>"
                             alt="PianoMode"
                             class="srt-logo-img">
                    </div>

                    <!-- Loading Text -->
                    <div class="srt-loader-text">
                        Loading PianoMode Sight Reading...
                    </div>

                    <!-- Progress Bar -->
                    <div class="srt-loader-progress">
                        <div class="srt-loader-bar" id="srtLoadingBar">
                            <div class="srt-loader-bar-fill"></div>
                        </div>
                        <div class="srt-loader-percentage" id="srtLoadingPercentage">0%</div>
                    </div>

                    <!-- Interactive Tips -->
                    <div class="srt-loader-tips">
                        <div class="srt-tip" id="srtLoadingTip">
                            <?php echo esc_html($this->loading_tips[0]); ?>
                        </div>
                    </div>

                    <!-- Let's Play Button (hidden until 100%) -->
                    <button class="srt-btn srt-btn-primary srt-lets-play-btn"
                            id="srtLetsPlayBtn"
                            style="display: none;"
                            disabled>
                        <span class="srt-btn-text">Let's Play!</span>
                        <svg class="srt-btn-icon" viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M8 5v14l11-7z"/>
                        </svg>
                    </button>

                </div>
            </div>

            <!-- ==========================================
                 MAIN INTERFACE (Will be created in Phase 1.2)
                 ========================================== -->
            <div class="srt-main-interface" id="srtMainInterface" style="display: none;">

                <!-- Top Header -->
                <div class="srt-header" id="srtHeader">
                    <div class="srt-header-content">
                        <div class="srt-header-left">
                            <img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/images/Logo-def_NOIR.png'); ?>"
                                 alt="PianoMode"
                                 class="srt-header-logo">
                            <h1 class="srt-header-title">Sight Reading Training</h1>
                        </div>
                        <div class="srt-header-right">
                            <div class="srt-stats-quick">
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Hits:</span>
                                    <span class="srt-stat-value" id="srtStatsHits">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Misses:</span>
                                    <span class="srt-stat-value" id="srtStatsMisses">0</span>
                                </div>
                                <div class="srt-stat-item">
                                    <span class="srt-stat-label">Streak:</span>
                                    <span class="srt-stat-value srt-stat-gold" id="srtStatsStreak">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Control Bar -->
                <div class="srt-control-bar" id="srtControlBar">
                    <div class="srt-control-group">

                        <!-- Mode Selector -->
                        <div class="srt-mode-selector">
                            <button class="srt-mode-btn active" data-mode="wait" title="Wait Mode - Practice note by note">
                                Wait
                            </button>
                            <button class="srt-mode-btn" data-mode="scroll" title="Scroll Mode - Notes scroll like a game">
                                Scroll
                            </button>
                            <button class="srt-mode-btn" data-mode="free" title="Free Play - No rules, just play">
                                Free
                            </button>
                        </div>

                        <!-- Playback Controls -->
                        <div class="srt-playback-controls">
                            <button class="srt-btn srt-btn-icon" id="srtPlayBtn" title="Play">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M8 5v14l11-7z"/>
                                </svg>
                            </button>
                            <button class="srt-btn srt-btn-icon" id="srtPauseBtn" title="Pause" style="display: none;">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                            </button>
                            <button class="srt-btn srt-btn-icon" id="srtStopBtn" title="Stop">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M6 6h12v12H6z"/>
                                </svg>
                            </button>
                            <button class="srt-btn srt-btn-icon" id="srtResetBtn" title="Reset">
                                <svg viewBox="0 0 24 24" width="20" height="20">
                                    <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Tempo Control -->
                        <div class="srt-tempo-control">
                            <label class="srt-control-label">Tempo</label>
                            <input type="range"
                                   id="srtTempoSlider"
                                   class="srt-slider"
                                   min="40"
                                   max="200"
                                   value="100"
                                   step="1">
                            <span class="srt-tempo-value" id="srtTempoValue">100 BPM</span>
                        </div>

                        <!-- Volume Control -->
                        <div class="srt-volume-control">
                            <svg class="srt-volume-icon" viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                            <input type="range"
                                   id="srtVolumeSlider"
                                   class="srt-slider srt-slider-small"
                                   min="0"
                                   max="100"
                                   value="75"
                                   step="1">
                            <span class="srt-volume-value" id="srtVolumeValue">75%</span>
                        </div>

                        <!-- Settings and Stats Buttons -->
                        <button class="srt-btn srt-btn-icon" id="srtSettingsBtn" title="Settings">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                        </button>

                        <button class="srt-btn srt-btn-icon" id="srtStatsBtn" title="Statistics">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"/>
                            </svg>
                        </button>

                    </div>
                </div>

                <!-- Staff Canvas Area (Will be completed in Phase 2) -->
                <div class="srt-staff-container" id="srtStaffContainer">
                    <canvas id="srtStaffCanvas" width="1200" height="200"></canvas>
                    <!-- Playhead for Scroll Mode -->
                    <div class="srt-playhead" id="srtPlayhead" style="display: none;"></div>
                </div>

                <!-- Piano Virtual (Will be completed in Phase 1.3) -->
                <div class="srt-piano-container" id="srtPianoContainer">
                    <div class="srt-piano-info">
                        <span>Connect MIDI keyboard or use computer keyboard</span>
                    </div>
                    <div class="srt-piano-keyboard" id="srtPianoKeyboard">
                        <!-- Piano keys will be generated by JavaScript -->
                    </div>
                </div>

            </div>

            <!-- Settings Panel (Hidden by default - Phase 1.2) -->
            <div class="srt-panel srt-panel-left" id="srtSettingsPanel">
                <div class="srt-panel-header">
                    <h3>Settings</h3>
                    <button class="srt-panel-close" id="srtSettingsPanelClose">&times;</button>
                </div>
                <div class="srt-panel-content">
                    <!-- Settings content will be added in Phase 6.1 -->
                </div>
            </div>

            <!-- Stats Panel (Hidden by default - Phase 1.2) -->
            <div class="srt-panel srt-panel-right" id="srtStatsPanel">
                <div class="srt-panel-header">
                    <h3>Statistics</h3>
                    <button class="srt-panel-close" id="srtStatsPanelClose">&times;</button>
                </div>
                <div class="srt-panel-content">
                    <!-- Stats content will be added in Phase 6.2 -->
                </div>
            </div>

        </div>

        <?php

        return ob_get_clean();
    }
}

// Initialize the game
new PianoMode_SightReading_Game();
