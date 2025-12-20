# Staging deployment (trusted testers)

This repo uses a simple promotion model:

- `main`: ongoing development
- `staging`: what testers run

CI builds artifacts from source. Do not commit `dist/`.

## 1. Create the staging branch

```bash
git checkout -b staging
git push -u origin staging
```

## 2. Web (GitHub Pages)

Workflow: [.github/workflows/web-pages-staging.yml](../../.github/workflows/web-pages-staging.yml)

1. In GitHub: Settings -> Pages
2. Source: select "GitHub Actions"
3. Push a commit to `staging` (or run the workflow manually)

The site URL will look like:

- `https://<owner>.github.io/<repo>/`

Notes:

- The workflow sets `BASE_PATH=/<repo>/` so Vite assets work on Pages.

It also sets the Vite env vars so the web app points at the staging API and uses Supabase Auth.

Add these GitHub repo secrets:

- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 3. API (Fly.io)

This repo deploys the API to Fly by building from source using:

- Fly config: [fly.toml](../../fly.toml)
- Dockerfile: [Dockerfile.api](../../Dockerfile.api)

There is no GHCR dependency for staging deploys.

### One-time setup

1. Create the Fly app (pick a name and a region):

```bash
flyctl apps create <your-app-name>
```

2. Update `fly.toml` to use your app name:

```toml
app = "<your-app-name>"
```

3. Set required secrets (examples):

```bash
flyctl secrets set \
  -a <your-app-name> \
  DATABASE_URL="..." \
  AUTH_SECRET="..." \
  OPENROUTER_API_KEY="..." \
  OPENROUTER_MODEL="deepseek/deepseek-chat"
```

### Deploy

Option A (recommended): deploy from your machine:

```bash
flyctl deploy -a <your-app-name>
```

Option B: deploy from GitHub Actions:

Workflow: [.github/workflows/api-fly-deploy-staging.yml](../../.github/workflows/api-fly-deploy-staging.yml)

Add these GitHub repo secrets:

- `FLY_API_TOKEN`
- `FLY_APP_NAME`

Then run the workflow "API - Deploy to Fly.io (staging)".

### Verify

```bash
curl -fsS "https://<your-app-name>.fly.dev/health"
```

## 5. Promotion flow

- Develop on `main` (feature branches -> PRs into `main`).
- When ready for testers: open a PR from `main` -> `staging` and merge.
- CI deploys web and updates the API image tag.
