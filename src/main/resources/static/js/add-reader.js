async function registerReader(event) {
    event.preventDefault();

    const readerData = {
        firstName: document.getElementById('readerFirstName').value.trim(),
        lastName: document.getElementById('readerLastName').value.trim(),
        email: document.getElementById('readerEmail').value.trim(),
        phone: document.getElementById('readerPhone').value.trim()
    };

    try {
        const response = await fetch('/api/readers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(readerData)
        });

        if (response.ok) {
            showNotification('✅ Читатель успешно зарегистрирован!', 'success');

            setTimeout(() => {
                if (confirm('Читатель зарегистрирован! Зарегистрировать ещё одного?')) {
                    document.querySelector('.reader-form').reset();
                } else {
                    window.location.href = '/readers.html';
                }
            }, 1500);
        } else {
            const error = await response.json();
            showNotification('❌ ' + (error.message || 'Ошибка при регистрации'), 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка сети', 'error');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    activateNavigation('readers');
});