document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user || user.role !== 'ADMIN') {
        window.location.href = '/login';
        return;
    }

    document.getElementById('adminName').textContent = user.username;
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) logout();
    });

    // Переключение вкладок
    document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = link.dataset.tab;
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById('tab-' + tab).classList.add('active');

            // Закрыть все модалки при переключении
            closeAllModals();
        });
    });

    // Модальное окно: Добавить книгу
    const bookModal = document.getElementById('bookModal');
    document.getElementById('openBookModal').addEventListener('click', () => {
        bookModal.classList.add('active');
    });
    document.getElementById('closeBookModal').addEventListener('click', () => {
        bookModal.classList.remove('active');
        resetBookForm();
    });
    document.getElementById('cancelBookModal').addEventListener('click', () => {
        bookModal.classList.remove('active');
        resetBookForm();
    });
    document.getElementById('submitBookModal').addEventListener('click', submitBook);

    // Предпросмотр книги
    ['bookTitle', 'bookAuthor', 'bookIsbn', 'bookYear', 'bookCopies'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateBookPreview);
    });

    // Модальное окно: Добавить читателя
    const readerModal = document.getElementById('readerModal');
    document.getElementById('openReaderModal').addEventListener('click', () => {
        readerModal.classList.add('active');
    });
    document.getElementById('closeReaderModal').addEventListener('click', () => {
        readerModal.classList.remove('active');
        resetReaderForm();
    });
    document.getElementById('cancelReaderModal').addEventListener('click', () => {
        readerModal.classList.remove('active');
        resetReaderForm();
    });
    document.getElementById('submitReaderModal').addEventListener('click', submitReader);

    // Предпросмотр читателя
    ['readerFirstName', 'readerLastName', 'readerEmail', 'readerPhone'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateReaderPreview);
    });

    // Модальное окно: Выдать книгу
    const loanModal = document.getElementById('loanModal');
    document.getElementById('openLoanModal').addEventListener('click', async () => {
        await loadBooksAndReaders();
        loanModal.classList.add('active');
    });
    document.getElementById('closeLoanModal').addEventListener('click', () => {
        loanModal.classList.remove('active');
        resetLoanForm();
    });
    document.getElementById('cancelLoanModal').addEventListener('click', () => {
        loanModal.classList.remove('active');
        resetLoanForm();
    });
    document.getElementById('submitLoanModal').addEventListener('click', submitLoan);

    // Предпросмотр выдачи
    ['loanBook', 'loanReader', 'loanDueDate'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateLoanPreview);
    });

    // Закрытие модалок по клику на overlay
    [bookModal, readerModal, loanModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                resetAllForms();
            }
        });
    });

    loadAdminData();
});

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    resetAllForms();
}

function resetAllForms() {
    resetBookForm();
    resetReaderForm();
    resetLoanForm();
}

function resetBookForm() {
    document.getElementById('bookForm').reset();
    document.getElementById('previewTitle').textContent = 'Название книги';
    document.getElementById('previewAuthor').textContent = 'Автор';
    document.getElementById('previewDetails').textContent = 'ISBN: • Год: • Экз.: ';
}

function resetReaderForm() {
    document.getElementById('readerForm').reset();
    document.getElementById('previewReaderName').textContent = 'Имя Фамилия';
    document.getElementById('previewReaderEmail').textContent = 'email@example.com';
    document.getElementById('previewReaderPhone').textContent = '+7 (000) 000-00-00';
}

function resetLoanForm() {
    document.getElementById('loanForm').reset();
    document.getElementById('previewLoanBook').textContent = 'Книга';
    document.getElementById('previewLoanReader').textContent = 'Читатель';
    document.getElementById('previewLoanDate').textContent = 'Срок: --';
}

function updateBookPreview() {
    const title = document.getElementById('bookTitle').value || 'Название книги';
    const author = document.getElementById('bookAuthor').value || 'Автор';
    const isbn = document.getElementById('bookIsbn').value || '';
    const year = document.getElementById('bookYear').value || '';
    const copies = document.getElementById('bookCopies').value || '';

    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewAuthor').textContent = author;
    document.getElementById('previewDetails').textContent = `ISBN: ${isbn} • Год: ${year} • Экз.: ${copies}`;
}

