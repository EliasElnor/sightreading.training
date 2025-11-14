/**
 * PianoMode Sight Reading Training - Songs Library
 * Version: 1.0.0
 * File: sightreading-songs.js
 * 
 * Bibliothèque de morceaux classiques, exercices, standards
 */

(function(window) {
    'use strict';

    const SONGS_LIBRARY = {
        // Exercices techniques
        exercises: [
            {
                id: 'hanon-1',
                title: 'Hanon Exercise No. 1',
                composer: 'Charles-Louis Hanon',
                difficulty: 'beginner',
                tempo: 60,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    // Pattern: C-D-E-F-E-D (repeat)
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 62, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 65, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 62, duration: 'quarter', beats: 1},
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 62, duration: 'quarter', beats: 1}
                ]
            },
            {
                id: 'czerny-100-1',
                title: 'Czerny 100 - Exercise 1',
                composer: 'Carl Czerny',
                difficulty: 'beginner',
                tempo: 80,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 72, duration: 'quarter', beats: 1}
                ]
            }
        ],

        // Morceaux classiques
        classical: [
            {
                id: 'ode-to-joy',
                title: 'Ode to Joy (simplified)',
                composer: 'Ludwig van Beethoven',
                difficulty: 'beginner',
                tempo: 100,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    // E-E-F-G-G-F-E-D-C-C-D-E-E-D-D
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 65, duration: 'quarter', beats: 1},
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 65, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 62, duration: 'quarter', beats: 1},
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 62, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'dotted_quarter', beats: 1.5},
                    {midi: 62, duration: 'eighth', beats: 0.5},
                    {midi: 62, duration: 'half', beats: 2}
                ]
            },
            {
                id: 'fur-elise-intro',
                title: 'Für Elise (intro)',
                composer: 'Ludwig van Beethoven',
                difficulty: 'intermediate',
                tempo: 120,
                keySignature: 'Am',
                timeSignature: '3/8',
                notes: [
                    // E-D#-E-D#-E-B-D-C-A
                    {midi: 64, duration: 'eighth', beats: 0.5},
                    {midi: 63, duration: 'eighth', beats: 0.5},
                    {midi: 64, duration: 'eighth', beats: 0.5},
                    {midi: 63, duration: 'eighth', beats: 0.5},
                    {midi: 64, duration: 'eighth', beats: 0.5},
                    {midi: 59, duration: 'eighth', beats: 0.5},
                    {midi: 62, duration: 'eighth', beats: 0.5},
                    {midi: 60, duration: 'eighth', beats: 0.5},
                    {midi: 57, duration: 'eighth', beats: 0.5}
                ]
            },
            {
                id: 'prelude-c-major',
                title: 'Prelude in C Major (simplified)',
                composer: 'Johann Sebastian Bach',
                difficulty: 'intermediate',
                tempo: 80,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    // Arpeggio pattern
                    {type: 'chord', notes: [60, 64, 67], duration: 'whole', beats: 4},
                    {type: 'chord', notes: [62, 65, 69], duration: 'whole', beats: 4},
                    {type: 'chord', notes: [59, 62, 65], duration: 'whole', beats: 4},
                    {type: 'chord', notes: [60, 64, 67], duration: 'whole', beats: 4}
                ]
            }
        ],

        // Standards jazz
        jazz: [
            {
                id: 'autumn-leaves-head',
                title: 'Autumn Leaves (head)',
                composer: 'Joseph Kosma',
                difficulty: 'intermediate',
                tempo: 120,
                keySignature: 'Gm',
                timeSignature: '4/4',
                notes: [
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 70, duration: 'quarter', beats: 1},
                    {midi: 72, duration: 'quarter', beats: 1},
                    {midi: 75, duration: 'quarter', beats: 1}
                ]
            }
        ],

        // Pop/Rock simplifiés
        pop: [
            {
                id: 'let-it-be-chorus',
                title: 'Let It Be (chorus)',
                composer: 'The Beatles',
                difficulty: 'beginner',
                tempo: 72,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    // Let-it-be, let-it-be
                    {type: 'chord', notes: [60, 64, 67], duration: 'whole', beats: 4},
                    {type: 'chord', notes: [65, 69, 72], duration: 'whole', beats: 4},
                    {type: 'chord', notes: [57, 60, 64], duration: 'whole', beats: 4},
                    {type: 'chord', notes: [60, 64, 67], duration: 'whole', beats: 4}
                ]
            },
            {
                id: 'imagine-intro',
                title: 'Imagine (intro)',
                composer: 'John Lennon',
                difficulty: 'beginner',
                tempo: 76,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    {midi: 60, duration: 'whole', beats: 4},
                    {midi: 65, duration: 'whole', beats: 4},
                    {midi: 57, duration: 'whole', beats: 4},
                    {midi: 60, duration: 'whole', beats: 4}
                ]
            }
        ],

        // Gammes et arpèges
        scales: [
            {
                id: 'c-major-scale',
                title: 'C Major Scale',
                composer: 'Exercise',
                difficulty: 'beginner',
                tempo: 60,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 62, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 65, duration: 'quarter', beats: 1},
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 69, duration: 'quarter', beats: 1},
                    {midi: 71, duration: 'quarter', beats: 1},
                    {midi: 72, duration: 'quarter', beats: 1}
                ]
            },
            {
                id: 'c-major-arpeggio',
                title: 'C Major Arpeggio',
                composer: 'Exercise',
                difficulty: 'beginner',
                tempo: 60,
                keySignature: 'C',
                timeSignature: '4/4',
                notes: [
                    {midi: 60, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 72, duration: 'quarter', beats: 1},
                    {midi: 67, duration: 'quarter', beats: 1},
                    {midi: 64, duration: 'quarter', beats: 1},
                    {midi: 60, duration: 'quarter', beats: 1},
                    {type: 'rest', duration: 'quarter', beats: 1}
                ]
            }
        ]
    };

    // Helper functions
    function getSongById(id) {
        for (const category in SONGS_LIBRARY) {
            const song = SONGS_LIBRARY[category].find(s => s.id === id);
            if (song) return song;
        }
        return null;
    }

    function getSongsByDifficulty(difficulty) {
        const songs = [];
        for (const category in SONGS_LIBRARY) {
            songs.push(...SONGS_LIBRARY[category].filter(s => s.difficulty === difficulty));
        }
        return songs;
    }

    function getSongsByCategory(category) {
        return SONGS_LIBRARY[category] || [];
    }

    function getAllSongs() {
        const all = [];
        for (const category in SONGS_LIBRARY) {
            all.push(...SONGS_LIBRARY[category]);
        }
        return all;
    }

    function getRandomSong(difficulty = null) {
        const songs = difficulty ? getSongsByDifficulty(difficulty) : getAllSongs();
        return songs[Math.floor(Math.random() * songs.length)];
    }

    // Export to global scope
    window.SRTSongs = {
        library: SONGS_LIBRARY,
        getSongById,
        getSongsByDifficulty,
        getSongsByCategory,
        getAllSongs,
        getRandomSong
    };

})(window);
