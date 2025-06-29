import React, { useEffect, useState, useRef } from 'react';
import { Card, DatePicker, Empty, Space, Button, theme } from 'antd';
import { Area } from '@ant-design/plots';
import dayjs from 'dayjs';
import { DownloadOutlined } from '@ant-design/icons';
import { toPng } from 'html-to-image';
import { getPerformance, PerformanceData } from '../../services/billing/reporting';
import { useAuth } from "@/context/AuthContext";

const { RangePicker } = DatePicker;

const PerformanceChart: React.FC = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isDarkMode = user?.profile?.theme_mode === 'dark';
  const { token } = theme.useToken();

  const fetchData = async (startDate?: string, endDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching performance data...', { startDate, endDate });
      const result = await getPerformance(startDate, endDate);
      console.log('Received performance data:', result);
      setData(result);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get the last 30 days to ensure we find at least 7 days with data
    const today = dayjs();
    const thirtyDaysAgo = today.subtract(29, 'day');
    fetchData(
      thirtyDaysAgo.format('YYYY-MM-DD'),
      today.format('YYYY-MM-DD')
    );
  }, []);

  const handleDateChange = (dates: any) => {
    if (!dates) {
      const today = dayjs();
      const thirtyDaysAgo = today.subtract(29, 'day');
      fetchData(
        thirtyDaysAgo.format('YYYY-MM-DD'),
        today.format('YYYY-MM-DD')
      );
      return;
    }
    const [start, end] = dates;
    fetchData(
      start.format('YYYY-MM-DD'),
      end.format('YYYY-MM-DD')
    );
  };

  const handleDownload = async () => {
    if (chartRef.current) {
      try {
        const dataUrl = await toPng(chartRef.current, {
          backgroundColor: isDarkMode ? token.colorBgContainer : '#fff',
        });
        const link = document.createElement('a');
        link.download = `performance-chart-${dayjs().format('YYYY-MM-DD')}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error downloading chart:', error);
      }
    }
  };

  if (error) {
    return (
      <Card title="Performance" style={{ width: '100%' }}>
        <Empty
          description={<span style={{ color: 'red' }}>{error}</span>}
        />
      </Card>
    );
  }

  if (!data || !data.dates || data.dates.length === 0) {
    return (
      <Card title="Performance" loading={loading} style={{ width: '100%' }}>
        <Empty description="No performance data available" />
      </Card>
    );
  }

  // Filter out days with zero values in both ALG and groupage
  const nonZeroDays = data.dates.reduce<number[]>((acc, _, index) => {
    if (data.alg_data[index] > 0 || data.groupage_data[index] > 0) {
      acc.push(index);
    }
    return acc;
  }, []);

  // Get the last 7 days with non-zero values
  const lastSevenNonZeroDays = nonZeroDays.slice(-7);

  // Filter data to only include these days
  const filteredDates = lastSevenNonZeroDays.map(index => data.dates[index]);
  const filteredAlgData = lastSevenNonZeroDays.map(index => data.alg_data[index]);
  const filteredGroupageData = lastSevenNonZeroDays.map(index => data.groupage_data[index]);

  // Transform data for the chart
  const chartData = [
    ...filteredDates.map((date, index) => ({
      date,
      value: filteredAlgData[index],
      category: 'ALG'
    })),
    ...filteredDates.map((date, index) => ({
      date,
      value: filteredGroupageData[index],
      category: 'Groupage'
    }))
  ];

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    color: ['#1677ff', '#52c41a'],
    xAxis: {
      range: [0, 1],
      tickCount: Math.min(7, filteredDates.length),
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${Number(v).toLocaleString()} TND`,
      },
    },
    areaStyle: () => {
      return {
        fillOpacity: 0.6,
      };
    },
    appendPadding: [10, 0, 0, 0],
    isStack: false,
    startOnZero: true,
    slider: {
      start: 0,
      end: 1,
    },
    theme: isDarkMode ? 'dark' : 'light',
    backgroundColor: token.colorBgContainer,
  };

  return (
    <Card
      title="Performance"
      extra={
        <Space>
          <RangePicker
            onChange={handleDateChange}
            defaultValue={[
              dayjs().subtract(29, 'day'),
              dayjs()
            ]}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Space>
      }
      style={{ width: '100%', height: '500px', borderRadius: '16px' }}
      loading={loading}
    >
      <div ref={chartRef} style={{ height: 400 }}>
        <Area {...config} />
      </div>
    </Card>
  );
};

export default PerformanceChart;
