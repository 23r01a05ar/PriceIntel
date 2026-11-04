# API Setup Guide

This project uses a Zero-Configuration API architecture. You do not need to set up any environment variables for providers.

### To add a new RapidAPI provider:
1. Copy the Node.js fetch snippet from RapidAPI.
2. Paste it into a new `.txt` file inside `frontend/src/config/rapidapi/snippets/`
3. Run `npm run validate-snippets`
4. You are done. The provider is active.

See `RAPIDAPI_SNIPPET_SETUP.md` for full details.
