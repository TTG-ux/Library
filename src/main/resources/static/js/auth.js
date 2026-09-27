// ===========================================
// ЛОГИКА АВТОРИЗАЦИИ
// ===========================================

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.querySelector('.btn-auth');
    const originalContent = submitBtn.innerHTML;

    if (!username) {
        showNotification('Введите логин', 'warning');
        shakeForm();
        return;
    }

    if (!password) {
        showNotification('Введите пароль', 'warning');
        shakeForm();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            saveAuthData(data);
            showNotification(`Добро пожаловать, ${data.username}!`, 'success');

            setTimeout(() => {
                window.location.href = data.role === 'ADMIN' ? '/admin' : '/reader';
            }, 1000);
        } else {
            showNotification(data.message || 'Неверный логин или пароль', 'error');
            shakeForm();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    } catch (error) {
        showNotification('Ошибка сети', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;
    const submitBtn = document.querySelector('.btn-auth');
    const originalContent = submitBtn.innerHTML;

    if (username.length < 3) {
        showNotification('Логин должен содержать минимум 3 символа', 'warning');
        shakeForm();
        return;
    }

    if (password.length < 6) {
        showNotification('Пароль должен содержать минимум 6 символов', 'warning');
        shakeForm();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Регистрация успешна! Перенаправление...', 'success');
            setTimeout(() => window.location.href = '/login', 1500);
        } else {
            showNotification(data.message || 'Ошибка регистрации', 'error');
            shakeForm();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    } catch (error) {
        showNotification('Ошибка сети', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
    }
}