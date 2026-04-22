# Free Email Validator

A simple, free email validation webapp - no signup, no API keys, no server required.

## Features

- ✅ Syntax validation (RFC-compliant)
- ✅ Disposable email detection
- ✅ Role-based email detection
- ✅ Domain and TLD extraction
- ✅ Instant client-side validation
- ✅ 100% free and open source

## Live Demo

Coming soon to GitHub Pages

## How It Works

This validator uses:
- **validator.js** - Robust email syntax validation
- **Built-in database** - 500+ disposable email domains
- **Role-based detection** - Identifies addresses like info@, support@

All validation happens in your browser - no data is sent to any server.

## Limitations

- **MX record checking** requires a server (marked as "Check server-side")
- For production use, consider adding SMTP verification
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
