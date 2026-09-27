// ===========================================
// ОБЩИЕ УТИЛИТЫ
// ===========================================

function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function saveAuthData(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

function showNotification(message, type = 'info') {
    let container = document.querySelector('.notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }

    const icons = {
        error: 'fa-exclamation-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type] || icons.info}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease forwards';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

function checkAuth() {
    const token = getToken();
    const user = getUser();
    if (!token || !user) {
        window.location.href = '/login';
        return null;
    }
    return user;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function shakeForm() {
    const form = document.querySelector('.auth-form');
    if (form) {
        form.classList.remove('shake');
        void form.offsetWidth;
        form.classList.add('shake');
    }
}

// Очистка ошибок при вводе
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.auth-form input');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
        });
    });
});