function updateReaderPreview() {
    const firstName = document.getElementById('readerFirstName').value || 'Имя';
    const lastName = document.getElementById('readerLastName').value || 'Фамилия';
    const email = document.getElementById('readerEmail').value || 'email@example.com';
    const phone = document.getElementById('readerPhone').value || '+7 (000) 000-00-00';

    document.getElementById('previewReaderName').textContent = `${firstName} ${lastName}`;
    document.getElementById('previewReaderEmail').textContent = email;
    document.getElementById('previewReaderPhone').textContent = phone;
}

function updateLoanPreview() {
    const bookSelect = document.getElementById('loanBook');
    const readerSelect = document.getElementById('loanReader');
    const dueDate = document.getElementById('loanDueDate').value;

    const bookName = bookSelect.options[bookSelect.selectedIndex]?.text || 'Книга';
    const readerName = readerSelect.options[readerSelect.selectedIndex]?.text || 'Читатель';

    document.getElementById('previewLoanBook').textContent = bookName;
    document.getElementById('previewLoanReader').textContent = readerName;
    document.getElementById('previewLoanDate').textContent = dueDate ? `Срок: ${formatDate(dueDate)}` : 'Срок: --';
}

async function loadBooksAndReaders() {
    const token = getToken();
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
        const [booksRes, readersRes] = await Promise.all([
            fetch('/api/books', { headers }),
            fetch('/api/readers', { headers })
        ]);

        const books = await booksRes.json();
        const readers = await readersRes.json();

        const bookSelect = document.getElementById('loanBook');
        const readerSelect = document.getElementById('loanReader');

        bookSelect.innerHTML = '<option value="">Выберите книгу</option>';
        readerSelect.innerHTML = '<option value="">Выберите читателя</option>';

        books.filter(b => b.availableCopies > 0).forEach(book => {
            bookSelect.innerHTML += `<option value="${book.id}">${book.title} (${book.availableCopies} экз.)</option>`;
        });

        readers.forEach(reader => {
            readerSelect.innerHTML += `<option value="${reader.id}">${reader.firstName} ${reader.lastName}</option>`;
        });
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}

async function submitBook() {
    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const isbn = document.getElementById('bookIsbn').value.trim();
    const year = parseInt(document.getElementById('bookYear').value);
    const copies = parseInt(document.getElementById('bookCopies').value);

    if (!title || !author || !isbn || !year || !copies) {
        showNotification('Заполните все поля', 'warning');
        return;
    }

    const token = getToken();
    try {
        const response = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                title, author, isbn,
                publicationYear: year,
                totalCopies: copies,
                availableCopies: copies
            })
        });

        if (response.ok) {
            showNotification('Книга добавлена', 'success');
            document.getElementById('bookModal').classList.remove('active');
            resetBookForm();
            loadAdminData();
        } else {
            showNotification('Ошибка добавления книги', 'error');
        }
    } catch (error) {
        showNotification('Ошибка сети', 'error');
    }
}

async function submitReader() {
    const firstName = document.getElementById('readerFirstName').value.trim();
    const lastName = document.getElementById('readerLastName').value.trim();
    const email = document.getElementById('readerEmail').value.trim();
    const phone = document.getElementById('readerPhone').value.trim();

    if (!firstName || !lastName || !email || !phone) {
        showNotification('Заполните все поля', 'warning');
        return;
    }

    const token = getToken();
    try {
        const response = await fetch('/api/readers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ firstName, lastName, email, phone })
        });

        if (response.ok) {
            showNotification('Читатель добавлен', 'success');
            document.getElementById('readerModal').classList.remove('active');
            resetReaderForm();
            loadAdminData();
        } else {
            showNotification('Ошибка добавления читателя', 'error');
        }
    } catch (error) {
        showNotification('Ошибка сети', 'error');
    }
}

