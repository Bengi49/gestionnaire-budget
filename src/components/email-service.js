document.addEventListener('DOMContentLoaded', () => {
    emailjs.init('AwLsdMnSI60Cm1XhA');

    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Récupérer le bouton submit
            const submitButton = this.querySelector('button[type="submit"]');
            if (!submitButton) return;

            try {
                // Désactiver le bouton
                submitButton.disabled = true;

                // Vérifier si reCAPTCHA est chargé
                if (typeof grecaptcha === 'undefined') {
                    throw new Error('reCAPTCHA n\'est pas chargé');
                }

                // Obtenir le token reCAPTCHA
                const token = document.getElementById('recaptcha-token').value;
                if (!token) {
                    throw new Error('Veuillez compléter le reCAPTCHA');
                }

                // Envoyer le formulaire
                const result = await emailjs.sendForm(
                    'service_k67p79l',
                    'template_pqq014m',
                    contactForm
                );

                if (result.status === 200) {
                    showNotification('success', 'Message envoyé avec succès !');
                    contactForm.reset();
                    document.getElementById('check').checked = false;
                }
            } catch (error) {
                console.error('Erreur:', error);
                showNotification('error', error.message || 'Erreur lors de l\'envoi du message');
            } finally {
                // Réactiver le bouton
                submitButton.disabled = false;
            }
        });
    }
});

// Fonction pour afficher les notifications
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const container = document.getElementById('notification-container') 
        || createNotificationContainer();
    
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    document.body.appendChild(container);
    return container;
}