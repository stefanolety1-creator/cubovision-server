// index.js
// Cubovision Middleware Server per Render.com
import "dotenv/config";
import express from "express";
import cors from "cors";

import configRoutes from "./routes/config.js";
import liveTvRoutes from "./routes/liveTv.js";
import sportsRoutes from "./routes/sports.js";
import vodRoutes from "./routes/vod.js";
import adminRoutes from "./routes/admin.js";
import { streamResolver } from "./services/streamResolver.js";

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware globali
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint Healthcheck per Render
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Dashboard Web in stile Cubovision 2009 Telecom Italia su root /
app.get("/", (req, res) => {
  const config = streamResolver.getConfig();
  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cubovision Middleware Server</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 10%, #440008 0%, #150003 40%, #050507 90%);
      color: #FFFFFF;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(18, 18, 22, 0.85);
      border: 1px solid #770011;
      box-shadow: 0 10px 40px rgba(226, 0, 26, 0.25);
      border-radius: 12px;
      max-width: 680px;
      width: 100%;
      padding: 32px;
      text-align: center;
    }
    .logo {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 8px;
    }
    .logo span { color: #E2001A; }
    .badge {
      display: inline-block;
      background: #E2001A;
      color: #FFF;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 24px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #002e12;
      border: 1px solid #00aa44;
      color: #00ff66;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .dot {
      width: 8px;
      height: 8px;
      background: #00ff66;
      border-radius: 50%;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin: 24px 0;
    }
    .stat-box {
      background: #111116;
      border: 1px solid #282832;
      border-radius: 8px;
      padding: 14px;
    }
    .stat-box .num {
      font-size: 24px;
      font-weight: 700;
      color: #E2001A;
    }
    .stat-box .label {
      font-size: 11px;
      color: #A0A0B0;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .endpoints {
      text-align: left;
      background: #0A0A0D;
      border: 1px solid #1E1E26;
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
      font-size: 13px;
    }
    .endpoints h3 {
      font-size: 12px;
      color: #E2001A;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .endpoint-item {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #15151C;
    }
    .endpoint-item:last-child { border-bottom: none; }
    .endpoint-item a {
      color: #00AAFF;
      text-decoration: none;
      font-family: monospace;
    }
    .endpoint-item a:hover { text-decoration: underline; }
    .endpoint-item .method {
      color: #00FF66;
      font-weight: 700;
      font-size: 11px;
    }
    footer {
      margin-top: 24px;
      font-size: 11px;
      color: #777788;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">cubo<span>vision</span>&reg;</div>
    <div class="badge">Middleware & Stream Variations Server</div>
    <br>
    <div class="status-badge"><span class="dot"></span> Online & Pronto per Render.com</div>

    <div class="grid">
      <div class="stat-box">
        <div class="num">${config.stats.totalChannels}</div>
        <div class="label">Canali TV</div>
      </div>
      <div class="stat-box">
        <div class="num">${config.stats.totalSportsEvents}</div>
        <div class="label">Eventi Sport Live</div>
      </div>
      <div class="stat-box">
        <div class="num">${config.stats.vodProvidersCount}</div>
        <div class="label">Mirror VOD</div>
      </div>
      <div class="stat-box">
        <div class="num">${config.stats.uptimeSeconds}s</div>
        <div class="label">Uptime</div>
      </div>
    </div>

    <div class="endpoints">
      <h3>Endpoint API Principali</h3>
      <div class="endpoint-item">
        <a href="/api/config" target="_blank">/api/config</a>
        <span class="method">GET</span>
      </div>
      <div class="endpoint-item">
        <a href="/api/live/channels" target="_blank">/api/live/channels</a>
        <span class="method">GET</span>
      </div>
      <div class="endpoint-item">
        <a href="/api/sports/events" target="_blank">/api/sports/events</a>
        <span class="method">GET</span>
      </div>
      <div class="endpoint-item">
        <a href="/api/vod/search?q=Inception" target="_blank">/api/vod/search?q=Inception</a>
        <span class="method">GET</span>
      </div>
      <div class="endpoint-item">
        <span style="font-family: monospace; color: #AAA;">/api/admin/variations</span>
        <span class="method" style="color: #FFB300;">POST</span>
      </div>
    </div>

    <footer>Telecom Italia &copy; 2009-2011 &bull; Cubovision On-Demand &amp; Live Ecosystem</footer>
  </div>
</body>
</html>`;
  res.send(html);
});

// Registrazione Router
app.use("/api/config", configRoutes);
app.use("/api/live", liveTvRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/vod", vodRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Endpoint non trovato" });
});

// Avvio Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Cubovision Server] Attivo su porta ${PORT}`);
  console.log(`[Cubovision Server] Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`[Cubovision Server] OMDb API Key: ${process.env.OMDB_API_KEY || "fdce1a3b"}`);
});
