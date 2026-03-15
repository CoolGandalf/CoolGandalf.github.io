# Swipe + Force Rank App

Simple mobile-friendly web app that lets you:
1. Swipe left/right through a list of names.
2. Force-rank everyone you kept (swiped right).

## Run locally

```bash
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

## Deploy to GitHub Pages (phone-accessible URL)

1. Push this repo to GitHub.
2. Ensure your default branch is `main`.
3. In GitHub, go to **Settings → Pages**.
4. Set **Source** to **GitHub Actions**.
5. Push to `main` (or run the workflow manually in the Actions tab).

After deploy, your app will be available at:
- `https://<your-username>.github.io/<repo-name>/`

## Notes

- App state is saved in browser local storage so reloads on phone won't lose progress.
- Use the **Reset** button to start over.
