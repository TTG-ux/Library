async function searchBooks(event) {
    event.preventDefault();

    const title = document.getElementById('searchTitle').value;
    const author = document.getElementById('searchAuthor').value;
    const isbn = document.getElementById('searchIsbn').value;
    const year = document.getElementById('searchYear').value;
    const available = document.getElementById('searchAvailable').value;

    let url = '/api/books/search?';
    if (title) url += `title=${encodeURIComponent(title)}&`;
    if (author) url += `author=${encodeURIComponent(author)}&`;
    if (isbn) url += `isbn=${encodeURIComponent(isbn)}&`;
    if (year) url += `year=${year}&`;
    if (available) url += `available=${available}&`;

    try {
        const response = await fetch(url);
        const books = await response.json();

        displayResults(books);
    } catch (error) {
        showNotification('Ошибка при поиске книг', 'error');
    }
}

function displayResults(books) {
    const container = document.getElementById('resultsContainer');
    const list = document.getElementById('resultsList');
    const count = document.getElementById('resultsCount');

    container.classList.add('active');
    count.textContent = `${books.length} книг найдено`;

    if (books.length === 0) {
        list.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Книги не найдены</h3>
                <p>Попробуйте изменить параметры поиска</p>
            </div>
        `;
        return;
    }

    list.innerHTML = books.map(book => `
        <div class="book-item">
            <h3>${book.title}</h3>
            <div class="meta">
                <span><i class="fas fa-user"></i> ${book.author}</span>
                <span><i class="fas fa-barcode"></i> ${book.isbn}</span>
                <span><i class="fas fa-calendar"></i> ${book.publicationYear}</span>
                <span class="badge ${book.availableCopies > 0 ? 'badge-success' : 'badge-danger'}">
                    <i class="fas fa-book"></i> Доступно: ${book.availableCopies}/${book.totalCopies}
                </span>
            </div>
        </div>
    `).join('');
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    activateNavigation('books');
});