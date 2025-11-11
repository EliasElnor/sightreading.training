# CLAUDE.md - PianoMode Sight Reading Training Tool

## 🎯 MISSION PRINCIPALE

Créer une application web professionnelle de **sight-reading** (lecture à vue musicale) pour PianoMode, intégrée à WordPress via shortcode.

**Référence visuelle principale** : [sightreading.training](https://sightreading.training) - notre benchmark qualité

---

## 📚 DOCUMENTS DE RÉFÉRENCE OBLIGATOIRES

### CRITIQUE : Lire TOUS ces documents AVANT de commencer

Tu DOIS lire et suivre ces documents dans cet ordre :

1. **INSTRUCTIONS_FINALES_-_PIANOMO.txt** (instructions complètes, 17,500+ lignes attendues)
   - Localisation : `/docs/sightreading/INSTRUCTIONS_FINALES_-_PIANOMO.txt`
   - Contenu : Spécifications complètes, architecture globale, bugs à corriger
   - **À lire en PREMIER** - c'est la bible du projet

2. **Recherches_claude_Sightreading.txt** (recherches techniques approfondies)
   - Localisation : `/docs/sightreading/Recherches_claude_Sightreading.txt`
   - Contenu : Rendu notation musicale, piano virtuel, génération notes, scrolling, projets open-source
   - Insights techniques critiques pour l'architecture

3. **Codes existants à RÉUTILISER** (ne pas réinventer la roue !) :
   
   **PACK_4** (Piano virtuel + Sight reading engine) :
   - `/docs/sightreading/PACK_4_sightreading-engine_virtual_piano_js.txt`
   - `/docs/sightreading/PACK_4_sightreading-main-virtual_piano_php.txt`
   - `/docs/sightreading/PACK_4_sightreading-virtual_piano_css.txt`
   
   **PACK_5** (Sight reading complet) :
   - `/docs/sightreading/PACK_5_sightreading_css.txt`
   - `/docs/sightreading/PACK_5_sightreading-main_php.txt`
   - `/docs/sightreading/PACK_5_sightreading-engine_js.txt`
   - `/docs/sightreading/PACK_5_3_sightreading-songs_js.txt`
   
   **PACK_5.1, 5.2, 5.3, 5.4** (Variantes et améliorations) :
   - `/docs/sightreading/PACK_5_1.TXT`
   - `/docs/sightreading/PACK_5_2.TXT`
   - `/docs/sightreading/PACK_5_3.TXT`
   - `/docs/sightreading/PACK_5_4.TXT`
   - `/docs/sightreading/PACK_5~4.TXT`
   
   **Modèles Sightreading** (Templates existants) :
   - `/docs/sightreading/Modèle_2_Sightreading-main_php.txt`
   - `/docs/sightreading/Modèle_2_Sightreading-JS2_js.txt`
   - `/docs/sightreading/Modèle_2_Sightreading-runtime_js.txt`
   - `/docs/sightreading/Modèle_2_Sightreading_js_PART1.txt`
   - `/docs/sightreading/Modèle_2_Sightreading_js_PART2.txt`
   - `/docs/sightreading/Modèle_2_Sightreading_js_PART3.txt`
   
   **Codes WordPress existants** :
   - `/docs/sightreading/functions.php.txt` (intégration WordPress)
   - `/docs/sightreading/dashboard_php.txt`
   - `/docs/sightreading/functions-account_php.txt`
   
   **Codes tier (benchmark sightreading.training)** :
   - `/docs/sightreading/generators_spec_js.txt`
   - `/docs/sightreading/music_spec_js.txt`
   - `/docs/sightreading/note_list_spec_js.txt`
   - `/docs/sightreading/parser_spec_js.txt`
   - `/docs/sightreading/song_spec_js.txt`

4. **Fichier ENGINE déjà créé** (3500+ lignes complètes) :
   - `/blocksy-child/assets/Sightreading-game/sightreading-engine-COMPLETE.js`
   - **100% FONCTIONNEL** - à utiliser comme base

### ⚠️ RÈGLE D'OR

**Tu DOIS** :
1. ✅ Lire les INSTRUCTIONS_FINALES en premier
2. ✅ T'inspirer FORTEMENT des codes PACK_4 et PACK_5 (ce sont des versions déjà testées)
3. ✅ Réutiliser l'architecture des Modèles Sightreading
4. ✅ Corriger TOUS les bugs listés dans INSTRUCTIONS_FINALES
5. ✅ Suivre les spécifications techniques des Recherches_claude

**Tu NE DOIS PAS** :
1. ❌ Inventer une nouvelle architecture sans justification
2. ❌ Ignorer les codes existants (ils représentent 100+ heures de travail)
3. ❌ Simplifier les fonctionnalités (tout doit être implémenté)
4. ❌ Créer des placeholders (code production-ready uniquement)

---

## 🔧 MÉTHODOLOGIE D'UTILISATION DES FICHIERS EXISTANTS

### Comment aborder chaque tâche

**TOUJOURS suivre ce processus** :

1. **Lire les spécifications** :
   - Consulter INSTRUCTIONS_FINALES section correspondante
   - Noter les critères de réussite
   - Identifier les bugs à corriger

2. **Étudier le code existant** :
   - Ouvrir les fichiers PACK_4/PACK_5 correspondants
   - Comprendre l'architecture utilisée
   - Repérer les fonctions/classes réutilisables

3. **Consulter les recherches** :
   - Lire section pertinente de Recherches_claude_Sightreading.txt
   - Noter les insights techniques (optimisations, pièges à éviter)
   - Vérifier les références aux projets open-source

4. **Implémenter** :
   - Réutiliser au maximum le code PACK_4/PACK_5
   - Adapter au design PianoMode (couleurs, fonts)
   - Corriger les bugs identifiés
   - Ajouter améliorations nécessaires

5. **Tester** :
   - Vérifier critères de réussite
   - Tester responsive
   - Vérifier performance (60 FPS)

### Exemple concret : Tâche "Piano virtuel 88 touches"

```
ÉTAPE 1 : Lire specs
→ INSTRUCTIONS_FINALES section "Piano virtuel"
→ Objectif : 88 touches (A0→C8), labels, feedback visuel

ÉTAPE 2 : Étudier code existant
→ Ouvrir PACK_4_sightreading-engine_virtual_piano_js.txt
→ Classe VirtualPiano déjà implémentée !
→ Algorithme génération touches : réutiliser

ÉTAPE 3 : Consulter recherches
→ Recherches_claude section "Piano virtuel"
→ Insight : pattern touches noires [1,1,0,1,1,1,0]
→ Optimisation : double canvas (statique + overlay)

ÉTAPE 4 : Implémenter
→ Copier classe VirtualPiano de PACK_4
→ Adapter couleurs : touches actives en #C59D3A (gold)
→ Corriger bug : touches restent dorées → ajouter classList.remove('active')

ÉTAPE 5 : Tester
→ ✅ 88 touches générées
→ ✅ Clic → feedback doré
→ ✅ Release → retour normal
→ ✅ Labels C3, C4, C5 visibles
```

### Fichiers par composant

| Composant | Fichiers existants à consulter |
|-----------|--------------------------------|
| **Piano virtuel** | PACK_4_sightreading-engine_virtual_piano_js.txt<br>PACK_4_sightreading-virtual_piano_css.txt |
| **Canvas / Staff** | PACK_5_sightreading-engine_js.txt (StaffRenderer)<br>Recherches_claude (VexFlow) |
| **Audio Engine** | PACK_5_sightreading-engine_js.txt (AudioEngine)<br>sightreading-engine-COMPLETE.js |
| **MIDI Handler** | PACK_5_sightreading-engine_js.txt (MIDIHandler)<br>Recherches_claude (Web MIDI API) |
| **Modes de jeu** | PACK_5_sightreading-engine_js.txt (WaitMode, ScrollMode)<br>INSTRUCTIONS_FINALES |
| **Générateurs** | generators_spec_js.txt (benchmark)<br>music_spec_js.txt<br>PACK_5_3_sightreading-songs_js.txt |
| **Interface** | PACK_5_sightreading-main_php.txt<br>Modèle_2_Sightreading-main_php.txt |
| **Styles** | PACK_5_sightreading_css.txt<br>PACK_4_sightreading-virtual_piano_css.txt |

---

## 📋 CONTEXTE DU PROJET

### Stack technique
- **Frontend** : HTML5 Canvas, JavaScript ES6+, jQuery
- **Audio** : Tone.js (Salamander Grand Piano samples)
- **MIDI** : Web MIDI API
- **Notation** : Algorithmes VexFlow adaptés (custom implementation)
- **Backend** : WordPress (PHP 8.1+), shortcode system, AJAX handlers
- **Styles** : CSS3 avec variables, Montserrat font

### Structure des fichiers
```
blocksy-child/assets/Sightreading-game/
├── sightreading-main.php           (4000+ lignes) - Shortcode WordPress + HTML
├── sightreading-engine.js          (6000+ lignes) - Moteur JavaScript principal  
├── sightreading-chord-generators.js (3000+ lignes) - Génération notes/accords
├── sightreading.css                (5000+ lignes) - Styles complets
└── sightreading-songs.js           (2000+ lignes) - Bibliothèque de morceaux
```

**Total : ~20,000 lignes de code professionnel**

---

## 🎨 DESIGN SYSTEM PIANOMODE

### Couleurs officielles
```css
--srt-gold: #C59D3A;         /* Or principal */
--srt-gold-light: #D4A942;   /* Or clair */
--srt-gold-dark: #B08A2E;    /* Or foncé */
--srt-black: #0B0B0B;        /* Noir profond */
--srt-white: #FFFFFF;        /* Blanc pur */
--srt-gray: #808080;         /* Gris neutre */
```

### Typographie
- **Font principale** : Montserrat (Google Fonts)
- **Tailles** : xs(12px), sm(14px), base(16px), lg(18px), xl(20px), 2xl(24px), 3xl(32px)
- **Poids** : light(300), normal(400), medium(500), semibold(600), bold(700)

---

## 🛠️ WORKFLOW DE DÉVELOPPEMENT

### Commandes essentielles
```bash
# Lancer le serveur de développement local
npm run dev

# Compiler les assets
npm run build

# Tests
npm test

# Linting
npm run lint
```

### Convention de nommage
- **Branches** : `feature/sight-reading-[feature-name]`
- **Commits** : Format Conventional Commits
  - `feat:` nouvelle fonctionnalité
  - `fix:` correction de bug
  - `refactor:` refactoring sans changement de comportement
  - `docs:` documentation
  - `style:` formatage, pas de changement de code
  - `test:` ajout ou modification de tests

### Structure des commits
```
type(scope): courte description

Description détaillée si nécessaire.

Références: #issue-number
```

---

## 🚀 PLAN DE DÉVELOPPEMENT PROGRESSIF

### PHASE 1 : FONDATIONS (Priorité CRITIQUE)
**Objectif** : Base fonctionnelle minimale

**📚 Documents à consulter pour cette phase** :
- `/docs/sightreading/PACK_4_sightreading-main-virtual_piano_php.txt` → Structure HTML
- `/docs/sightreading/PACK_5_sightreading-main_php.txt` → Shortcode WordPress
- `/docs/sightreading/Modèle_2_Sightreading-main_php.txt` → Template de base

#### Tâche 1.1 : Écran de chargement
- [ ] Créer overlay avec logo PianoMode
- [ ] Barre de progression animée
- [ ] Bouton "Let's Play" (activé après chargement complet)
- [ ] Tips interactifs pendant le chargement
- [ ] Transition smooth vers l'interface principale

**Fichiers concernés** : `sightreading-main.php` (HTML), `sightreading.css` (styles)

**Critères de réussite** :
- Loading screen visible au démarrage
- Progression de 0% à 100% en ~2-3 secondes
- Bouton Let's Play désactivé jusqu'à 100%
- Transition fluide vers le jeu

---

#### Tâche 1.2 : Structure HTML principale
- [ ] Container principal full-width (échapper au wrapper WordPress)
- [ ] Top bar avec logo + stats (hits/misses/streak)
- [ ] Control bar avec modes (Wait/Scroll) + tempo + volume
- [ ] Zone canvas pour la portée musicale
- [ ] Piano virtuel 88 touches
- [ ] Panneaux Settings (gauche) et Stats (droite) **CACHÉS par défaut**

**Fichiers concernés** : `sightreading-main.php`

**Critères de réussite** :
- Interface visible après "Let's Play"
- Tous les éléments positionnés correctement
- Panneaux Settings/Stats invisibles (transform: translateX(-100%/100%))
- Responsive sur desktop (1920px), tablet (768px), mobile (375px)

---

#### Tâche 1.3 : Piano virtuel 88 touches

**📚 Documents à consulter** :
- `/docs/sightreading/PACK_4_sightreading-engine_virtual_piano_js.txt` → Code piano complet
- `/docs/sightreading/PACK_4_sightreading-virtual_piano_css.txt` → Styles piano
- `/docs/sightreading/sightreading-virtual piano.css.txt` → CSS alternatif
- `/docs/sightreading/Recherches_claude_Sightreading.txt` → Section "Structure du piano virtuel"

**🔍 Points clés à réutiliser des PACK** :
- Algorithme génération 88 touches (A0→C8)
- Pattern touches noires : [1,1,0,1,1,1,0] (C#,D#,-,F#,G#,A#,-)
- Mapping MIDI ↔ Position canvas
- Event listeners mousedown/touchstart

- [ ] Générer 88 touches (A0 → C8, MIDI 21-108)
- [ ] Touches blanches : 52 touches, largeur adaptative
- [ ] Touches noires : 36 touches, positionnées entre les blanches
- [ ] Labels sur touches blanches (C3, C4, C5, etc.)
- [ ] Event listeners (mousedown/mouseup/touchstart)
- [ ] Feedback visuel (classe `.active` en or #C59D3A)
- [ ] Mapping MIDI ↔ position canvas

**Fichiers concernés** : `sightreading-engine.js` (classe VirtualPiano)

**Critères de réussite** :
- 88 touches affichées dans le bon ordre (graves à gauche, aiguës à droite)
- Clic sur touche → feedback doré immédiat
- Release → retour état normal instantané
- Labels visibles sur les Do (C3, C4, etc.)
- Touch-friendly sur mobile

---

#### Tâche 1.4 : Audio Engine (Tone.js + Salamander Piano)
- [ ] Initialiser Tone.js après interaction utilisateur
- [ ] Charger Salamander Grand Piano samples (30 notes clés)
- [ ] Créer chaîne audio : Sampler → Gain → Reverb → Output
- [ ] Fonctions playNote(midi), playChord([midi]), stopNote(midi)
- [ ] Volume control (0-100)
- [ ] Sustain pédale (via MIDI CC64 ou touche ALT)

**Fichiers concernés** : `sightreading-engine.js` (classe AudioEngine)

**Critères de réussite** :
- Sons piano naturels (pas de bips électroniques)
- Latence < 50ms
- Volume control fonctionnel
- Pas de distorsion à fort volume
- Samples chargés en ~2-3 secondes

---

### PHASE 2 : RENDU MUSICAL (Priorité IMPORTANTE)

**📚 Documents à consulter pour cette phase** :
- `/docs/sightreading/Recherches_claude_Sightreading.txt` → Sections VexFlow et notation
- `/docs/sightreading/PACK_5_sightreading-engine_js.txt` → StaffRenderer complet
- `/docs/sightreading/generators_spec_js.txt` (benchmark) → Logique génération
- `/blocksy-child/assets/Sightreading-game/sightreading-engine-COMPLETE.js` → Classes déjà créées

**🔍 Architecture à suivre** :
- Utiliser algorithmes VexFlow pour calcul positions
- Table MIDI_TO_STAFF_POSITION complète (voir PACK_5)
- Rendu Canvas avec double-buffering (optimisation)

#### Tâche 2.1 : Canvas - Grand Staff (Sol + Fa)
- [ ] Dessiner 2 portées (5 lignes chacune, espacement 10px)
- [ ] Portée Sol (Treble) en haut
- [ ] Portée Fa (Bass) en bas (70px dessous)
- [ ] Accolade gauche (bracket) reliant les 2 portées
- [ ] Clés Sol et Fa (glyphes Unicode SMuFL ou SVG)
- [ ] Armature (key signature) : Do Majeur par défaut
- [ ] Mesures à 4/4 (toujours, non modifiable)

**Fichiers concernés** : `sightreading-engine.js` (classe StaffRenderer)

**Critères de réussite** :
- Grand staff professionnel
- Clés Sol/Fa clairement visibles
- Espacement uniforme (10px entre lignes)
- Bracket reliant les portées

---

#### Tâche 2.2 : Mapping MIDI → Position Portée
- [ ] Table complète MIDI 36-84 (C2-C6) → ligne portée
- [ ] Do central (MIDI 60) entre les deux portées (ligne supplémentaire)
- [ ] Notes portée Sol : MIDI 60-84 (C4-C6)
- [ ] Notes portée Fa : MIDI 36-59 (C2-B3)
- [ ] Calcul position Y selon ligne (0 = ligne du bas)
- [ ] Lignes supplémentaires (ledger lines) automatiques

**Fichiers concernés** : `sightreading-engine.js` (objet MIDI_TO_STAFF_POSITION)

**Critères de réussite** :
- Do central (C4) exactement entre les portées
- Notes hautes sur portée Sol
- Notes basses sur portée Fa
- Lignes supplémentaires pour notes hors portée

---

#### Tâche 2.3 : Rendu des notes (têtes + hampes + crochets)
- [ ] Tête de note : ellipse (rayon 7px)
  - Ronde : vide, pas de hampe
  - Blanche : vide + hampe
  - Noire : pleine + hampe
  - Croche : pleine + hampe + 1 crochet
  - Double croche : pleine + hampe + 2 crochets
- [ ] Hampe (stem) : 35px de long, direction selon position note
  - Hampe vers le haut si note < ligne centrale
  - Hampe vers le bas si note >= ligne centrale
- [ ] Crochets (flags) : forme courbe, nombre selon durée
- [ ] Altérations : ♯ (dièse), ♭ (bémol), ♮ (bécarre)

**Fichiers concernés** : `sightreading-engine.js` (méthode drawNote)

**Critères de réussite** :
- Notes rondes sans hampe
- Notes noires avec hampe correcte
- Croches avec 1 crochet visible
- Doubles croches avec 2 crochets
- Direction hampe logique

---

#### Tâche 2.4 : Rendu des accords
- [ ] Empiler notes verticalement
- [ ] Décalage horizontal si notes trop proches (< 1 ligne)
- [ ] Barre verticale reliant toutes les têtes
- [ ] Hampe commune pour l'accord
- [ ] Support triades (3 notes) et septièmes (4 notes)

**Fichiers concernés** : `sightreading-engine.js` (méthode drawChord)

**Critères de réussite** :
- Accord de 3+ notes empilé proprement
- Pas de collision entre têtes
- Barre verticale visible
- Rendu professionnel

---

### PHASE 3 : MODES DE JEU (Priorité ESSENTIELLE)

**📚 Documents à consulter pour cette phase** :
- `/docs/sightreading/INSTRUCTIONS_FINALES_-_PIANOMO.txt` → Sections Mode WAIT et Mode SCROLL
- `/docs/sightreading/PACK_5_sightreading-engine_js.txt` → Classes WaitMode et ScrollMode
- `/docs/sightreading/Recherches_claude_Sightreading.txt` → Section "Défilement et génération"
- `/docs/sightreading/note_list_spec_js.txt` (benchmark) → Gestion liste notes

**🔍 Points critiques** :
- Mode Wait : validation note par note, scroll après 4 notes (1 mesure)
- Mode Scroll : playhead fixe, défilement continu, pause sur erreur
- AudioContext.currentTime pour sync parfaite (voir Recherches)

#### Tâche 3.1 : Mode WAIT (Attente)
- [ ] Générer exercice (4-16 mesures)
- [ ] Afficher toutes les notes sur la portée
- [ ] Mettre en évidence la note actuelle (encadré doré)
- [ ] Attendre input utilisateur (MIDI ou clavier PC)
- [ ] Validation :
  - Note correcte → feedback doré + son piano + avancer
  - Note incorrecte → feedback rouge transparent + rester sur place
- [ ] Scroll après 4 notes (1 mesure)
- [ ] Supprimer notes hors écran (x < -50px)
- [ ] Écran de fin avec statistiques

**Fichiers concernés** : `sightreading-engine.js` (classe WaitMode)

**Critères de réussite** :
- Notes affichées dès le début
- Progression note par note
- Feedback visuel immédiat
- Scroll fluide après chaque mesure
- Stats finales précises

---

#### Tâche 3.2 : Mode SCROLL (Défilement)
- [ ] Générer exercice long (16+ mesures)
- [ ] Bande verticale dorée fixe (playhead)
- [ ] Défilement horizontal des notes (vitesse selon tempo)
- [ ] Détection note atteignant playhead (tolérance ±10px)
- [ ] Validation en temps réel :
  - Note jouée à temps → feedback doré + continuer
  - Note manquée → PAUSE + message erreur
- [ ] Reprendre sur bouton Play
- [ ] Calcul précision temporelle

**Fichiers concernés** : `sightreading-engine.js` (classe ScrollMode)

**Critères de réussite** :
- Bande playhead fixe visible
- Défilement fluide (60 FPS)
- Pause immédiate sur erreur
- Tempo modifie vitesse défilement
- Synchronisation audio-visuel parfaite

---

#### Tâche 3.3 : Boutons de contrôle
- [ ] Play : démarrer mode actif (Wait ou Scroll)
- [ ] Pause : arrêter temporairement, reprendre sur Play
- [ ] Stop : arrêter et revenir au début
- [ ] Reset / New Exercise : générer nouvel exercice
- [ ] Tempo slider : 40-200 BPM
- [ ] Volume slider : 0-100%
- [ ] Métronome : on/off

**Fichiers concernés** : `sightreading-engine.js` (event listeners)

**Critères de réussite** :
- Tous les boutons fonctionnels
- Play/Pause/Stop sans bugs
- Tempo change la vitesse en temps réel
- Volume control immédiat
- Métronome audible

---

### PHASE 4 : GÉNÉRATION DE CONTENU (Priorité IMPORTANTE)

**📚 Documents à consulter pour cette phase** :
- `/docs/sightreading/INSTRUCTIONS_FINALES_-_PIANOMO.txt` → Section "Génération avancée"
- `/docs/sightreading/Recherches_claude_Sightreading.txt` → Section "Génération de notes"
- `/docs/sightreading/generators_spec_js.txt` (benchmark sightreading.training) → **RÉFÉRENCE GOLD**
- `/docs/sightreading/music_spec_js.txt` (benchmark) → Logique musicale
- `/docs/sightreading/PACK_5_3_sightreading-songs_js.txt` → Bibliothèque morceaux

**🔍 Architecture de génération à suivre** :
1. **BaseGenerator** (classe mère avec helpers musicaux)
2. **RandomGenerator** → Notes aléatoires avec contraintes gamme
3. **ScaleGenerator** → Toutes les gammes (major, minor, modes)
4. **TriadGenerator** → Accords simples (I, IV, V, ii, iii, vi, vii°)
5. **ChordGenerator** → Accords complexes (7th, 9th, sus, add)
6. **ProgressionGenerator** → Suites harmoniques (I-V-vi-IV, ii-V-I, etc.)
7. **ArpeggioGenerator** → Arpèges (patterns up/down/random)
8. **IntervalGenerator** → Intervalles (2nds, 3rds, 4ths, etc.)

**⚠️ CRITIQUE** : Les générateurs doivent **respecter strictement** :
- 4/4 time signature (toujours 4 temps par mesure)
- Key signature (altérations selon tonalité)
- Range MIDI selon difficulté
- Smooth motion (pas de sauts > octave sauf si voulu)

#### Tâche 4.1 : Random Generator (Niveau Beginner)
- [ ] Range notes : C4-C5 (1 octave)
- [ ] Durées : rondes, blanches, noires
- [ ] Pas d'altérations
- [ ] Pas d'accords (notes simples uniquement)
- [ ] Respecter 4/4 (toujours 4 temps par mesure)
- [ ] 10% de silences (pauses, demi-pauses)

**Fichiers concernés** : `sightreading-chord-generators.js` (classe RandomGenerator)

**Critères de réussite** :
- Notes dans range C4-C5
- Rythmes simples
- Pas de dépasse temps mesure
- Silences occasionnels
- Lisible pour débutants

---

#### Tâche 4.2 : Scale Generator (Gammes)
- [ ] Major scales : C, G, D, A, E, F, Bb, Eb, Ab
- [ ] Minor scales (natural, harmonic, melodic)
- [ ] Ascending/Descending
- [ ] Patterns rythmiques variés
- [ ] 1-2 octaves selon difficulté

**Fichiers concernés** : `sightreading-chord-generators.js` (classe ScaleGenerator)

**Critères de réussite** :
- Toutes les gammes majeures générées correctement
- Altérations respectées (♯, ♭)
- Direction configurable
- Rythmes variés

---

#### Tâche 4.3 : Triad Generator (Accords simples)
- [ ] Triades majeurs : I, IV, V
- [ ] Triades mineurs : ii, iii, vi
- [ ] Accord diminué : vii°
- [ ] Arpégés ou plaqués
- [ ] Inversions (root, 1st, 2nd)

**Fichiers concernés** : `sightreading-chord-generators.js` (classe TriadGenerator)

**Critères de réussite** :
- Accords corrects harmoniquement
- Rendu propre (empilé ou arpégé)
- Inversions fonctionnelles

---

#### Tâche 4.4 : Progression Generator (Suites harmoniques)
- [ ] Progressions célèbres :
  - I-V-vi-IV (Axis progression)
  - I-IV-V-I (Rock progressions)
  - ii-V-I (Jazz turnaround)
  - I-vi-ii-V (50s progression)
- [ ] Durée accords configurables
- [ ] Main gauche (basse) + main droite (mélodie) optionnel

**Fichiers concernés** : `sightreading-chord-generators.js` (classe ProgressionGenerator)

**Critères de réussite** :
- Progressions sonnent musicalement
- Tempo adapté
- Transitions smooth

---

### PHASE 5 : MIDI & INTERACTIONS (Priorité ESSENTIELLE)

#### Tâche 5.1 : Web MIDI API
- [ ] Détecter navigateurs compatibles (Chrome, Edge, Opera)
- [ ] Lister inputs MIDI disponibles
- [ ] Connexion à input sélectionné
- [ ] Event listeners noteOn/noteOff
- [ ] Sustain pédale (CC64)
- [ ] Velocity (intensité du jeu)
- [ ] Gestion connexion/déconnexion à chaud

**Fichiers concernés** : `sightreading-engine.js` (classe MIDIHandler)

**Critères de réussite** :
- Liste devices MIDI affichée
- Connexion fonctionnelle
- Notes capturées correctement
- Pédale sustain opérationnelle
- Pas de lag MIDI

---

#### Tâche 5.2 : Clavier PC (Fallback)
- [ ] Mapping touches clavier → notes MIDI
  - A-L : touches blanches C4-E5
  - W, E, T, Y, U : touches noires
- [ ] Feedback visuel sur piano virtuel
- [ ] Sustain : touche ALT
- [ ] Octave shift : touches Z/X

**Fichiers concernés** : `sightreading-engine.js` (classe KeyboardInput)

**Critères de réussite** :
- Touches clavier jouent notes
- Mapping intuitif
- Feedback synchronisé
- Pas de conflit avec shortcuts navigateur

---

### PHASE 6 : PANNEAUX & CONFIGURATION (Priorité IMPORTANTE)

#### Tâche 6.1 : Settings Panel (Gauche)
- [ ] Ouverture/Fermeture fluide (translateX animation)
- [ ] Sections :
  - **STAFF** : Treble / Bass / Grand (défaut)
  - **GENERATOR** : Random / Scales / Triads / Progression / Arpeggios / Intervals
  - **NOTES** : Slider 2-16 notes
  - **SMOOTHNESS** : Slider 1-5 (mouvement mélodique)
  - **NOTE RANGE** : Min/Max (C2-C7)
  - **KEY** : C, G, D, A, E, B, F, Bb, Eb, Ab
  - **MIDI CONFIGURATION** (en bas) :
    - Indicateur statut (vert si connecté)
    - Select input MIDI
    - Bouton Refresh Devices
- [ ] Fermeture au clic externe ou touche Escape

**Fichiers concernés** : `sightreading-main.php` (HTML), `sightreading.css` (styles)

**Critères de réussite** :
- Panel caché par défaut
- Ouverture smooth (300ms)
- Toutes options configurables
- Sauvegarde settings (localStorage)
- MIDI en bas du panel

---

#### Tâche 6.2 : Stats Panel (Droite)
- [ ] Ouverture/Fermeture fluide
- [ ] Statistiques session :
  - Durée (timer)
  - Notes jouées
  - Accuracy (%)
  - Streak actuel
- [ ] Statistiques globales :
  - Total score
  - Best streak
  - Temps de pratique total
- [ ] Graphique progression (Chart.js)
- [ ] Reset stats (confirmation)

**Fichiers concernés** : `sightreading-main.php` (HTML), `sightreading-engine.js` (StatsTracker)

**Critères de réussite** :
- Stats temps réel
- Graphique progression visible
- Données persistantes (database ou localStorage)
- Reset fonctionnel

---

### PHASE 7 : POLISH & OPTIMISATION (Priorité MOYENNE)

#### Tâche 7.1 : Performance
- [ ] 60 FPS constant (requestAnimationFrame)
- [ ] Double buffering canvas (statique + overlay)
- [ ] Object pooling pour notes
- [ ] Lazy loading images/sons
- [ ] Debounce event listeners
- [ ] Profiling Chrome DevTools

**Fichiers concernés** : Tous fichiers JS

**Critères de réussite** :
- 60 FPS stable
- Pas de memory leaks
- Temps chargement < 3s
- Smooth sur mobile

---

#### Tâche 7.2 : Responsive Design
- [ ] Desktop (1920px+) : layout complet
- [ ] Laptop (1440px) : layout compact
- [ ] Tablet (768px) : piano scrollable
- [ ] Mobile (375px) : layout vertical, piano caché par défaut
- [ ] Touch-friendly : min 44px targets
- [ ] Orientation landscape/portrait

**Fichiers concernés** : `sightreading.css` (media queries)

**Critères de réussite** :
- Utilisable sur tous devices
- Pas de scroll horizontal non voulu
- Touch gestures naturels
- Lisible sur petit écran

---

#### Tâche 7.3 : Accessibilité (A11Y)
- [ ] Contraste texte/fond ≥ 4.5:1
- [ ] Focus visible (outline)
- [ ] Keyboard navigation complète
- [ ] ARIA labels sur boutons
- [ ] Alt text sur images
- [ ] Skip links
- [ ] Screen reader compatible

**Fichiers concernés** : Tous fichiers HTML/CSS/JS

**Critères de réussite** :
- Lighthouse A11Y score ≥ 90
- Navigable au clavier
- VoiceOver/NVDA compatible

---

## 🐛 BUGS CRITIQUES À CORRIGER

### Bug 1 : Panneaux visibles au chargement
**Problème** : Settings/Stats panels ouverts dès le départ
**Solution** : 
```css
.srt-panel-left { transform: translateX(-100%); }
.srt-panel-right { transform: translateX(100%); }
.srt-panel-left.open { transform: translateX(0); }
.srt-panel-right.open { transform: translateX(0); }
```

### Bug 2 : Notes sans hampes
**Problème** : Seulement des ronds, pas de hampes/crochets
**Solution** : Implémenter drawStem() et drawFlag() dans StaffRenderer

### Bug 3 : Piano à l'envers
**Problème** : Graves à droite, aiguës à gauche
**Solution** : Générer touches de gauche à droite (MIDI 21→108)

### Bug 4 : Touches restent dorées
**Problème** : Classe `.active` pas retirée au release
**Solution** : `key.classList.remove('active')` dans handleKeyUp()

### Bug 5 : Notes ne disparaissent pas
**Problème** : Toutes les notes restent à l'écran
**Solution** : `notes = notes.filter(n => n.x > -50)` après scroll

### Bug 6 : Time Signature sélectionnable
**Problème** : UI permet de changer mais pas implémenté
**Solution** : Hardcoder 4/4, retirer select du HTML

### Bug 7 : Pas d'accords
**Problème** : Seulement notes simples générées
**Solution** : Implémenter TriadGenerator et ChordGenerator

### Bug 8 : Boutons Play/Pause inactifs
**Problème** : Event listeners manquants
**Solution** : `$('#srtPlayBtn').on('click', () => engine.play())`

### Bug 9 : Generate Random Sheet ne marche pas
**Problème** : Fonction non implémentée
**Solution** : `generateNewExercise()` avec params actuels

### Bug 10 : Pas de bouton Let's Play
**Problème** : Jeu démarre directement
**Solution** : Loading overlay avec bouton (voir Phase 1.1)

---

## 📊 INDICATEURS DE QUALITÉ

### Metrics cibles
- **Performance** : Lighthouse Performance ≥ 90
- **Accessibilité** : Lighthouse A11Y ≥ 90
- **Best Practices** : Lighthouse BP ≥ 90
- **SEO** : Lighthouse SEO ≥ 90
- **Code Coverage** : ≥ 70% (tests unitaires)
- **FPS** : 60 FPS constant
- **Latency audio** : < 50ms
- **Loading time** : < 3s (3G)

### Tests manuels essentiels
- [ ] Click sur chaque touche piano → son correct
- [ ] Mode Wait : progression note par note
- [ ] Mode Scroll : défilement fluide + pause sur erreur
- [ ] MIDI : connexion device + capture notes
- [ ] Clavier PC : touches A-L jouent notes
- [ ] Panels : ouverture/fermeture smooth
- [ ] Settings : tous paramètres fonctionnels
- [ ] Stats : compteurs temps réel
- [ ] Responsive : 4 breakpoints (mobile, tablet, laptop, desktop)
- [ ] Feedback : doré (correct), rouge (erreur)

---

## 📚 RESSOURCES TECHNIQUES

### Documentation essentielle
- **VexFlow** : https://github.com/0xfe/vexflow (notation musicale)
- **Tone.js** : https://tonejs.github.io/docs/ (audio synthesis)
- **Web MIDI API** : https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
- **SMuFL** : https://w3c.github.io/smufl/latest/ (glyphes musicaux)
- **Bravura font** : https://github.com/steinbergmedia/bravura

### Projets open-source de référence
- **sightreading.training** : https://github.com/leafo/sightreading.training
- **react-piano** : https://github.com/kevinsqi/react-piano
- **Prelude** : https://github.com/BHSPitMonkey/Prelude

### CDN assets
```html
<!-- Tone.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"></script>

<!-- Salamander Piano Samples -->
https://tonejs.github.io/audio/salamander/[note].mp3

<!-- Montserrat Font -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap">

<!-- Bravura Music Font -->
<link href="https://cdn.jsdelivr.net/npm/@vexflow-fonts/bravura/bravura.css">
```

---

## 🔒 RÈGLES DE SÉCURITÉ

### WordPress Security
- **Sanitize inputs** : `sanitize_text_field()`, `esc_html()`, `esc_url()`
- **Nonces** : `wp_create_nonce()`, `check_ajax_referer()`
- **Prepared statements** : `$wpdb->prepare()`
- **Capability checks** : `current_user_can()`
- **XSS prevention** : Jamais de `innerHTML` avec données utilisateur
- **CSRF protection** : Nonces sur tous les forms/AJAX

### JavaScript Best Practices
- **No eval()** : Jamais utiliser eval()
- **Content Security Policy** : Respecter CSP WordPress
- **HTTPS only** : Toujours HTTPS pour MIDI/Audio
- **Input validation** : Valider TOUS les inputs utilisateur
- **Error handling** : try/catch sur opérations sensibles

---

## 🎓 STYLE GUIDE CODE

### JavaScript
```javascript
// ✅ GOOD - Classes en PascalCase
class AudioEngine {
    constructor() {
        this.isReady = false;
    }
    
    async initialize() {
        // ...
    }
}

// ✅ GOOD - Fonctions en camelCase
function calculateNotePosition(midi, staffY) {
    // ...
}

// ✅ GOOD - Constantes en SCREAMING_SNAKE_CASE
const MAX_NOTES_PER_MEASURE = 16;

// ✅ GOOD - Arrow functions pour callbacks
notes.forEach(note => {
    this.drawNote(note);
});

// ❌ BAD - Variables vagues
let x = 5; // Quoi x?

// ✅ GOOD - Variables explicites
let noteIndex = 5;
```

### CSS
```css
/* ✅ GOOD - Classes préfixées .srt- */
.srt-piano-key {
    background: var(--srt-gold);
}

/* ✅ GOOD - Variables CSS pour couleurs */
:root {
    --srt-gold: #C59D3A;
}

/* ❌ BAD - Couleurs hardcodées */
.button {
    background: #C59D3A; /* Utiliser var(--srt-gold) */
}

/* ✅ GOOD - BEM naming */
.srt-panel__header { }
.srt-panel__content { }
.srt-panel--open { }
```

### PHP
```php
// ✅ GOOD - WordPress coding standards
public function render_shortcode($atts) {
    $atts = shortcode_atts(array(
        'mode' => 'wait',
        'difficulty' => 'beginner'
    ), $atts);
    
    ob_start();
    ?>
    <div class="srt-container">
        <?php echo esc_html($atts['mode']); ?>
    </div>
    <?php
    return ob_get_clean();
}

// ✅ GOOD - Nonces pour sécurité
check_ajax_referer('srt_nonce', 'nonce');

// ✅ GOOD - Prepared statements
$results = $wpdb->get_results($wpdb->prepare(
    "SELECT * FROM {$wpdb->prefix}srt_stats WHERE user_id = %d",
    $user_id
));
```

---

## 🧪 TESTS À EFFECTUER

### Tests unitaires (Jest)
```javascript
describe('AudioEngine', () => {
    test('should initialize Tone.js correctly', async () => {
        const engine = new AudioEngine();
        await engine.initialize();
        expect(engine.isReady).toBe(true);
    });
    
    test('should play note with correct frequency', () => {
        const engine = new AudioEngine();
        const midi = 60; // C4
        const freq = engine.midiToFrequency(midi);
        expect(freq).toBeCloseTo(261.63, 2);
    });
});
```

### Tests d'intégration
```javascript
describe('WaitMode', () => {
    test('should advance to next note on correct input', () => {
        const mode = new WaitMode(mockEngine);
        mode.start();
        
        mode.handleNoteInput(60); // C4
        
        expect(mode.currentNoteIndex).toBe(1);
        expect(mockEngine.stats.correctNotes).toBe(1);
    });
});
```

### Tests E2E (Playwright)
```javascript
test('complete sight-reading session', async ({ page }) => {
    await page.goto('/sight-reading');
    
    // Cliquer "Let's Play"
    await page.click('#srtStartButton');
    
    // Vérifier interface chargée
    await expect(page.locator('.srt-staff-container')).toBeVisible();
    
    // Cliquer sur touche piano
    await page.click('[data-midi="60"]');
    
    // Vérifier feedback
    await expect(page.locator('.srt-golden-frame')).toBeVisible();
});
```

---

## 🚨 CHECKLIST AVANT COMMIT

Avant chaque commit, vérifier :

- [ ] **Code compile** : Pas d'erreurs ESLint/PHP Codesniffer
- [ ] **Tests passent** : `npm test` vert
- [ ] **Console clean** : Pas d'erreurs/warnings console
- [ ] **Responsive** : Testé sur 3+ viewports
- [ ] **Performance** : Pas de lag visible
- [ ] **Accessibility** : Focus visible, ARIA labels
- [ ] **Security** : Inputs sanitizés, nonces présents
- [ ] **Documentation** : Commentaires inline à jour
- [ ] **Git** : Commit message formaté correctement

---

## 🎯 CRITÈRES DE SUCCÈS GLOBAUX

### L'application est considérée RÉUSSIE si :

1. **Fonctionnel** ✅
   - Tous les modes (Wait/Scroll) opérationnels
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

## 📞 CONTACT & SUPPORT

Si tu rencontres des problèmes ou as des questions :

1. **Documentation technique** : Voir sections ci-dessus
2. **Issues GitHub** : Ouvrir un ticket détaillé
3. **Code review** : Demander review avant merge importante
4. **Pair programming** : Disponible pour features complexes

**Bon développement !** 🎹🎶

---

*Document version : 1.0.0*  
*Dernière mise à jour : 2025-01-11*  
*Auteur : PianoMode Team*
