# 🚀 Quick Start Guide - Claude Code

## Première connexion

Tu es Claude Code et tu vas développer l'application **PianoMode Sight Reading Training**.

### 📖 Lecture obligatoire (dans cet ordre)

1. **CLAUDE.md** (ce fichier guide principal) - LIS-LE EN ENTIER
2. **docs/sightreading/INSTRUCTIONS_FINALES_-_PIANOMO.txt** - Specs complètes
3. **docs/sightreading/Recherches_claude_Sightreading.txt** - Insights techniques

### 🎯 Première tâche

Commence par la **Phase 1.1** : Écran de chargement

```
Je vais commencer par Phase 1.1: Loading Screen.

Avant de coder, je vais :
1. Lire INSTRUCTIONS_FINALES section "Écran de chargement"
2. Consulter PACK_5_sightreading-main_php.txt pour voir structure HTML
3. Étudier PACK_5_sightreading_css.txt pour les styles existants

Puis je vais créer :
- HTML overlay dans sightreading-main.php
- Styles dans sightreading.css
- Logique chargement dans sightreading-engine.js

Je vais suivre le design PianoMode :
- Couleur or : #C59D3A
- Couleur noire : #0B0B0B
- Font : Montserrat
```

### 📁 Structure des fichiers à créer

```
blocksy-child/assets/Sightreading-game/
├── sightreading-main.php           ← À créer (4000+ lignes)
├── sightreading-engine.js          ← À créer (6000+ lignes)
├── sightreading-chord-generators.js ← À créer (3000+ lignes)
├── sightreading.css                ← À créer (5000+ lignes)
└── sightreading-songs.js           ← À créer (2000+ lignes)
```

### ✅ Checklist avant chaque commit

- [ ] Code compile sans erreurs
- [ ] Suit les spécifications INSTRUCTIONS_FINALES
- [ ] Réutilise code PACK_4/PACK_5 quand pertinent
- [ ] Respecte design PianoMode (couleurs, fonts)
- [ ] Corrige les bugs identifiés
- [ ] Commentaires inline clairs
- [ ] Pas de placeholders (code production-ready)

### 🐛 Bugs critiques à corriger (rappel)

1. ✅ Panneaux cachés par défaut (transform: translateX)
2. ✅ Notes avec hampes complètes
3. ✅ Piano dans le bon sens (graves gauche, aiguës droite)
4. ✅ Touches retour normal au release
5. ✅ Notes disparaissent hors écran
6. ✅ Time signature fixé à 4/4
7. ✅ Accords empilés verticalement
8. ✅ Boutons Play/Pause/Stop fonctionnels
9. ✅ Generate Random Sheet opérationnel
10. ✅ Bouton "Let's Play" avant démarrage

### 💡 Principes de qualité

- **Performance** : 60 FPS constant
- **Responsive** : Mobile, tablet, desktop
- **Accessible** : A11Y ≥ 90
- **Secure** : Sanitize inputs, nonces WordPress
- **Professional** : Rivaliser avec sightreading.training

---

**Prêt ?** Commence par lire CLAUDE.md section "Phase 1.1" ! 🎹
