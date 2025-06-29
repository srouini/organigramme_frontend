import axios from 'axios';

export async function getDailyEarningsStats() {
  try {
    const response = await axios.get('/api/billing/reporting/daily_earnings_stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching earnings stats:', error);
    throw error;
  }
}


export async function getMonthlyEarningsStats() {
  try {
    const response = await axios.get('/api/billing/reporting/monthly_earnings_stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching earnings stats:', error);
    throw error;
  }
}


export async function getYearlyEarningsStats() {
  try {
    const response = await axios.get('/api/billing/reporting/yearly_earnings_stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching earnings stats:', error);
    throw error;
  }
}


export interface PerformanceData {
  dates: string[];
  alg_data: number[];
  groupage_data: number[];
}

export async function getPerformance(startDate?: string, endDate?: string) {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    console.log('Requesting performance data with params:', Object.fromEntries(params));
    
    const response = await axios.get('/api/billing/reporting/performance/', { 
      params,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    console.log('Performance API response:', response);
    
    if (!response.data || !response.data.dates) {
      throw new Error('Invalid response format from performance API');
    }
    
    return response.data as PerformanceData;
  } catch (error) {
    console.error('Error in getPerformance:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw error;
  }
}
