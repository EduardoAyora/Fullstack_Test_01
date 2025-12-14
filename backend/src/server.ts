import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';


const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor', error);
    process.exit(1);
  }
};

startServer();
