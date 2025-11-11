# 🎹 PianoMode Sight Reading Training

Application web professionnelle de **lecture à vue musicale** (sight-reading) pour PianoMode, intégrée à WordPress.

## 📋 Vue d'ensemble

**Benchmark** : [sightreading.training](https://sightreading.training)  
**Technologie** : HTML5 Canvas, JavaScript ES6+, Tone.js, Web MIDI API, WordPress  
**Lignes de code attendues** : ~20,000 lignes

## 🗂️ Structure du projet

```
website-learn/
├── CLAUDE.md                    ← Guide complet pour Claude Code (LIRE EN PREMIER)
├── QUICK_START.md               ← Démarrage rapide
├── README.md                    ← Ce fichier
│
├── blocksy-child/
│   └── assets/
│       └── Sightreading-game/
│           ├── sightreading-main.php           (4000+ lignes)
│           ├── sightreading-engine.js          (6000+ lignes)
│           ├── sightreading-chord-generators.js (3000+ lignes)
│           ├── sightreading.css                (5000+ lignes)
│           └── sightreading-songs.js           (2000+ lignes)
│
└── docs/
    └── sightreading/
        ├── INSTRUCTIONS_FINALES_-_PIANOMO.txt     ← Specs complètes (BIBLE)
        ├── Recherches_claude_Sightreading.txt     ← Insights techniques
        │
        ├── PACK_4/                                ← Codes existants v4
        │   ├── sightreading-engine_virtual_piano_js.txt
        │   ├── sightreading-main-virtual_piano_php.txt
        │   └── sightreading-virtual_piano_css.txt
        │
        ├── PACK_5/                                ← Codes existants v5
        │   ├── sightreading_css.txt
        │   ├── sightreading-main_php.txt
        │   ├── sightreading-engine_js.txt
        │   └── sightreading-songs_js.txt
        │
        ├── PACK_5.1/                              ← Variantes et améliorations
        ├── PACK_5.2/
        ├── PACK_5.3/
        ├── PACK_5.4/
        │
        ├── Modeles/                               ← Templates existants
        │   ├── Modèle_2_Sightreading-main_php.txt
        │   └── Modèle_2_Sightreading_js_*.txt
        │
        ├── Benchmark/                             ← Code sightreading.training
        │   ├── generators_spec_js.txt
        │   ├── music_spec_js.txt
        │   └── note_list_spec_js.txt
        │
        └── WordPress/                             ← Intégration WP
            ├── functions.php.txt
            └── functions-account_php.txt
```

## 🚀 Démarrage

### Pour les développeurs

1. **Cloner le repo**
   ```bash
   git clone https://github.com/username/website-learn.git
   cd website-learn
   ```

2. **Installer dépendances**
   ```bash
   npm install
   ```

3. **Lancer développement local**
   ```bash
   npm run dev
   ```

### Pour Claude Code

1. **Lire la documentation** (dans cet ordre)
   - `QUICK_START.md` (5 min)
   - `CLAUDE.md` (30 min)
   - `docs/sightreading/INSTRUCTIONS_FINALES_-_PIANOMO.txt` (1h)

2. **Configurer environnement**
   - Nom : `SightReading-Dev`
   - Accès réseau : Trusted network
   - Variables : voir `CLAUDE.md`

3. **Commencer Phase 1.1**
   ```
   Start Phase 1.1: Create loading screen overlay with PianoMode branding
   ```

## 🎨 Design System

### Couleurs officielles PianoMode
- **Or principal** : `#C59D3A`
- **Or clair** : `#D4A942`
- **Or foncé** : `#B08A2E`
- **Noir profond** : `#0B0B0B`
- **Blanc pur** : `#FFFFFF`
- **Gris neutre** : `#808080`

### Typographie
- **Font** : Montserrat (Google Fonts)
- **Tailles** : 12px, 14px, 16px, 18px, 20px, 24px, 32px
- **Poids** : 300, 400, 500, 600, 700

## 📦 Fonctionnalités

### Modes de jeu
- ✅ **Wait Mode** : Attente validation note par note
- ✅ **Scroll Mode** : Défilement continu avec playhead fixe

### Générateurs de contenu
- ✅ Random (notes aléatoires)
- ✅ Scales (gammes majeures, mineures, modes)
- ✅ Triads (accords simples)
- ✅ Chords (accords complexes 7th, 9th)
- ✅ Progressions (suites harmoniques)
- ✅ Arpeggios (arpèges)
- ✅ Intervals (intervalles)

### Interfaces
- ✅ Piano virtuel 88 touches
- ✅ Grand Staff (portée Sol + Fa)
- ✅ MIDI input/output
- ✅ Keyboard PC fallback
- ✅ Settings panel (gauche)
- ✅ Stats panel (droite)

### Audio
- ✅ Tone.js + Salamander Grand Piano samples
- ✅ Reverb subtile
- ✅ Volume control
- ✅ Métronome

## 🐛 Bugs corrigés

1. ✅ Panneaux Settings/Stats cachés par défaut
2. ✅ Notes avec hampes complètes (rondes, blanches, noires, croches)
3. ✅ Piano dans le bon sens (graves à gauche)
4. ✅ Touches retour normal au release
5. ✅ Notes disparaissent après dépassement
6. ✅ Time signature fixé à 4/4
7. ✅ Accords empilés verticalement
8. ✅ Boutons Play/Pause/Stop fonctionnels
9. ✅ Generate Random Sheet opérationnel
10. ✅ Bouton "Let's Play" écran chargement

## 📊 Métriques de qualité

- **Performance** : Lighthouse ≥ 90
- **Accessibilité** : A11Y ≥ 90
- **FPS** : 60 constant
- **Latency audio** : < 50ms
- **Loading time** : < 3s

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests E2E
npm run test:e2e

# Linting
npm run lint

# Build production
npm run build
```

## 📚 Documentation

- **Guide développeur** : `CLAUDE.md`
- **Specs complètes** : `docs/sightreading/INSTRUCTIONS_FINALES_-_PIANOMO.txt`
- **Recherches techniques** : `docs/sightreading/Recherches_claude_Sightreading.txt`

## 🔗 Ressources externes

- **VexFlow** : https://github.com/0xfe/vexflow
- **Tone.js** : https://tonejs.github.io/docs/
- **Web MIDI API** : https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
- **sightreading.training** : https://github.com/leafo/sightreading.training

## 🤝 Contribution

### Workflow Git

1. Créer branche : `git checkout -b feature/sight-reading-[feature-name]`
2. Coder en suivant `CLAUDE.md`
3. Commit : `git commit -m "feat(sight-reading): description"`
4. Push : `git push origin feature/sight-reading-[feature-name]`
5. Créer Pull Request
6. Review + Tests
7. Merge

### Convention commits

Format : `type(scope): description`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `refactor`: Refactoring
- `docs`: Documentation
- `style`: Formatage
- `test`: Tests
- `perf`: Performance

## 📄 Licence

Propriété de PianoMode. Tous droits réservés.

## 📞 Contact

**Équipe PianoMode**  
Email : contact@pianomode.com  
Site : https://pianomode.com

---

*Version 1.0.0 - 2025-01-11*
