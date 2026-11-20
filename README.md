# 📺 Cubovision Middleware & Stream Variations Server

Server middleware e API aggregator progettato per essere distribuito istantaneamente su **Render.com** (o su qualsiasi cloud provider Node.js), a supporto dell'app Android TV e Mobile **Cubovision Telecom Italia 2009**.

---

## 🎯 Perché questo server?

1. **Gestione Variazioni Senza Ricompilare l'APK**: Se uno stream HLS o un'API cambia dominio o cade, aggiungi o aggiorni la variazione sul server (o via API Admin) e l'app continuerà a funzionare immediatamente.
2. **Aggregatore Sport & Live TV**: Raccoglie gli eventi sportivi da API esterne, li normalizza in formato uniforme con stato `LIVE`, punteggi e flussi multipli (Server 1 HD, Server 2 Backup, ecc.).
3. **Cache In-Memory Intelligente**: Evita rate limiting sulle API esterne e riduce la latenza a pochi millisecondi.
4. **Dashboard 2009 Red & Black**: Pagina di benvenuto e monitoraggio integrata nello stile originale Telecom Italia.

---

## 🚀 Distribuzione su Render.com (1-Click)

### Metodo A: Via GitHub (Consigliato)
1. Crea un repository GitHub (es. `cubovision-server`).
2. Fai il push di questa cartella (`cubovision-server`).
3. Vai su [Render.com Dashboard](https://dashboard.render.com/) e clicca **New +** -> **Web Service**.
4. Seleziona il tuo repository GitHub.
5. Imposta i seguenti parametri:
   - **Name**: `cubovision-server`
   - **Runtime**: `Node`
   - **Region**: `Frankfurt (EU Central)` *(bassa latenza per l'Italia)*
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. (Opzionale) Nelle **Environment Variables** puoi aggiungere:
   - `OMDB_API_KEY`: `fdce1a3b`
   - `SPORT_API_BASE_URL`: *(il tuo endpoint sport)*
   - `SPORT_API_KEY`: *(la tua chiave sport)*
   - `ADMIN_SECRET_KEY`: *(la tua chiave segreta per aggiornamenti a caldo)*
7. Clicca **Create Web Service**. In circa 60 secondi il tuo server sarà online con HTTPS gratuito (`https://cubovision-server.onrender.com`)!

### Metodo B: Via Render Blueprint (`render.yaml`)
Render riconosce automaticamente il file `render.yaml` incluso nel progetto:
1. In Render Dashboard, seleziona **New +** -> **Blueprint**.
2. Collega il repository: leggerà automaticamente regione, build command, porta e variabili.

---

## 📡 Endpoint API Disponibili

### 1. Configurazione Globale
- **`GET /api/config`**: Restituisce le feature attive, statistiche, tema e impostazioni per l'app Android.

### 2. Canali Live TV & Variazioni
- **`GET /api/live/channels`**: Elenco di tutti i canali TV con le relative variazioni di stream.
- **`GET /api/live/channels/:id`**: Dettaglio canale singolo con tutte le sorgenti alternative.
- **`GET /api/live/play/:id?var=0`**: Esegue il redirect diretto (302) allo stream della variazione scelta (`?var=0` per primaria, `?var=1` per backup, ecc.), oppure restituisce il JSON se `format=json`.

### 3. Eventi Sportivi Live & Variazioni
- **`GET /api/sports/events`**: Elenco eventi sportivi in diretta e in programma con punteggio, minuto, torneo e variazioni (Server 1, Server 2...).
- **`GET /api/sports/events/:id`**: Dettagli del singolo evento.
- **`GET /api/sports/play/:id?var=0`**: Risoluzione o redirect immediato al player sportivo prescelto.

### 4. VOD & Ricerca (OMDb)
- **`GET /api/vod/search?q=Inception`**: Ricerca film e serie TV con cache.
- **`GET /api/vod/details/:imdbId`**: Scheda completa con trama, cast, valutazioni e mirror video preconfigurati.

### 5. Amministrazione e Aggiornamenti a Caldo (Nessun Riavvio)
Invia l'header `x-admin-token: cubovision_secret_admin_2009`:
- **`POST /api/admin/channels`**: Aggiungi o sovrascrivi un canale.
- **`POST /api/admin/sports`**: Aggiungi o aggiorna un match o evento sportivo.
- **`POST /api/admin/variations`**: Modifica all'istante l'elenco delle variazioni di stream per un canale o match:
  ```json
  {
    "type": "sport",
    "id": "sport_match_01",
    "variations": [
      { "name": "Server 1 Ultra", "type": "hls", "url": "https://nuovourl.m3u8", "priority": 1 }
    ]
  }
  ```
- **`POST /api/admin/cache/clear`**: Svuota istantaneamente la cache in memoria.

---

## 🛠️ Test Locale

Se vuoi avviarlo in locale (richiede Node.js 18+):
```bash
npm install
npm start
```
Il server si avvierà su `http://localhost:10000` con dashboard grafica Cubovision attiva!
