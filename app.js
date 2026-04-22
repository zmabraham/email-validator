// Disposable email domain list (expanded)
const disposableDomains = new Set([
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'yopmail.com', 'throwaway.email', 'fakeinbox.com', 'temp-mail.org',
    'sharklasers.com', 'getairmail.com', 'maildrop.cc', 'incognitomail.com',
    'filzmail.com', 'meltmail.com', 'trashmail.com', 'spambox.me',
    'spam4.me', 'tempmail.net', 'temporaryemail.com', 'trashmail.com',
    'yopmail.fr', 'yopmail.net', 'jetable.com', 'nospammail.net',
    'mailcatch.com', 'throwawaymail.com', 'trashmail.ca', 'tempmail.de',
    '0-mail.com', '0815.ru', '0clickemail.com', '0wnd.net', '0wnd.org',
    '0x207.info', '1-8.biz', '1000rebates.stream', '100likers.com',
    '10mail.com', '10mail.org', '10minutemail.co.za', '10minutemail.de',
    '10minutemail.nl', '10minutemail.org', '10minutemail.xyz',
    '123-m.com', '1chuan.com', '1fsdfdsfsdf.tk', '1pad.de', '1st-forms.com',
    '1to1mail.org', '1zhuan.com', '2.0-2.info', '20email.eu', '20mail.in',
    '20mail.it', '20minutemail.com', '21cn.com', '24hourmail.com',
    '2fdgdfgdfgdf.tk', '2prong.com', '33mail.com', '36rt.com', '3mail.ga',
    '4-n.us', '4warding.com', '4warding.net', '4warding.org', '50set.com',
    '60minutemail.com', '675hosting.com', '672642.net', '675hosting.net',
    '6hjngj.tk', '6paq.com', '6url.com', '75hosting.com', '7days-printing.com',
    '7tags.com', '80665.com', '8127ep.com', '99experts.com', '9mail.cf',
    '9ox.net', 'a-bc.net', 'a45.in', 'aa5zy64.com', 'aaqweqqwt.com',
    'abcmail.email', 'ability2lore.com', 'abovewealth.com', 'absolutrtype.net',
    'abusemail.de', 'abuser.eu', 'ac20mail.in', 'academiccommunity.com',
    'acentri.com', 'acmemail.com', 'actudep.com', 'adamenf.com',
    'adash.com', 'adasia.com', 'adbite.com', 'ad_blk.com', 'adf3.us',
    'adipex.su', 'admanmail.com', 'adresijb.com', 'adsoftheworld.net',
    'adspt.com', 'adult-work.info', 'advantagemail.com', 'advertisinggum.com',
    'aegia.net', 'aegiscorp.net', 'aerialvalueestimates.com', 'afrobacon.com',
    'afrosflix.co.uk', 'agmednet.com', 'ahead.eu', 'ai.ki', 'aimmail.info',
    'air2mail.com', 'airmail.box', 'airsi.de', 'ajaxapp.net', 'akapro.com',
    'akchiz.com', 'akjk.com', 'akul.in', 'active1.com',
    // Add more as needed...
]);

// Role-based email prefixes
const rolePrefixes = new Set([
    'admin', 'administrator', 'info', 'support', 'sales', 'contact',
    'office', 'help', 'enquiries', 'billing', 'accounts', 'finance',
    'hr', 'jobs', 'careers', 'marketing', 'webmaster', 'postmaster',
    'hostmaster', 'abuse', 'noreply', 'no-reply', 'noreply',
]);

const BATCH_SIZE = 100;
const MAX_EMAILS = 10000;
const ITEMS_PER_PAGE = 50;

class EmailValidator {
    constructor() {
        this.emailInput = document.getElementById('email-input');
        this.validateBtn = document.getElementById('validate-btn');
        this.resultsDiv = document.getElementById('results');
        this.statusIcon = document.getElementById('status-icon');
        this.statusTitle = document.getElementById('status-title');
        this.statusMessage = document.getElementById('status-message');
        this.resultDetails = document.getElementById('result-details');

        // Bulk mode elements
        this.uploadArea = document.getElementById('upload-area');
        this.fileInput = document.getElementById('file-input');
        this.fileInfo = document.getElementById('file-info');
        this.fileName = document.getElementById('file-name');
        this.fileCount = document.getElementById('file-count');
        this.removeFileBtn = document.getElementById('remove-file-btn');
        this.bulkValidateBtn = document.getElementById('bulk-validate-btn');
        this.progressSection = document.getElementById('progress-section');
        this.progressFill = document.getElementById('progress-fill');
        this.progressPercent = document.getElementById('progress-percent');
        this.progressStats = document.getElementById('progress-stats');
        this.bulkResults = document.getElementById('bulk-results');
        this.resultsBody = document.getElementById('results-body');

        // Bulk validation state
        this.emailsToValidate = [];
        this.validationResults = [];
        this.currentPage = 1;
        this.totalPages = 1;

        this.init();
    }

    init() {
        this.setupModeToggle();
        this.setupSingleMode();
        this.setupBulkMode();
    }

