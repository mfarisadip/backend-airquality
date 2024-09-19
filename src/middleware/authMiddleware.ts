// src/middleware/authMiddleware.ts
import { Elysia } from 'elysia';

export const authMiddleware = new Elysia()
  .derive(({ request, set, jwt }) => {
    return {
      auth: async () => {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          set.status = 401;
          throw new Error('Tidak diizinkan: Token tidak disediakan');
        }

        const token = authHeader.split(' ')[1];
        try {
          const payload = await jwt.verify(token);
          if (!payload) {
            set.status = 401;
            throw new Error('Tidak diizinkan: Token tidak valid');
          }
          // Tambahkan validasi tambahan jika diperlukan
          if (!payload.userId || !payload.username) {
            set.status = 401;
            throw new Error('Tidak diizinkan: Token tidak memiliki informasi yang diperlukan');
          }
          return payload;
        } catch (error) {
          set.status = 401;
          throw new Error('Tidak diizinkan: Token tidak valid');
        }
      }
    };
  });