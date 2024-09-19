import { PrismaClient } from '@prisma/client';
import { checkAirQuality } from '../utils/airQualityChecker';

const prisma = new PrismaClient();

export interface AirQualityData {
  id?: string;
  stasiun: string;
  pm10: number;
  pm25: number;
  so2: number;
  o3: number;
  co: number;
  no2: number;
  kategori: string;
  created_at?: Date;
  updated_at?: Date;
}

export const AirQualityModel = {
  generateId(stasiun: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const stationCode = stasiun.slice(0, 3).toUpperCase();
    
    return `${year}${month}${day}${stationCode}`;
  },

  async create(data: AirQualityData): Promise<AirQualityData> {
    const { stasiun, pm10, pm25, so2, o3, co, no2 } = data;
    let id = this.generateId(stasiun);
    
    const kategori = checkAirQuality({ pm10, pm25, so2, o3, no2 });
    
    let result;
    let increment = 0;
    
    do {
      try {
        const finalId = increment === 0 ? id : `${id}${increment}`;
        result = await prisma.iSPU_Jakarta_2024.create({
          data: {
            id: finalId,
            stasiun,
            pm10,
            pm25,
            so2,
            o3,
            co,
            no2,
            kategori
          }
        });
        break;
      } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'P2002') {
          increment++;
        } else {
          throw error;
        }
      }
    } while (true);

    return result;
  },

  async findById(id: string): Promise<AirQualityData | null> {
    return prisma.iSPU_Jakarta_2024.findUnique({
      where: { id }
    });
  },

  async findLimitData(page: number = 1, limit: number = 10): Promise<{ data: AirQualityData[], total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.iSPU_Jakarta_2024.findMany({
        take: limit,
        skip,
        orderBy: { created_at: 'desc' }
      }),
      prisma.iSPU_Jakarta_2024.count()
    ]);

    return { data, total };
  },

  async getAll(): Promise<AirQualityData[]> {
    return prisma.iSPU_Jakarta_2024.findMany();
  },

  async update(id: string, data: Partial<AirQualityData>): Promise<AirQualityData | null> {
    const { stasiun, pm10, pm25, so2, o3, co, no2 } = data;
    
    let needsKategoriUpdate = pm10 !== undefined || pm25 !== undefined || so2 !== undefined || o3 !== undefined || no2 !== undefined;

    let updateData: any = { ...data };

    if (needsKategoriUpdate) {
      const currentData = await this.findById(id);
      if (currentData) {
        const updatedData = { ...currentData, ...data };
        const newKategori = checkAirQuality({
          pm10: updatedData.pm10,
          pm25: updatedData.pm25,
          so2: updatedData.so2,
          o3: updatedData.o3,
          no2: updatedData.no2
        });
        updateData.kategori = newKategori;
      }
    }

    updateData.updated_at = new Date();

    return prisma.iSPU_Jakarta_2024.update({
      where: { id },
      data: updateData
    });
  },

  async delete(id: string): Promise<boolean> {
    const result = await prisma.iSPU_Jakarta_2024.delete({
      where: { id }
    });
    return !!result;
  },

  async getKategoriCounts(): Promise<{ kategori: string; count: number }[]> {
    return prisma.iSPU_Jakarta_2024.groupBy({
      by: ['kategori'],
      _count: {
        kategori: true
      }
    }).then(results => results.map(r => ({
      kategori: r.kategori,
      count: r._count.kategori
    })));
  },

  async getStationAQI(): Promise<{ stasiun: string; aqi: number }[]> {
    // Implementasi ini mungkin perlu disesuaikan tergantung pada kemampuan Prisma
    // untuk melakukan operasi yang kompleks seperti ini
    const results = await prisma.$queryRaw`
      SELECT stasiun, 
             ROUND(GREATEST(
               COALESCE(pm10 / 3, 0),
               COALESCE(pm25 / 1.5, 0),
               COALESCE(so2 / 1.3, 0),
               COALESCE(o3 / 2, 0),
               COALESCE(co / 100, 0),
               COALESCE(no2 / 2, 0)
             )) as aqi
      FROM "ISPU_Jakarta_2024"
      WHERE created_at = (
        SELECT MAX(created_at)
        FROM "ISPU_Jakarta_2024" sub
        WHERE sub.stasiun = "ISPU_Jakarta_2024".stasiun
      )
      ORDER BY aqi DESC
    `;
    return results as { stasiun: string; aqi: number }[];
  }
};