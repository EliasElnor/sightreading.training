/**
 * PianoMode Sight Reading Training - Chord & Note Generators
 * Version: 1.0.0
 * File: sightreading-chord-generators.js
 * 
 * Generators pour tous les niveaux de difficulté
 */

(function(window) {
    'use strict';

    console.log('🎼 Loading Chord Generators...');

    /* =====================================================
       BASE GENERATOR (Parent Class)
       ===================================================== */

    class BaseGenerator {
        constructor() {
            this.keySignature = 'C';
            this.timeSignature = '4/4';
            this.includeRests = true;
        }

        // Music theory helpers
        getScaleNotes(root, scaleType = 'major') {
            const intervals = {
                'major': [0, 2, 4, 5, 7, 9, 11],
                'minor': [0, 2, 3, 5, 7, 8, 10],
                'harmonic_minor': [0, 2, 3, 5, 7, 8, 11],
                'melodic_minor': [0, 2, 3, 5, 7, 9, 11]
            };
            
            const scale = intervals[scaleType] || intervals.major;
            return scale.map(interval => root + interval);
        }

        getChordNotes(root, chordType = 'major') {
            const intervals = {
                'major': [0, 4, 7],
                'minor': [0, 3, 7],
                'dim': [0, 3, 6],
                'aug': [0, 4, 8],
                'maj7': [0, 4, 7, 11],
                'min7': [0, 3, 7, 10],
                'dom7': [0, 4, 7, 10]
            };
            
            const chord = intervals[chordType] || intervals.major;
            return chord.map(interval => root + interval);
        }

        randomNote(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        randomDuration(options = ['quarter', 'half']) {
            return options[Math.floor(Math.random() * options.length)];
        }
    }

    /* =====================================================
       RANDOM GENERATOR
       ===================================================== */

    class RandomGenerator extends BaseGenerator {
        constructor(difficulty = 'beginner') {
            super();
            this.difficulty = difficulty;
        }

        generate(numMeasures = 4) {
            const config = this.getDifficultyConfig();
            const notes = [];
            
            for (let measure = 0; measure < numMeasures; measure++) {
                let beatsInMeasure = 0;
                const measureNotes = [];
                
                while (beatsInMeasure < 4) {
                    const duration = this.getRandomDuration(config.durations);
                    const beats = this.durationToBeats(duration);
                    
                    if (beatsInMeasure + beats <= 4) {
                        if (Math.random() > 0.9 && this.includeRests) {
                            // Add rest
                            measureNotes.push({
                                type: 'rest',
                                duration: duration,
                                beats: beats
                            });
                        } else {
                            // Add note
                            const midi = this.randomNote(config.minNote, config.maxNote);
                            measureNotes.push({
                                type: 'note',
                                midi: midi,
                                duration: duration,
                                beats: beats
                            });
                        }
                        beatsInMeasure += beats;
                    }
                }
                
                notes.push(...measureNotes);
            }
            
            return notes;
        }

        getDifficultyConfig() {
            const configs = {
                'beginner': {
                    minNote: 60,  // C4
                    maxNote: 72,  // C5
                    durations: ['whole', 'half', 'quarter'],
                    includeAccidentals: false
                },
                'intermediate': {
                    minNote: 55,  // G3
                    maxNote: 79,  // G5
                    durations: ['half', 'quarter', 'eighth'],
                    includeAccidentals: true
                },
                'advanced': {
                    minNote: 48,  // C3
                    maxNote: 84,  // C6
                    durations: ['quarter', 'eighth', 'sixteenth'],
                    includeAccidentals: true
                },
                'expert': {
                    minNote: 36,  // C2
                    maxNote: 96,  // C7
                    durations: ['eighth', 'sixteenth', 'dotted_quarter'],
                    includeAccidentals: true
                }
            };
            
            return configs[this.difficulty] || configs.beginner;
        }

        getRandomDuration(options) {
            return options[Math.floor(Math.random() * options.length)];
        }

        durationToBeats(duration) {
            const beats = {
                'whole': 4,
                'half': 2,
                'dotted_half': 3,
                'quarter': 1,
                'dotted_quarter': 1.5,
                'eighth': 0.5,
                'dotted_eighth': 0.75,
                'sixteenth': 0.25
            };
            return beats[duration] || 1;
        }
    }

    /* =====================================================
       SCALE GENERATOR
       ===================================================== */

    class ScaleGenerator extends BaseGenerator {
        generate(scaleType = 'major', root = 60) {
            const notes = [];
            const scale = this.getScaleNotes(root, scaleType);
            
            // Ascending
            scale.forEach(midi => {
                notes.push({
                    type: 'note',
                    midi: midi,
                    duration: 'quarter',
                    beats: 1
                });
            });
            
            // Descending
            [...scale].reverse().forEach(midi => {
                notes.push({
                    type: 'note',
                    midi: midi,
                    duration: 'quarter',
                    beats: 1
                });
            });
            
            return notes;
        }
    }

    /* =====================================================
       CHORD GENERATOR
       ===================================================== */

    class ChordGenerator extends BaseGenerator {
        generate(progression = ['I', 'IV', 'V', 'I'], root = 60) {
            const notes = [];
            
            progression.forEach(romanNumeral => {
                const chordRoot = this.getRomanNumeralRoot(root, romanNumeral);
                const chordType = this.getRomanNumeralType(romanNumeral);
                const chordNotes = this.getChordNotes(chordRoot, chordType);
                
                notes.push({
                    type: 'chord',
                    notes: chordNotes,
                    duration: 'whole',
                    beats: 4
                });
            });
            
            return notes;
        }

        getRomanNumeralRoot(tonic, romanNumeral) {
            const degrees = {
                'I': 0, 'i': 0,
                'II': 2, 'ii': 2,
                'III': 4, 'iii': 4,
                'IV': 5, 'iv': 5,
                'V': 7, 'v': 7,
                'VI': 9, 'vi': 9,
                'VII': 11, 'vii': 11
            };
            
            return tonic + (degrees[romanNumeral] || 0);
        }

        getRomanNumeralType(romanNumeral) {
            if (romanNumeral === romanNumeral.toUpperCase()) {
                return 'major';
            } else {
                return 'minor';
            }
        }
    }

    /* =====================================================
       EXPORT TO GLOBAL SCOPE
       ===================================================== */

    window.SRTGenerators = {
        BaseGenerator,
        RandomGenerator,
        ScaleGenerator,
        ChordGenerator
    };

    console.log('✅ Chord Generators loaded');

})(window);
