import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

  app.post('/api/chat', async (req, res) => {
    try {
      const { query } = req.body;

      if (!query || typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ 
          error: 'Query is required and must be a non-empty string',
          status: 'error'
        });
      }

      const response = await fetch(`${BACKEND_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: errorData.detail || 'Failed to get response from AI assistant',
          status: 'error'
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (error: any) {
      console.error('Chat API error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          error: 'Unable to connect to the AI backend. Please ensure the backend server is running.',
          status: 'error'
        });
      }

      return res.status(500).json({
        error: error.message || 'An unexpected error occurred',
        status: 'error'
      });
    }
  });

  app.get('/api/health', async (req, res) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/health`, {
        method: 'GET',
      });

      const data = await response.json();
      return res.json({
        frontend: 'healthy',
        backend: data,
        backendUrl: BACKEND_API_URL
      });
    } catch (error: any) {
      return res.status(503).json({
        frontend: 'healthy',
        backend: 'unreachable',
        backendUrl: BACKEND_API_URL,
        error: error.message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
