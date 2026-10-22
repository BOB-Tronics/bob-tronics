RULES FOR INTEGRATION
1. Work on ONE feature at a time. Do not touch other features.
2. Before changing any file, tell me which file and why. Wait for my approval.
3. Never hardcode the backend URL. Use NEXT_PUBLIC_API_URL from .env.local.
4. Never put secrets, passwords or tokens in code. Never commit .env.local.
5. Use TypeScript types for every API response. No "any".
6. Keep all API calls in one place: /lib/api.ts (or /services).
7. Handle loading, error and empty states on every screen that fetches data.
8. Do not change the UI design, colors or layout. Only connect data.
9. Do not delete or rewrite files I didn't mention.
10. Explain each change in simple words, as if I'm a beginner.
11. If something fails, show me the exact error and explain it before fixing.
12. After each change, tell me exactly how to test it.