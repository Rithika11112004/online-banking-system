// Global State
let currentUser = null;
let currentAccount = null;

const API_BASE = '/api';

// --- UI Utility Functions ---

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function switchAuthTab(tab) {
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-register').classList.remove('active');
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');

    document.getElementById(`tab-${tab}`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.remove('hidden');
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
        modal.classList.add('hidden');
    });
    // clear inputs
    document.querySelectorAll('.modal-content input').forEach(input => input.value = '');
}

function switchToDashboard() {
    document.getElementById('auth-view').classList.remove('active');
    setTimeout(() => {
        document.getElementById('auth-view').classList.add('hidden');
        document.getElementById('dashboard-view').classList.remove('hidden');
        setTimeout(() => document.getElementById('dashboard-view').classList.add('active'), 50);
    }, 500);

    // Populate Data
    document.getElementById('user-display-name').textContent = currentUser.name.split(' ')[0];
    document.getElementById('account-number').textContent = currentAccount.accountNumber;

    refreshDashboard();
}

function handleLogout() {
    currentUser = null;
    currentAccount = null;

    document.getElementById('dashboard-view').classList.remove('active');
    setTimeout(() => {
        document.getElementById('dashboard-view').classList.add('hidden');
        document.getElementById('auth-view').classList.remove('hidden');
        setTimeout(() => document.getElementById('auth-view').classList.add('active'), 50);
    }, 500);

    // clear inputs
    document.querySelectorAll('input').forEach(input => input.value = '');
    showToast('Logged out successfully');
}


// --- API Integrations ---

async function fetchInternal(url, options = {}) {
    try {
        const response = await fetch(API_BASE + url, options);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || response.statusText);
        }
        return await response.json();
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const phone = document.getElementById('reg-phone').value;
    const password = document.getElementById('reg-pwd').value;

    try {
        // 1. Register User
        const user = await fetchInternal('/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, password })
        });

        // 2. Automatically create bank account
        const account = await fetchInternal(`/accounts?userId=${user.id}`, { method: 'POST' });

        currentUser = user;
        currentAccount = account;

        showToast('Registration successful! Account Created.');
        switchToDashboard();
    } catch (error) {
        console.error("Registration failed:", error);
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pwd').value;

    try {
        // 1. Login
        const user = await fetchInternal('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        // 2. Get User's First Account
        const accounts = await fetchInternal(`/accounts/user/${user.id}`);
        if (accounts.length === 0) {
            throw new Error('No account found for this user.');
        }

        currentUser = user;
        currentAccount = accounts[0];

        showToast('Welcome back!');
        switchToDashboard();
    } catch (error) {
        console.error("Login failed:", error);
    }
}

async function refreshDashboard() {
    if (!currentAccount) return;

    try {
        // Refresh Account Details
        const accountDetails = await fetchInternal(`/accounts/${currentAccount.accountNumber}`);
        currentAccount = accountDetails;

        // Format balance with commas
        const formattedBalance = parseFloat(currentAccount.balance).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        document.getElementById('account-balance').textContent = formattedBalance;

        // Fetch transaction history
        const txHistory = await fetchInternal(`/transactions/${currentAccount.accountNumber}`);
        renderTransactions(txHistory);
    } catch (err) {
        console.error("Failed to refresh:", err);
    }
}

async function handleDeposit(e) {
    e.preventDefault();
    const amount = document.getElementById('deposit-amount').value;
    try {
        await fetchInternal(`/transactions/deposit?accountNumber=${currentAccount.accountNumber}&amount=${amount}`, { method: 'POST' });
        showToast('Deposit successful!');
        hideAllModals();
        refreshDashboard();
    } catch (err) {
        console.error(err);
    }
}

async function handleWithdraw(e) {
    e.preventDefault();
    const amount = document.getElementById('withdraw-amount').value;
    try {
        await fetchInternal(`/transactions/withdraw?accountNumber=${currentAccount.accountNumber}&amount=${amount}`, { method: 'POST' });
        showToast('Withdrawal successful!');
        hideAllModals();
        refreshDashboard();
    } catch (err) {
        console.error(err);
    }
}

async function handleTransfer(e) {
    e.preventDefault();
    const target = document.getElementById('transfer-target').value;
    const amount = document.getElementById('transfer-amount').value;

    if (target === currentAccount.accountNumber) {
        showToast("Cannot transfer to your own account", "error");
        return;
    }

    try {
        await fetchInternal(`/transactions/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fromAccountNumber: currentAccount.accountNumber,
                toAccountNumber: target,
                amount: parseFloat(amount)
            })
        });
        showToast('Transfer complete!');
        document.getElementById('transfer-target').value = '';
        document.getElementById('transfer-amount').value = '';
        refreshDashboard();
    } catch (err) {
        console.error(err);
    }
}

function renderTransactions(transactions) {
    const list = document.getElementById('transaction-list');
    list.innerHTML = '';

    if (transactions.length === 0) {
        list.innerHTML = '<div class="empty-state">No transactions yet.</div>';
        return;
    }

    transactions.forEach(tx => {
        let title = tx.transactionType;
        let isPositive = false;

        if (tx.transactionType === 'DEPOSIT') {
            isPositive = true;
        } else if (tx.transactionType === 'TRANSFER_IN') {
            title = 'Transfer from ' + tx.targetAccountNumber;
            isPositive = true;
        } else if (tx.transactionType === 'TRANSFER_OUT') {
            title = 'Transfer to ' + tx.targetAccountNumber;
        }

        const date = new Date(tx.timestamp).toLocaleString();
        const sign = isPositive ? '+' : '-';
        const colorClass = isPositive ? 'tx-positive' : 'tx-negative';

        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="tx-info">
                <h4>${title}</h4>
                <p>${date}</p>
            </div>
            <div class="tx-amount ${colorClass}">${sign}$${tx.amount.toFixed(2)}</div>
        `;
        list.appendChild(div);
    });
}
