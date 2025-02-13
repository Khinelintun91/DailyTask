
      // Global variables
let customers = [];
const form = document.getElementById('customer-form');
let editingIndex = -1;

// Save data to localStorage
function saveData() {
    try {
        localStorage.setItem('customers', JSON.stringify(customers));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Load data from localStorage
function loadData() {
    try {
        const saved = localStorage.getItem('customers');
        if (saved) {
            customers = JSON.parse(saved);
            updateTables();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        customers = [];
    }
}

// Show/hide pages
function showPage(pageId) {
    try {
        const pages = ['form-page', 'overdue-page', 'monthly-report'];
        pages.forEach(page => {
            document.getElementById(page).classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
        updateTables();
    } catch (error) {
        console.error('Error showing page:', error);
    }
}

// Format date to Myanmar locale
function formatDate(dateString) {
    try {
        return new Date(dateString).toLocaleString('my-MM');
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

// Search customers
function searchCustomers() {
    try {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filteredCustomers = customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm)
        );
        updateTablesWithData(filteredCustomers);
    } catch (error) {
        console.error('Error searching customers:', error);
    }
}

// Update customer count
function updateCustomerCount() {
    try {
        document.getElementById('totalCustomers').textContent = customers.length;
    } catch (error) {
        console.error('Error updating customer count:', error);
    }
}

// Update tables with filtered data
function updateTablesWithData(data) {
    try {
        // Update main customer table
        const tableBody = document.querySelector('#customers-table tbody');
        tableBody.innerHTML = '';
        
        data.forEach((customer, index) => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.phone}</td>
                <td>${formatDate(customer.pickupDate)}</td>
                <td>${formatDate(customer.returnDate)}</td>
                <td>${customer.quantity}</td>
                <td>${customer.totalAmount}</td>
                <td>
                    <button class="edit-btn" onclick="editCustomer(${index})">ပြင်ဆင်ရန်</button>
                    <button class="delete-btn" onclick="deleteCustomer(${index})">ဖျက်ရန်</button>
                </td>
            `;
        });

        // Update overdue table
        const overdueBody = document.querySelector('#overdue-table tbody');
        overdueBody.innerHTML = '';
        
        const now = new Date();
        data.forEach(customer => {
            const returnDate = new Date(customer.returnDate);
            if (returnDate < now) {
                const days = Math.floor((now - returnDate) / (1000 * 60 * 60 * 24));
                const row = overdueBody.insertRow();
                row.innerHTML = `
                    <td>${customer.name}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.quantity}</td>
                    <td>${formatDate(customer.returnDate)}</td>
                    <td>${days} ရက်</td>
                `;
            }
        });

        // Update monthly report
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyData = data.filter(customer => {
            const customerDate = new Date(customer.pickupDate);
            return customerDate.getMonth() === currentMonth && 
                   customerDate.getFullYear() === currentYear;
        });

        const totalQuantity = monthlyData.reduce((sum, customer) => 
            sum + Number(customer.quantity), 0
        );
        const totalAmount = monthlyData.reduce((sum, customer) => 
            sum + Number(customer.totalAmount), 0
        );

        document.getElementById('total-monthly-quantity').textContent = totalQuantity;
        document.getElementById('total-monthly-amount').textContent = totalAmount.toLocaleString();

        // Update total customer count
        updateCustomerCount();
    } catch (error) {
        console.error('Error updating tables:', error);
    }
}

// Update all tables
function updateTables() {
    try {
        updateTablesWithData(customers);
    } catch (error) {
        console.error('Error in updateTables:', error);
    }
}

// Edit customer
function editCustomer(index) {
    try {
        const customer = customers[index];
        document.getElementById('name').value = customer.name;
        document.getElementById('address').value = customer.address;
        document.getElementById('phone').value = customer.phone;
        document.getElementById('pickup-date').value = customer.pickupDate;
        document.getElementById('return-date').value = customer.returnDate;
        document.getElementById('quantity').value = customer.quantity;
        document.getElementById('total-amount').value = customer.totalAmount;
        editingIndex = index;
    } catch (error) {
        console.error('Error editing customer:', error);
    }
}

// Delete customer
function deleteCustomer(index) {
    try {
        if (confirm('ဤစာရင်းကို ဖျက်မှာသေချာပါသလား?')) {
            customers.splice(index, 1);
            saveData();
            updateTables();
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
    }
}

// Form submit handler
form.addEventListener('submit', (e) => {
    try {
        e.preventDefault();
        
        const customerData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            pickupDate: document.getElementById('pickup-date').value,
            returnDate: document.getElementById('return-date').value,
            quantity: document.getElementById('quantity').value,
            totalAmount: document.getElementById('total-amount').value
        };

        if (editingIndex === -1) {
            customers.push(customerData);
        } else {
            customers[editingIndex] = customerData;
            editingIndex = -1;
        }

        saveData();
        updateTables();
        form.reset();
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

// Initialize data when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        loadData();
        updateCustomerCount();
    } catch (error) {
        console.error('Error initializing data:', error);
    }
});
