/**
 * Listen & Play - Script principal
 * Gestion de la bibliothèque de partitions avec recherche et filtres
 */

jQuery(document).ready(function($) {
    console.log('🎹 Initialisation de Listen & Play');

    // Vérification des éléments du DOM
    const elements = {
        searchInput: $('#searchInput'),
        scoresContainer: $('#scoresContainer'),
        loadingIndicator: $('#loadingIndicator'),
        resultsCounter: $('#resultsCounter'),
        resultsCount: $('#resultsCount'),
        paginationContainer: $('#paginationContainer'),
        clearFiltersBtn: $('#clearFiltersBtn'),
        filterCheckboxes: $('#filterCheckboxes')
    };

    // Vérifier que tous les éléments existent
    let missingElements = [];
    Object.keys(elements).forEach(function(key) {
        if (elements[key].length === 0) {
            missingElements.push(key);
            console.warn('🎹 Élément ' + key + ' non trouvé');
        }
    });

    if (missingElements.length > 0) {
        console.error('🎹 Éléments manquants: ' + missingElements.join(', '));
        console.error('🎹 Assurez-vous que le HTML de listen-play.html est bien inséré dans la page WordPress');
        return; // Arrêter l'exécution si des éléments sont manquants
    }

    console.log('🎹 Tous les éléments DOM sont présents');

    // Configuration
    const config = {
        scoresPerPage: 12,
        currentPage: 1,
        totalScores: 0,
        searchDelay: 300, // Délai en ms avant de lancer la recherche
        ajaxUrl: typeof ajaxurl !== 'undefined' ? ajaxurl : '/wp-admin/admin-ajax.php'
    };

    let searchTimer = null;

    // Données de démonstration (à remplacer par de vraies données WordPress)
    const demoScores = [
        {
            id: 1,
            title: 'Sonate au Clair de Lune',
            composer: 'Beethoven',
            difficulty: 'avance',
            genre: 'classique',
            thumbnail: 'https://via.placeholder.com/300x400?text=Sonate',
            pdf_url: '#',
            audio_url: '#'
        },
        {
            id: 2,
            title: 'Prélude en Do Majeur',
            composer: 'Bach',
            difficulty: 'intermediaire',
            genre: 'classique',
            thumbnail: 'https://via.placeholder.com/300x400?text=Prelude',
            pdf_url: '#',
            audio_url: '#'
        },
        {
            id: 3,
            title: 'Autumn Leaves',
            composer: 'Joseph Kosma',
            difficulty: 'intermediaire',
            genre: 'jazz',
            thumbnail: 'https://via.placeholder.com/300x400?text=Autumn',
            pdf_url: '#',
            audio_url: '#'
        },
        {
            id: 4,
            title: 'Let It Be',
            composer: 'The Beatles',
            difficulty: 'debutant',
            genre: 'pop',
            thumbnail: 'https://via.placeholder.com/300x400?text=Let+It+Be',
            pdf_url: '#',
            audio_url: '#'
        },
        {
            id: 5,
            title: 'Gymnopédie No. 1',
            composer: 'Erik Satie',
            difficulty: 'debutant',
            genre: 'classique',
            thumbnail: 'https://via.placeholder.com/300x400?text=Gymnopedie',
            pdf_url: '#',
            audio_url: '#'
        },
        {
            id: 6,
            title: 'Blue Bossa',
            composer: 'Kenny Dorham',
            difficulty: 'avance',
            genre: 'jazz',
            thumbnail: 'https://via.placeholder.com/300x400?text=Blue+Bossa',
            pdf_url: '#',
            audio_url: '#'
        }
    ];

    /**
     * Récupère les filtres actifs
     */
    function getActiveFilters() {
        const filters = {
            difficulty: [],
            genre: []
        };

        if (elements.filterCheckboxes.length > 0) {
            elements.filterCheckboxes.find('input[type="checkbox"]:checked').each(function() {
                const name = $(this).attr('name');
                const value = $(this).val();

                if (name && value && filters[name]) {
                    filters[name].push(value);
                }
            });
        }

        return filters;
    }

    /**
     * Récupère le terme de recherche
     */
    function getSearchTerm() {
        if (elements.searchInput.length > 0) {
            return elements.searchInput.val() ? elements.searchInput.val().trim().toLowerCase() : '';
        }
        return '';
    }

    /**
     * Effectue la recherche et le filtrage
     */
    function performSearch() {
        console.log('🎹 Recherche en cours...');

        const searchTerm = getSearchTerm();
        const filters = getActiveFilters();

        console.log('🎹 Terme de recherche:', searchTerm);
        console.log('🎹 Filtres actifs:', filters);

        // Afficher l'indicateur de chargement
        showLoading(true);

        // Filtrer les partitions
        let filteredScores = demoScores.filter(function(score) {
            // Filtre par difficulté
            if (filters.difficulty.length > 0 && !filters.difficulty.includes(score.difficulty)) {
                return false;
            }

            // Filtre par genre
            if (filters.genre.length > 0 && !filters.genre.includes(score.genre)) {
                return false;
            }

            // Filtre par recherche textuelle
            if (searchTerm) {
                const titleMatch = score.title.toLowerCase().includes(searchTerm);
                const composerMatch = score.composer.toLowerCase().includes(searchTerm);
                if (!titleMatch && !composerMatch) {
                    return false;
                }
            }

            return true;
        });

        config.totalScores = filteredScores.length;
        config.currentPage = 1;

        console.log('🎹 Résultats trouvés:', config.totalScores);

        // Simuler un délai de chargement
        setTimeout(function() {
            displayScores(filteredScores);
            updateResultsCounter();
            renderPagination();
            showLoading(false);
        }, 300);
    }

    /**
     * Affiche les partitions
     */
    function displayScores(scores) {
        if (elements.scoresContainer.length === 0) {
            console.error('🎹 Conteneur des partitions non trouvé');
            return;
        }

        elements.scoresContainer.empty();

        if (scores.length === 0) {
            elements.scoresContainer.html('<div class="no-results"><p>Aucune partition trouvée</p></div>');
            return;
        }

        // Pagination
        const startIndex = (config.currentPage - 1) * config.scoresPerPage;
        const endIndex = startIndex + config.scoresPerPage;
        const paginated = scores.slice(startIndex, endIndex);

        // Afficher chaque partition
        paginated.forEach(function(score) {
            const scoreCard = createScoreCard(score);
            elements.scoresContainer.append(scoreCard);
        });

        console.log('🎹 Affichage de', paginated.length, 'partitions');
    }

    /**
     * Crée une carte de partition
     */
    function createScoreCard(score) {
        const difficultyLabels = {
            'debutant': 'Débutant',
            'intermediaire': 'Intermédiaire',
            'avance': 'Avancé'
        };

        const genreLabels = {
            'classique': 'Classique',
            'jazz': 'Jazz',
            'pop': 'Pop'
        };

        return $('<div>', { class: 'score-card' })
            .append(
                $('<div>', { class: 'score-thumbnail' })
                    .append($('<img>', { src: score.thumbnail, alt: score.title }))
            )
            .append(
                $('<div>', { class: 'score-info' })
                    .append($('<h3>', { class: 'score-title', text: score.title }))
                    .append($('<p>', { class: 'score-composer', text: score.composer }))
                    .append(
                        $('<div>', { class: 'score-meta' })
                            .append($('<span>', { class: 'score-difficulty difficulty-' + score.difficulty, text: difficultyLabels[score.difficulty] }))
                            .append($('<span>', { class: 'score-genre', text: genreLabels[score.genre] }))
                    )
            )
            .append(
                $('<div>', { class: 'score-actions' })
                    .append($('<a>', { href: score.pdf_url, class: 'btn btn-view', text: 'Voir la partition', target: '_blank' }))
                    .append($('<a>', { href: score.audio_url, class: 'btn btn-listen', text: 'Écouter', target: '_blank' }))
            );
    }

    /**
     * Affiche/cache l'indicateur de chargement
     */
    function showLoading(show) {
        if (elements.loadingIndicator.length > 0) {
            if (show) {
                elements.loadingIndicator.fadeIn(200);
            } else {
                elements.loadingIndicator.fadeOut(200);
            }
        }
    }

    /**
     * Met à jour le compteur de résultats
     */
    function updateResultsCounter() {
        if (elements.resultsCount.length > 0) {
            elements.resultsCount.text(config.totalScores);
        }

        if (elements.resultsCounter.length > 0) {
            elements.resultsCounter.fadeIn(200);
        }
    }

    /**
     * Génère la pagination
     */
    function renderPagination() {
        if (elements.paginationContainer.length === 0) {
            return;
        }

        elements.paginationContainer.empty();

        const totalPages = Math.ceil(config.totalScores / config.scoresPerPage);

        if (totalPages <= 1) {
            return;
        }

        const paginationWrapper = $('<div>', { class: 'pagination' });

        // Bouton précédent
        if (config.currentPage > 1) {
            paginationWrapper.append(
                $('<button>', { class: 'page-btn prev-btn', text: '← Précédent' })
                    .on('click', function() {
                        config.currentPage--;
                        performSearch();
                        scrollToTop();
                    })
            );
        }

        // Numéros de page
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = $('<button>', {
                class: 'page-btn' + (i === config.currentPage ? ' active' : ''),
                text: i
            }).on('click', function() {
                config.currentPage = i;
                performSearch();
                scrollToTop();
            });

            paginationWrapper.append(pageBtn);
        }

        // Bouton suivant
        if (config.currentPage < totalPages) {
            paginationWrapper.append(
                $('<button>', { class: 'page-btn next-btn', text: 'Suivant →' })
                    .on('click', function() {
                        config.currentPage++;
                        performSearch();
                        scrollToTop();
                    })
            );
        }

        elements.paginationContainer.append(paginationWrapper);
    }

    /**
     * Fait défiler la page vers le haut
     */
    function scrollToTop() {
        $('html, body').animate({
            scrollTop: elements.scoresContainer.offset().top - 100
        }, 400);
    }

    /**
     * Recherche initiale au chargement de la page
     */
    function performInitialSearch() {
        console.log('🎹 Recherche initiale');
        performSearch();
    }

    // === Event Listeners ===

    // Recherche avec délai
    if (elements.searchInput.length > 0) {
        elements.searchInput.on('input', function() {
            clearTimeout(searchTimer);
            searchTimer = setTimeout(performSearch, config.searchDelay);
        });
    }

    // Filtres
    if (elements.filterCheckboxes.length > 0) {
        elements.filterCheckboxes.find('input[type="checkbox"]').on('change', performSearch);
    }

    // Bouton "Effacer les filtres"
    if (elements.clearFiltersBtn.length > 0) {
        elements.clearFiltersBtn.on('click', function() {
            // Décocher toutes les cases
            elements.filterCheckboxes.find('input[type="checkbox"]').prop('checked', false);
            // Vider la recherche
            elements.searchInput.val('');
            // Relancer la recherche
            performSearch();
        });
    }

    // Initialisation
    performInitialSearch();

    console.log('🎹 Listen & Play initialisé avec succès');
});
