# Deploying to trip.nicholaschan.ca

This app is deployed as a standalone service in its own directory on the VPS.
It shares only Traefik's external Docker network — nothing else touches nicholaschan.ca.

---

## 1. DNS

Add an **A record** at your domain registrar:

| Name | Type | Value |
|------|------|-------|
| `trip` | A | `<your VPS IP>` |

---

## 2. One-time VPS setup

SSH into your VPS and create a dedicated directory for this app:

```bash
mkdir -p /var/www/trip-planner
cd /var/www/trip-planner
git clone <your-repo-url> .
```

Create the `.env` file from the template:

```bash
cp .env.example .env
nano .env
```

Fill in these two values:

```env
# Generate a secure secret:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=paste_generated_secret_here

VITE_GOOGLE_MAPS_API_KEY=your_existing_google_maps_key
```

---

## 3. Fill in Traefik placeholders in docker-compose.yml

Open `docker-compose.yml` and update the two marked lines:

```bash
nano docker-compose.yml
```

| Placeholder | How to find your value |
|---|---|
| `traefik_network` (×2) | Run `docker network ls` — look for your Traefik network |
| `letsencrypt` | Check your Traefik config for the `certificatesResolvers` name |

---

## 4. Deploy

```bash
cd ~/trip-planner
docker compose up -d --build
```

Traefik will detect the new container via labels and automatically provision an SSL cert for `trip.nicholaschan.ca`.

---

## 5. Updating the app

```bash
cd /var/www/trip-planner
git pull
docker compose up -d --build
```

The SQLite database is stored in a Docker named volume (`trip_data`) and survives rebuilds.

---

## Directory structure on VPS

```
/var/www/trip-planner/        ← this app only, nothing shared with nicholaschan.ca
  docker-compose.yml
  Dockerfile
  .env                 ← never commit this
  server/
  src/
  dist/                ← built by Docker, not committed
  data/                ← SQLite lives here (via Docker volume)
```

---

## Useful commands

```bash
# View logs
cd /var/www/trip-planner && docker compose logs -f trip-planner

# Restart without rebuild
cd /var/www/trip-planner && docker compose restart trip-planner

# Stop
cd /var/www/trip-planner && docker compose down

# Backup the database
docker run --rm -v trip-planner_trip_data:/data alpine \
  tar czf - /data > backup-$(date +%Y%m%d).tar.gz
```
