async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const submitBtn = document.querySelector('.btn-auth');
    const originalContent = submitBtn.innerHTML;

    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Вход...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем данные пользователя
            localStorage.setItem('user', JSON.stringify(data));

            showNotification('✅ Добро пожаловать, ' + data.username + '!', 'success');

            // Перенаправляем на главную через 1.5 секунды
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            showNotification('❌ ' + data.error, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    } catch (error) {
        showNotification('❌ Ошибка сети. Проверьте подключение.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
    }
}