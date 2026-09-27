let books = [];
let readers = [];

function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
}

async function loadData() {
    try {
        const [booksRes, readersRes] = await Promise.all([
            fetch('/api/books'),
            fetch('/api/readers')
        ]);

        books = await booksRes.json();
        readers = await readersRes.json();

        populateSelects();
    } catch (error) {
        showNotification('Ошибка загрузки данных', 'error');
    }
}

function populateSelects() {
    const bookSelect = document.getElementById('issueBookId');
    const readerSelect = document.getElementById('issueReaderId');

    bookSelect.innerHTML = '<option value="">Выберите книгу</option>' +
        books.filter(b => b.availableCopies > 0).map(b =>
            `<option value="${b.id}">${b.title} - ${b.author} (Доступно: ${b.availableCopies})</option>`
        ).join('');

    readerSelect.innerHTML = '<option value="">Выберите читателя</option>' +
        readers.map(r =>
            `<option value="${r.id}">${r.firstName} ${r.lastName} (${r.email})</option>`
        ).join('');
}

async function issueBook(event) {
    event.preventDefault();

    const loanData = {
        bookId: parseInt(document.getElementById('issueBookId').value),
        readerId: parseInt(document.getElementById('issueReaderId').value),
        dueDate: document.getElementById('issueDueDate').value
    };

    try {
        const response = await fetch('/api/loans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loanData)
        });

        if (response.ok) {
            showNotification('✅ Книга успешно выдана!', 'success');
            await loadData();
        } else {
            const error = await response.json();
            showNotification(' ' + error.message, 'error');
        }
    } catch (error) {
        showNotification('❌ Ошибка сети', 'error');
    }
}

async function returnBook() {
    const loanId = document.getElementById('returnLoanId').value;
    if (!loanId) {
        showNotification('Введите ID записи', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/loans/${loanId}/return`, {
            method: 'PUT'
        });

        if (response.ok) {
            showNotification('✅ Книга возвращена!', 'success');
        } else {
            const error = await response.json();
            showNotification('❌ ' + error.message, 'error');
        }
    } catch (error) {
        showNotification(' Ошибка сети', 'error');
    }
}

async function loadOverdue() {
    try {
        const response = await fetch('/api/loans/overdue');
        const loans = await response.json();

        const container = document.getElementById('overdueList');
        if (loans.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Нет просроченных книг</p>';
            return;
        }

        container.innerHTML = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Книга</th>
                        <th>Читатель</th>
                        <th>Срок возврата</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${loans.map(loan => `
                        <tr>
                            <td>${loan.id}</td>
                            <td>${loan.book?.title || 'N/A'}</td>
                            <td>${loan.reader?.firstName || 'N/A'} ${loan.reader?.lastName || 'N/A'}</td>
                            <td><span class="badge badge-danger">${loan.dueDate}</span></td>
                            <td>
                                <button onclick="returnBookById(${loan.id})" class="btn btn-success" style="padding: 0.5rem 1rem;">
                                    <i class="fas fa-undo"></i> Вернуть
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        showNotification('Ошибка загрузки', 'error');
    }
}

function returnBookById(loanId) {
    document.getElementById('returnLoanId').value = loanId;
    switchTab('return');
    document.querySelector('.tab:nth-child(2)').classList.add('active');
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadData();

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('issueDueDate').min = today;

    activateNavigation('loans');
});