async function submitLoan() {
    const bookId = parseInt(document.getElementById('loanBook').value);
    const readerId = parseInt(document.getElementById('loanReader').value);
    const dueDate = document.getElementById('loanDueDate').value;

    if (!bookId || !readerId || !dueDate) {
        showNotification('Заполните все поля', 'warning');
        return;
    }

    const token = getToken();
    try {
        const response = await fetch('/api/loans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ bookId, readerId, dueDate })
        });

        if (response.ok) {
            showNotification('Книга выдана', 'success');
            document.getElementById('loanModal').classList.remove('active');
            resetLoanForm();
            loadAdminData();
        } else {
            showNotification('Ошибка выдачи книги', 'error');
        }
    } catch (error) {
        showNotification('Ошибка сети', 'error');
    }
}

async function loadAdminData() {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    const headers = { 'Authorization': 'Bearer ' + token };

    try {
        let books = [], readers = [], loans = [], overdue = [];

        try {
            const res = await fetch('/api/books', { headers });
            if (res.ok) books = await res.json();
        } catch (e) { console.error('Books error:', e); }

        try {
            const res = await fetch('/api/readers', { headers });
            if (res.ok) readers = await res.json();
        } catch (e) { console.error('Readers error:', e); }

        try {
            const res = await fetch('/api/loans', { headers });
            if (res.ok) loans = await res.json();
        } catch (e) { console.error('Loans error:', e); }

        try {
            const res = await fetch('/api/loans/overdue', { headers });
            if (res.ok) overdue = await res.json();
        } catch (e) { console.error('Overdue error:', e); }

        document.getElementById('statBooks').textContent = books.length;
        document.getElementById('statReaders').textContent = readers.length;
        document.getElementById('statLoans').textContent = loans.filter(l => l.status === 'ACTIVE').length;
        document.getElementById('statOverdue').textContent = overdue.length;

        renderBooks(books);
        renderReaders(readers);
        renderLoans(loans);
    } catch (error) {
        showNotification('Ошибка загрузки данных', 'error');
    }
}

function renderBooks(books) {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.publicationYear}</td>
            <td>${book.availableCopies}/${book.totalCopies}</td>
            <td>
                <button class="btn-icon btn-danger" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function renderReaders(readers) {
    const tbody = document.getElementById('readersTableBody');
    tbody.innerHTML = readers.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.firstName}</td>
            <td>${r.lastName}</td>
            <td>${r.email}</td>
            <td>${r.phone}</td>
            <td>${formatDate(r.registrationDate)}</td>
        </tr>
    `).join('');
}

function renderLoans(loans) {
    const tbody = document.getElementById('loansTableBody');
    tbody.innerHTML = loans.map(loan => `
        <tr>
            <td>${loan.id}</td>
            <td>${loan.book?.title || 'N/A'}</td>
            <td>${loan.reader?.firstName || 'N/A'} ${loan.reader?.lastName || 'N/A'}</td>
            <td>${formatDate(loan.loanDate)}</td>
            <td>${formatDate(loan.dueDate)}</td>
            <td><span class="badge badge-${loan.status === 'ACTIVE' ? 'warning' : 'success'}">${loan.status}</span></td>
            <td>
                ${loan.status === 'ACTIVE' ? `
                    <button class="btn-icon btn-success" onclick="returnBook(${loan.id})">
                        <i class="fas fa-undo"></i>
                    </button>
                ` : '-'}
            </td>
        </tr>
    `).join('');
}

async function deleteBook(id) {
    if (!confirm('Удалить книгу?')) return;
    const token = getToken();
    await fetch(`/api/books/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token } });
    loadAdminData();
    showNotification('Книга удалена', 'success');
}

async function returnBook(id) {
    const token = getToken();
    await fetch(`/api/loans/${id}/return`, { method: 'PUT', headers: { 'Authorization': 'Bearer ' + token } });
    loadAdminData();
    showNotification('Книга возвращена', 'success');
}