# Listen & Play - Bibliothèque de Partitions

Ce dossier contient les fichiers nécessaires pour la page "Listen & Play" de PianoMode.

## Fichiers

- **listen-play.html** : Structure HTML de la page
- **listen-play.js** : Logique JavaScript pour la recherche et les filtres
- **listen-play.css** : Styles CSS

## Installation sur WordPress

### 1. Uploader les fichiers

Uploadez ces 3 fichiers dans votre thème enfant Blocksy :
```
/wp-content/themes/blocksy-child/Listen & Play page/
```

### 2. Créer la page WordPress

1. Dans l'admin WordPress, allez dans **Pages > Ajouter**
2. Donnez un titre à la page (ex: "Listen & Play")
3. Passez en mode **Éditeur de code** (pas l'éditeur visuel)

### 3. Insérer le HTML

Copiez le contenu du fichier `listen-play.html` et collez-le dans l'éditeur de page.

### 4. Charger les fichiers CSS et JS

Dans votre fichier `functions.php` du thème enfant, ajoutez :

```php
<?php
/**
 * Charger les scripts pour Listen & Play
 */
function pianomode_listen_play_scripts() {
    // Uniquement sur la page Listen & Play
    if (is_page('listen-play')) { // Remplacez 'listen-play' par le slug de votre page

        // CSS
        wp_enqueue_style(
            'listen-play-style',
            get_stylesheet_directory_uri() . '/Listen & Play page/listen-play.css',
            array(),
            '1.0.0'
        );

        // JavaScript
        wp_enqueue_script(
            'listen-play-script',
            get_stylesheet_directory_uri() . '/Listen & Play page/listen-play.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'pianomode_listen_play_scripts');
?>
```

### 5. Vérifications importantes

Après avoir téléchargé les fichiers sur votre serveur, vérifiez :

1. **Les fichiers sont bien au bon endroit** :
   - Vérifiez que l'URL fonctionne : `https://pianomode.com/wp-content/themes/blocksy-child/Listen%20&%20Play%20page/listen-play.js`

2. **Le HTML est bien inséré dans la page** :
   - Ouvrez la page dans un navigateur
   - Faites clic droit > Inspecter
   - Vérifiez que les éléments avec les IDs suivants existent :
     - `searchInput`
     - `scoresContainer`
     - `loadingIndicator`
     - `resultsCounter`
     - `paginationContainer`
     - `clearFiltersBtn`
     - `filterCheckboxes`

3. **Les fichiers CSS et JS sont chargés** :
   - Ouvrez la console du navigateur (F12)
   - Allez dans l'onglet Network/Réseau
   - Rechargez la page
   - Vérifiez que `listen-play.js` et `listen-play.css` se chargent sans erreur 404

4. **Le JavaScript s'exécute correctement** :
   - Ouvrez la console du navigateur (F12)
   - Vous devriez voir : `🎹 Initialisation de Listen & Play`
   - Puis : `🎹 Tous les éléments DOM sont présents`
   - Puis : `🎹 Listen & Play initialisé avec succès`

## Résolution des problèmes

### Problème : Bande noire uniquement, sans contenu

**Solution** : Le HTML n'est pas inséré dans la page WordPress.
- Vérifiez que vous avez bien copié le contenu de `listen-play.html` dans l'éditeur de page
- Assurez-vous d'être en mode "Éditeur de code" et non en mode visuel

### Problème : Erreur "Élément XXX non trouvé"

**Solution** : Les éléments HTML ne sont pas présents dans la page.
- Inspectez la page avec les outils de développement
- Vérifiez que tous les éléments avec les bons IDs sont présents
- Réinstallez le HTML en mode "Éditeur de code"

### Problème : 404 sur les fichiers JS/CSS

**Solution** : Les fichiers ne sont pas au bon endroit ou le code dans functions.php est incorrect.
- Vérifiez le chemin des fichiers sur le serveur
- Vérifiez que le slug de la page dans `is_page()` est correct
- Videz le cache de WordPress

### Problème : Le CSS ne s'applique pas

**Solution** : Le CSS est peut-être écrasé par d'autres styles.
- Inspectez les éléments avec les outils de développement
- Vérifiez si d'autres CSS ont une priorité plus élevée
- Ajoutez `!important` si nécessaire (en dernier recours)

## Données de démonstration

Actuellement, le JavaScript utilise des données de démonstration hardcodées (voir la variable `demoScores` dans `listen-play.js`).

Pour utiliser de vraies données WordPress :

1. Créez un Custom Post Type pour les partitions
2. Modifiez le JavaScript pour faire des requêtes AJAX vers WordPress
3. Créez un endpoint REST API ou utilisez `admin-ajax.php`

## Support

Si vous rencontrez des problèmes, vérifiez la console du navigateur pour voir les messages d'erreur détaillés.
