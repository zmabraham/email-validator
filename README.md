# Free Email Validator

A simple, free email validation webapp - no signup, no API keys, no server required.

## Features

### Single Email Mode
- ✅ Syntax validation (RFC-compliant)
- ✅ Disposable email detection
- ✅ Role-based email detection
- ✅ Domain and TLD extraction
- ✅ Instant client-side validation

### Bulk Mode (New!)
- ✅ Validate up to 10,000 emails at once
- ✅ Upload CSV or TXT files
- ✅ Progress tracking with real-time updates
- ✅ Results table with pagination
- ✅ Export results to CSV
- ✅ Detailed breakdown (valid, invalid, warnings)
- ✅ Drag & drop file upload

## Live Demo

https://zmabraham.github.io/email-validator/

## How It Works

This validator uses:
- **validator.js** - Robust email syntax validation
- **Built-in database** - 500+ disposable email domains
- **Role-based detection** - Identifies addresses like info@, support@
- **Batch processing** - Handles thousands of emails efficiently

All validation happens in your browser - no data is sent to any server.

## Usage

### Single Email
1. Enter an email address
2. Click "Validate"
3. View instant results

### Bulk Validation
1. Switch to "Bulk Validate" tab
2. Upload a CSV or TXT file
3. Click "Validate All Emails"
4. Export results when complete

**Supported file formats:**
- CSV: One email per column, or as the first column
- TXT: Emails separated by newlines, commas, or spaces

## Status Labels

| Status | Meaning |
|--------|---------|
| ✅ Valid | Clean email, passes all checks |
| ⚠️ Warning | Disposable or role-based address |
| ❌ Invalid | Malformed email address |

## Limitations

- **MX record checking** requires a server (not included for client-side privacy)
- **SMTP verification** requires server-side implementation
- Disposable domain list is maintained locally

## Deployment

This static site can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

## License

MIT

## Credits

Built with:
- [validator.js](https://github.com/validatorjs/validator.js)
- [MailChecker](https://github.com/FGRibreau/mailchecker) (inspiration for disposable list)
