# 🎹 PianoMode Sight Reading Training - Application

## 📊 État du Développement

### ✅ COMPLÉTÉ (11 Novembre 2025)

#### 1. Structure HTML Complète (`sightreading-main.php` - 628 lignes)

**Fichier créé** : `static/sightreading-app/sightreading-main.php`

**Contenu** :
- ✅ Classe WordPress avec shortcode `[sightreading_game]`
- ✅ Enqueue des scripts et styles (Tone.js, Chart.js, fonts)
- ✅ AJAX handler pour sauvegarder les statistiques
- ✅ **Écran de chargement complet** :
  - Logo PianoMode
  - Barre de progression animée (0-100%)
  - Tips interactifs pendant le chargement
  - Bouton "Let's Play!" (activé après chargement)
- ✅ **Interface principale complète** :
  - Toolbar avec logo, stats en temps réel (Hits/Misses/Streak/Accuracy)
  - Boutons Play/Pause/Stop/Reset/Settings/Stats
  - Control bar avec modes (Wait/Scroll/Free), tempo, métronome, difficulté, volume, MIDI
  - Zone centrale avec canvas (160px height) pour portée musicale
  - Bande verticale fixe pour mode Scroll
  - Conteneur piano virtuel 88 touches
- ✅ **Panneau Settings (gauche, caché par défaut)** :
  - Exercise Type (Random, Scales, Triads, Chords, Arpeggios, Progressions, Intervals)
  - Note Density (1-4)
  - Rhythm Complexity (Simple, Moderate, Complex)
  - Staff Display (Treble, Bass, Grand Staff)
  - Key Signature (toutes les tonalités)
  - Note Names Display (Hidden, US, International, Both)
  - Note Range (Min/Max)
  - **MIDI Configuration** (en bas du panneau)
- ✅ **Panneau Stats (droite, caché par défaut)** :
  - Session Stats (Duration, Notes Played, Accuracy, Current Streak)
  - Overall Progress (Total Score, Best Streak, Practice Time, Level)
  - Graphique progression hebdomadaire (Chart.js canvas)
  - Recent Achievements
  - Bouton Reset Stats

**Architecture** :
- Shortcode WordPress intégré
- Security : nonces, sanitization, AJAX sécurisé
- Accessibility : ARIA labels, roles, semantic HTML
- Responsive : structure prête pour mobile/tablet/desktop

---

## 📋 PROCHAINES ÉTAPES

### 🎨 2. Fichier CSS Complet (`sightreading.css` - ~5000 lignes attendues)

**À créer** : `static/sightreading-app/sightreading.css`

