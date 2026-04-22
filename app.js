// Disposable email domain list (common ones)
const disposableDomains = new Set([
    // Temp mail services
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
]);

// Role-based email prefixes
const rolePrefixes = new Set([
    'admin', 'administrator', 'info', 'support', 'sales', 'contact',
    'office', 'help', 'enquiries', 'billing', 'accounts', 'finance',
    'hr', 'jobs', 'careers', 'marketing', 'webmaster', 'postmaster',
    'hostmaster', 'abuse', 'noreply', 'no-reply', 'noreply',
]);

class EmailValidator {
    constructor() {
        this.emailInput = document.getElementById('email-input');
        this.validateBtn = document.getElementById('validate-btn');
        this.resultsDiv = document.getElementById('results');
        this.statusIcon = document.getElementById('status-icon');
        this.statusTitle = document.getElementById('status-title');
        this.statusMessage = document.getElementById('status-message');
        this.resultDetails = document.getElementById('result-details');

        this.init();
    }

    init() {
        this.validateBtn.addEventListener('click', () => this.validate());
        this.emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.validate();
        });
        this.emailInput.addEventListener('input', () => {
            this.resultsDiv.classList.add('hidden');
        });
    }

    validate() {
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
            hasMxRecords: null,
            domain: '',
            localPart: '',
            suggestions: []
        };

        // Extract domain and local part
        const match = email.match(/^([^@]+)@(.+)$/);
        if (match) {
            results.localPart = match[1];
            results.domain = match[2];
        }

        // Syntax validation using validator.js
        results.isSyntaxValid = validator.isEmail(email, {
            allow_display_name: false,
            require_tld: true,
            allow_ip_domain: false
        });

        // Check for disposable domain
        results.isDisposable = disposableDomains.has(results.domain);

        // Check for role-based email
        results.isRoleBased = rolePrefixes.has(results.localPart);

        // MX record validation (would require server-side, so we note it)
        results.hasMxRecords = 'Server-side check required';

        return results;
    }

    displayResults(results) {
        this.resultsDiv.classList.remove('hidden');
        this.resultDetails.innerHTML = '';

        let isValid = results.isSyntaxValid && !results.isDisposable;
        let isWarning = results.isSyntaxValid && results.isRoleBased;

        if (isValid && !isWarning) {
            this.showSuccess('Valid Email', 'This email address passes all basic validation checks.');
        } else if (isWarning) {
            this.showWarning('Role-Based Email', 'This is a role-based email address (e.g., info@, support@).');
        } else if (!results.isSyntaxValid) {
            this.showError('Invalid Email', 'The email format is not valid.');
        } else if (results.isDisposable) {
            this.showWarning('Disposable Email', 'This email is from a temporary email service.');
        }

        // Display details
        this.addDetailItem('Email Address', results.email, 'neutral');
        this.addDetailItem('Syntax', results.isSyntaxValid ? 'Valid' : 'Invalid', results.isSyntaxValid ? 'valid' : 'invalid');
        this.addDetailItem('Domain', results.domain || 'N/A', 'neutral');

        if (results.domain) {
            const tld = results.domain.split('.').pop();
            this.addDetailItem('TLD', tld.toUpperCase(), 'neutral');
        }

        this.addDetailItem('Disposable', results.isDisposable ? 'Yes' : 'No', results.isDisposable ? 'invalid' : 'valid');
        this.addDetailItem('Role-Based', results.isRoleBased ? 'Yes' : 'No', results.isRoleBased ? 'warning' : 'valid');

        // Note about MX records
        this.addDetailItem('MX Records', 'Check server-side', 'neutral');
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
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new EmailValidator();
});
