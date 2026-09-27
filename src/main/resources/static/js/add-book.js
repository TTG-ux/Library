// Обновление превью
function updatePreview() {
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const isbn = document.getElementById('bookIsbn').value;
    const year = document.getElementById('bookYear').value;
    const total = document.getElementById('bookTotal').value;
    const available = document.getElementById('bookAvailable').value;

    updatePreviewItem('previewTitle', title);
    updatePreviewItem('previewAuthor', author);
    updatePreviewItem('previewIsbn', isbn);
    updatePreviewItem('previewYear', year);
    updatePreviewItem('previewTotal', total);
    updatePreviewItem('previewAvailable', available);
}

function updatePreviewItem(id, value) {
    const element = document.getElementById(id);
    if (value && value.trim() !== '') {
        element.textContent = value;
        element.classList.remove('empty');
    } else {
        element.textContent = 'Не указано';
        element.classList.add('empty');
    }
}

// Счётчик символов
function updateCharCounter(input, max) {
    const counter = document.getElementById('titleCounter');
    const length = input.value.length;
    counter.textContent = `${length} / ${max}`;

    counter.classList.remove('warning', 'danger');
    if (length > max * 0.9) {
        counter.classList.add('danger');
    } else if (length > max * 0.75) {
        counter.classList.add('warning');
    }
}

// Валидация ISBN
function validateIsbn(input) {
    const value = input.value.replace(/\D/g, '');
    input.value = value;

    if (value.length > 0 && value.length !== 10 && value.length !== 13) {
        input.style.borderColor = '#e74c3c';
    } else {
        input.style.borderColor = '#27ae60';
    }
}

// Обновление доступных экземпляров
function updateAvailableCopies() {
    const total = document.getElementById('bookTotal').value;
    const available = document.getElementById('bookAvailable');
    if (!available.value || parseInt(available.value) > parseInt(total)) {
        available.value = total;
    }
}

// Сброс формы
function resetForm() {
    if (confirm('Вы уверены, что хотите сбросить все поля?')) {
        document.getElementById('addBookForm').reset();
        document.getElementById('bookAvailable').value = '1';
        updatePreview();
        showNotification('Форма сброшена', 'success');
    }
}

// Сохранение книги
async function saveBook(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const originalContent = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Сохранение...';

    const bookData = {
        title: document.getElementById('bookTitle').value.trim(),
        author: document.getElementById('bookAuthor').value.trim(),
        isbn: document.getElementById('bookIsbn').value.trim(),
        publicationYear: parseInt(document.getElementById('bookYear').value),
        totalCopies: parseInt(document.getElementById('bookTotal').value),
        availableCopies: parseInt(document.getElementById('bookAvailable').value) || parseInt(document.getElementById('bookTotal').value)
    };

    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            showNotification('✅ Книга успешно добавлена!', 'success');

            setTimeout(() => {
                if (confirm('Книга добавлена! Добавить ещё одну книгу?')) {
                    document.getElementById('addBookForm').reset();
                    document.getElementById('bookAvailable').value = '1';
                    updatePreview();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.location.href = '/books.html';
                }
            }, 1500);
        } else {
            const error = await response.json();
            showNotification('❌ ' + (error.message || 'Ошибка при сохранении'), 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка сети. Проверьте подключение.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalContent;
    }
}

// Инициализация навигации
document.addEventListener('DOMContentLoaded', function() {
    activateNavigation('books');
});