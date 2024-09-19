import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { jwt } from '@elysiajs/jwt';
import { AirQualityController } from './controllers/airQualityController';
import { authMiddleware } from './middleware/authMiddleware';
import { checkAirQuality } from './utils/airQualityChecker';

interface CustomError extends Error {
  status?: number;
}

const app = new Elysia()
  .use(cors())
  // .use(jwt({
  //   name: 'jwt',
  //   secret: process.env.JWT_SECRET || 'your-secret-key'
  // }))
  .get('/', () => 'Air Quality Monitoring API')
  .group('/api/v1/air-quality', app => app
    .use(authMiddleware)
    .get('/', async ({ query }) => {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      return AirQualityController.getLimitData(page, limit);
    })
    .get('/all', async ({ query }) => {
      return AirQualityController.getAll();
    })
    .get('/:id', async ({ params: { id } }) => {
      return AirQualityController.getById(id);
    })
    .post('/', async ({ body }) => {
      return AirQualityController.create(body as any);
    })
    .put('/:id', async ({ params: { id }, body }) => {
      const result = await AirQualityController.update(id, body as any);
      console.log(`Update request for id ${id}:`, result);
      return result;
    })
    .delete('/:id', async ({ params: { id } }) => {
      return AirQualityController.delete(id);
    })
    .post('/predict', ({ body }: { body: { pm10: number, pm25: number, so2: number, o3: number, no2: number } }) => {
      if (!body || !body.pm10 || !body.pm25 || !body.so2 || !body.o3 || !body.no2) {
        return { error: 'Data tidak lengkap' }
      }
      const result = checkAirQuality(body);
      return { prediction: result };
    })
    .get('/kategori-counts', async () => {
      return AirQualityController.getKategoriCounts();
    })
    .get('/station-aqi', async () => {
      return AirQualityController.getStationAQI();
    })
    // .post('/login', async ({ body } : { body: { username: string, password: string } }) => {
    //   if (body.username === 'admin' && body.password === 'password') {
    //     const token = await jwt.sign({ 
    //       userId: 1, 
    //       username: body.username 
    //     })
    //     return { token }
    //   }
    //   return { error: 'Invalid credentials' }
    // })
  )
  
  .onError(({ error, set }) => {
    console.error(error);
    set.status = (error as CustomError).status || 500;
    return { error: error.message };
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);