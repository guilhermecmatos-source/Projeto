import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './modules/auth/auth.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import vehiclesRoutes from './modules/vehicles/vehicles.routes';
import driversRoutes from './modules/drivers/drivers.routes';
import routesRoutes from './modules/routes/routes.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import commercialRoutes from './modules/commercial/commercial.routes';
import commandCenterRoutes from './modules/command-center/command-center.routes';
import simulationsRoutes from './modules/simulations/simulations.routes';
import ceoAiRoutes from './modules/ceo-ai/ceo-ai.routes';
import digitalTwinRoutes from './modules/digital-twin/digital-twin.routes';
import aiRoutes from './modules/ai/ai.routes';

const app = express();

const corsOrigin = env.corsOrigin;
app.use(
  cors({
    origin:
      corsOrigin === '*'
        ? true
        : corsOrigin
          ? corsOrigin.split(',').map((o) => o.trim())
          : [
              'http://localhost:3000',
              'http://127.0.0.1:3000',
              /^http:\/\/192\.168\.\d+\.\d+:3000$/,
              /^http:\/\/10\.\d+\.\d+\.\d+:3000$/,
            ],
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', service: 'Fleet AI API', version: '1.0.0' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/commercial', commercialRoutes);
app.use('/api/command-center', commandCenterRoutes);
app.use('/api/simulations', simulationsRoutes);
app.use('/api/ceo-ai', ceoAiRoutes);
app.use('/api/digital-twin', digitalTwinRoutes);
app.use('/api/ai', aiRoutes);

app.use(errorHandler);

export default app;
