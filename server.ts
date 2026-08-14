import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { appState } from "./src/db/schema";
import { eq } from "drizzle-orm";
import { calculateOfficialScoreboard } from "./src/utils/scoreboardEngine";

async function startServer() {
  const app = express();
  const PORT = 3000;
  app.use(express.json({ limit: '10mb' }));

  const dbUrl = process.env.DATABASE_URL;
  let db: ReturnType<typeof drizzle> | null = null;
  if (dbUrl) {
    const pool = new pg.Pool({ connectionString: dbUrl });
    db = drizzle(pool);
    console.log("Connected to PostgreSQL");
  } else {
    console.log("No DATABASE_URL found. Falling back to local file storage.");
  }

  const LOCAL_STATE_FILE = path.join(process.cwd(), 'local_state.json');

  async function getStateData() {
    if (db) {
      const result = await db.select().from(appState).where(eq(appState.id, 'main_state')).limit(1);
      if (result.length > 0) {
        return result[0].data as any;
      }
      return {};
    } else {
      if (fs.existsSync(LOCAL_STATE_FILE)) {
        const data = fs.readFileSync(LOCAL_STATE_FILE, 'utf-8');
        return JSON.parse(data);
      }
      return {};
    }
  }

  app.get("/api/state", async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      const state = await getStateData();
      return res.json(state);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/scoreboard", async (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const state = await getStateData();
      const results = state.results || [];
      const programmes = state.programmes || [];
      const teams = state.teams || [];

      const scoreboard = calculateOfficialScoreboard(results, programmes, teams);
      return res.json(scoreboard);
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state", async (req, res) => {
    try {
      const data = req.body;
      if (db) {
        const result = await db.select().from(appState).where(eq(appState.id, 'main_state')).limit(1);
        if (result.length > 0) {
          await db.update(appState).set({ data }).where(eq(appState.id, 'main_state'));
        } else {
          await db.insert(appState).values({ id: 'main_state', data });
        }
      } else {
        fs.writeFileSync(LOCAL_STATE_FILE, JSON.stringify(data, null, 2));
      }
      res.json({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
