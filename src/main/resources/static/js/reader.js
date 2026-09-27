document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user || user.role !== 'READER') {
        window.location.href = '/login';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) {
            logout();
        }
    });

    // Закрытие информационного модального окна
    document.getElementById('closeInfoModal').addEventListener('click', () => {
        document.getElementById('infoModal').classList.remove('active');
    });

    document.getElementById('infoModal').addEventListener('click', (e) => {
        if (e.target.id === 'infoModal') {
            document.getElementById('infoModal').classList.remove('active');
        }
    });

    if (user.readerId) {
        loadMyBooks(user.readerId);
    } else {
        document.getElementById('booksList').innerHTML =
            '<div class="no-books"><i class="fas fa-info-circle"></i><h3>Профиль читателя не найден</h3></div>';
    }
});

function showInfo(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('infoModalTitle');
    const body = document.getElementById('infoModalBody');

    const infoData = {
        total: {
            icon: 'fa-book',
            color: '#3182ce',
            title: 'Всего книг',
            content: `
                <p>Здесь отображается общее количество книг, которые вы брали в библиотеке за всё время.</p>
                <p>Это включает как активные выдачи, так и уже возвращённые книги.</p>
                <ul>
                    <li>📚 Активные книги — которые вы ещё не вернули</li>
                    <li>✅ Возвращённые — которые вы уже сдали</li>
                </ul>
            `
        },
        active: {
            icon: 'fa-check-circle',
            color: '#38a169',
            title: 'Активные книги',
            content: `
                <p>Это книги, которые вы взяли в библиотеке и ещё не вернули.</p>
                <p>У каждой активной книги есть срок возврата, который нужно соблюдать.</p>
                <ul>
                    <li>📅 Следите за сроком возврата</li>
                    <li>🔄 Верните книгу вовремя, чтобы избежать штрафа</li>
                    <li>📞 Если нужна продление — обратитесь к библиотекарю</li>
                </ul>
            `
        },
        overdue: {
            icon: 'fa-exclamation-triangle',
            color: '#e53e3e',
            title: 'Просроченные книги',
            content: `
                <p>Это книги, срок возврата которых уже прошёл.</p>
                <p>Просроченные книги могут повлечь штраф или ограничение доступа к библиотеке.</p>
                <ul>
                    <li>️ Срочно верните просроченные книги</li>
                    <li>💰 Может быть начислен штраф</li>
                    <li>🚫 Возможно ограничение доступа к новым выдачам</li>
                </ul>
            `
        }
    };

    const data = infoData[type];
    title.textContent = data.title;
    body.innerHTML = `
        <div class="info-content">
            <i class="fas ${data.icon}" style="color: ${data.color}"></i>
            <h4>${data.title}</h4>
            ${data.content}
        </div>
    `;

    modal.classList.add('active');
}

async function loadMyBooks(readerId) {
    const token = getToken();
    const booksList = document.getElementById('booksList');

    try {
        const response = await fetch(`/api/loans/reader/${readerId}`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const loans = await response.json();
        const activeLoans = loans.filter(l => l.status === 'ACTIVE');

        document.getElementById('totalBooks').textContent = loans.length;
        document.getElementById('overdueCount').textContent =
            activeLoans.filter(l => new Date(l.dueDate) < new Date()).length;
        document.getElementById('activeCount').textContent = activeLoans.length;

        if (activeLoans.length === 0) {
            booksList.innerHTML = '<div class="no-books"><i class="fas fa-book-reader"></i><h3>У вас нет активных книг</h3><p>Когда вы возьмёте книги, они появятся здесь</p></div>';
            return;
        }

        booksList.innerHTML = activeLoans.map(loan => {
            const isOverdue = new Date(loan.dueDate) < new Date();
            return `
                <div class="book-card ${isOverdue ? 'overdue' : ''}">
                    <div class="book-header">
                        <div>
                            <h2 class="book-title">${loan.book?.title || 'Неизвестно'}</h2>
                            <p class="book-author"><i class="fas fa-user"></i> ${loan.book?.author || 'Неизвестно'}</p>
                        </div>
                        <span class="book-badge ${isOverdue ? 'badge-overdue' : 'badge-active'}">
                            ${isOverdue ? 'Просрочено' : 'Активно'}
                        </span>
                    </div>
                    <div class="book-details">
                        <div class="detail-item">
                            <i class="fas fa-calendar-plus"></i>
                            <span class="detail-label">Дата выдачи:</span>
                            <span class="detail-value">${formatDate(loan.loanDate)}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar-times"></i>
                            <span class="detail-label">Вернуть до:</span>
                            <span class="detail-value ${isOverdue ? 'overdue' : ''}">${formatDate(loan.dueDate)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Ошибка загрузки книг:', error);
        booksList.innerHTML = '<div class="no-books"><i class="fas fa-exclamation-triangle"></i><h3>Ошибка загрузки</h3><p>Не удалось загрузить данные. Попробуйте позже.</p></div>';
        showNotification('Ошибка загрузки', 'error');
    }
}