    setupModeToggle() {
        const modeBtns = document.querySelectorAll('.mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchMode(btn.dataset.mode);
            });
        });
    }

    switchMode(mode) {
        document.querySelectorAll('.mode-content').forEach(el => {
            el.classList.remove('active');
        });
        document.getElementById(`${mode}-mode`).classList.add('active');

        if (mode === 'bulk') {
            document.querySelector('.container').classList.add('wide');
        } else {
            document.querySelector('.container').classList.remove('wide');
        }
    }

    setupSingleMode() {
        this.validateBtn.addEventListener('click', () => this.validateSingle());
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validateSingle();
        });
        this.emailInput.addEventListener('input', () => {
            this.resultsDiv.classList.add('hidden');
        });
    }

    setupBulkMode() {
        // File upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            this.handleFile(e.dataTransfer.files[0]);
        });
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.handleFile(e.target.files[0]);
            }
        });

        // Remove file
        this.removeFileBtn.addEventListener('click', () => this.clearFile());

        // Validate button
        this.bulkValidateBtn.addEventListener('click', () => this.runBulkValidation());

        // Export button
        document.getElementById('export-btn').addEventListener('click', () => this.exportResults());

        // Pagination
        document.getElementById('prev-page').addEventListener('click', () => this.changePage(-1));
        document.getElementById('next-page').addEventListener('click', () => this.changePage(1));
    }

    validateSingle() {
        const email = this.emailInput.value.trim().toLowerCase();

        if (!email) {
            this.showError('Please enter an email address');
            return;
        }

        const results = this.performValidation(email);
        this.displayResults(results);
    }

    performValidation(email) {
        const results = {
            email,
            isSyntaxValid: false,
            isDisposable: false,
            isRoleBased: false,
            domain: '',
            localPart: '',
            status: 'invalid',
            details: []
        };

        const match = email.match(/^([^@]+)@(.+)$/);
        if (match) {
            results.localPart = match[1];
            results.domain = match[2];
        }

        results.isSyntaxValid = validator.isEmail(email, {
            allow_display_name: false,
            require_tld: true,
            allow_ip_domain: false
        });

        results.isDisposable = disposableDomains.has(results.domain);
        results.isRoleBased = rolePrefixes.has(results.localPart);

        // Determine status
        if (!results.isSyntaxValid) {
            results.status = 'invalid';
            results.details.push('Invalid syntax');
        } else if (results.isDisposable) {
            results.status = 'warning';
            results.details.push('Disposable email');
        } else if (results.isRoleBased) {
            results.status = 'warning';
            results.details.push('Role-based address');
        } else {
            results.status = 'valid';
        }

        return results;
    }

    displayResults(results) {
        this.resultsDiv.classList.remove('hidden');
        this.resultDetails.innerHTML = '';

        if (results.status === 'valid') {
            this.showSuccess('Valid Email', 'This email address passes all basic validation checks.');
        } else if (results.status === 'warning') {
            this.showWarning('Warning', results.details.join(', '));
        } else {
            this.showError('Invalid Email', 'The email format is not valid.');
        }

        this.addDetailItem('Email Address', results.email, 'neutral');
        this.addDetailItem('Syntax', results.isSyntaxValid ? 'Valid' : 'Invalid', results.isSyntaxValid ? 'valid' : 'invalid');
        this.addDetailItem('Domain', results.domain || 'N/A', 'neutral');

        if (results.domain) {
            const tld = results.domain.split('.').pop();
            this.addDetailItem('TLD', tld.toUpperCase(), 'neutral');
        }

        this.addDetailItem('Disposable', results.isDisposable ? 'Yes' : 'No', results.isDisposable ? 'invalid' : 'valid');
        this.addDetailItem('Role-Based', results.isRoleBased ? 'Yes' : 'No', results.isRoleBased ? 'warning' : 'valid');
    }

    showSuccess(title, message) {
        this.statusIcon.className = 'result-icon success';
        this.statusIcon.innerHTML = '✓';
        this.statusTitle.textContent = title;
        this.statusTitle.style.color = 'var(--success)';
        this.statusMessage.textContent = message;
    }

    showError(title, message) {
        this.statusIcon.className = 'result-icon error';
        this.statusIcon.innerHTML = '✗';
        this.statusTitle.textContent = title;
        this.statusTitle.style.color = 'var(--error)';
        this.statusMessage.textContent = message;
    }

    showWarning(title, message) {
        this.statusIcon.className = 'result-icon warning';
        this.statusIcon.innerHTML = '⚠';
        this.statusTitle.textContent = title;
        this.statusTitle.style.color = 'var(--warning)';
        this.statusMessage.textContent = message;
    }

    addDetailItem(label, value, status) {
        const item = document.createElement('div');
        item.className = 'detail-item';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'detail-label';
        labelSpan.textContent = label;

        const valueDiv = document.createElement('div');
        valueDiv.className = `detail-value ${status}`;

        if (status === 'valid' || status === 'invalid') {
            const badge = document.createElement('span');
            badge.className = `badge ${status}`;
            badge.textContent = value;
            valueDiv.appendChild(badge);
        } else {
            valueDiv.textContent = value;
        }

        item.appendChild(labelSpan);
        item.appendChild(valueDiv);
        this.resultDetails.appendChild(item);
    }

    async handleFile(file) {
        if (!file) return;

        const text = await file.text();
        let emails = [];

        // Parse based on file type
        if (file.name.endsWith('.csv')) {
            emails = this.parseCSV(text);
        } else {
            emails = this.parsePlainText(text);
        }

        // Limit to max emails
        if (emails.length > MAX_EMAILS) {
            alert(`File contains ${emails.length} emails. Only the first ${MAX_EMAILS} will be processed.`);
            emails = emails.slice(0, MAX_EMAILS);
        }

        this.emailsToValidate = emails;
        this.fileName.textContent = file.name;
        this.fileCount.textContent = `${emails.length} email${emails.length !== 1 ? 's' : ''} found`;

        this.uploadArea.classList.add('hidden');
        this.fileInfo.classList.remove('hidden');
        this.bulkValidateBtn.disabled = false;
    }

    parseCSV(text) {
        const emails = [];
        const lines = text.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Try to parse as CSV (handle quoted values)
            const match = trimmed.match(/^"?([^",@]+@[^",]+)"?,?/);
            if (match) {
                emails.push(match[1].toLowerCase());
            } else if (trimmed.includes('@')) {
                emails.push(trimmed.split(',')[0].toLowerCase());
            }
        }

        return emails;
    }

    parsePlainText(text) {
        return text
            .split(/[\n\r,\s\t]+/)
            .map(e => e.trim().toLowerCase())
            .filter(e => e.includes('@'));
    }

    clearFile() {
        this.emailsToValidate = [];
        this.validationResults = [];
        this.fileInput.value = '';
        this.uploadArea.classList.remove('hidden');
        this.fileInfo.classList.add('hidden');
        this.bulkValidateBtn.disabled = true;
        this.bulkResults.classList.add('hidden');
        this.progressSection.classList.add('hidden');
    }

    async runBulkValidation() {
        if (this.emailsToValidate.length === 0) return;

        this.bulkValidateBtn.disabled = true;
        this.progressSection.classList.remove('hidden');
        this.bulkResults.classList.add('hidden');

        this.validationResults = [];
        let processed = 0;
        const total = this.emailsToValidate.length;

        // Process in batches to avoid UI blocking
        for (let i = 0; i < this.emailsToValidate.length; i += BATCH_SIZE) {
            const batch = this.emailsToValidate.slice(i, i + BATCH_SIZE);
            const batchResults = batch.map(email => this.performValidation(email));
            this.validationResults.push(...batchResults);

            processed += batch.length;
            this.updateProgress(processed, total);

            // Allow UI to update
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        this.displayBulkResults();
        this.bulkValidateBtn.disabled = false;
    }

    updateProgress(processed, total) {
        const percent = Math.round((processed / total) * 100);
        this.progressFill.style.width = `${percent}%`;
        this.progressPercent.textContent = `${percent}%`;
        this.progressStats.textContent = `${processed}/${total} processed`;
    }

    displayBulkResults() {
        this.progressSection.classList.add('hidden');
        this.bulkResults.classList.remove('hidden');

        // Calculate stats
        const valid = this.validationResults.filter(r => r.status === 'valid').length;
        const invalid = this.validationResults.filter(r => r.status === 'invalid').length;
        const warning = this.validationResults.filter(r => r.status === 'warning').length;

        document.getElementById('valid-count').textContent = valid;
        document.getElementById('invalid-count').textContent = invalid;
        document.getElementById('warning-count').textContent = warning;
        document.getElementById('total-count').textContent = this.validationResults.length;

        this.currentPage = 1;
        this.totalPages = Math.ceil(this.validationResults.length / ITEMS_PER_PAGE);
        this.updateResultsTable();
    }

    updateResultsTable() {
        this.resultsBody.innerHTML = '';

        const start = (this.currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageResults = this.validationResults.slice(start, end);

        pageResults.forEach(result => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHtml(result.email)}</td>
                <td><span class="status-badge ${result.status}">${result.status}</span></td>
                <td>
                    <div class="detail-tags">
                        ${result.details.map(d => `<span class="detail-tag">${this.escapeHtml(d)}</span>`).join('')}
                        ${result.details.length === 0 ? '<span class="detail-tag">Clean</span>' : ''}
                    </div>
                </td>
            `;
            this.resultsBody.appendChild(row);
        });

        // Update pagination
        document.getElementById('current-page').textContent = this.currentPage;
        document.getElementById('total-pages').textContent = this.totalPages;
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage === this.totalPages;
    }

    changePage(delta) {
        this.currentPage += delta;
        this.updateResultsTable();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    exportResults() {
        const headers = ['Email', 'Status', 'Details', 'Domain', 'Disposable', 'Role-Based'];
        const rows = this.validationResults.map(r => [
            r.email,
            r.status,
            r.details.join('; '),
            r.domain,
            r.isDisposable ? 'Yes' : 'No',
            r.isRoleBased ? 'Yes' : 'No'
        ]);

        const csv = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-validation-results-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new EmailValidator();
});
