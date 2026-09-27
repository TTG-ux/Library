async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    const submitBtn = document.querySelector('.btn-auth');
    const originalContent = submitBtn.innerHTML;

    // Показываем загрузку
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Регистрация...';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, role })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('✅ Регистрация успешна! Теперь войдите.', 'success');

            // Очищаем форму
            document.querySelector('.auth-form').reset();

            // Перенаправляем на страницу входа через 2 секунды
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
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