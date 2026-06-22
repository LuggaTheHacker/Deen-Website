import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();

// CORS-Schutz für den MVP deaktivieren, damit Vercel ungehindert zugreifen kann
app.use(cors());
app.use(express.json());

// Render nutzt automatisch die PORT Environment Variable, ansonsten Fallback auf 10000
const port = process.env.PORT || 10000;

// Neon PostgreSQL Verbindung herstellen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Wichtig für Neon.tech
  }
});

// Auto-Setup: Tabellen erstellen und mit Start-Daten füllen (Fließband-Tempo)
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255),
        material VARCHAR(100),
        status VARCHAR(50),
        date VARCHAR(50)
      );
    `);
    
    // Prüfen ob schon Daten existieren
    const check = await pool.query('SELECT COUNT(*) FROM orders');
    if (check.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO orders (id, name, material, status, date) VALUES 
        ('PRJ-8821', 'Gehäuse-Prototyp V4', 'PA12 (Nylon)', 'Im Druck', '22.06.2026'),
        ('PRJ-8819', 'Zahnrad-Modul (Test)', 'Resin (Tough)', 'Versandbereit', '20.06.2026'),
        ('PRJ-8790', 'Halterung Konzept A', 'PETG', 'Abgeschlossen', '15.05.2026');
      `);
      console.log('Produktionsdatenbank mit Startdaten kalibriert.');
    }
  } catch (err) {
    console.error('Fehler an der Datenbank-Station:', err);
  }
}

// Datenbank-Initialisierung beim Serverstart auslösen
initDB();

// --- API ROUTEN (Endpunkte für das Frontend) ---

// 1. Health-Check (Um zu testen ob Render online ist)
app.get('/health', (req, res) => {
  res.status(200).send('AERO // PRINT Backend läuft stabil.');
});

// 2. Aufträge abrufen (Verkabelung für das Dashboard)
app.get('/api/orders', async (req, res) => {
  try {
    // Neueste Aufträge zuerst
    const result = await pool.query('SELECT * FROM orders ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Neuen Auftrag anlegen (Verkabelung für den Upload)
app.post('/api/orders', async (req, res) => {
  const { material, tolerance } = req.body;
  
  // Zufällige ID generieren und aktuelles Datum setzen
  const newId = 'PRJ-' + Math.floor(Math.random() * 9000 + 1000);
  const today = new Date().toLocaleDateString('de-DE');
  
  try {
    const result = await pool.query(
      'INSERT INTO orders (id, name, material, status, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [newId, 'Neuer CAD Upload', material || 'Unbekannt', 'CAD-Prüfung', today]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Backend-Fließband läuft auf Port ${port}`);
});
