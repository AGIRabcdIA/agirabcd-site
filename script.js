// Fonction pour changer de thème
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode clair';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i> Mode sombre';
    }
}

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM chargé, initialisation du script...");
    
    // Initialiser le bouton de changement de thème
    initThemeToggle();
    
    // Initialiser la mise en surbrillance du code si hljs est disponible
    if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
        addCopyButtons();
    }

    // Initialiser la recherche
    initSearch();

    // Initialiser les filtres si on est sur la page d'exemples
    if (document.querySelector('.filter-container')) {
        initFilters();
    }
});

// Fonction d'initialisation du bouton de changement de thème
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        console.log("Bouton de thème trouvé, initialisation...");
        
        // Vérifier les préférences enregistrées ou les préférences du système
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // Appliquer le thème
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Mode clair';
        }
        
        // Ajouter l'attribut onclick directement au bouton s'il n'existe pas déjà
        if (!themeToggle.hasAttribute('onclick')) {
            console.log("Ajout de l'attribut onclick au bouton");
            themeToggle.setAttribute('onclick', 'toggleTheme()');
        }
    } else {
        console.error("Bouton de changement de thème non trouvé!");
    }
}

// Ajouter des boutons de copie aux blocs de code
function addCopyButtons() {
    // Get all the pre elements
    const preElements = document.querySelectorAll('pre');
    
    preElements.forEach(pre => {
        // Create header div
        const header = document.createElement('div');
        header.className = 'code-header';
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copier';
        
        // Add click event to copy button
        copyButton.addEventListener('click', () => {
            const code = pre.querySelector('code').innerText;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copié!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copier';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                copyButton.innerHTML = '<i class="fas fa-times"></i> Erreur!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="fas fa-copy"></i> Copier';
                }, 2000);
            });
        });
        
        // Add button to header
        header.appendChild(copyButton);
        
        // Insert header before pre
        pre.parentNode.insertBefore(header, pre);
    });
}

// Fonctionnalité de recherche
function initSearch() {
    const searchForm = document.querySelector('form.d-flex');
    const searchInput = document.querySelector('input[type="search"]');
    
    if (searchForm && searchInput) {
        // Create search results container
        const searchResults = document.createElement('div');
        searchResults.className = 'search-results';
        searchForm.appendChild(searchResults);
        
        // Handle search input
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 3) {
                searchResults.style.display = 'none';
                return;
            }
            
            // In a real implementation, this would search through actual content
            // For now, we'll just show some dummy results
            const dummyResults = [
                { title: 'Méthodologie de création de prompts', url: 'methodologie.html' },
                { title: 'Aide aux devoirs - Exemples', url: 'domaines/decrochage.html#aide-devoirs' },
                { title: 'Apprentissage du français - Prompts', url: 'domaines/integration.html#apprentissage-francais' }
            ].filter(item => item.title.toLowerCase().includes(query));
            
            if (dummyResults.length > 0) {
                searchResults.innerHTML = '';
                dummyResults.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.textContent = result.title;
                    resultItem.addEventListener('click', () => {
                        window.location.href = result.url;
                    });
                    searchResults.appendChild(resultItem);
                });
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-result-item">Aucun résultat trouvé</div>';
                searchResults.style.display = 'block';
            }
        }, 300));
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
        
        // Prevent form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length >= 3) {
                // In a real implementation, this would redirect to a search results page
                alert('Recherche pour: ' + query);
            }
        });
    }
}

// Fonctionnalité de filtrage pour la page d'exemples
function initFilters() {
    const filterInputs = document.querySelectorAll('.filter-container input[type="checkbox"]');
    const promptExamples = document.querySelectorAll('.prompt-example');
    const resetButton = document.getElementById('reset-filters');
    const noResultsMessage = document.getElementById('no-results-message');
    
    if (filterInputs.length > 0 && promptExamples.length > 0) {
        console.log("Initialisation des filtres...");
        
        // Add event listeners to checkboxes
        filterInputs.forEach(input => {
            input.addEventListener('change', updateFilters);
        });
        
        // Add event listener to reset button
        if (resetButton) {
            resetButton.addEventListener('click', resetFilters);
        }
        
        // Function to reset all filters
        function resetFilters() {
            filterInputs.forEach(input => {
                input.checked = false;
            });
            updateFilters();
        }
        
        // Function to update filters and display
        function updateFilters() {
            const activeFilters = {
                domains: [],
                audiences: [],
                objectives: []
            };
            
            // Collect active filters
            filterInputs.forEach(input => {
                if (input.checked) {
                    const filterType = input.getAttribute('data-filter-type');
                    const filterValue = input.value;
                    
                    if (activeFilters[filterType]) {
                        activeFilters[filterType].push(filterValue);
                    }
                }
            });
            
            // Check if any filters are active
            const hasActiveFilters = Object.values(activeFilters).some(arr => arr.length > 0);
            
            // If no filters are active, show all examples
            if (!hasActiveFilters) {
                promptExamples.forEach(example => {
                    example.style.display = 'block';
                });
                if (noResultsMessage) {
                    noResultsMessage.style.display = 'none';
                }
                return;
            }
            
            // Apply filters
            let visibleCount = 0;
            
            promptExamples.forEach(example => {
                let shouldShow = true;
                
                // Check domain filter
                if (activeFilters.domains.length > 0) {
                    const exampleDomain = example.getAttribute('data-domain');
                    if (!activeFilters.domains.includes(exampleDomain)) {
                        shouldShow = false;
                    }
                }
                
                // Check audience filter
                if (shouldShow && activeFilters.audiences.length > 0) {
                    const exampleAudience = example.getAttribute('data-audience');
                    if (!activeFilters.audiences.includes(exampleAudience)) {
                        shouldShow = false;
                    }
                }
                
                // Check objective filter
                if (shouldShow && activeFilters.objectives.length > 0) {
                    const exampleObjective = example.getAttribute('data-objective');
                    if (!activeFilters.objectives.includes(exampleObjective)) {
                        shouldShow = false;
                    }
                }
                
                // Show or hide example
                example.style.display = shouldShow ? 'block' : 'none';
                
                if (shouldShow) {
                    visibleCount++;
                }
            });
            
            // Show message if no results
            if (noResultsMessage) {
                noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Ajouter un message de débogage pour confirmer que le script est chargé
console.log("Script chargé avec succès!");

