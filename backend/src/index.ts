import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import reservationRoutes from './routes/reservation.routes';
import authRoutes from './routes/auth.routes';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const requestId = uuidv4();
  const start = Date.now();

  (req as any).requestId = requestId;

  res.on('finish', () => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      userId: (req as any).userId ?? null
    }));
  });

  next();
});

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 1. Conexión a Base de Datos
connectDB();

// 2. Rutas
app.use('/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);

// 3. Middleware de Error (Debe ir después de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});