**Contenu nécessaire** :
- Variables CSS (couleurs PianoMode : #C59D3A gold, #0B0B0B noir)
- Reset et base styles
- Loading screen styles (overlay, progress bar, animations)
- Main interface (toolbar, control bar, center area)
- Canvas et staff styles
- **Piano virtuel** :
  - 88 touches (A0 à C8)
  - Touches blanches (52) et noires (36)
  - Feedback visuel (active state en or)
  - Labels sur touches
  - Responsive (5/7/88 keys modes)
- **Panneaux** :
  - Panel gauche/droite (400px width)
  - Animations slide (translateX)
  - Scrollbar custom
  - Sections et groupes de settings
- **Feedback visuel** :
  - Notes correctes (cadre doré)
  - Notes incorrectes (rouge transparent)
  - Animations fluides (pulse, fade)
- **Responsive breakpoints** :
  - Desktop 1920px+
  - Laptop 1440px
  - Tablet 768px
  - Mobile 375px

**Référence** :
- `PACK_5_sightreading.css.txt` (base complète)
- `PACK_4_sightreading-virtual piano.css.txt` (styles piano)
- `PACK_5.2_sightreading.css.txt` (améliorations)

---

### ⚙️ 3. Moteur JavaScript Principal (`sightreading-engine.js` - ~6000 lignes attendues)

**À créer** : `static/sightreading-app/sightreading-engine.js`

**Classes principales à implémenter** :

#### 3.1. AudioEngine
- Initialisation Tone.js
- Chargement Salamander Piano samples (30 notes clés)
- Chain audio : Sampler → Gain → Reverb → Output
- Méthodes : `playNote(midi)`, `playChord([midi])`, `stopNote(midi)`
- Métronome (clic à chaque temps)
- Contrôle volume

#### 3.2. VirtualPiano
- Génération 88 touches (A0-C8, MIDI 21-108)
- Pattern touches noires : [1,1,0,1,1,1,0]
- Event listeners (mousedown/up, touchstart/end)
- Feedback visuel (classe active)
- Sustain pédale (touche ALT)
- Keyboard mapping (QWERTY → notes MIDI)

#### 3.3. StaffRenderer
- Canvas rendering (double-buffering)
- Grand Staff (2 portées, 5 lignes chacune)
- Clés Sol et Fa
- Armature (key signature)
- Barres de mesure
- **Rendu notes** :
  - Têtes (rondes, blanches, noires, croches, doubles)
  - Hampes (direction selon position)
  - Crochets (flags)
  - Altérations (♯, ♭, ♮)
- **Rendu accords** :
  - Empilement vertical
  - Barre commune
- Lignes supplémentaires (ledger lines)
- Mapping MIDI → Position portée (table complète MIDI 21-108)

#### 3.4. MIDIHandler
- Web MIDI API
- Détection devices
- Connexion/déconnexion
- Events noteOn/noteOff
- Sustain pédale (CC64)
- Velocity

#### 3.5. WaitMode
- Génération exercice (4-16 mesures)
- Affichage toutes les notes
- Curseur sur note actuelle
- Validation note par note
- Feedback doré (correct) / rouge (incorrect)
- Scroll après 4 notes (1 mesure)
- Suppression notes hors écran

#### 3.6. ScrollMode
- Bande verticale fixe dorée (x=200px)
- Défilement horizontal des notes
- Vitesse liée au tempo
- Détection notes atteignant playhead
- Pause immédiate sur erreur
- Calcul précision temporelle

#### 3.7. FreeMode
- Portée vide au départ
- Notes s'affichent en noir lors du jeu
- Placement automatique (Fa/Sol selon hauteur)
- Barres de mesure automatiques
- Export MIDI/MusicXML

#### 3.8. StatsTracker
- Session stats (temps, notes jouées, accuracy, streak)
- Overall stats (score total, best streak, temps total)
- Graphique Chart.js
- LocalStorage/Database persistence
- Achievements system

**Référence** :
- `PACK_5_sightreading-engine.js.txt` (moteur complet)
- `PACK_4_sightreading-engine virtual piano.js.txt` (piano virtuel)
- `sightreading-engine-COMPLETE.js` (3500+ lignes déjà créées)

---

### 🎼 4. Générateurs de Contenu (`sightreading-chord-generators.js` - ~3000 lignes attendues)

**À créer** : `static/sightreading-app/sightreading-chord-generators.js`

**Classes à implémenter** :

#### 4.1. BaseGenerator (classe mère)
- Helpers musicaux
- Tables intervalles, gammes, modes
- Calculs théorie musicale

#### 4.2. RandomGenerator
- **Beginner** : C4-C5, rondes/blanches/noires, pas d'altérations
- **Intermediate** : A2-E6, + croches, triades, 3 altérations max
- **Advanced** : Full range, accords 7e, rythmes complexes
- **Expert** : Chromatisme, accords 11e/13e, polyrythmie

#### 4.3. ScaleGenerator
- Gammes majeures (C, G, D, A, E, B, F, Bb, Eb, Ab, Db, Gb)
- Gammes mineures (natural, harmonic, melodic)
- Modes (Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian)
- Direction (ascending/descending)
- Patterns rythmiques variés

#### 4.4. TriadGenerator
- Accords majeurs : I, IV, V
- Accords mineurs : ii, iii, vi
- Accord diminué : vii°
- Inversions (root, 1st, 2nd)
- Arpégé ou plaqué

#### 4.5. ChordGenerator
- Accords 7e (maj7, min7, dom7, dim7, m7b5)
- Accords 9e, 11e, 13e
- Sus, add, aug, dim

#### 4.6. ProgressionGenerator
- Progressions célèbres :
  - I-V-vi-IV (Axis)
  - I-IV-V-I (Rock)
  - ii-V-I (Jazz turnaround)
  - I-vi-ii-V (50s progression)
- Main gauche + droite optionnel

#### 4.7. ArpeggioGenerator
- Patterns : up, down, up-down, random
- Triades et septièmes
- Vitesses variées

#### 4.8. IntervalGenerator
- Intervalles : 2nds, 3rds, 4ths, 5ths, 6ths, 7ths, octaves
- Ascending/descending
- Harmonique ou mélodique

**Référence** :
- `PACK_5.2_sightreading-chord-generator.js.txt`
- `generators_spec_js.txt` (benchmark sightreading.training)
- `music_spec_js.txt` (logique musicale)

---

### 🎵 5. Bibliothèque de Morceaux (`sightreading-songs.js` - ~2000 lignes attendues)

**À créer** : `static/sightreading-app/sightreading-songs.js`

**Contenu** :
- Morceaux classiques (Bach, Mozart, Beethoven, Chopin)
- Exercices techniques (Hanon, Czerny)
- Standards jazz
- Pop/Rock simplifiés
- Format : JSON avec métadonnées
  - Titre, compositeur, difficulté
  - Notes (MIDI, durée, position)
  - Tempo suggéré
  - Key signature

**Référence** :
- `PACK_5.2_sightreading-songs.js.txt`
- `song_spec_js.txt` (benchmark)

---

## 🎯 BUGS CRITIQUES À CORRIGER (Listés dans INSTRUCTIONS FINALES)

1. ✅ Panneaux visibles au chargement → **Résolu** : Panels cachés par défaut (HTML aria-hidden="true")
2. ⏳ Notes sans hampes → **À implémenter** dans StaffRenderer
3. ⏳ Piano à l'envers → **À implémenter** génération gauche→droite (MIDI 21→108)
4. ⏳ Touches restent dorées → **À implémenter** classList.remove('active')
5. ⏳ Notes ne disparaissent pas → **À implémenter** filter(n => n.x > -50)
6. ✅ Time Signature sélectionnable → **Résolu** : Hardcodé 4/4, pas de select
7. ⏳ Pas d'accords → **À implémenter** dans ChordGenerator
8. ⏳ Boutons Play/Pause inactifs → **À implémenter** event listeners
9. ⏳ Generate Random Sheet ne marche pas → **À implémenter** generateNewExercise()
10. ✅ Pas de bouton Let's Play → **Résolu** : Loading overlay avec bouton

**Légende** :
- ✅ Résolu dans HTML
- ⏳ À implémenter dans JS/CSS

---

## 📦 STRUCTURE DES FICHIERS FINALE

```
static/sightreading-app/
├── README.md                           (ce fichier)
├── sightreading-main.php               ✅ (628 lignes) - Shortcode WordPress + HTML
├── sightreading.css                    ⏳ (~5000 lignes) - Styles complets
├── sightreading-engine.js              ⏳ (~6000 lignes) - Moteur principal
├── sightreading-chord-generators.js    ⏳ (~3000 lignes) - Génération notes/accords
└── sightreading-songs.js               ⏳ (~2000 lignes) - Bibliothèque musicale

TOTAL ATTENDU: ~20,000 lignes de code professionnel
ACTUELLEMENT: ~628 lignes (3% complété)
```

---

## 🚀 COMMANDES POUR CONTINUER

### Créer le fichier CSS
```bash
# Examiner les PACK CSS existants
cat PACK_5_sightreading.css.txt
cat PACK_4_sightreading-virtual piano.css.txt

# Créer le fichier avec tous les styles nécessaires
# Voir sections détaillées ci-dessus
```

### Créer le moteur JavaScript
```bash
# Examiner les PACK JS existants
cat PACK_5_sightreading-engine.js.txt
cat sightreading-engine-COMPLETE.js

# Créer le fichier avec toutes les classes
# Voir sections détaillées ci-dessus
```

---

## 📚 DOCUMENTATION RÉFÉRENCE

### Documents principaux
1. **INSTRUCTIONS_FINALES_-_PIANOMO.txt** (17,500+ lignes) - Spécifications complètes
2. **CLAUDE.md** - Guide méthodologique de développement
3. **Recherches_claude_Sightreading.txt** - Insights techniques

### Codes existants à réutiliser
- **PACK_4** : Piano virtuel + Sight reading engine
- **PACK_5** : Sight reading complet (version de base)
- **PACK_5.1 à 5.4** : Variantes et améliorations
- **Modèles Sightreading** : Templates existants
- **Codes WordPress** : Intégration WP (functions.php, etc.)
- **Benchmark sightreading.training** : Générateurs, logique musicale

### Technologies
- **Frontend** : HTML5 Canvas, JavaScript ES6+, jQuery
- **Audio** : Tone.js + Salamander Grand Piano samples
- **MIDI** : Web MIDI API
- **Notation** : Algorithmes VexFlow adaptés
- **Backend** : WordPress PHP 8.1+, shortcode, AJAX
- **Styles** : CSS3 variables, Montserrat font

### Design System PianoMode
```css
--srt-gold: #C59D3A;         /* Or principal */
--srt-gold-light: #D4A942;   /* Or clair */
--srt-gold-dark: #B08A2E;    /* Or foncé */
--srt-black: #0B0B0B;        /* Noir profond */
--srt-white: #FFFFFF;        /* Blanc pur */
--srt-gray: #808080;         /* Gris neutre */
```

---

## ✅ CRITÈRES DE SUCCÈS

L'application est considérée **RÉUSSIE** si :

1. **Fonctionnel** ✅
   - Tous les modes (Wait/Scroll/Free) opérationnels
   - Piano virtuel 88 touches fonctionnel
   - MIDI input/output fonctionnel
   - Audio Salamander Piano sans bug

2. **Visuel** 🎨
   - Interface PianoMode (or #C59D3A + noir #0B0B0B)
   - Grand staff professionnel
   - Notes avec hampes/crochets corrects
   - Feedback visuel immédiat (doré/rouge)

3. **Performance** ⚡
   - 60 FPS constant
   - Latence audio < 50ms
   - Loading < 3s
   - Pas de memory leaks

4. **Qualité** 🏆
   - Code sans bugs critiques
   - Responsive mobile/tablet/desktop
   - Accessible (A11Y ≥ 90)
   - Tests coverage ≥ 70%

5. **UX** 💎
   - Intuitive pour débutants
   - Feedback immédiat sur actions
   - Pas de frustrations utilisateur
   - Comparable à sightreading.training

---

## 🎯 PROCHAINE SESSION

**À faire en priorité** :
1. ⏳ Créer `sightreading.css` (5000+ lignes) - Tous les styles
2. ⏳ Créer `sightreading-engine.js` (6000+ lignes) - Moteur complet
3. ⏳ Créer `sightreading-chord-generators.js` (3000+ lignes) - Génération
4. ⏳ Créer `sightreading-songs.js` (2000+ lignes) - Bibliothèque
5. ⏳ Tester l'application complète
6. ⏳ Corriger les bugs identifiés
7. ⏳ Optimiser les performances (60 FPS)
8. ⏳ Tests responsive (mobile/tablet/desktop)

---

**Date de création** : 11 Novembre 2025
**Version** : 1.0.0 (WIP)
**Auteur** : PianoMode Team / Claude Code
**Statut** : 🚧 EN DÉVELOPPEMENT (3% complété)
