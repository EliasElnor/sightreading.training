<?php
/**
 * PianoMode Sight Reading Training - Main File
 *
 * @package PianoMode
 * @subpackage SightReadingTraining
 * @version 1.0.0
 * @author PianoMode Team
 *
 * Description: Application complète de lecture à vue musicale (sight-reading)
 * intégrée à WordPress via shortcode [sightreading_game]
 *
 * Référence: sightreading.training
 * Technologies: HTML5 Canvas, Tone.js, Web MIDI API, VexFlow
 */

// Sécurité WordPress
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Classe principale Sight Reading Training
 */
class PianoMode_SightReading_Main {

    /**
     * Version de l'application
     */
    const VERSION = '1.0.0';

    /**
     * Constructeur
     */
    public function __construct() {
        // Hooks WordPress
        add_shortcode('sightreading_game', array($this, 'render_shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('wp_ajax_srt_save_stats', array($this, 'ajax_save_stats'));
        add_action('wp_ajax_nopriv_srt_save_stats', array($this, 'ajax_save_stats'));
    }

    /**
     * Enregistrer les scripts et styles
     */
    public function enqueue_assets() {
        // Vérifier si le shortcode est présent sur la page
        global $post;
        if (!is_a($post, 'WP_Post') || !has_shortcode($post->post_content, 'sightreading_game')) {
            return;
        }

        // Google Fonts - Montserrat
        wp_enqueue_style(
            'srt-montserrat-font',
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
            array(),
            null
        );

        // Bravura Music Font
        wp_enqueue_style(
            'srt-bravura-font',
            'https://cdn.jsdelivr.net/npm/@vexflow-fonts/bravura/bravura.css',
            array(),
            null
        );

        // CSS Principal
        wp_enqueue_style(
            'srt-styles',
            get_stylesheet_directory_uri() . '/assets/sightreading/sightreading.css',
            array(),
            self::VERSION
        );

        // Tone.js (Audio Engine)
        wp_enqueue_script(
            'tone-js',
            'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js',
            array(),
            '14.8.49',
            true
        );

        // Chart.js (pour les statistiques)
        wp_enqueue_script(
            'chart-js',
            'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js',
            array(),
            '3.9.1',
            true
        );

        // jQuery (déjà inclus dans WordPress)
        wp_enqueue_script('jquery');

        // JavaScript - Chord Generators
        wp_enqueue_script(
            'srt-chord-generators',
            get_stylesheet_directory_uri() . '/assets/sightreading/sightreading-chord-generators.js',
            array('jquery', 'tone-js'),
            self::VERSION,
            true
        );

        // JavaScript - Songs Library
        wp_enqueue_script(
            'srt-songs',
            get_stylesheet_directory_uri() . '/assets/sightreading/sightreading-songs.js',
            array('jquery'),
            self::VERSION,
            true
        );

        // JavaScript - Main Engine
        wp_enqueue_script(
            'srt-engine',
            get_stylesheet_directory_uri() . '/assets/sightreading/sightreading-engine.js',
            array('jquery', 'tone-js', 'srt-chord-generators', 'srt-songs'),
            self::VERSION,
            true
        );

        // Localiser le script avec des données WordPress
        wp_localize_script('srt-engine', 'srtConfig', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('srt_nonce'),
            'userId' => get_current_user_id(),
            'isLoggedIn' => is_user_logged_in(),
            'assetsPath' => get_stylesheet_directory_uri() . '/assets/sightreading/',
            'version' => self::VERSION
        ));
    }

    /**
     * Sauvegarder les statistiques via AJAX
     */
    public function ajax_save_stats() {
        check_ajax_referer('srt_nonce', 'nonce');

        $user_id = get_current_user_id();
        if (!$user_id) {
            wp_send_json_error('User not logged in');
            return;
        }

        $stats = isset($_POST['stats']) ? json_decode(stripslashes($_POST['stats']), true) : array();

        // Sauvegarder dans user meta
        update_user_meta($user_id, 'srt_stats', $stats);

        wp_send_json_success(array('message' => 'Stats saved successfully'));
    }

    /**
     * Rendu du shortcode
     */
    public function render_shortcode($atts) {
        // Attributs par défaut
        $atts = shortcode_atts(array(
            'mode' => 'wait',
            'difficulty' => 'beginner',
            'theme' => 'dark'
        ), $atts);

        ob_start();
        $this->render_html();
        return ob_get_clean();
    }

    /**
     * Rendu HTML complet de l'application
     */
    private function render_html() {
        ?>
<!-- ============================================
     PIANOMODE SIGHT READING TRAINING APPLICATION
     Version: <?php echo esc_attr(self::VERSION); ?>
     ============================================ -->

<div id="sightReadingGame" class="srt-root-container" data-version="<?php echo esc_attr(self::VERSION); ?>">

    <!-- ========== ÉCRAN DE CHARGEMENT ========== -->
    <div id="srtLoadingOverlay" class="srt-loading-overlay">
        <div class="srt-loading-content">
            <!-- Logo PianoMode -->
            <div class="srt-logo-container">
                <img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/images/Logo-def_NOIR.png'); ?>"
                     alt="PianoMode"
                     class="srt-loading-logo">
            </div>

            <!-- Titre -->
            <h1 class="srt-loading-title">Sight Reading Training</h1>
            <p class="srt-loading-subtitle">Loading audio samples and initializing...</p>

            <!-- Barre de progression -->
            <div class="srt-progress-container">
                <div class="srt-progress-bar">
                    <div id="srtProgressFill" class="srt-progress-fill"></div>
                </div>
                <p id="srtProgressText" class="srt-progress-text">0%</p>
            </div>

            <!-- Tips interactifs -->
            <div class="srt-tips-container">
                <p class="srt-tip" id="srtCurrentTip">
                    💡 Tip: Start with "Wait Mode" to practice note-by-note
                </p>
            </div>

            <!-- Bouton Let's Play (désactivé au début) -->
            <button id="srtLetsPlayBtn" class="srt-btn-primary srt-btn-large" disabled>
                <span class="srt-btn-text">Let's Play!</span>
                <span class="srt-btn-icon">🎹</span>
            </button>
        </div>
    </div>

    <!-- ========== INTERFACE PRINCIPALE ========== -->
    <div id="srtMainInterface" class="srt-main-interface" style="display: none;">

        <!-- Container principal (échapper au wrapper WordPress) -->
        <div class="srt-container">

            <!-- ========== TOOLBAR PRINCIPALE ========== -->
            <div class="srt-toolbar-main">
                <div class="srt-toolbar-left">
                    <img src="<?php echo esc_url(get_stylesheet_directory_uri() . '/assets/images/Logo-def_NOIR.png'); ?>"
                         alt="PianoMode"
                         class="srt-logo">
                    <h1 class="srt-title">Sight Reading Training</h1>
                </div>

                <div class="srt-toolbar-center">
                    <div class="srt-stats-display">
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Hits:</span>
                            <span class="srt-stat-value" id="srtHitsValue">0</span>
                        </div>
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Misses:</span>
                            <span class="srt-stat-value srt-stat-error" id="srtMissesValue">0</span>
                        </div>
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Streak:</span>
                            <span class="srt-stat-value srt-stat-gold" id="srtStreakValue">0</span>
                        </div>
                        <div class="srt-stat-item">
                            <span class="srt-stat-label">Accuracy:</span>
                            <span class="srt-stat-value" id="srtAccuracyValue">100%</span>
                        </div>
                    </div>
                </div>

                <div class="srt-toolbar-right">
                    <div class="srt-toolbar-buttons">
                        <button id="srtPlayBtn" class="srt-btn-icon" title="Play (Space)" aria-label="Play">
                            <span class="srt-icon">▶</span>
                        </button>
                        <button id="srtPauseBtn" class="srt-btn-icon" title="Pause (Space)" aria-label="Pause" style="display: none;">
                            <span class="srt-icon">⏸</span>
                        </button>
                        <button id="srtStopBtn" class="srt-btn-icon" title="Stop" aria-label="Stop">
                            <span class="srt-icon">⏹</span>
                        </button>
                        <button id="srtResetBtn" class="srt-btn-icon" title="New Exercise (N)" aria-label="Reset">
                            <span class="srt-icon">↺</span>
                        </button>
                        <button id="srtSettingsBtn" class="srt-btn-icon" title="Settings (S)" aria-label="Settings">
                            <span class="srt-icon">⚙</span>
                        </button>
                        <button id="srtStatsBtn" class="srt-btn-icon" title="Statistics (T)" aria-label="Stats">
                            <span class="srt-icon">📊</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ========== CONTROL BAR ========== -->
            <div class="srt-control-bar">
                <div class="srt-control-group">
                    <label class="srt-label">Mode</label>
                    <div class="srt-mode-selector">
                        <button class="srt-mode-btn active" data-mode="wait" title="Wait Mode: Note-by-note validation">
                            <span class="srt-mode-icon">⏸</span>
                            <span class="srt-mode-text">Wait</span>
                        </button>
                        <button class="srt-mode-btn" data-mode="scroll" title="Scroll Mode: Continuous scrolling">
                            <span class="srt-mode-icon">▶</span>
                            <span class="srt-mode-text">Scroll</span>
                        </button>
                        <button class="srt-mode-btn" data-mode="free" title="Free Play: No validation">
                            <span class="srt-mode-icon">🎹</span>
                            <span class="srt-mode-text">Free</span>
                        </button>
                    </div>
                </div>

                <div class="srt-control-group">
                    <label class="srt-label" for="srtTempoSlider">Tempo</label>
                    <div class="srt-tempo-group">
                        <input id="srtTempoSlider" type="range" min="40" max="200" value="100" step="1" aria-label="Tempo control">
                        <span id="srtTempoValue" class="srt-value-display">100 BPM</span>
                    </div>
                </div>

                <div class="srt-control-group">
                    <button id="srtMetronomeBtn" class="srt-btn-toggle" title="Metronome (M)" aria-label="Toggle Metronome">
                        <span class="srt-icon">🎵</span>
                        <span class="srt-label">Metronome</span>
                    </button>
                </div>

                <div class="srt-control-group">
                    <label class="srt-label" for="srtDifficultySelect">Difficulty</label>
                    <select id="srtDifficultySelect" class="srt-select" aria-label="Difficulty level">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>

                <div class="srt-control-group">
                    <label class="srt-label" for="srtVolume">Volume</label>
                    <div class="srt-volume-group">
                        <span class="srt-icon">🔊</span>
                        <input id="srtVolume" type="range" min="0" max="100" value="75" step="1" aria-label="Volume control">
                        <span id="srtVolumeValue" class="srt-value-display">75%</span>
                    </div>
                </div>

                <div class="srt-control-group">
                    <button id="srtMidiConnectBtn" class="srt-btn-midi" title="MIDI Connection" aria-label="MIDI Connection">
                        <span class="srt-midi-status"></span>
                        <span class="srt-label">MIDI</span>
                    </button>
                </div>
            </div>

            <!-- ========== ZONE CENTRALE (Canvas + Staff) ========== -->
            <div class="srt-center-area">
                <div class="srt-score-container">
                    <!-- Canvas principal pour la portée musicale -->
                    <!-- Hauteur réduite: 2 portées (140px) + marges (20px) = 160px MAX -->
                    <canvas id="srtScoreCanvas" width="1200" height="160" aria-label="Musical staff display"></canvas>

                    <!-- Bande verticale FIXE dorée (mode Scroll) -->
                    <div id="srtPlayhead" class="srt-playhead" style="display: none;"></div>

                    <!-- Layer de feedback pour notes incorrectes -->
                    <div id="srtFeedbackLayer" class="srt-feedback-layer"></div>

                    <!-- Brackets pour grand staff -->
                    <div class="srt-staff-bracket-left"></div>
                    <div class="srt-staff-bracket-right"></div>
                </div>
            </div>

            <!-- ========== PIANO VIRTUEL 88 TOUCHES ========== -->
            <div id="srtPianoContainer" class="srt-piano-container">
                <!-- Contrôles d'octaves -->
                <div class="srt-piano-controls">
                    <button class="srt-octave-btn" data-octaves="5" title="Show 5 octaves">
                        <span>5 Octaves</span>
                    </button>
                    <button class="srt-octave-btn active" data-octaves="7" title="Show 7 octaves">
                        <span>7 Octaves</span>
                    </button>
                    <button class="srt-octave-btn" data-octaves="all" title="Show all 88 keys">
                        <span>88 Keys</span>
                    </button>

                    <div class="srt-piano-info-right">
                        <span class="srt-sustain-indicator" id="srtSustainIndicator">
                            <span class="srt-icon">🎹</span>
                            <span class="srt-text">Sustain (ALT)</span>
                        </span>
                    </div>
                </div>

                <!-- Clavier piano (généré dynamiquement par JavaScript) -->
                <div class="srt-piano-keyboard" id="srtPianoKeyboard" role="application" aria-label="Virtual Piano Keyboard">
                    <!-- Les 88 touches seront générées ici par JavaScript -->
                </div>

                <!-- Informations -->
                <div class="srt-piano-info">
                    <span class="srt-info-text">Connect MIDI device or use Computer Keyboard (A-L keys)</span>
                    <span class="srt-keyboard-hint">Keyboard mapping: QWERTY (C4=Q, D4=W, E4=E, ...)</span>
                </div>
            </div>

        </div>

        <!-- ========== PANNEAU SETTINGS (GAUCHE, 400px, CACHÉ PAR DÉFAUT) ========== -->
        <div id="srtSettingsPanel" class="srt-panel srt-panel-left" role="dialog" aria-labelledby="srtSettingsPanelTitle" aria-hidden="true">
            <div class="srt-panel-header">
                <h3 id="srtSettingsPanelTitle" class="srt-panel-title">Settings</h3>
                <button class="srt-panel-close" id="srtSettingsPanelClose" aria-label="Close Settings Panel">
                    <span>×</span>
                </button>
            </div>

            <div class="srt-panel-content">
                <!-- Exercise Type -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label">Exercise Type</label>
                    <div class="srt-btn-group" role="group" aria-label="Exercise Type">
                        <button class="srt-btn-option active" data-generator="random" title="Random notes">Random</button>
                        <button class="srt-btn-option" data-generator="scales" title="Musical scales">Scales</button>
                        <button class="srt-btn-option" data-generator="triads" title="Simple triads">Triads</button>
                        <button class="srt-btn-option" data-generator="chords" title="Complex chords">Chords</button>
                        <button class="srt-btn-option" data-generator="arpeggios" title="Arpeggios">Arpeggios</button>
                        <button class="srt-btn-option" data-generator="progression" title="Chord progressions">Progressions</button>
                        <button class="srt-btn-option" data-generator="intervals" title="Intervals training">Intervals</button>
                    </div>
                </div>

                <!-- Note Density -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label" for="srtNoteDensity">
                        Note Density
                        <span class="srt-help-icon" title="Number of simultaneous notes">?</span>
                    </label>
                    <div class="srt-slider-group">
                        <input type="range" id="srtNoteDensity" min="1" max="4" value="1" step="1" aria-label="Note density">
                        <span id="srtNoteDensityValue" class="srt-value-label">Single Notes</span>
                    </div>
                </div>

                <!-- Rhythm Complexity -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label">Rhythm Complexity</label>
                    <div class="srt-btn-group" role="group" aria-label="Rhythm Complexity">
                        <button class="srt-btn-option active" data-rhythm="simple" title="Whole, half, quarter notes">Simple</button>
                        <button class="srt-btn-option" data-rhythm="moderate" title="Add eighth notes">Moderate</button>
                        <button class="srt-btn-option" data-rhythm="complex" title="Add sixteenth notes and syncopation">Complex</button>
                    </div>
                </div>

                <!-- Staff Display -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label">Staff Display</label>
                    <div class="srt-btn-group" role="group" aria-label="Staff Display">
                        <button class="srt-btn-option" data-clef="treble" title="Treble clef only">Treble</button>
                        <button class="srt-btn-option" data-clef="bass" title="Bass clef only">Bass</button>
                        <button class="srt-btn-option active" data-clef="grand" title="Grand staff (both clefs)">Grand Staff</button>
                    </div>
                </div>

                <!-- Key Signature -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label" for="srtKeySignature">Key Signature</label>
                    <select id="srtKeySignature" class="srt-select" aria-label="Key signature">
                        <option value="C" selected>C Major / A minor</option>
                        <option value="G">G Major / E minor (1♯)</option>
                        <option value="D">D Major / B minor (2♯)</option>
                        <option value="A">A Major / F♯ minor (3♯)</option>
                        <option value="E">E Major / C♯ minor (4♯)</option>
                        <option value="B">B Major / G♯ minor (5♯)</option>
                        <option value="F#">F♯ Major / D♯ minor (6♯)</option>
                        <option value="F">F Major / D minor (1♭)</option>
                        <option value="Bb">B♭ Major / G minor (2♭)</option>
                        <option value="Eb">E♭ Major / C minor (3♭)</option>
                        <option value="Ab">A♭ Major / F minor (4♭)</option>
                        <option value="Db">D♭ Major / B♭ minor (5♭)</option>
                        <option value="Gb">G♭ Major / E♭ minor (6♭)</option>
                    </select>
                </div>

                <!-- Note Names Display -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label" for="srtNoteNamesDisplay">Note Names on Piano</label>
                    <select id="srtNoteNamesDisplay" class="srt-select" aria-label="Note names display">
                        <option value="none">Hidden</option>
                        <option value="us" selected>US (C, D, E...)</option>
                        <option value="int">International (Do, Re, Mi...)</option>
                        <option value="both">Both Systems</option>
                    </select>
                </div>

                <!-- Note Range -->
                <div class="srt-setting-group">
                    <label class="srt-setting-label">Note Range</label>
                    <div class="srt-range-controls">
                        <div class="srt-range-item">
                            <label for="srtRangeMin">Min:</label>
                            <select id="srtRangeMin" class="srt-select-small">
                                <option value="36">C2</option>
                                <option value="48" selected>C3</option>
                                <option value="60">C4</option>
                            </select>
                        </div>
                        <div class="srt-range-item">
                            <label for="srtRangeMax">Max:</label>
                            <select id="srtRangeMax" class="srt-select-small">
                                <option value="72">C5</option>
                                <option value="84" selected>C6</option>
                                <option value="96">C7</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- MIDI Configuration (EN BAS) -->
                <div class="srt-setting-group srt-midi-section">
                    <h4 class="srt-section-title">MIDI Configuration</h4>

                    <div class="srt-midi-status-box">
                        <div class="srt-midi-indicator" id="srtMidiIndicator"></div>
                        <span id="srtMidiStatusText" class="srt-midi-status-text">No device connected</span>
                    </div>

                    <label class="srt-setting-label" for="srtMidiInput">MIDI Input Device</label>
                    <select id="srtMidiInput" class="srt-select" aria-label="MIDI input device">
                        <option value="">Select MIDI Input...</option>
                    </select>

                    <label class="srt-setting-label" for="srtMidiChannel">MIDI Channel</label>
                    <select id="srtMidiChannel" class="srt-select" aria-label="MIDI channel">
                        <option value="all" selected>All Channels</option>
                        <?php for ($i = 1; $i <= 16; $i++): ?>
                        <option value="<?php echo $i; ?>">Channel <?php echo $i; ?></option>
                        <?php endfor; ?>
                    </select>

                    <button id="srtMidiRefresh" class="srt-btn-secondary srt-btn-block" aria-label="Refresh MIDI devices">
                        <span class="srt-icon">🔄</span>
                        <span>Refresh Devices</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ========== PANNEAU STATS (DROITE, 400px, CACHÉ PAR DÉFAUT) ========== -->
        <div id="srtStatsPanel" class="srt-panel srt-panel-right" role="dialog" aria-labelledby="srtStatsPanelTitle" aria-hidden="true">
            <div class="srt-panel-header">
                <h3 id="srtStatsPanelTitle" class="srt-panel-title">Performance Stats</h3>
                <button class="srt-panel-close" id="srtStatsPanelClose" aria-label="Close Stats Panel">
                    <span>×</span>
                </button>
            </div>

            <div class="srt-panel-content">
                <!-- Session Stats -->
                <div class="srt-stats-section">
                    <h4 class="srt-stats-section-title">Current Session</h4>
                    <div class="srt-stats-grid">
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Duration:</span>
                            <span class="srt-stat-value" id="srtSessionDuration">00:00</span>
                        </div>
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Notes Played:</span>
                            <span class="srt-stat-value" id="srtNotesPlayed">0</span>
                        </div>
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Accuracy:</span>
                            <span class="srt-stat-value" id="srtAccuracyStat">100%</span>
                        </div>
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Current Streak:</span>
                            <span class="srt-stat-value srt-stat-gold" id="srtCurrentStreak">0</span>
                        </div>
                    </div>
                </div>

                <!-- Overall Stats -->
                <div class="srt-stats-section">
                    <h4 class="srt-stats-section-title">Overall Progress</h4>
                    <div class="srt-stats-grid">
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Total Score:</span>
                            <span class="srt-stat-value" id="srtTotalScore">0</span>
                        </div>
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Best Streak:</span>
                            <span class="srt-stat-value srt-stat-gold" id="srtBestStreak">0</span>
                        </div>
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Practice Time:</span>
                            <span class="srt-stat-value" id="srtTotalTime">0h 0m</span>
                        </div>
                        <div class="srt-stat-row">
                            <span class="srt-stat-label">Level:</span>
                            <span class="srt-stat-value" id="srtUserLevel">1</span>
                        </div>
                    </div>

                    <button id="srtResetStatsBtn" class="srt-btn-danger srt-btn-block" aria-label="Reset all statistics">
                        <span class="srt-icon">⚠</span>
                        <span>Reset All Stats</span>
                    </button>
                </div>

                <!-- Progress Chart -->
                <div class="srt-stats-section">
                    <h4 class="srt-stats-section-title">Weekly Progress</h4>
                    <div class="srt-chart-container">
                        <canvas id="srtProgressChart" width="350" height="200" aria-label="Weekly progress chart"></canvas>
                    </div>
                </div>

                <!-- Achievements -->
                <div class="srt-stats-section">
                    <h4 class="srt-stats-section-title">Recent Achievements</h4>
                    <div id="srtRecentAchievements" class="srt-achievements-list">
                        <!-- Badges générés dynamiquement -->
                        <p class="srt-no-achievements">Start playing to unlock achievements!</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

</div>

<!-- End Sight Reading Game -->
        <?php
    }
}

// Initialiser l'application
new PianoMode_SightReading_Main();
