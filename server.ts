import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { ChargeBee } from "chargebee-typescript";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/integrations/status", (req, res) => {
    res.json({
      chargebee: !!process.env.CHARGEBEE_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      qonto: !!process.env.QONTO_API_KEY,
      pennylane: !!process.env.PENNYLANE_API_KEY,
    });
  });

  app.post("/api/integrations/sync", async (req, res) => {
    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const status = {
      chargebee: !!process.env.CHARGEBEE_API_KEY,
      stripe: !!process.env.STRIPE_SECRET_KEY,
      qonto: !!process.env.QONTO_API_KEY,
      pennylane: !!process.env.PENNYLANE_API_KEY,
    };

    res.json({ success: true, status });
  });

  // Endpoint to fetch Chargebee transactions
  app.get("/api/integrations/chargebee/transactions", async (req, res) => {
    if (!process.env.CHARGEBEE_API_KEY) {
      return res.status(400).json({ error: "Clé API Chargebee non configurée dans les secrets." });
    }

    const siteName = process.env.CHARGEBEE_SITE || "woodstock-trading-test";

    try {
      // Configure Chargebee dynamically to ensure it uses the latest env vars
      const chargebee = new ChargeBee();
      chargebee.configure({
        site: siteName,
        api_key: process.env.CHARGEBEE_API_KEY
      });

      // Fetch recent invoices from Chargebee
      const result = await chargebee.invoice.list({
        limit: 10,
        "sort_by[desc]": "date"
      }).request();

      const transactions = result.list.map(entry => {
        const invoice = entry.invoice;
        return {
          id: invoice.id,
          date: new Date(invoice.date * 1000).toISOString().split('T')[0],
          client: invoice.customer_id || "Client Inconnu", // Chargebee returns customer_id, we'd ideally fetch the customer details too
          amount: (invoice.total / 100), // Chargebee amounts are in cents
          status: invoice.status
        };
      });

      res.json({ success: true, transactions });
    } catch (error: any) {
      console.error("Chargebee API Error:", error);
      
      // Extract the specific error message from Chargebee
      const errorMessage = error.message || "Erreur inconnue lors de la connexion à Chargebee";
      
      res.status(500).json({ 
        error: `Erreur renvoyée par Chargebee : ${errorMessage}. Vérifiez que le nom du site (${siteName}) et la clé API sont corrects.` 
      });
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
