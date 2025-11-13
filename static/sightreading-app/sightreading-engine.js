/**
 * PianoMode Sight Reading Game - JavaScript Engine
 * File: /blocksy-child/assets/Sightreading-game/sightreading-engine.js
 * Version: 15.0.0 - Professional Complete Implementation
 * 
 * Complete sight reading engine with all features:
 * - Canvas rendering for staff and notes
 * - MIDI input/output support
 * - Virtual piano keyboard
 * - Wait & Scroll modes
 * - Note generation algorithms
 * - Achievement system
 * - Statistics tracking
 * - Sound synthesis
 * - And much more...
 */

(function($) {
    'use strict';

    /**
     * Main Sight Reading Engine Class
     */
    class SightReadingEngine {
        constructor(container) {
            this.container = container;
            this.config = window.srtConfig || {};
            this.canvas = null;
            this.ctx = null;
            this.piano = null;
            this.midi = null;
            this.audio = null;
            this.notes = [];
            this.currentNoteIndex = 0;
            this.isPlaying = false;
            this.isPaused = false;
            this.mode = 'wait'; // 'wait' or 'scroll'
            this.tempo = 100;
            this.score = 0;
            this.streak = 0;
            this.bestStreak = 0;
            this.correctNotes = 0;
            this.incorrectNotes = 0;
            this.sessionStartTime = null;
            this.sessionDuration = 0;
            this.playheadPosition = 0;
            this.scrollSpeed = 1;
            this.metronomeEnabled = false;
            this.metronomeBeat = 0;
            this.achievements = [];
            this.userSettings = {};
            this.staffSettings = {
                clef: 'treble',
                keySignature: 'C',
                timeSignature: '4/4'
            };
            this.noteGenerator = null;
            this.renderer = null;
            this.animationFrame = null;
            this.lastFrameTime = 0;
            this.deltaTime = 0;
            
            this.init();
        }
        
        /**
         * Initialize the engine with visible progress
         */
        async init() {
            try {
                console.log('🔧 Starting engine initialization...');

                this.updateLoadingProgress(5, 'Loading user settings...');
                await this.delay(300);
                this.loadUserSettings();

                this.updateLoadingProgress(15, 'Setting up canvas...');
                await this.delay(300);
                this.setupCanvas();

                this.updateLoadingProgress(30, 'Creating virtual piano...');
                await this.delay(300);
                this.setupPiano();

                this.updateLoadingProgress(45, 'Configuring MIDI...');
                await this.delay(300);
                this.setupMIDI();

                this.updateLoadingProgress(60, 'Initializing audio...');
                await this.delay(300);
                this.setupAudio();

                this.updateLoadingProgress(75, 'Setting up controls...');
                await this.delay(300);
                this.setupEventListeners();

                this.updateLoadingProgress(85, 'Preparing note generator...');
                await this.delay(300);
                this.setupNoteGenerator();

                this.updateLoadingProgress(92, 'Setting up renderer...');
                await this.delay(300);
                this.setupRenderer();

                this.updateLoadingProgress(97, 'Generating initial notes...');
                await this.delay(300);
                this.generateInitialNotes();

                this.updateLoadingProgress(100, 'Ready! Click the button below to start.');
                await this.delay(400);

                this.showLetsPlayButton();
                console.log('✅ Engine initialization complete!');

            } catch (error) {
                console.error('❌ Initialization error:', error);
                this.updateLoadingProgress(100, 'Error occurred - click to try anyway');
                this.showLetsPlayButton();
            }
        }

        /**
         * Helper delay function
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * Update loading progress bar and message
         */
        updateLoadingProgress(percent, message) {
            const $bar = $('#srtLoadingBar');
            const $percentage = $('#srtLoadingPercentage');
            const $tips = $('#srtLoadingTips p');

            if ($bar.length) {
                $bar.css('width', percent + '%');
            }
            if ($percentage.length) {
                $percentage.text(percent + '%');
            }
            if ($tips.length && message) {
                $tips.text('💡 ' + message);
            }

            console.log(`📊 Loading: ${percent}% - ${message}`);
        }

        /**
         * Show Let's Play button
         */
        showLetsPlayButton() {
            const $btn = $('#srtLetsPlayBtn');
            if ($btn.length) {
                $btn.prop('disabled', false);
                $btn.css({
                    'display': 'block',
                    'opacity': 0
                });
                $btn.animate({ 'opacity': 1 }, 500);

                // Attach click handler
                $btn.off('click').on('click', () => {
                    console.log('🎯 Let\'s Play button clicked!');
                    this.hideLoadingScreen();
                    this.startAnimationLoop();
                });

                console.log('🎯 Let\'s Play button is now visible and clickable!');
                console.log('👆 USER: CLICK THE BUTTON TO START!');
            } else {
                console.error('❌ Let\'s Play button not found!');
                // Fallback: just hide loading screen
                setTimeout(() => {
                    this.hideLoadingScreen();
                    this.startAnimationLoop();
                }, 1000);
            }
        }
        
        /**
         * Load user settings
         */
        loadUserSettings() {
            this.userSettings = {
                ...this.config.userSettings,
                ...this.getLocalSettings()
            };
        }
        
        /**
         * Get settings from localStorage
         */
        getLocalSettings() {
            try {
                const settings = localStorage.getItem('srt_settings');
                return settings ? JSON.parse(settings) : {};
            } catch (e) {
                console.error('Failed to load local settings:', e);
                return {};
            }
        }
        
        /**
         * Save settings to localStorage
         */
        saveLocalSettings() {
            try {
                localStorage.setItem('srt_settings', JSON.stringify(this.userSettings));
            } catch (e) {
                console.error('Failed to save local settings:', e);
            }
        }
        
        /**
         * Setup canvas for rendering
         */
        setupCanvas() {
            this.canvas = document.getElementById('srtScoreCanvas');
            if (!this.canvas) {
                console.error('Canvas element not found');
                return;
            }
            
            this.ctx = this.canvas.getContext('2d');
            this.resizeCanvas();
            
            // Setup high DPI support
            const dpr = window.devicePixelRatio || 1;
            const rect = this.canvas.getBoundingClientRect();
            
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.ctx.scale(dpr, dpr);
            
            // Set canvas styles
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
        }
        
        /**
         * Resize canvas to fit container
         */
        resizeCanvas() {
            const container = this.canvas.parentElement;
            const rect = container.getBoundingClientRect();
            
            this.canvas.style.width = rect.width + 'px';
            this.canvas.style.height = rect.height + 'px';
            
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            
            if (this.ctx) {
                this.ctx.scale(dpr, dpr);
            }
        }
        
        /**
         * Setup virtual piano keyboard
         */
        setupPiano() {
            this.piano = new VirtualPiano(this);
            this.piano.init();
        }
        
        /**
         * Setup MIDI support
         */
        setupMIDI() {
            this.midi = new MIDIManager(this);
            this.midi.init();
        }
        
        /**
         * Setup audio context and synthesis
         */
        setupAudio() {
            this.audio = new AudioManager(this);
            this.audio.init();
        }
        
        /**
         * Setup all event listeners
         */
        setupEventListeners() {
            // Play/Pause/Stop buttons
            $('#srtPlayBtn').on('click', () => this.start());
            $('#srtPauseBtn').on('click', () => this.pause());
            $('#srtStopBtn').on('click', () => this.stop());
            $('#srtResetBtn').on('click', () => this.reset());
            
            // Mode buttons
            $('.srt-mode-btn').on('click', (e) => {
                const mode = $(e.currentTarget).data('mode');
                this.setMode(mode);
            });
            
            // Tempo slider
            $('#srtTempoSlider').on('input', (e) => {
                this.setTempo(parseInt(e.target.value));
            });
            
            // Metronome button
            $('#srtMetronomeBtn').on('click', () => {
                this.toggleMetronome();
            });
            
            // Settings button
            $('#srtSettingsBtn').on('click', () => {
                this.toggleSettingsPanel();
            });
            
            // Settings panel close
            $('#srtPanelClose').on('click', () => {
                this.closeSettingsPanel();
            });
            
            // Difficulty selector
            $('#srtDifficultySelect').on('change', (e) => {
                this.setDifficulty(e.target.value);
            });
            
            // Clef buttons
            $('.srt-btn-option[data-clef]').on('click', (e) => {
                const clef = $(e.currentTarget).data('clef');
                this.setClef(clef);
            });
            
            // Generator type buttons
            $('.srt-btn-option[data-generator]').on('click', (e) => {
                const generator = $(e.currentTarget).data('generator');
                this.setGeneratorType(generator);
            });
            
            // Key signature selector
            $('#srtKeySignature').on('change', (e) => {
                this.setKeySignature(e.target.value);
            });
            
            // Time signature selector
            $('#srtTimeSignature').on('change', (e) => {
                this.setTimeSignature(e.target.value);
            });
            
            // Note range selectors
            $('#srtRangeMin, #srtRangeMax').on('change', () => {
                this.updateNoteRange();
            });
            
            // Hands buttons
            $('.srt-btn-option[data-hands]').on('click', (e) => {
                const hands = $(e.currentTarget).data('hands');
                this.setHands(hands);
            });
            
            // Accidentals switch
            $('#srtAccidentals').on('change', (e) => {
                this.setAccidentals(e.target.checked);
            });
            
            // Chord density slider
            $('#srtChordDensity').on('input', (e) => {
                this.setChordDensity(parseInt(e.target.value));
            });
            
            // Note names selector
            $('#srtNoteNames').on('change', (e) => {
                this.setNoteNames(e.target.value);
            });
            
            // Show keyboard switch
            $('#srtShowKeyboard').on('change', (e) => {
                this.toggleKeyboard(e.target.checked);
            });
            
            // Show stats switch
            $('#srtShowStats').on('change', (e) => {
                this.toggleStats(e.target.checked);
            });
            
            // Highlight errors switch
            $('#srtHighlightErrors').on('change', (e) => {
                this.setHighlightErrors(e.target.checked);
            });
            
            // Piano sound selector
            $('#srtPianoSound').on('change', (e) => {
                this.setPianoSound(e.target.value);
            });
            
            // Volume sliders
            $('#srtVolume').on('input', (e) => {
                this.setVolume(parseInt(e.target.value));
            });
            
            $('#srtMetronomeVolume').on('input', (e) => {
                this.setMetronomeVolume(parseInt(e.target.value));
            });
            
            // MIDI refresh button
            $('#srtMidiRefresh').on('click', () => {
                this.midi.refreshDevices();
            });
            
            // MIDI selectors
            $('#srtMidiInput, #srtMidiOutput, #srtMidiChannel').on('change', () => {
                this.updateMIDISettings();
            });
            
            // Octave controls
            $('#srtOctaveDown').on('click', () => {
                this.piano.changeOctave(-1);
            });
            
            $('#srtOctaveUp').on('click', () => {
                this.piano.changeOctave(1);
            });
            
            // Transpose selector
            $('#srtTranspose').on('change', (e) => {
                this.piano.setTranspose(parseInt(e.target.value));
            });
            
            // Sustain button
            $('#srtSustainBtn').on('click', () => {
                this.piano.toggleSustain();
            });
            
            // Custom sound upload
            $('#srtPianoSound').on('change', (e) => {
                if (e.target.value === 'custom') {
                    $('#srtCustomSoundRow').show();
                } else {
                    $('#srtCustomSoundRow').hide();
                }
            });
            
            $('#srtUploadBtn').on('click', () => {
                this.uploadCustomSound();
            });
            
            // Window resize
            $(window).on('resize', () => {
                this.resizeCanvas();
                if (this.renderer) {
                    this.renderer.resize();
                }
            });
            
            // Keyboard shortcuts
            $(document).on('keydown', (e) => {
                this.handleKeyboardShortcut(e);
            });
            
            // Prevent context menu on canvas
            this.canvas.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        }
        
        /**
         * Setup note generator
         */
        setupNoteGenerator() {
            this.noteGenerator = new NoteGenerator(this);
        }
        
        /**
         * Setup renderer
         */
        setupRenderer() {
            this.renderer = new StaffRenderer(this);
        }
        
        /**
         * Generate initial notes
         */
        generateInitialNotes() {
            this.notes = this.noteGenerator.generate();
        }
        
        /**
         * Hide loading screen and show main interface
         */
        hideLoadingScreen() {
            console.log('💫 Hiding loading screen and showing interface...');

            $('.srt-loading-screen').fadeOut(500, () => {
                console.log('✅ Loading screen hidden');

                // Show main interface elements
                $('#srtHeader').fadeIn(400);
                $('#srtToolbar').fadeIn(400);
                $('#srtMainArea').fadeIn(400, () => {
                    console.log('✅ Main interface visible');
                    console.log('🎹 Ready to play!');
                });
            });
        }
        
        /**
         * Start animation loop
         */
        startAnimationLoop() {
            const animate = (timestamp) => {
                if (!this.lastFrameTime) {
                    this.lastFrameTime = timestamp;
                }
                
                this.deltaTime = timestamp - this.lastFrameTime;
                this.lastFrameTime = timestamp;
                
                this.update(this.deltaTime);
                this.render();
                
                this.animationFrame = requestAnimationFrame(animate);
            };
            
            this.animationFrame = requestAnimationFrame(animate);
        }
        
        /**
         * Update game state
         */
        update(deltaTime) {
            if (!this.isPlaying || this.isPaused) {
                return;
            }
            
            // Update session duration
            if (this.sessionStartTime) {
                this.sessionDuration = (Date.now() - this.sessionStartTime) / 1000;
                this.updateDurationDisplay();
            }
            
            // Update based on mode
            if (this.mode === 'scroll') {
                this.updateScrollMode(deltaTime);
            } else {
                this.updateWaitMode(deltaTime);
            }
            
            // Update metronome
            if (this.metronomeEnabled) {
                this.updateMetronome(deltaTime);
            }
            
            // Check achievements
            this.checkAchievements();
            
            // Update statistics
            this.updateStatistics();
        }
        
        /**
         * Update scroll mode
         */
        updateScrollMode(deltaTime) {
            // Calculate scroll speed based on tempo
            const beatsPerSecond = this.tempo / 60;
            const pixelsPerBeat = 100; // Adjust as needed
            const scrollSpeed = (beatsPerSecond * pixelsPerBeat * deltaTime) / 1000;
            
            // Update playhead position
            this.playheadPosition += scrollSpeed;
            
            // Check if notes have passed the playhead
            this.checkNotesInScrollMode();
            
            // Generate new notes if needed
            if (this.shouldGenerateMoreNotes()) {
                this.generateMoreNotes();
            }
            
            // Update playhead visual
            this.updatePlayheadVisual();
        }
        
        /**
         * Update wait mode
         */
        updateWaitMode(deltaTime) {
            // In wait mode, the game waits for the correct note to be played
            // No automatic scrolling
            
            // Check if current note has been played
            if (this.currentNoteIndex < this.notes.length) {
                const currentNote = this.notes[this.currentNoteIndex];
                
                // Visual feedback for current note
                if (!currentNote.highlighted) {
                    currentNote.highlighted = true;
                    this.highlightCurrentNote(currentNote);
                }
            }
        }
        
        /**
         * Update metronome
         */
        updateMetronome(deltaTime) {
            if (!this.audio.metronome) {
                return;
            }
            
            const beatDuration = 60000 / this.tempo; // milliseconds per beat
            const timeSinceLastBeat = Date.now() - (this.lastMetronomeBeat || 0);
            
            if (timeSinceLastBeat >= beatDuration) {
                this.audio.playMetronomeTick(this.metronomeBeat === 0);
                this.metronomeBeat = (this.metronomeBeat + 1) % 4;
                this.lastMetronomeBeat = Date.now();
                
                // Visual metronome feedback
                this.showMetronomeBeat();
            }
        }
        
        /**
         * Render the scene
         */
        render() {
            if (!this.ctx || !this.renderer) {
                return;
            }
            
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Render staff
            this.renderer.renderStaff();
            
            // Render notes
            this.renderer.renderNotes(this.notes);
            
            // Render playhead (for scroll mode)
            if (this.mode === 'scroll') {
                this.renderer.renderPlayhead(this.playheadPosition);
            }
            
            // Render feedback layer
            this.renderer.renderFeedback();
            
            // Render current note indicator (for wait mode)
            if (this.mode === 'wait' && this.currentNoteIndex < this.notes.length) {
                this.renderer.renderCurrentNoteIndicator(this.notes[this.currentNoteIndex]);
            }
        }
        
        /**
         * Start the game
         */
        start() {
            if (this.isPlaying) {
                return;
            }
            
            this.isPlaying = true;
            this.isPaused = false;
            this.sessionStartTime = Date.now();
            
            // Update UI
            $('#srtPlayBtn').hide();
            $('#srtPauseBtn').show();
            
            // Start metronome if enabled
            if (this.metronomeEnabled) {
                this.lastMetronomeBeat = Date.now();
            }
            
            // Play start sound
            this.audio.playSound('start');
            
            // Log session start
            this.logEvent('session_start', {
                difficulty: this.userSettings.difficulty,
                mode: this.mode
            });
        }
        
        /**
         * Pause the game
         */
        pause() {
            if (!this.isPlaying || this.isPaused) {
                return;
            }
            
            this.isPaused = true;
            
            // Update UI
            $('#srtPauseBtn').hide();
            $('#srtPlayBtn').show();
            
            // Pause audio
            this.audio.pauseAll();
            
            // Log pause event
            this.logEvent('session_pause');
        }
        
        /**
         * Stop the game
         */
        stop() {
            if (!this.isPlaying) {
                return;
            }
            
            this.isPlaying = false;
            this.isPaused = false;
            
            // Update UI
            $('#srtPauseBtn').hide();
            $('#srtPlayBtn').show();
            
            // Stop audio
            this.audio.stopAll();
            
            // Save session data
            this.saveSession();
            
            // Reset game state
            this.currentNoteIndex = 0;
            this.playheadPosition = 0;
            
            // Log session end
            this.logEvent('session_stop', {
                duration: this.sessionDuration,
                score: this.score,
                accuracy: this.getAccuracy()
            });
        }
        
        /**
         * Reset the game
         */
        reset() {
            this.stop();
            
            // Reset statistics
            this.score = 0;
            this.streak = 0;
            this.bestStreak = 0;
            this.correctNotes = 0;
            this.incorrectNotes = 0;
            this.sessionDuration = 0;
            
            // Generate new notes
            this.generateInitialNotes();
            
            // Update displays
            this.updateAllDisplays();
            
            // Clear feedback
            this.renderer.clearFeedback();
            
            // Log reset event
            this.logEvent('session_reset');
        }
        
        /**
         * Handle note input
         */
        handleNoteInput(note, velocity = 127, source = 'keyboard') {
            if (!this.isPlaying || this.isPaused) {
                // Allow playing notes even when not in game
                this.audio.playNote(note, velocity);
                this.piano.highlightKey(note);
                return;
            }
            
            // Play the note
            this.audio.playNote(note, velocity);
            this.piano.highlightKey(note);
            
            // Check if correct note
            if (this.mode === 'wait') {
                this.checkNoteInWaitMode(note);
            } else {
                this.checkNoteInScrollMode(note);
            }
            
            // Log note input
            this.logEvent('note_input', {
                note: note,
                velocity: velocity,
                source: source
            });
        }
        
        /**
         * Check note in wait mode
         */
        checkNoteInWaitMode(playedNote) {
            if (this.currentNoteIndex >= this.notes.length) {
                return;
            }
            
            const currentNote = this.notes[this.currentNoteIndex];
            const isCorrect = this.isCorrectNote(playedNote, currentNote);
            
            if (isCorrect) {
                this.handleCorrectNote(currentNote);
                this.currentNoteIndex++;
                
                // Check if exercise complete
                if (this.currentNoteIndex >= this.notes.length) {
                    this.handleExerciseComplete();
                }
            } else {
                this.handleIncorrectNote(playedNote, currentNote);
            }
        }
        
        /**
         * Check note in scroll mode
         */
        checkNoteInScrollMode(playedNote) {
            // Find notes within the playhead range
            const playheadRange = 50; // pixels
            const notesInRange = this.notes.filter(note => {
                const notePosition = this.getNotePosition(note);
                return Math.abs(notePosition - this.playheadPosition) < playheadRange;
            });
            
            // Check if any note matches
            let matchFound = false;
            for (const note of notesInRange) {
                if (this.isCorrectNote(playedNote, note) && !note.played) {
                    this.handleCorrectNote(note);
                    note.played = true;
                    matchFound = true;
                    break;
                }
            }
            
            if (!matchFound && notesInRange.length > 0) {
                this.handleIncorrectNote(playedNote, notesInRange[0]);
            }
        }
        
        /**
         * Check if played note matches expected note
         */
        isCorrectNote(playedNote, expectedNote) {
            // Simple MIDI number comparison
            // Can be extended to handle enharmonic equivalents
            return playedNote === expectedNote.midi;
        }
        
        /**
         * Handle correct note
         */
        handleCorrectNote(note) {
            this.correctNotes++;
            this.streak++;
            this.score += this.calculateScore(note);
            
            if (this.streak > this.bestStreak) {
                this.bestStreak = this.streak;
            }
            
            // Visual feedback
            this.renderer.showCorrectFeedback(note);
            this.showFeedbackMessage('Correct!', 'success');
            
            // Audio feedback
            this.audio.playSound('correct');
            
            // Update displays
            this.updateScoreDisplay();
            this.updateStreakDisplay();
            this.updateAccuracyDisplay();
            
            // Check for streak achievements
            this.checkStreakAchievements();
        }
        
        /**
         * Handle incorrect note
         */
        handleIncorrectNote(playedNote, expectedNote) {
            this.incorrectNotes++;
            this.streak = 0;
            
            // Visual feedback
            if (this.userSettings.highlight_errors) {
                this.renderer.showIncorrectFeedback(expectedNote, playedNote);
                this.showFeedbackMessage('Try again', 'error');
            }
            
            // Audio feedback
            this.audio.playSound('incorrect');
            
            // Update displays
            this.updateStreakDisplay();
            this.updateAccuracyDisplay();
        }
        
        /**
         * Calculate score for correct note
         */
        calculateScore(note) {
            let baseScore = 10;
            
            // Bonus for difficulty
            const difficultyMultiplier = {
                'beginner': 1,
                'elementary': 1.5,
                'intermediate': 2,
                'advanced': 3,
                'expert': 5
            };
            
            baseScore *= difficultyMultiplier[this.userSettings.difficulty] || 1;
            
            // Bonus for streak
            if (this.streak > 10) {
                baseScore *= 1.5;
            } else if (this.streak > 5) {
                baseScore *= 1.25;
            }
            
            // Bonus for chord
            if (note.chord && note.chord.length > 1) {
                baseScore *= note.chord.length;
            }
            
            // Bonus for accidentals
            if (note.accidental) {
                baseScore *= 1.2;
            }
            
            return Math.round(baseScore);
        }
        
        /**
         * Handle exercise complete
         */
        handleExerciseComplete() {
            this.stop();
            
            // Show completion modal
            this.showCompletionModal();
            
            // Check for completion achievements
            this.checkCompletionAchievements();
            
            // Generate new exercise
            setTimeout(() => {
                this.generateInitialNotes();
                this.currentNoteIndex = 0;
            }, 2000);
        }
        
        /**
         * Show completion modal
         */
        showCompletionModal() {
            const accuracy = this.getAccuracy();
            let message = '';
            
            if (accuracy >= 95) {
                message = 'Perfect! Outstanding performance!';
            } else if (accuracy >= 85) {
                message = 'Excellent! Great job!';
            } else if (accuracy >= 75) {
                message = 'Good work! Keep practicing!';
            } else {
                message = 'Keep trying! Practice makes perfect!';
            }
            
            // Create and show modal
            const modal = $(`
                <div class="srt-modal srt-completion-modal">
                    <div class="srt-modal-content">
                        <h2>Exercise Complete!</h2>
                        <div class="srt-completion-stats">
                            <div class="srt-stat-item">
                                <span class="srt-stat-label">Score:</span>
                                <span class="srt-stat-value">${this.score}</span>
                            </div>
                            <div class="srt-stat-item">
                                <span class="srt-stat-label">Accuracy:</span>
                                <span class="srt-stat-value">${accuracy.toFixed(1)}%</span>
                            </div>
                            <div class="srt-stat-item">
                                <span class="srt-stat-label">Best Streak:</span>
                                <span class="srt-stat-value">${this.bestStreak}</span>
                            </div>
                        </div>
                        <p>${message}</p>
                        <button class="srt-btn srt-btn-primary" onclick="$(this).closest('.srt-modal').remove()">
                            Continue
                        </button>
                    </div>
                </div>
            `);
            
            $('body').append(modal);
            modal.fadeIn(300);
        }
        
        /**
         * Get current accuracy percentage
         */
        getAccuracy() {
            const totalNotes = this.correctNotes + this.incorrectNotes;
            if (totalNotes === 0) {
                return 0;
            }
            return (this.correctNotes / totalNotes) * 100;
        }
        
        /**
         * Update all displays
         */
        updateAllDisplays() {
            this.updateScoreDisplay();
            this.updateStreakDisplay();
            this.updateAccuracyDisplay();
            this.updateDurationDisplay();
            this.updateNotesPlayedDisplay();
            this.updateCorrectNotesDisplay();
            this.updateIncorrectNotesDisplay();
        }
        
        /**
         * Update score display
         */
        updateScoreDisplay() {
            $('#srtScore').text(this.score);
            $('#srtSessionScore').text(this.score);
        }
        
        /**
         * Update streak display
         */
        updateStreakDisplay() {
            $('#srtStreak').text(this.streak);
            $('#srtBestStreak').text(this.bestStreak);
        }
        
        /**
         * Update accuracy display
         */
        updateAccuracyDisplay() {
            const accuracy = this.getAccuracy();
            $('#srtAccuracy').text(accuracy.toFixed(1) + '%');
            $('#srtSessionAccuracy').text(accuracy.toFixed(1) + '%');
        }
        
        /**
         * Update duration display
         */
        updateDurationDisplay() {
            const minutes = Math.floor(this.sessionDuration / 60);
            const seconds = Math.floor(this.sessionDuration % 60);
            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            $('#srtDuration').text(display);
        }
        
        /**
         * Update notes played display
         */
        updateNotesPlayedDisplay() {
            const totalNotes = this.correctNotes + this.incorrectNotes;
            $('#srtNotesPlayed').text(totalNotes);
        }
        
        /**
         * Update correct notes display
         */
        updateCorrectNotesDisplay() {
            $('#srtCorrectNotes').text(this.correctNotes);
        }
        
        /**
         * Update incorrect notes display
         */
        updateIncorrectNotesDisplay() {
            $('#srtIncorrectNotes').text(this.incorrectNotes);
        }
        
        /**
         * Show feedback message
         */
        showFeedbackMessage(message, type) {
            const feedbackLayer = $('#srtFeedbackLayer');
            const feedback = $(`<div class="srt-feedback srt-feedback-${type}">${message}</div>`);
            
            feedbackLayer.append(feedback);
            
            setTimeout(() => {
                feedback.fadeOut(300, () => feedback.remove());
            }, 1000);
        }
        
        /**
         * Check achievements
         */
        checkAchievements() {
            // First note achievement
            if (this.correctNotes === 1 && !this.hasAchievement('first_note')) {
                this.unlockAchievement('first_note');
            }
            
            // Perfect 10 achievement
            if (this.streak === 10 && !this.hasAchievement('perfect_10')) {
                this.unlockAchievement('perfect_10');
            }
            
            // Speed demon achievement
            if (this.tempo >= 150 && this.correctNotes >= 20 && !this.hasAchievement('speed_demon')) {
                this.unlockAchievement('speed_demon');
            }
            
            // Accuracy master achievement
            if (this.getAccuracy() >= 95 && this.correctNotes >= 50 && !this.hasAchievement('accuracy_master')) {
                this.unlockAchievement('accuracy_master');
            }
        }
        
        /**
         * Check if user has achievement
         */
        hasAchievement(achievementId) {
            return this.achievements.includes(achievementId);
        }
        
        /**
         * Unlock achievement
         */
        unlockAchievement(achievementId) {
            if (this.hasAchievement(achievementId)) {
                return;
            }
            
            this.achievements.push(achievementId);
            
            // Get achievement details
            const achievement = this.config.achievements[achievementId];
            if (!achievement) {
                return;
            }
            
            // Show achievement modal
            this.showAchievementModal(achievement);
            
            // Save to server if logged in
            if (this.config.isLoggedIn) {
                this.saveAchievement(achievementId);
            }
            
            // Play achievement sound
            this.audio.playSound('achievement');
        }
        
        /**
         * Show achievement modal
         */
        showAchievementModal(achievement) {
            $('#srtAchievementIcon').text(achievement.icon);
            $('#srtAchievementName').text(achievement.name);
            $('#srtAchievementDescription').text(achievement.description);
            $('#srtAchievementXP').text(achievement.xp);
            
            $('#srtAchievementModal').fadeIn(300);
        }
        
        /**
         * Save achievement to server
         */
        saveAchievement(achievementId) {
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'srt_unlock_achievement',
                    nonce: this.config.nonce,
                    achievement_id: achievementId
                },
                success: (response) => {
                    if (response.success) {
                        console.log('Achievement saved:', achievementId);
                    }
                }
            });
        }
        
        /**
         * Save session data
         */
        saveSession() {
            if (!this.config.isLoggedIn) {
                return;
            }
            
            const sessionData = {
                total_sessions: 1,
                total_time: this.sessionDuration,
                total_notes: this.correctNotes + this.incorrectNotes,
                correct_notes: this.correctNotes,
                incorrect_notes: this.incorrectNotes,
                avg_accuracy: this.getAccuracy(),
                high_score: this.score,
                best_streak: this.bestStreak,
                session_duration: this.sessionDuration,
                session_notes: this.correctNotes + this.incorrectNotes,
                session_accuracy: this.getAccuracy(),
                session_score: this.score,
                difficulty: this.userSettings.difficulty
            };
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'srt_save_progress',
                    nonce: this.config.nonce,
                    data: sessionData
                },
                success: (response) => {
                    if (response.success) {
                        console.log('Session saved');
                    }
                }
            });
        }
        
        /**
         * Update statistics
         */
        updateStatistics() {
            // Update session stats
            this.updateAllDisplays();
        }
        
        /**
         * Log event for analytics
         */
        logEvent(eventName, eventData = {}) {
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'sight_reading',
                    ...eventData
                });
            }
        }
        
        // Settings methods
        
        setMode(mode) {
            this.mode = mode;
            $('.srt-mode-btn').removeClass('active');
            $(`.srt-mode-btn[data-mode="${mode}"]`).addClass('active');
            
            // Reset for new mode
            if (this.isPlaying) {
                this.reset();
            }
        }
        
        setTempo(tempo) {
            this.tempo = tempo;
            $('#srtTempoValue').text(tempo);
            this.scrollSpeed = tempo / 100; // Adjust scroll speed based on tempo
        }
        
        toggleMetronome() {
            this.metronomeEnabled = !this.metronomeEnabled;
            $('#srtMetronomeBtn').toggleClass('active', this.metronomeEnabled);
            
            if (!this.metronomeEnabled) {
                this.audio.stopMetronome();
            }
        }
        
        toggleSettingsPanel() {
            $('#srtSettingsPanel').toggleClass('open');
        }
        
        closeSettingsPanel() {
            $('#srtSettingsPanel').removeClass('open');
        }
        
        setDifficulty(difficulty) {
            this.userSettings.difficulty = difficulty;
            this.saveSettings();
            
            // Generate new notes for the difficulty
            this.generateInitialNotes();
            
            // Update tempo range
            const level = this.config.difficulties[difficulty];
            if (level) {
                const midTempo = Math.round((level.tempo_range[0] + level.tempo_range[1]) / 2);
                this.setTempo(midTempo);
                $('#srtTempoSlider').attr('min', level.tempo_range[0]);
                $('#srtTempoSlider').attr('max', level.tempo_range[1]);
            }
        }
        
        setClef(clef) {
            this.staffSettings.clef = clef;
            $('.srt-btn-option[data-clef]').removeClass('active');
            $(`.srt-btn-option[data-clef="${clef}"]`).addClass('active');
            
            // Re-render staff
            if (this.renderer) {
                this.renderer.setClef(clef);
            }
        }
        
        setGeneratorType(type) {
            this.userSettings.generator_type = type;
            $('.srt-btn-option[data-generator]').removeClass('active');
            $(`.srt-btn-option[data-generator="${type}"]`).addClass('active');
            
            // Generate new notes
            this.generateInitialNotes();
        }
        
        setKeySignature(key) {
            this.staffSettings.keySignature = key;
            if (this.renderer) {
                this.renderer.setKeySignature(key);
            }
        }
        
        setTimeSignature(time) {
            this.staffSettings.timeSignature = time;
            if (this.renderer) {
                this.renderer.setTimeSignature(time);
            }
        }
        
        updateNoteRange() {
            const min = $('#srtRangeMin').val();
            const max = $('#srtRangeMax').val();
            this.userSettings.note_range_min = min;
            this.userSettings.note_range_max = max;
            this.saveSettings();
        }
        
        setHands(hands) {
            this.userSettings.hands = hands;
            $('.srt-btn-option[data-hands]').removeClass('active');
            $(`.srt-btn-option[data-hands="${hands}"]`).addClass('active');
            this.saveSettings();
        }
        
        setAccidentals(enabled) {
            this.userSettings.use_accidentals = enabled;
            this.saveSettings();
        }
        
        setChordDensity(density) {
            this.userSettings.chord_density = density;
            $('#srtChordDensityValue').text(density + ' notes');
            this.saveSettings();
        }
        
        setNoteNames(system) {
            this.userSettings.note_names = system;
            if (this.renderer) {
                this.renderer.setNoteNameSystem(system);
            }
            this.saveSettings();
        }
        
        toggleKeyboard(show) {
            if (show) {
                $('#srtPianoContainer').show();
            } else {
                $('#srtPianoContainer').hide();
            }
            this.userSettings.show_keyboard = show;
            this.saveSettings();
        }
        
        toggleStats(show) {
            if (show) {
                $('#srtStatsPanel').show();
            } else {
                $('#srtStatsPanel').hide();
            }
            this.userSettings.show_stats = show;
            this.saveSettings();
        }
        
        setHighlightErrors(enabled) {
            this.userSettings.highlight_errors = enabled;
            this.saveSettings();
        }
        
        setPianoSound(sound) {
            this.userSettings.piano_sound = sound;
            this.audio.setPianoSound(sound);
            this.saveSettings();
        }
        
        setVolume(volume) {
            this.userSettings.volume = volume;
            $('#srtVolumeValue').text(volume + '%');
            this.audio.setVolume(volume / 100);
            this.saveSettings();
        }
        
        setMetronomeVolume(volume) {
            this.userSettings.metronome_volume = volume;
            $('#srtMetronomeVolumeValue').text(volume + '%');
            this.audio.setMetronomeVolume(volume / 100);
            this.saveSettings();
        }
        
        updateMIDISettings() {
            const input = $('#srtMidiInput').val();
            const output = $('#srtMidiOutput').val();
            const channel = parseInt($('#srtMidiChannel').val());
            
            this.userSettings.midi_input = input;
            this.userSettings.midi_output = output;
            this.userSettings.midi_channel = channel;
            
            if (this.midi) {
                this.midi.updateSettings(input, output, channel);
            }
            
            this.saveSettings();
        }
        
        uploadCustomSound() {
            const fileInput = document.getElementById('srtSoundUpload');
            if (!fileInput.files || fileInput.files.length === 0) {
                alert('Please select a sound file');
                return;
            }
            
            const formData = new FormData();
            formData.append('action', 'srt_upload_sound');
            formData.append('nonce', this.config.nonce);
            formData.append('sound_file', fileInput.files[0]);
            
            $.ajax({
                url: this.config.ajaxUrl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: (response) => {
                    if (response.success) {
                        this.audio.loadCustomSound(response.data.url);
                        this.showToast('Custom sound uploaded successfully');
                    } else {
                        alert('Upload failed: ' + response.data);
                    }
                }
            });
        }
        
        saveSettings() {
            // Save to localStorage
            this.saveLocalSettings();
            
            // Save to server if logged in
            if (this.config.isLoggedIn) {
                $.ajax({
                    url: this.config.ajaxUrl,
                    type: 'POST',
                    data: {
                        action: 'srt_update_settings',
                        nonce: this.config.nonce,
                        settings: this.userSettings
                    },
                    success: (response) => {
                        if (response.success) {
                            console.log('Settings saved');
                        }
                    }
                });
            }
        }
        
        showToast(message, type = 'success') {
            $('#srtToastMessage').text(message);
            $('#srtToast').removeClass('error success').addClass(type).fadeIn(300);
            
            setTimeout(() => {
                $('#srtToast').fadeOut(300);
            }, 3000);
        }
        
        handleKeyboardShortcut(e) {
            // Space bar - play/pause
            if (e.keyCode === 32) {
                e.preventDefault();
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.start();
                }
            }
            
            // Escape - stop
            if (e.keyCode === 27) {
                this.stop();
            }
            
            // R - reset
            if (e.keyCode === 82 && e.ctrlKey) {
                e.preventDefault();
                this.reset();
            }
            
            // M - toggle metronome
            if (e.keyCode === 77) {
                this.toggleMetronome();
            }
            
            // S - toggle settings
            if (e.keyCode === 83 && e.ctrlKey) {
                e.preventDefault();
                this.toggleSettingsPanel();
            }
        }
        
        // Additional helper methods
        
        shouldGenerateMoreNotes() {
            // Check if we need to generate more notes for continuous play
            const lastNote = this.notes[this.notes.length - 1];
            if (!lastNote) {
                return true;
            }
            
            const lastNotePosition = this.getNotePosition(lastNote);
            const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
            
            return lastNotePosition < this.playheadPosition + canvasWidth;
        }
        
        generateMoreNotes() {
            const newNotes = this.noteGenerator.generate();
            
            // Offset the new notes to continue from the last note
            const lastNote = this.notes[this.notes.length - 1];
            const offset = lastNote ? lastNote.measure + 1 : 0;
            
            newNotes.forEach(note => {
                note.measure += offset;
            });
            
            this.notes = this.notes.concat(newNotes);
        }
        
        getNotePosition(note) {
            // Calculate the x position of a note based on its measure and beat
            const measureWidth = 200; // pixels per measure
            const beatWidth = measureWidth / 4; // assuming 4/4 time
            
            return (note.measure * measureWidth) + (note.beat * beatWidth);
        }
        
        checkNotesInScrollMode() {
            // Check if any notes have passed the playhead without being played
            const missedNotes = this.notes.filter(note => {
                const notePosition = this.getNotePosition(note);
                return !note.played && notePosition < this.playheadPosition - 50;
            });
            
            missedNotes.forEach(note => {
                if (!note.missed) {
                    note.missed = true;
                    this.handleMissedNote(note);
                }
            });
        }
        
        handleMissedNote(note) {
            this.incorrectNotes++;
            this.streak = 0;
            
            // Visual feedback
            this.renderer.showMissedFeedback(note);
            
            // Update displays
            this.updateStreakDisplay();
            this.updateAccuracyDisplay();
            this.updateIncorrectNotesDisplay();
        }
        
        highlightCurrentNote(note) {
            this.renderer.highlightNote(note);
        }
        
        updatePlayheadVisual() {
            const playhead = document.getElementById('srtPlayhead');
            if (playhead) {
                const canvasRect = this.canvas.getBoundingClientRect();
                const x = canvasRect.width / 3; // Fixed position on screen
                playhead.style.left = x + 'px';
            }
        }
        
        showMetronomeBeat() {
            // Visual metronome indicator
            const indicator = $('<div class="srt-metronome-beat"></div>');
            $('#srtMetronomeBtn').append(indicator);
            
            setTimeout(() => {
                indicator.remove();
            }, 100);
        }
        
        checkStreakAchievements() {
            // Check various streak milestones
            const streakMilestones = [10, 25, 50, 100];
            
            streakMilestones.forEach(milestone => {
                if (this.streak === milestone) {
                    const achievementId = `streak_${milestone}`;
                    if (!this.hasAchievement(achievementId)) {
                        // Dynamic achievement creation
                        this.config.achievements[achievementId] = {
                            name: `${milestone} Note Streak`,
                            description: `Get ${milestone} notes correct in a row`,
                            icon: '🔥',
                            xp: milestone * 10
                        };
                        this.unlockAchievement(achievementId);
                    }
                }
            });
        }
        
        checkCompletionAchievements() {
            // Check for perfect completion
            if (this.getAccuracy() === 100) {
                if (!this.hasAchievement('perfect_exercise')) {
                    this.unlockAchievement('perfect_exercise');
                }
            }
        }
    }
    
    /**
     * Virtual Piano Class
     */
    class VirtualPiano {
        constructor(engine) {
            this.engine = engine;
            this.container = null;
            this.keys = [];
            this.octave = 4;
            this.transpose = 0;
            this.sustain = false;
            this.activeNotes = new Set();
        }
        
        init() {
            this.container = document.getElementById('srtPianoKeyboard');
            if (!this.container) {
                console.error('Piano container not found');
                return;
            }
            
            this.createKeys();
            this.setupEventListeners();
            this.mapComputerKeyboard();
        }
        
        createKeys() {
            // Clear existing keys
            this.container.innerHTML = '';
            this.keys = [];
            
            // Create 3 octaves (C3 to B5)
            for (let octave = 3; octave <= 5; octave++) {
                this.createOctave(octave);
            }
        }
        
        createOctave(octave) {
            const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
            const blackKeys = {
                'C#': 1, 'D#': 2, 'F#': 4, 'G#': 5, 'A#': 6
            };
            
            const octaveContainer = document.createElement('div');
            octaveContainer.className = 'srt-piano-octave';
            octaveContainer.dataset.octave = octave;
            
            // Create white keys
            noteNames.forEach((note, index) => {
                const key = this.createKey(note, octave, 'white', index);
                octaveContainer.appendChild(key);
                this.keys.push({
                    element: key,
                    note: note + octave,
                    midi: this.noteToMidi(note + octave),
                    type: 'white'
                });
            });
            
            // Create black keys
            Object.entries(blackKeys).forEach(([note, position]) => {
                const key = this.createKey(note, octave, 'black', position);
                octaveContainer.appendChild(key);
                this.keys.push({
                    element: key,
                    note: note + octave,
                    midi: this.noteToMidi(note + octave),
                    type: 'black'
                });
            });
            
            this.container.appendChild(octaveContainer);
        }
        
        createKey(note, octave, type, position) {
            const key = document.createElement('div');
            key.className = `srt-piano-key srt-piano-key-${type}`;
            key.dataset.note = note + octave;
            key.dataset.midi = this.noteToMidi(note + octave);
            
            if (type === 'black') {
                key.style.left = `${position * 40 - 10}px`;
            }
            
            // Add note label for white keys
            if (type === 'white' && note === 'C') {
                const label = document.createElement('span');
                label.className = 'srt-key-label';
                label.textContent = `C${octave}`;
                key.appendChild(label);
            }
            
            return key;
        }
        
        setupEventListeners() {
            // Mouse events
            this.keys.forEach(key => {
                key.element.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.playKey(key.midi);
                });
                
                key.element.addEventListener('mouseup', () => {
                    if (!this.sustain) {
                        this.releaseKey(key.midi);
                    }
                });
                
                key.element.addEventListener('mouseenter', (e) => {
                    if (e.buttons === 1) {
                        this.playKey(key.midi);
                    }
                });
                
                key.element.addEventListener('mouseleave', () => {
                    if (!this.sustain) {
                        this.releaseKey(key.midi);
                    }
                });
            });
            
            // Touch events for mobile
            this.keys.forEach(key => {
                key.element.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.playKey(key.midi);
                });
                
                key.element.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    if (!this.sustain) {
                        this.releaseKey(key.midi);
                    }
                });
            });
        }
        
        mapComputerKeyboard() {
            // Map computer keyboard to piano keys
            const keyMap = {
                // White keys
                'a': 'C', 's': 'D', 'd': 'E', 'f': 'F', 
                'g': 'G', 'h': 'A', 'j': 'B', 'k': 'C',
                
                // Black keys
                'w': 'C#', 'e': 'D#', 't': 'F#', 'y': 'G#', 'u': 'A#',
                
                // Octave controls
                'z': 'octave-down', 'x': 'octave-up',
                
                // Sustain
                'c': 'sustain'
            };
            
            document.addEventListener('keydown', (e) => {
                // Don't interfere with input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }
                
                const mapping = keyMap[e.key.toLowerCase()];
                if (!mapping) {
                    return;
                }
                
                e.preventDefault();
                
                if (mapping === 'octave-down') {
                    this.changeOctave(-1);
                } else if (mapping === 'octave-up') {
                    this.changeOctave(1);
                } else if (mapping === 'sustain') {
                    this.toggleSustain();
                } else {
                    const note = mapping + this.octave;
                    const midi = this.noteToMidi(note) + this.transpose;
                    
                    if (!this.activeNotes.has(midi)) {
                        this.playKey(midi);
                    }
                }
            });
            
            document.addEventListener('keyup', (e) => {
                const mapping = keyMap[e.key.toLowerCase()];
                if (!mapping || mapping === 'octave-down' || mapping === 'octave-up') {
                    return;
                }
                
                if (mapping === 'sustain') {
                    // Sustain handled by toggle
                    return;
                }
                
                const note = mapping + this.octave;
                const midi = this.noteToMidi(note) + this.transpose;
                
                if (!this.sustain) {
                    this.releaseKey(midi);
                }
            });
        }
        
        playKey(midi) {
            this.activeNotes.add(midi);
            this.highlightKey(midi);
            this.engine.handleNoteInput(midi, 127, 'piano');
        }
        
        releaseKey(midi) {
            this.activeNotes.delete(midi);
            this.unhighlightKey(midi);
            
            if (this.engine.audio) {
                this.engine.audio.releaseNote(midi);
            }
        }
        
        highlightKey(midi) {
            const key = this.keys.find(k => k.midi === midi);
            if (key) {
                key.element.classList.add('active');
            }
        }
        
        unhighlightKey(midi) {
            const key = this.keys.find(k => k.midi === midi);
            if (key) {
                key.element.classList.remove('active');
            }
        }
        
        changeOctave(direction) {
            const newOctave = this.octave + direction;
            if (newOctave >= 1 && newOctave <= 7) {
                this.octave = newOctave;
                $('#srtOctaveValue').text(this.octave);
            }
        }
        
        setTranspose(semitones) {
            this.transpose = semitones;
        }
        
        toggleSustain() {
            this.sustain = !this.sustain;
            $('#srtSustainBtn').toggleClass('active', this.sustain);
            
            if (!this.sustain) {
                // Release all sustained notes
                this.activeNotes.forEach(midi => {
                    this.releaseKey(midi);
                });
            }
        }
        
        noteToMidi(note) {
            const noteMap = {
                'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
                'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
                'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
            };
            
            const matches = note.match(/([A-G]#?b?)(\d+)/);
            if (!matches) {
                return 60; // Default to middle C
            }
            
            const noteName = matches[1];
            const octave = parseInt(matches[2]);
            
            return (octave + 1) * 12 + (noteMap[noteName] || 0);
        }
    }
    
    /**
     * MIDI Manager Class
     */
    class MIDIManager {
        constructor(engine) {
            this.engine = engine;
            this.midiAccess = null;
            this.activeInput = null;
            this.activeOutput = null;
            this.channel = 1;
        }
        
        async init() {
            if (!navigator.requestMIDIAccess) {
                console.log('Web MIDI API not supported');
                this.updateStatus('unsupported');
                return;
            }
            
            try {
                this.midiAccess = await navigator.requestMIDIAccess();
                this.setupMIDI();
                this.updateStatus('connected');
            } catch (error) {
                console.error('Failed to access MIDI:', error);
                this.updateStatus('error');
            }
        }
        
        setupMIDI() {
            // Populate device lists
            this.populateDevices();
            
            // Listen for device changes
            this.midiAccess.onstatechange = () => {
                this.populateDevices();
            };
            
            // Auto-connect first available device
            const inputs = Array.from(this.midiAccess.inputs.values());
            if (inputs.length > 0) {
                this.setInput(inputs[0]);
            }
        }
        
        populateDevices() {
            // Populate input devices
            const inputSelect = document.getElementById('srtMidiInput');
            inputSelect.innerHTML = '<option value="none">No MIDI Device</option>';
            
            this.midiAccess.inputs.forEach((input) => {
                const option = document.createElement('option');
                option.value = input.id;
                option.textContent = input.name;
                inputSelect.appendChild(option);
            });
            
            // Populate output devices
            const outputSelect = document.getElementById('srtMidiOutput');
            outputSelect.innerHTML = '<option value="none">Built-in Piano</option>';
            
            this.midiAccess.outputs.forEach((output) => {
                const option = document.createElement('option');
                option.value = output.id;
                option.textContent = output.name;
                outputSelect.appendChild(option);
            });
        }
        
        setInput(input) {
            // Remove previous listener
            if (this.activeInput) {
                this.activeInput.onmidimessage = null;
            }
            
            if (typeof input === 'string') {
                input = this.midiAccess.inputs.get(input);
            }
            
            if (!input) {
                return;
            }
            
            this.activeInput = input;
            
            // Set up message handler
            this.activeInput.onmidimessage = (message) => {
                this.handleMIDIMessage(message);
            };
            
            // Update UI
            document.getElementById('srtMidiInput').value = input.id;
            this.updateStatus('connected');
        }
        
        setOutput(output) {
            if (typeof output === 'string') {
                if (output === 'none') {
                    this.activeOutput = null;
                } else {
                    this.activeOutput = this.midiAccess.outputs.get(output);
                }
            } else {
                this.activeOutput = output;
            }
            
            // Update UI
            if (this.activeOutput) {
                document.getElementById('srtMidiOutput').value = this.activeOutput.id;
            }
        }
        
        handleMIDIMessage(message) {
            const [status, data1, data2] = message.data;
            const command = status >> 4;
            const channel = (status & 0x0F) + 1;
            
            // Check if message is on our channel
            if (this.channel !== 0 && channel !== this.channel) {
                return;
            }
            
            switch (command) {
                case 9: // Note On
                    if (data2 > 0) {
                        this.handleNoteOn(data1, data2);
                    } else {
                        this.handleNoteOff(data1);
                    }
                    break;
                    
                case 8: // Note Off
                    this.handleNoteOff(data1);
                    break;
                    
                case 11: // Control Change
                    this.handleControlChange(data1, data2);
                    break;
                    
                case 14: // Pitch Bend
                    this.handlePitchBend(data1, data2);
                    break;
            }
        }
        
        handleNoteOn(note, velocity) {
            this.engine.handleNoteInput(note, velocity, 'midi');
            
            // Forward to output if configured
            if (this.activeOutput) {
                const statusByte = 0x90 | (this.channel - 1);
                this.activeOutput.send([statusByte, note, velocity]);
            }
        }
        
        handleNoteOff(note) {
            if (this.engine.piano) {
                this.engine.piano.releaseKey(note);
            }
            
            // Forward to output
            if (this.activeOutput) {
                const statusByte = 0x80 | (this.channel - 1);
                this.activeOutput.send([statusByte, note, 0]);
            }
        }
        
        handleControlChange(controller, value) {
            // Handle sustain pedal
            if (controller === 64) {
                if (value >= 64) {
                    this.engine.piano.sustain = true;
                } else {
                    this.engine.piano.sustain = false;
                }
            }
        }
        
        handlePitchBend(lsb, msb) {
            // Implement pitch bend if needed
            const bend = (msb << 7) | lsb;
            // Map to -2 to +2 semitones
            const semitones = ((bend - 8192) / 8192) * 2;
            // Apply pitch bend to audio engine
        }
        
        updateSettings(input, output, channel) {
            this.channel = channel;
            
            if (input !== 'none') {
                this.setInput(input);
            }
            
            if (output !== 'none') {
                this.setOutput(output);
            } else {
                this.activeOutput = null;
            }
        }
        
        refreshDevices() {
            this.populateDevices();
        }
        
        updateStatus(status) {
            const statusElement = document.getElementById('srtMidiStatus');
            const statusText = document.getElementById('srtMidiStatusText');
            
            statusElement.className = 'srt-status-indicator';
            
            switch (status) {
                case 'connected':
                    statusElement.classList.add('connected');
                    statusText.textContent = 'MIDI Connected';
                    break;
                case 'disconnected':
                    statusElement.classList.add('disconnected');
                    statusText.textContent = 'MIDI Disconnected';
                    break;
                case 'error':
                    statusElement.classList.add('error');
                    statusText.textContent = 'MIDI Error';
                    break;
                case 'unsupported':
                    statusText.textContent = 'MIDI Not Supported';
                    break;
            }
        }
    }
    
    /**
     * Audio Manager Class
     */
    class AudioManager {
        constructor(engine) {
            this.engine = engine;
            this.context = null;
            this.masterGain = null;
            this.pianoGain = null;
            this.metronomeGain = null;
            this.compressor = null;
            this.reverb = null;
            this.samples = {};
            this.activeSounds = new Map();
            this.metronome = null;
            this.customSound = null;
        }
        
        init() {
            // Create audio context
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain
            this.masterGain = this.context.createGain();
            this.masterGain.gain.value = 0.7;
            
            // Create separate gains for piano and metronome
            this.pianoGain = this.context.createGain();
            this.pianoGain.gain.value = 1;
            this.pianoGain.connect(this.masterGain);
            
            this.metronomeGain = this.context.createGain();
            this.metronomeGain.gain.value = 0.5;
            this.metronomeGain.connect(this.masterGain);
            
            // Create compressor for overall dynamics
            this.compressor = this.context.createDynamicsCompressor();
            this.compressor.threshold.value = -24;
            this.compressor.knee.value = 30;
            this.compressor.ratio.value = 12;
            this.compressor.attack.value = 0.003;
            this.compressor.release.value = 0.25;
            
            this.masterGain.connect(this.compressor);
            this.compressor.connect(this.context.destination);
            
            // Load default sounds
            this.loadDefaultSounds();
            
            // Resume context on user interaction
            document.addEventListener('click', () => {
                if (this.context.state === 'suspended') {
                    this.context.resume();
                }
            }, { once: true });
        }
        
        loadDefaultSounds() {
            // Load UI sounds
            this.loadSound('correct', '/assets/sounds/correct.mp3');
            this.loadSound('incorrect', '/assets/sounds/incorrect.mp3');
            this.loadSound('achievement', '/assets/sounds/achievement.mp3');
            this.loadSound('start', '/assets/sounds/start.mp3');
            
            // Load metronome sounds
            this.loadSound('tick', '/assets/sounds/tick.mp3');
            this.loadSound('tock', '/assets/sounds/tock.mp3');
        }
        
        async loadSound(name, url) {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                this.samples[name] = audioBuffer;
            } catch (error) {
                console.error(`Failed to load sound ${name}:`, error);
            }
        }
        
        playSound(name) {
            const buffer = this.samples[name];
            if (!buffer) {
                return;
            }
            
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.masterGain);
            source.start();
        }
        
        playNote(midi, velocity = 127) {
            // Convert MIDI to frequency
            const frequency = 440 * Math.pow(2, (midi - 69) / 12);
            
            // Create oscillators for richer sound
            const osc1 = this.context.createOscillator();
            const osc2 = this.context.createOscillator();
            const osc3 = this.context.createOscillator();
            
            osc1.type = 'sine';
            osc2.type = 'sine';
            osc3.type = 'sine';
            
            osc1.frequency.value = frequency;
            osc2.frequency.value = frequency * 2; // First harmonic
            osc3.frequency.value = frequency * 3; // Second harmonic
            
            // Create envelope
            const envelope = this.context.createGain();
            envelope.gain.value = 0;
            
            // Create individual gains for harmonics
            const gain1 = this.context.createGain();
            const gain2 = this.context.createGain();
            const gain3 = this.context.createGain();
            
            gain1.gain.value = 1;
            gain2.gain.value = 0.3;
            gain3.gain.value = 0.15;
            
            // Connect oscillators
            osc1.connect(gain1);
            osc2.connect(gain2);
            osc3.connect(gain3);
            
            gain1.connect(envelope);
            gain2.connect(envelope);
            gain3.connect(envelope);
            
            envelope.connect(this.pianoGain);
            
            // Apply velocity
            const maxGain = (velocity / 127) * 0.3;
            
            // ADSR envelope
            const now = this.context.currentTime;
            const attack = 0.01;
            const decay = 0.1;
            const sustain = 0.7;
            const release = 0.5;
            
            envelope.gain.setValueAtTime(0, now);
            envelope.gain.linearRampToValueAtTime(maxGain, now + attack);
            envelope.gain.linearRampToValueAtTime(maxGain * sustain, now + attack + decay);
            
            // Start oscillators
            osc1.start(now);
            osc2.start(now);
            osc3.start(now);
            
            // Store for release
            this.activeSounds.set(midi, {
                oscillators: [osc1, osc2, osc3],
                envelope: envelope,
                startTime: now
            });
        }
        
        releaseNote(midi) {
            const sound = this.activeSounds.get(midi);
            if (!sound) {
                return;
            }
            
            const now = this.context.currentTime;
            const release = 0.5;
            
            sound.envelope.gain.cancelScheduledValues(now);
            sound.envelope.gain.setValueAtTime(sound.envelope.gain.value, now);
            sound.envelope.gain.linearRampToValueAtTime(0, now + release);
            
            sound.oscillators.forEach(osc => {
                osc.stop(now + release);
            });
            
            this.activeSounds.delete(midi);
        }
        
        playMetronomeTick(isDownbeat) {
            const osc = this.context.createOscillator();
            const envelope = this.context.createGain();
            
            osc.frequency.value = isDownbeat ? 1000 : 800;
            osc.type = 'sine';
            
            osc.connect(envelope);
            envelope.connect(this.metronomeGain);
            
            const now = this.context.currentTime;
            envelope.gain.setValueAtTime(1, now);
            envelope.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            
            osc.start(now);
            osc.stop(now + 0.1);
        }
        
        stopMetronome() {
            // Metronome is event-based, no continuous sound to stop
        }
        
        setVolume(value) {
            this.masterGain.gain.value = value;
        }
        
        setMetronomeVolume(value) {
            this.metronomeGain.gain.value = value;
        }
        
        setPianoSound(sound) {
            // Switch between different piano synthesis types
            // This could load different samples or change synthesis parameters
        }
        
        loadCustomSound(url) {
            this.loadSound('custom', url);
            this.customSound = url;
        }
        
        pauseAll() {
            // Pause is handled by the engine stopping updates
        }
        
        stopAll() {
            // Stop all active sounds
            this.activeSounds.forEach((sound, midi) => {
                this.releaseNote(midi);
            });
        }
    }
    
    /**
     * Note Generator Class
     */
    class NoteGenerator {
        constructor(engine) {
            this.engine = engine;
        }
        
        generate() {
            const settings = this.engine.userSettings;
            const difficulty = this.engine.config.difficulties[settings.difficulty];
            
            switch (settings.generator_type) {
                case 'triads':
                    return this.generateTriads();
                case 'scales':
                    return this.generateScales();
                case 'progression':
                    return this.generateProgression();
                default:
                    return this.generateRandom();
            }
        }
        
        generateRandom() {
            const notes = [];
            const measureCount = 4;
            const beatsPerMeasure = 4;
            
            for (let measure = 0; measure < measureCount; measure++) {
                for (let beat = 0; beat < beatsPerMeasure; beat++) {
                    const note = {
                        midi: this.getRandomMidi(),
                        duration: 'quarter',
                        measure: measure,
                        beat: beat,
                        staff: Math.random() > 0.5 ? 'treble' : 'bass'
                    };
                    
                    notes.push(note);
                }
            }
            
            return notes;
        }
        
        generateTriads() {
            const notes = [];
            const triads = [
                [0, 4, 7],  // Major
                [0, 3, 7],  // Minor
                [0, 3, 6],  // Diminished
                [0, 4, 8]   // Augmented
            ];
            
            for (let measure = 0; measure < 4; measure++) {
                const triad = triads[Math.floor(Math.random() * triads.length)];
                const root = 60 + Math.floor(Math.random() * 12);
                
                triad.forEach((interval, index) => {
                    notes.push({
                        midi: root + interval,
                        duration: 'quarter',
                        measure: measure,
                        beat: index,
                        staff: 'treble'
                    });
                });
            }
            
            return notes;
        }
        
        generateScales() {
            const notes = [];
            const scale = this.engine.config.scalePatterns.major;
            const root = 60;
            
            scale.forEach((interval, index) => {
                notes.push({
                    midi: root + interval,
                    duration: 'eighth',
                    measure: Math.floor(index / 8),
                    beat: (index % 8) * 0.5,
                    staff: 'treble'
                });
            });
            
            // Descending
            scale.slice().reverse().forEach((interval, index) => {
                notes.push({
                    midi: root + interval,
                    duration: 'eighth',
                    measure: Math.floor((index + scale.length) / 8),
                    beat: ((index + scale.length) % 8) * 0.5,
                    staff: 'treble'
                });
            });
            
            return notes;
        }
        
        generateProgression() {
            const notes = [];
            const progression = ['I', 'vi', 'IV', 'V'];
            const key = 60; // C
            
            const chordMap = {
                'I': [0, 4, 7],
                'ii': [2, 5, 9],
                'iii': [4, 7, 11],
                'IV': [5, 9, 0],
                'V': [7, 11, 2],
                'vi': [9, 0, 4],
                'vii': [11, 2, 5]
            };
            
            progression.forEach((chord, measure) => {
                const intervals = chordMap[chord] || [0, 4, 7];
                
                intervals.forEach((interval) => {
                    notes.push({
                        midi: key + interval,
                        duration: 'whole',
                        measure: measure,
                        beat: 0,
                        staff: 'treble',
                        chord: true
                    });
                });
            });
            
            return notes;
        }
        
        getRandomMidi() {
            const min = this.midiFromNote(this.engine.userSettings.note_range_min || 'C3');
            const max = this.midiFromNote(this.engine.userSettings.note_range_max || 'C5');
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        midiFromNote(note) {
            const noteMap = {
                'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
            };
            
            const matches = note.match(/([A-G])(\d+)/);
            if (!matches) {
                return 60;
            }
            
            const noteName = matches[1];
            const octave = parseInt(matches[2]);
            
            return (octave + 1) * 12 + (noteMap[noteName] || 0);
        }
    }
    
    /**
     * Staff Renderer Class
     */
    class StaffRenderer {
        constructor(engine) {
            this.engine = engine;
            this.ctx = engine.ctx;
            this.canvas = engine.canvas;
            this.staffY = 100;
            this.staffSpacing = 12;
            this.measureWidth = 200;
            this.clef = 'treble';
            this.keySignature = 'C';
            this.timeSignature = '4/4';
            this.noteNameSystem = 'none';
            this.feedback = [];
        }
        
        resize() {
            // Handle canvas resize
        }
        
        renderStaff() {
            const ctx = this.ctx;
            const width = this.canvas.width / (window.devicePixelRatio || 1);
            const height = this.canvas.height / (window.devicePixelRatio || 1);
            
            ctx.save();
            
            // Set styles
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.font = '20px Arial';
            
            // Render based on clef setting
            if (this.clef === 'grand') {
                this.renderGrandStaff();
            } else if (this.clef === 'bass') {
                this.renderBassStaff();
            } else {
                this.renderTrebleStaff();
            }
            
            ctx.restore();
        }
        
        renderTrebleStaff() {
            const ctx = this.ctx;
            const width = this.canvas.width / (window.devicePixelRatio || 1);
            
            // Draw staff lines
            for (let i = 0; i < 5; i++) {
                const y = this.staffY + (i * this.staffSpacing);
                ctx.beginPath();
                ctx.moveTo(50, y);
                ctx.lineTo(width - 50, y);
                ctx.stroke();
            }
            
            // Draw clef
            this.drawTrebleClef(60, this.staffY);
            
            // Draw key signature
            this.drawKeySignature(120, this.staffY, 'treble');
            
            // Draw time signature
            this.drawTimeSignature(180, this.staffY);
            
            // Draw bar lines
            this.drawBarLines();
        }
        
        renderBassStaff() {
            const ctx = this.ctx;
            const width = this.canvas.width / (window.devicePixelRatio || 1);
            
            // Draw staff lines
            for (let i = 0; i < 5; i++) {
                const y = this.staffY + (i * this.staffSpacing);
                ctx.beginPath();
                ctx.moveTo(50, y);
                ctx.lineTo(width - 50, y);
                ctx.stroke();
            }
            
            // Draw clef
            this.drawBassClef(60, this.staffY);
            
            // Draw key signature
            this.drawKeySignature(120, this.staffY, 'bass');
            
            // Draw time signature
            this.drawTimeSignature(180, this.staffY);
            
            // Draw bar lines
            this.drawBarLines();
        }
        
        renderGrandStaff() {
            const ctx = this.ctx;
            const width = this.canvas.width / (window.devicePixelRatio || 1);
            const trebleY = this.staffY;
            const bassY = this.staffY + 100;
            
            // Draw treble staff
            for (let i = 0; i < 5; i++) {
                const y = trebleY + (i * this.staffSpacing);
                ctx.beginPath();
                ctx.moveTo(50, y);
                ctx.lineTo(width - 50, y);
                ctx.stroke();
            }
            
            // Draw bass staff
            for (let i = 0; i < 5; i++) {
                const y = bassY + (i * this.staffSpacing);
                ctx.beginPath();
                ctx.moveTo(50, y);
                ctx.lineTo(width - 50, y);
                ctx.stroke();
            }
            
            // Draw brace
            this.drawBrace(40, trebleY, bassY + this.staffSpacing * 4);
            
            // Draw clefs
            this.drawTrebleClef(60, trebleY);
            this.drawBassClef(60, bassY);
            
            // Draw key signatures
            this.drawKeySignature(120, trebleY, 'treble');
            this.drawKeySignature(120, bassY, 'bass');
            
            // Draw time signatures
            this.drawTimeSignature(180, trebleY);
            this.drawTimeSignature(180, bassY);
            
            // Draw bar lines connecting both staves
            this.drawGrandStaffBarLines(trebleY, bassY);
        }
        
        drawTrebleClef(x, y) {
            const ctx = this.ctx;
            ctx.save();
            ctx.font = '48px Arial';
            ctx.fillStyle = '#333';
            ctx.fillText('𝄞', x, y + 35);
            ctx.restore();
        }
        
        drawBassClef(x, y) {
            const ctx = this.ctx;
            ctx.save();
            ctx.font = '36px Arial';
            ctx.fillStyle = '#333';
            ctx.fillText('𝄢', x, y + 20);
            ctx.restore();
        }
        
        drawBrace(x, topY, bottomY) {
            const ctx = this.ctx;
            ctx.save();
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.bezierCurveTo(x - 10, topY + 20, x - 10, bottomY - 20, x, bottomY);
            ctx.stroke();
            ctx.restore();
        }
        
        drawKeySignature(x, y, clef) {
            // Draw sharps or flats based on key signature
            const signatures = {
                'C': [],
                'G': ['F#'],
                'D': ['F#', 'C#'],
                'A': ['F#', 'C#', 'G#'],
                'E': ['F#', 'C#', 'G#', 'D#'],
                'B': ['F#', 'C#', 'G#', 'D#', 'A#'],
                'F': ['Bb'],
                'Bb': ['Bb', 'Eb'],
                'Eb': ['Bb', 'Eb', 'Ab'],
                'Ab': ['Bb', 'Eb', 'Ab', 'Db'],
                'Db': ['Bb', 'Eb', 'Ab', 'Db', 'Gb']
            };
            
            const accidentals = signatures[this.keySignature] || [];
            
            accidentals.forEach((accidental, index) => {
                const accX = x + (index * 15);
                const accY = this.getAccidentalY(accidental, y, clef);
                
                if (accidental.includes('#')) {
                    this.drawSharp(accX, accY);
                } else if (accidental.includes('b')) {
                    this.drawFlat(accX, accY);
                }
            });
        }
        
        drawTimeSignature(x, y) {
            const ctx = this.ctx;
            const [top, bottom] = this.timeSignature.split('/');
            
            ctx.save();
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            
            ctx.fillText(top, x, y + 15);
            ctx.fillText(bottom, x, y + 40);
            
            ctx.restore();
        }
        
        drawBarLines() {
            const ctx = this.ctx;
            const width = this.canvas.width / (window.devicePixelRatio || 1);
            
            for (let i = 1; i <= 4; i++) {
                const x = 200 + (i * this.measureWidth);
                if (x < width - 50) {
                    ctx.beginPath();
                    ctx.moveTo(x, this.staffY);
                    ctx.lineTo(x, this.staffY + (4 * this.staffSpacing));
                    ctx.stroke();
                }
            }
        }
        
        drawGrandStaffBarLines(trebleY, bassY) {
            const ctx = this.ctx;
            const width = this.canvas.width / (window.devicePixelRatio || 1);
            
            for (let i = 1; i <= 4; i++) {
                const x = 200 + (i * this.measureWidth);
                if (x < width - 50) {
                    ctx.beginPath();
                    ctx.moveTo(x, trebleY);
                    ctx.lineTo(x, bassY + (4 * this.staffSpacing));
                    ctx.stroke();
                }
            }
        }
        
        renderNotes(notes) {
            notes.forEach(note => {
                this.renderNote(note);
            });
        }
        
        renderNote(note) {
            const x = this.getNoteX(note);
            const y = this.getNoteY(note);
            
            const ctx = this.ctx;
            ctx.save();
            
            // Draw note head
            ctx.fillStyle = note.played ? '#4CAF50' : 
                           note.missed ? '#F44336' : 
                           note.highlighted ? '#C59D3A' : '#333';
            
            ctx.beginPath();
            ctx.ellipse(x, y, 6, 5, -20 * Math.PI / 180, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw stem if needed
            if (note.duration !== 'whole') {
                const stemHeight = 30;
                const stemDirection = y < this.staffY + 24 ? 1 : -1;
                
                ctx.beginPath();
                ctx.moveTo(x + (stemDirection > 0 ? 5 : -5), y);
                ctx.lineTo(x + (stemDirection > 0 ? 5 : -5), y + (stemHeight * stemDirection));
                ctx.lineWidth = 2;
                ctx.stroke();
                
                // Draw flags for eighth and sixteenth notes
                if (note.duration === 'eighth' || note.duration === 'sixteenth') {
                    this.drawFlags(x + (stemDirection > 0 ? 5 : -5), 
                                  y + (stemHeight * stemDirection), 
                                  stemDirection, 
                                  note.duration);
                }
            }
            
            // Draw ledger lines if needed
            this.drawLedgerLines(x, y);
            
            // Draw accidentals
            if (note.accidental) {
                this.drawAccidental(x - 15, y, note.accidental);
            }
            
            // Draw note name if enabled
            if (this.noteNameSystem !== 'none') {
                this.drawNoteName(x, y + 20, note);
            }
            
            ctx.restore();
        }
        
        getNoteX(note) {
            return 200 + (note.measure * this.measureWidth) + (note.beat * (this.measureWidth / 4));
        }
        
        getNoteY(note) {
            // Calculate Y position based on MIDI note number
            const notePositions = {
                60: this.staffY + 60,  // Middle C
                62: this.staffY + 54,  // D
                64: this.staffY + 48,  // E
                65: this.staffY + 42,  // F
                67: this.staffY + 36,  // G
                69: this.staffY + 30,  // A
                71: this.staffY + 24,  // B
                72: this.staffY + 18   // C
            };
            
            // Adjust for octaves
            const octaveOffset = Math.floor((note.midi - 60) / 12) * -42;
            const noteInOctave = note.midi % 12;
            const baseNote = 60 + noteInOctave;
            
            return (notePositions[baseNote] || this.staffY + 30) + octaveOffset;
        }
        
        drawLedgerLines(x, y) {
            const ctx = this.ctx;
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            
            // Above staff
            if (y < this.staffY) {
                for (let lineY = this.staffY - this.staffSpacing; lineY >= y; lineY -= this.staffSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(x - 10, lineY);
                    ctx.lineTo(x + 10, lineY);
                    ctx.stroke();
                }
            }
            
            // Below staff
            if (y > this.staffY + (4 * this.staffSpacing)) {
                for (let lineY = this.staffY + (5 * this.staffSpacing); lineY <= y; lineY += this.staffSpacing) {
                    ctx.beginPath();
                    ctx.moveTo(x - 10, lineY);
                    ctx.lineTo(x + 10, lineY);
                    ctx.stroke();
                }
            }
        }
        
        drawAccidental(x, y, type) {
            const ctx = this.ctx;
            ctx.font = '16px Arial';
            ctx.fillStyle = '#333';
            
            if (type === 'sharp') {
                ctx.fillText('♯', x, y + 4);
            } else if (type === 'flat') {
                ctx.fillText('♭', x, y + 4);
            }
        }
        
        drawSharp(x, y) {
            this.drawAccidental(x, y, 'sharp');
        }
        
        drawFlat(x, y) {
            this.drawAccidental(x, y, 'flat');
        }
        
        drawFlags(x, y, direction, duration) {
            const ctx = this.ctx;
            const flagCount = duration === 'eighth' ? 1 : 2;
            
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < flagCount; i++) {
                ctx.beginPath();
                ctx.moveTo(x, y + (i * 6 * direction));
                ctx.bezierCurveTo(
                    x + 10, y + (i * 6 + 10) * direction,
                    x + 10, y + (i * 6 + 20) * direction,
                    x, y + (i * 6 + 25) * direction
                );
                ctx.stroke();
            }
        }
        
        drawNoteName(x, y, note) {
            const ctx = this.ctx;
            const noteName = this.getNoteNameFromMidi(note.midi);
            
            ctx.save();
            ctx.font = '10px Arial';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.fillText(noteName, x, y);
            ctx.restore();
        }
        
        getNoteNameFromMidi(midi) {
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const systems = this.engine.config.notationSystems;
            const system = systems[this.noteNameSystem] || systems.international;
            
            const noteName = noteNames[midi % 12];
            return system[noteName] || noteName;
        }
        
        getAccidentalY(accidental, staffY, clef) {
            // Position accidentals correctly on staff
            const positions = {
                'treble': {
                    'F#': staffY,
                    'C#': staffY + 18,
                    'G#': staffY + 3,
                    'D#': staffY + 21,
                    'A#': staffY + 6,
                    'Bb': staffY + 24,
                    'Eb': staffY + 9,
                    'Ab': staffY + 27,
                    'Db': staffY + 12,
                    'Gb': staffY + 30
                },
                'bass': {
                    'F#': staffY + 24,
                    'C#': staffY + 6,
                    'G#': staffY + 27,
                    'D#': staffY + 9,
                    'A#': staffY + 30,
                    'Bb': staffY + 12,
                    'Eb': staffY + 33,
                    'Ab': staffY + 15,
                    'Db': staffY + 36,
                    'Gb': staffY + 18
                }
            };
            
            return positions[clef][accidental] || staffY;
        }
        
        renderPlayhead(position) {
            const ctx = this.ctx;
            const x = 200 - (this.engine.playheadPosition % (this.measureWidth * 4));
            
            ctx.save();
            ctx.strokeStyle = '#C59D3A';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#C59D3A';
            ctx.shadowBlur = 10;
            
            if (this.clef === 'grand') {
                // Span both staves
                ctx.beginPath();
                ctx.moveTo(x, this.staffY - 10);
                ctx.lineTo(x, this.staffY + 160);
                ctx.stroke();
            } else {
                // Single staff
                ctx.beginPath();
                ctx.moveTo(x, this.staffY - 10);
                ctx.lineTo(x, this.staffY + 60);
                ctx.stroke();
            }
            
            ctx.restore();
        }
        
        renderCurrentNoteIndicator(note) {
            const x = this.getNoteX(note);
            const y = this.getNoteY(note);
            
            const ctx = this.ctx;
            ctx.save();
            
            ctx.strokeStyle = '#C59D3A';
            ctx.lineWidth = 2;
            ctx.shadowColor = '#C59D3A';
            ctx.shadowBlur = 15;
            
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.restore();
        }
        
        renderFeedback() {
            this.feedback.forEach((item, index) => {
                if (Date.now() - item.timestamp > 2000) {
                    this.feedback.splice(index, 1);
                } else {
                    this.renderFeedbackItem(item);
                }
            });
        }
        
        renderFeedbackItem(item) {
            const ctx = this.ctx;
            const opacity = 1 - ((Date.now() - item.timestamp) / 2000);
            
            ctx.save();
            ctx.globalAlpha = opacity;
            
            if (item.type === 'correct') {
                ctx.fillStyle = '#4CAF50';
                ctx.font = 'bold 24px Arial';
                ctx.fillText('✓', item.x, item.y);
            } else if (item.type === 'incorrect') {
                ctx.fillStyle = '#F44336';
                ctx.font = 'bold 24px Arial';
                ctx.fillText('✗', item.x, item.y);
            }
            
            ctx.restore();
        }
        
        showCorrectFeedback(note) {
            const x = this.getNoteX(note);
            const y = this.getNoteY(note) - 30;
            
            this.feedback.push({
                type: 'correct',
                x: x,
                y: y,
                timestamp: Date.now()
            });
        }
        
        showIncorrectFeedback(expectedNote, playedNote) {
            const x = this.getNoteX(expectedNote);
            const y = this.getNoteY(expectedNote) - 30;
            
            this.feedback.push({
                type: 'incorrect',
                x: x,
                y: y,
                timestamp: Date.now()
            });
        }
        
        showMissedFeedback(note) {
            note.missed = true;
        }
        
        highlightNote(note) {
            note.highlighted = true;
        }
        
        clearFeedback() {
            this.feedback = [];
        }
        
        setClef(clef) {
            this.clef = clef;
        }
        
        setKeySignature(key) {
            this.keySignature = key;
        }
        
        setTimeSignature(time) {
            this.timeSignature = time;
        }
        
        setNoteNameSystem(system) {
            this.noteNameSystem = system;
        }
    }

    /* =====================================================
       LOADING SCREEN CREATION - Always creates in JavaScript
       ===================================================== */

    function ensureLoadingScreen(container) {
        // Remove any existing loading screen first
        const existing = container.querySelector('.srt-loading-screen');
        if (existing) {
            existing.remove();
            console.log('🗑️ Removed PHP-generated loading screen (using JS version instead)');
        }

        console.log('🎨 Creating loading screen dynamically...');

        const loadingHTML = `
            <div class="srt-loading-screen" id="srtLoadingScreen" style="position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; background: linear-gradient(135deg, #0B0B0B 0%, #1A1A1A 100%) !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 999999 !important; visibility: visible !important; opacity: 1 !important;">
                <div class="srt-loader" style="text-align: center; max-width: 700px; padding: 40px; background: rgba(11, 11, 11, 0.95); border-radius: 20px; box-shadow: 0 10px 50px rgba(0,0,0,0.8);">
                    <div class="srt-loader-logo" style="margin: 0 auto 30px; text-align: center;">
                        <img src="https://pianomode.com/wp-content/uploads/2025/11/cropped-ChatGPT-Image-Nov-10-2025-01_18_37-AM.png" alt="PianoMode" style="max-width: 200px; height: auto;">
                    </div>
                    <div class="srt-loader-text" style="color: #FFFFFF; font-size: 24px; font-weight: 500;">Loading PianoMode Sight Reading...</div>
                    <div class="srt-loader-progress" style="width: 500px; height: 16px; background: #333; border-radius: 10px; overflow: hidden; margin: 30px auto; border: 2px solid #444;">
                        <div class="srt-loader-bar" id="srtLoadingBar" style="height: 100%; background: linear-gradient(90deg, #B08A2E, #C59D3A, #D4A942); width: 0%; transition: width 0.5s ease-out; border-radius: 10px;"></div>
                    </div>
                    <div class="srt-loader-percentage" id="srtLoadingPercentage" style="color: #C59D3A; font-size: 56px !important; font-weight: 900 !important; text-align: center; margin: 30px 0;">0%</div>
                    <div class="srt-loader-tips" id="srtLoadingTips" style="color: #D4A942; font-size: 20px !important; text-align: center; margin: 30px 0;">
                        <p style="margin: 0;">💡 Initializing application...</p>
                    </div>
                    <button class="srt-btn srt-lets-play-btn" id="srtLetsPlayBtn" style="display: none; margin-top: 40px; padding: 24px 80px !important; font-size: 36px !important; font-weight: 900 !important; background: linear-gradient(135deg, #C59D3A 0%, #D4A942 100%) !important; color: #0B0B0B !important; border: 4px solid #D4A942 !important; border-radius: 16px !important; cursor: pointer !important; text-transform: uppercase !important; min-width: 400px !important;">Let's Play!</button>
                </div>
            </div>
        `;

        // Insert at the beginning of container
        container.insertAdjacentHTML('afterbegin', loadingHTML);

        const loadingScreen = document.getElementById('srtLoadingScreen');
        if (loadingScreen) {
            console.log('✅ Loading screen created successfully');
            return loadingScreen;
        } else {
            console.error('❌ Failed to create loading screen!');
            return null;
        }
    }

    /* =====================================================
       INITIALIZATION - Document Ready
       ===================================================== */

    $(document).ready(function() {
        console.log('🎹 PianoMode Sight Reading Training - PACK_5 Complete');
        console.log('📦 Version: 2.5.0 - WordPress Integration');

        // Get container
        const container = document.getElementById('sightReadingGame');

        if (!container) {
            console.error('❌ CRITICAL: Container #sightReadingGame NOT FOUND!');
            console.error('❌ Make sure the shortcode [sightreading_game] is on the WordPress page!');
            alert('ERREUR: Le shortcode [sightreading_game] n\'est pas sur la page!\n\nAjoutez [sightreading_game] à votre page WordPress.');
            return;
        }

        console.log('✅ Container found:', container);

        // ALWAYS create loading screen in JavaScript (don't rely on PHP HTML)
        const loadingScreen = ensureLoadingScreen(container);

        if (!loadingScreen) {
            console.error('❌ Could not create loading screen!');
            return;
        }

        // Initialize engine
        console.log('🚀 Initializing Sight Reading Engine...');
        window.sightReadingEngine = new SightReadingEngine(container);
    });

})(jQuery);