// ===========================================
// ДАШБОРД - АНАЛИТИКА И ГРАФИКИ
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user || user.role !== 'ADMIN') {
        window.location.href = '/login';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Вы уверены, что хотите выйти?')) {
            logout();
        }
    });

    document.getElementById('refreshBtn').addEventListener('click', loadDashboardData);
    document.getElementById('chartPeriod').addEventListener('change', loadDashboardData);

    loadDashboardData();
});

let loansChart, booksChart, readersChart, statusChart;

async function loadDashboardData() {
    const token = getToken();
    if (!token) {
        window.location.href = '/login';
        return;
    }

    const headers = { 'Authorization': 'Bearer ' + token };
    const period = document.getElementById('chartPeriod').value;

    try {
        // Загрузка статистики
        const statsRes = await fetch('/api/statistics', { headers });
        const stats = await statsRes.json();

        updateKPIs(stats);

        // Загрузка данных для графиков
        const [booksRes, readersRes, loansRes] = await Promise.all([
            fetch('/api/books', { headers }),
            fetch('/api/readers', { headers }),
            fetch('/api/loans', { headers })
        ]);

        const books = await booksRes.json();
        const readers = await readersRes.json();
        const loans = await loansRes.json();

        updateCharts(books, readers, loans, period);
        updateRecentOperations(loans);

    } catch (error) {
        console.error('Ошибка загрузки дашборда:', error);
        showNotification('Ошибка загрузки данных', 'error');
    }
}

function updateKPIs(stats) {
    document.getElementById('kpiTotalBooks').textContent = stats.totalBooks || 0;
    document.getElementById('kpiTotalReaders').textContent = stats.totalReaders || 0;
    document.getElementById('kpiActiveLoans').textContent = stats.activeLoans || 0;
    document.getElementById('kpiOverdue').textContent = stats.overdueLoans || 0;

    // Имитация трендов (в реальном приложении - из API)
    document.getElementById('kpiBooksTrend').textContent = '+12%';
    document.getElementById('kpiReadersTrend').textContent = '+8%';
    document.getElementById('kpiLoansTrend').textContent = '0%';
    document.getElementById('kpiOverdueTrend').textContent = '-5%';
}

function updateCharts(books, readers, loans, period) {
    updateLoansChart(loans, period);
    updateBooksChart(books);
    updateReadersChart(readers);
    updateStatusChart(loans);
}

function updateLoansChart(loans, period) {
    const ctx = document.getElementById('loansChart').getContext('2d');
    const days = parseInt(period);
    const labels = [];
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }));

        const dayLoans = loans.filter(l => {
            const loanDate = new Date(l.loanDate);
            return loanDate.toDateString() === date.toDateString();
        }).length;

        data.push(dayLoans);
    }

    if (loansChart) loansChart.destroy();

    loansChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Выдачи',
                data: data,
                backgroundColor: 'rgba(49, 130, 206, 0.8)',
                borderColor: '#3182ce',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

function updateBooksChart(books) {
    const ctx = document.getElementById('booksChart').getContext('2d');

    const authors = {};
    books.forEach(book => {
        authors[book.author] = (authors[book.author] || 0) + 1;
    });

    const topAuthors = Object.entries(authors)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (booksChart) booksChart.destroy();

    booksChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: topAuthors.map(a => a[0]),
            datasets: [{
                data: topAuthors.map(a => a[1]),
                backgroundColor: [
                    '#3182ce',
                    '#38a169',
                    '#d69e2e',
                    '#e53e3e',
                    '#805ad5'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateReadersChart(readers) {
    const ctx = document.getElementById('readersChart').getContext('2d');
    const labels = [];
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('ru-RU', { weekday: 'short' }));

        const dayReaders = readers.filter(r => {
            const regDate = new Date(r.registrationDate);
            return regDate.toDateString() === date.toDateString();
        }).length;

        data.push(dayReaders);
    }

    if (readersChart) readersChart.destroy();

    readersChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Новые читатели',
                data: data,
                borderColor: '#38a169',
                backgroundColor: 'rgba(56, 161, 105, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateStatusChart(loans) {
    const ctx = document.getElementById('statusChart').getContext('2d');

    const active = loans.filter(l => l.status === 'ACTIVE').length;
    const returned = loans.filter(l => l.status === 'RETURNED').length;
    const overdue = loans.filter(l => {
        return l.status === 'ACTIVE' && new Date(l.dueDate) < new Date();
    }).length;

    if (statusChart) statusChart.destroy();

    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Активные', 'Возвращённые', 'Просроченные'],
            datasets: [{
                data: [active, returned, overdue],
                backgroundColor: ['#38a169', '#3182ce', '#e53e3e']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateRecentOperations(loans) {
    const container = document.getElementById('operationsList');
    const recentLoans = loans.slice(-10).reverse();

    if (recentLoans.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Нет операций</h3>
                <p>Операции появятся здесь после выдачи книг</p>
            </div>
        `;
        return;
    }

    container.innerHTML = recentLoans.map(loan => {
        const isOverdue = loan.status === 'ACTIVE' && new Date(loan.dueDate) < new Date();
        const type = loan.status === 'RETURNED' ? 'return' : (isOverdue ? 'overdue' : 'loan');
        const icon = type === 'return' ? 'fa-undo' : (isOverdue ? 'fa-exclamation-triangle' : 'fa-hand-holding');

        return `
            <div class="operation-item ${type}">
                <div class="operation-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="operation-content">
                    <h4>${loan.book?.title || 'Неизвестно'}</h4>
                    <p>${loan.reader?.firstName || ''} ${loan.reader?.lastName || ''} • ${formatDate(loan.loanDate)}</p>
                </div>
                <div class="operation-time">
                    ${formatDate(loan.dueDate)}
                </div>
            </div>
        `;
    }).join('');
}