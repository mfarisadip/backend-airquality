import { AirQualityModel, AirQualityData } from '../models/airQualityModel';

export const AirQualityController = {
  async create(data: AirQualityData) {
    try {
      const id = AirQualityModel.generateId(data.stasiun);
      const newData = await AirQualityModel.create({ ...data, id });
      
      return { success: true, data: newData };
    } catch (error) {
      console.error('Failed to create air quality data:', error);
      return { success: false, error: 'Failed to create air quality data' };
    }
  },

  async getById(id: string) {
    try {
      const data = await AirQualityModel.findById(id);
      if (!data) {
        return { success: false, error: 'Air quality data not found' };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve air quality data' };
    }
  },

  async getLimitData(page: number = 1, limit: number = 10) {
    try {
      const { data, total } = await AirQualityModel.findLimitData(page, limit);
      const totalPages = Math.ceil(total / limit);
      return { 
        success: true, 
        data, 
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve air quality data' };
    }
  },

  async getAll() {
    try {
      const data = await AirQualityModel.getAll();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to retrieve air quality data' };
    }
  },

  async update(id: string, data: Partial<AirQualityData>) {
    try {
      console.log(`Attempting to update air quality data with id: ${id}`);
      const updatedData = await AirQualityModel.update(id, data);
      if (!updatedData) {
        console.log(`Air quality data with id ${id} not found`);
        return { success: false, error: 'Air quality data not found' };
      }
      console.log(`Successfully updated air quality data with id: ${id}`);
      return { success: true, data: updatedData };
    } catch (error) {
      console.error(`Failed to update air quality data with id ${id}:`, error);
      return { success: false, error: 'Failed to update air quality data' };
    }
  },

  async delete(id: string) {
    try {
      const deleted = await AirQualityModel.delete(id);
      if (!deleted) {
        return { success: false, error: 'Air quality data not found' };
      }
      return { success: true, message: 'Air quality data deleted successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to delete air quality data' };
    }
  },

  async getKategoriCounts() {
    try {
      const counts = await AirQualityModel.getKategoriCounts();
      return { success: true, data: counts };
    } catch (error) {
      console.error('Gagal mengambil jumlah kategori:', error);
      return { success: false, error: 'Gagal mengambil jumlah kategori' };
    }
  },

  async getStationAQI() {
    try {
      const aqi = await AirQualityModel.getStationAQI();
      return { success: true, data: aqi };
    } catch (error) {
      console.error('Gagal mengambil AQI stasiun:', error);
      return { success: false, error: 'Gagal mengambil AQI stasiun' };
    }
  }
};