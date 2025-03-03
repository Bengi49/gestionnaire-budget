import validator from 'validator';

document.addEventListener('DOMContentLoaded', () => {
    const earningsContainer = document.querySelector('#earnings-infos');
    const expensesContainer = document.querySelector('#expenses-infos');
    const addEarningButton = document.querySelector('#add-earning');
    const addExpenseButton = document.querySelector('#add-expense');
    const earningsTotalInput = document.querySelector('#earnings-total');
    const expensesTotalInput = document.querySelector('#expenses-total');
    const balanceInput = document.querySelector('#balance');
    const downloadPdfButton = document.querySelector('#download-pdf');
    const downloadCsvButton = document.querySelector('#download-csv');

    // Calcul des revenus et des dépenses
    const calculateTotalEarnings = () => {
        let totalEarnings = 0;
        const earningsInputs = document.querySelectorAll('#earnings-infos .add-new-item input[type="text"]');

        earningsInputs.forEach(input => {
            const value = parseFloat(input.value.replace(',', '.')) || 0;
            totalEarnings += value;
        });
        
        earningsTotalInput.value = totalEarnings.toFixed(2);
        updateBalance();
    };

    const calculateTotalExpenses = () => {
        let totalExpenses = 0;
        const expensesInputs = document.querySelectorAll('#expenses-infos .add-new-item input[type="text"]');

        expensesInputs.forEach(input => {
            const value = parseFloat(input.value.replace(',', '.')) || 0;
            totalExpenses += value;
        });
        
        expensesTotalInput.value = totalExpenses.toFixed(2);
        updateBalance();
    };

    const updateBalance = () => {
        const earningsTotal = parseFloat(earningsTotalInput.value.replace(',', '.')) || 0;
        const expensesTotal = parseFloat(expensesTotalInput.value.replace(',', '.')) || 0;
        const balance = earningsTotal - expensesTotal;
        console.log('Balance:', balance);
        balanceInput.value = balance.toFixed(2);
    };

    // Champs de saisie pour ajouter les revenus et les dépenses
    const createInputField = (name, value) => {
        const div = document.createElement('div');
        div.className = 'add-new-item';

        const label = document.createElement('label');
        label.setAttribute('for', `input-${name}`);
        label.textContent = name;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${name}`;
        input.name = name;
        input.value = value;
        input.setAttribute('inputmode', 'decimal');
        input.setAttribute('pattern', '[0-9]*[.,]?[0-9]+');
        input.setAttribute('placeholder', 'Montant...');
        input.addEventListener('input', () => {
            calculateTotalEarnings();
            calculateTotalExpenses();
            updateBalance();
        });

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = 'X';
        removeButton.addEventListener('click', () => {
            div.remove();
            calculateTotalEarnings();
            calculateTotalExpenses();
            updateBalance();
        });

        div.appendChild(label);
        div.appendChild(input);
        div.appendChild(removeButton);

        return div;
    };

    addEarningButton.addEventListener('click', () => {
        const name = document.querySelector('#new-earning-name').value;
        const amount = document.querySelector('#new-earning-amount').value;

        // Validation des entrées utilisateurs
        if (validator.isEmpty(name) || !validator.isNumeric(amount)) {
            alert('Veuillez indiquer un titre et un montant valide. ("." et "," autorisés)');
            return;
        }

        const sanitizedName = validator.escape(name);
        const sanitizedAmount = validator.toFloat(amount);

        if (sanitizedName && sanitizedAmount) {
            const newField = createInputField(sanitizedName, sanitizedAmount);
            earningsContainer.appendChild(newField);
            newField.querySelector('input').addEventListener('input', calculateTotalEarnings);
            calculateTotalEarnings();
        }
    });

    addExpenseButton.addEventListener('click', () => {
        const name = document.querySelector('#new-expense-name').value;
        const amount = document.querySelector('#new-expense-amount').value;

        if (validator.isEmpty(name) || !validator.isNumeric(amount)) {
            alert('Veuillez indiquer un titre et un montant valide. ("." et "," autorisés)');
            return;
        }

        const sanitizedName = validator.escape(name);
        const sanitizedAmount = validator.toFloat(amount);

        if (sanitizedName && sanitizedAmount) {
            const newField = createInputField(sanitizedName, sanitizedAmount);
            expensesContainer.appendChild(newField);
            newField.querySelector('input').addEventListener('input', calculateTotalExpenses);
            calculateTotalExpenses();
        }
    });

    // Téléchargement du fichier PDF
    downloadPdfButton.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text('Gestionnaire de budget', 10, 10);
        doc.text(`Total revenus: ${earningsTotalInput.value}`, 10, 20);
        doc.text(`Total dépenses: ${expensesTotalInput.value}`, 10, 30);
        doc.text(`Solde Restant: ${balanceInput.value}`, 10, 40);

        doc.save('budget.pdf');
    });

    // Téléchargement du fichier CSV
    downloadCsvButton.addEventListener('click', () => {
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Type,Nom,Montant\n';

        const earningsInputs = document.querySelectorAll('#earnings-infos .form-display');
        earningsInputs.forEach(div => {
            const label = div.querySelector('label').textContent;
            const input = div.querySelector('input').value;
            csvContent += `Revenu,${label},${input}\n`;
        });

        const expensesInputs = document.querySelectorAll('#expenses-infos .form-display');
        expensesInputs.forEach(div => {
            const label = div.querySelector('label').textContent;
            const input = div.querySelector('input').value;
            csvContent += `Dépense,${label},${input}\n`;
        });

        csvContent += `Total des revenus,,${earningsTotalInput.value}\n`;
        csvContent += `Total des dépenses,,${expensesTotalInput.value}\n`;
        csvContent += `Solde restant,,${balanceInput.value}\n`;

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'budget.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Bouton Mode Sombre / Clair
    const colorSchemeButton = document.querySelector('#color-scheme');

    colorSchemeButton.addEventListener('click', () => {
        if (document.documentElement.hasAttribute('data-theme')) {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    });

    if (window.matchMedia && window.matchMedia('(prefers-color-sheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('#contact-form');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Lien Mailto
        const mailtoLink = `mailto:ben.game7249@gmail.com?subject=Contact de ${name}&body=${encodeURIComponent(
            `Message de: ${name}\nEmail: ${email}\n\n${message}`
        )}`;

        window.location.href = mailtoLink;

        contactForm.reset();
        document.getElementById('check').checked = false;
    }

    );
    // Initialisation des totaux
    calculateTotalEarnings();
    calculateTotalExpenses();
});