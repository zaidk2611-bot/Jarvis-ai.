# Jarvis AI

A simple mobile-friendly Jarvis web assistant with typed chat, speech input, and spoken replies.

## Files
- `server.js` — web server and protected AI API connection
- `package.json` — project settings
- `public/index.html` — Jarvis interface

## Important
Do not put your API key in `index.html`, GitHub, or any public file. Add it privately as the `OPENAI_API_KEY` environment variable in your hosting provider. The app can start without the key, but AI answers will not work until it is configured.

## Run
Requires Node.js 18 or newer:
1. Run `npm start`
2. Open the local address shown by the host (usually port 3000).

For online use, deploy the repository to a Node.js hosting provider and set the environment variable `OPENAI_API_KEY` there.
