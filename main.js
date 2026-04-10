// Gestion du panier
document.addEventListener('DOMContentLoaded', function() {
    // Mise à jour du nombre d'articles dans le panier
    updateCartCount();
    
    // Gestion des favoris
    const favoriteForms = document.querySelectorAll('.favorite-form');
    favoriteForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Le formulaire est soumis normalement
        });
    });
    
    // Confirmation avant suppression
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
                e.preventDefault();
            }
        });
    });
    
    // Validation des formulaires
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    showError(field, 'Ce champ est requis');
                } else {
                    field.classList.remove('error');
                }
            });
            
            // Validation email
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (field.value && !emailRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    showError(field, 'Email invalide');
                }
            });
            
            // Validation téléphone (pour les paiements)
            const phoneFields = form.querySelectorAll('input[name="phone_number"]');
            phoneFields.forEach(field => {
                const phoneRegex = /^[6][0-9]{8}$/;
                if (field.value && !phoneRegex.test(field.value)) {
                    isValid = false;
                    field.classList.add('error');
                    showError(field, 'Numéro de téléphone invalide (Format: 6XXXXXXXX)');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Gestion des modals
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

function updateCartCount() {
    fetch('/api/cart-count.php')
        .then(response => response.json())
        .then(data => {
            const cartCount = document.querySelector('.cart-count');
            if (cartCount && data.count > 0) {
                cartCount.textContent = data.count;
                cartCount.style.display = 'inline';
            }
        })
        .catch(error => console.error('Error:', error));
}

function showError(field, message) {
    let errorDiv = field.parentElement.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('small');
        errorDiv.className = 'error-message';
        field.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Filtres dynamiques
function applyFilters() {
    const form = document.querySelector('.filters-sidebar form');
    if (form) {
        form.submit();
    }
}

// Recherche en temps réel (optionnelle)
let searchTimeout;
function liveSearch(input) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const form = input.closest('form');
        if (form) {
            form.submit();
        }
    }, 500);
}