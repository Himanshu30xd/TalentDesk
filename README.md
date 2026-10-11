# TalentDesk

Static front-end recruitment workspace (HTML, CSS, JavaScript). No build step.

## Files (all must sit together in the repository root)
- `index.html` Recruitment (home page)
- `import-export.html` Candidate and job CSV import/export
- `event.html` Hiring events and interviews
- `style.css` shared styles
- `app.js` shared behaviour and the `Store` object (replace its load/save to connect a backend)
- `supabase-schema.sql` draft database schema with Row Level Security (not yet run or tested)

## Deploy on GitHub Pages
Settings > Pages > Deploy from a branch > `main` and `/ (root)`. `index.html` must be in the root of that branch.

## Limitations
Data is stored in each browser's localStorage. It does not sync between devices or users. Do not enter real candidate data until a backend with login and Row Level Security is configured and tested.
