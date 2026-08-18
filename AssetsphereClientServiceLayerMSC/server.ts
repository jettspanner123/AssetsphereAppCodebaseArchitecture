import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini Client server-side
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', app: 'AssetSphere Enterprise', version: '2.0' });
  });

  // AI Assistant Endpoint - Gemini 3.6 Flash
  app.post('/api/ai/assistant', async (req: Request, res: Response) => {
    try {
      const { prompt, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      const systemInstruction = `
You are AssetSphere AI, the built-in Enterprise AI Assistant for AssetSphere Enterprise IT Asset Management (ITAM).
You help IT Directors, Security Analysts, Procurement Managers, and System Admins manage physical, virtual, and cloud assets, employee allocations, warranties, compliance, and failure predictions.

Context of current inventory / assets:
${JSON.stringify(context || {}, null, 2)}

Instructions:
1. Provide concise, professional, actionable executive insights and direct answers.
2. When answering about specific assets or employees, highlight relevant Asset IDs, serial numbers, warranty end dates, or health scores.
3. Offer concrete suggestions (e.g., "Reallocate unused seat", "Approve battery replacement", "Renew warranty").
4. Maintain an enterprise ITAM authoritative tone. Format with clear Markdown bullet points.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2,
        },
      });

      return res.json({
        answer: response.text || 'No response generated from AI Assistant.',
      });
    } catch (error: any) {
      console.error('AI Assistant Error:', error);
      return res.status(500).json({
        error: 'Failed to process AI assistant query.',
        details: error?.message || String(error),
      });
    }
  });

  // AI Asset Diagnostic Analysis Endpoint
  app.post('/api/ai/diagnostics', async (req: Request, res: Response) => {
    try {
      const { asset } = req.body;
      if (!asset) {
        return res.status(400).json({ error: 'Asset payload is required' });
      }

      const ai = getGeminiClient();
      const prompt = `Analyze this IT asset and generate a comprehensive health diagnostic report, failure risk assessment, and recommended next action steps.

Asset Details:
Name: ${asset.deviceName} (${asset.assetNumber})
Category: ${asset.category} / ${asset.subtype}
Age in Months: ${asset.health?.deviceAgeMonths || 'N/A'}
Battery Health: ${asset.health?.batteryHealthPct ? asset.health.batteryHealthPct + '%' : 'N/A'}
Warranty Status: ${asset.warranty?.warrantyEnd ? 'Ends on ' + asset.warranty.warrantyEnd : 'N/A'}
Repair Tickets Count: ${asset.health?.repairCount || 0}
Compliance Status: ${asset.security?.isCompliant ? 'Compliant' : 'Non-Compliant'}
Current Value: $${asset.currentValue}

Provide a JSON object with:
- "healthSummary": short 2-sentence summary
- "failureRiskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
- "riskFactors": string array of risks
- "recommendedAction": concise recommended decision (e.g. "Replace Battery", "Extend Warranty 1 Year", "Retire Asset", "Keep In Service")
- "estimatedCostSaving": string describing financial impact
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (e) {
        return res.json({
          healthSummary: text,
          failureRiskLevel: 'MEDIUM',
          riskFactors: ['Periodic maintenance required'],
          recommendedAction: 'Inspect hardware physically during next maintenance window.',
          estimatedCostSaving: 'N/A',
        });
      }
    } catch (error: any) {
      console.error('AI Diagnostics Error:', error);
      return res.status(500).json({
        error: 'Failed to generate asset diagnostics.',
        details: error?.message || String(error),
      });
    }
  });

  // Vite Dev Server / Static Production Fallback
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AssetSphere Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
