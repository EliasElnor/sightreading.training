/**
 * PianoMode Sight Reading Training - Main Engine
 * File: /blocksy-child/assets/Sightreading-game/sightreading-engine.js
 * Version: 1.0.0 - Phase 1.1 Complete
 *
 * @package PianoModeSightReading
 * @author PianoMode Development Team
 *
 * PHASE 1.1 - Loading Screen Logic:
 * - Progressive loading (0-100%)
 * - Resource preloading (Tone.js, audio samples)
 * - Interactive tips rotation
 * - "Let's Play" button activation
 * - Smooth transition to main interface
 */

(function($) {
    'use strict';

    /**
     * Main SightReading Engine Class
     */
    class SightReadingEngine {
        constructor() {
            this.version = '1.0.0';
            this.loadingProgress = 0;
            this.audioEngine = null;
            this.isReady = false;
            this.currentTipIndex = 0;
            this.tipRotationInterval = null;

            // DOM Elements
            this.$loadingScreen = null;
            this.$loadingBar = null;
            this.$loadingPercentage = null;
            this.$loadingTip = null;
            this.$letsPlayBtn = null;
            this.$mainInterface = null;

            // Configuration
            this.config = window.srtConfig || {};
            this.loadingTips = this.config.loadingTips || [
                'Loading resources...',
                'Preparing audio engine...',
                'Almost ready...'
            ];

            this.init();
        }

        /**
         * Initialize the engine
         */
        init() {
            $(document).ready(() => {
                this.cacheDOMElements();
                this.startLoading();
            });
        }

        /**
         * Cache all DOM elements
         */
        cacheDOMElements() {
            this.$loadingScreen = $('#srtLoadingScreen');
            this.$loadingBar = $('#srtLoadingBar .srt-loader-bar-fill');
            this.$loadingPercentage = $('#srtLoadingPercentage');
            this.$loadingTip = $('#srtLoadingTip');
            this.$letsPlayBtn = $('#srtLetsPlayBtn');
            this.$mainInterface = $('#srtMainInterface');
        }

        /**
         * Start the loading process
         */
        startLoading() {
            console.log('🎹 PianoMode Sight Reading - Loading Started');

            // Start tip rotation
            this.startTipRotation();

            // Simulate progressive loading
            this.simulateLoading();

            // Load actual resources
            this.loadResources();
        }

        /**
         * Rotate loading tips
         */
        startTipRotation() {
            this.tipRotationInterval = setInterval(() => {
                this.currentTipIndex = (this.currentTipIndex + 1) % this.loadingTips.length;

                // Fade out
                this.$loadingTip.fadeOut(300, () => {
                    // Change text
                    this.$loadingTip.text(this.loadingTips[this.currentTipIndex]);
                    // Fade in
                    this.$loadingTip.fadeIn(300);
                });
            }, 4000);
        }

        /**
         * Stop tip rotation
         */
        stopTipRotation() {
            if (this.tipRotationInterval) {
                clearInterval(this.tipRotationInterval);
                this.tipRotationInterval = null;
            }
        }

        /**
         * Simulate progressive loading for smooth UX
         */
        simulateLoading() {
            const updateProgress = () => {
                if (this.loadingProgress < 90) {
                    // Progress quickly to 90%
                    this.loadingProgress += Math.random() * 15;
                    if (this.loadingProgress > 90) {
                        this.loadingProgress = 90;
                    }
                    this.updateProgressBar(this.loadingProgress);
                    setTimeout(updateProgress, 200);
                } else if (!this.isReady) {
                    // Stay at 90% until resources are loaded
                    setTimeout(updateProgress, 100);
                }
            };

            updateProgress();
        }

        /**
         * Update progress bar
         */
        updateProgressBar(progress) {
            const roundedProgress = Math.round(progress);
            this.$loadingBar.css('width', `${roundedProgress}%`);
            this.$loadingPercentage.text(`${roundedProgress}%`);

            // Check if loading is complete
            if (roundedProgress >= 100) {
                this.onLoadingComplete();
            }
        }

        /**
         * Load actual resources (Tone.js, audio samples, etc.)
         */
        async loadResources() {
            try {
                // Wait for Tone.js to be available
                await this.waitForToneJS();
                console.log('✓ Tone.js loaded');

                // Initialize Audio Engine
                await this.initializeAudioEngine();
                console.log('✓ Audio Engine initialized');

                // Mark as ready
                this.isReady = true;

                // Complete loading to 100%
                this.loadingProgress = 100;
                this.updateProgressBar(100);

            } catch (error) {
                console.error('❌ Error loading resources:', error);
                this.$loadingTip.text('Error loading resources. Please refresh the page.');
            }
        }

        /**
         * Wait for Tone.js to be loaded
         */
        waitForToneJS() {
            return new Promise((resolve, reject) => {
                const checkTone = () => {
                    if (typeof Tone !== 'undefined') {
                        resolve();
                    } else {
                        setTimeout(checkTone, 100);
                    }
                };
                checkTone();

                // Timeout after 10 seconds
                setTimeout(() => {
                    if (typeof Tone === 'undefined') {
                        reject(new Error('Tone.js failed to load'));
                    }
                }, 10000);
            });
        }

        /**
         * Initialize Audio Engine with Tone.js
         */
        async initializeAudioEngine() {
            return new Promise((resolve, reject) => {
                try {
                    // Audio Engine will be fully implemented in Phase 1.4
                    // For now, just prepare basic setup
                    this.audioEngine = {
                        ready: false,
                        piano: null,
                        volume: 0.75
                    };

                    // Simulate loading time
                    setTimeout(() => {
                        this.audioEngine.ready = true;
                        resolve();
                    }, 500);

                } catch (error) {
                    reject(error);
                }
            });
        }

        /**
         * Called when loading reaches 100%
         */
        onLoadingComplete() {
            console.log('✓ Loading Complete');

            // Stop tip rotation
            this.stopTipRotation();

            // Show final message
            this.$loadingTip.fadeOut(300, () => {
                this.$loadingTip.text('Ready to play!').fadeIn(300);
            });

            // Show and enable "Let's Play" button
            this.$letsPlayBtn.fadeIn(500, () => {
                this.$letsPlayBtn.prop('disabled', false);
            });

            // Bind "Let's Play" button
            this.$letsPlayBtn.off('click').on('click', () => {
                this.startGame();
            });
        }

        /**
         * Start the game (transition from loading to main interface)
         */
        startGame() {
            console.log('🎮 Starting game...');

            // Fade out loading screen
            this.$loadingScreen.fadeOut(600, () => {
                this.$loadingScreen.addClass('hidden');
            });

            // Fade in main interface
            setTimeout(() => {
                this.$mainInterface.fadeIn(600, () => {
                    this.initializeMainInterface();
                });
            }, 300);
        }

        /**
         * Initialize main interface (will be expanded in Phase 1.2+)
         */
        initializeMainInterface() {
            console.log('✓ Main Interface Loaded');

            // Bind control buttons
            this.bindControls();

            // Initialize canvas (Phase 2)
            // this.initializeCanvas();

            // Initialize piano (Phase 1.3)
            // this.initializePiano();

            // Initialize MIDI (Phase 5.1)
            // this.initializeMIDI();
        }

        /**
         * Bind control buttons
         */
        bindControls() {
            // Play button
            $('#srtPlayBtn').on('click', () => {
                console.log('Play clicked');
                $('#srtPlayBtn').hide();
                $('#srtPauseBtn').show();
                // Play logic will be implemented in Phase 3
            });

            // Pause button
            $('#srtPauseBtn').on('click', () => {
                console.log('Pause clicked');
                $('#srtPauseBtn').hide();
                $('#srtPlayBtn').show();
                // Pause logic will be implemented in Phase 3
            });

            // Stop button
            $('#srtStopBtn').on('click', () => {
                console.log('Stop clicked');
                $('#srtPauseBtn').hide();
                $('#srtPlayBtn').show();
                // Stop logic will be implemented in Phase 3
            });

            // Reset button
            $('#srtResetBtn').on('click', () => {
                console.log('Reset clicked');
                // Reset logic will be implemented in Phase 3
            });

            // Settings button
            $('#srtSettingsBtn').on('click', () => {
                console.log('Settings clicked');
                $('#srtSettingsPanel').toggleClass('open');
            });

            // Stats button
            $('#srtStatsBtn').on('click', () => {
                console.log('Stats clicked');
                $('#srtStatsPanel').toggleClass('open');
            });

            // Close panels
            $('#srtSettingsPanelClose').on('click', () => {
                $('#srtSettingsPanel').removeClass('open');
            });

            $('#srtStatsPanelClose').on('click', () => {
                $('#srtStatsPanel').removeClass('open');
            });

            // Mode buttons
            $('.srt-mode-btn').on('click', function() {
                const mode = $(this).data('mode');
                console.log('Mode changed to:', mode);
                $('.srt-mode-btn').removeClass('active');
                $(this).addClass('active');
                // Mode change logic will be implemented in Phase 3
            });

            // Tempo slider
            $('#srtTempoSlider').on('input', function() {
                const tempo = $(this).val();
                $('#srtTempoValue').text(`${tempo} BPM`);
                // Tempo change logic will be implemented in Phase 3
            });

            // Volume slider
            $('#srtVolumeSlider').on('input', function() {
                const volume = $(this).val();
                $('#srtVolumeValue').text(`${volume}%`);
                // Volume change logic will be implemented in Phase 1.4
            });

            // Close panels when clicking outside
            $(document).on('click', (e) => {
                if (!$(e.target).closest('.srt-panel, #srtSettingsBtn, #srtStatsBtn').length) {
                    $('.srt-panel').removeClass('open');
                }
            });

            // ESC key to close panels
            $(document).on('keydown', (e) => {
                if (e.key === 'Escape') {
                    $('.srt-panel').removeClass('open');
                }
            });
        }
    }

    // Initialize the engine when DOM is ready
    $(document).ready(function() {
        window.sightReadingEngine = new SightReadingEngine();
    });

})(jQuery);
