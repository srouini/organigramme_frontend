import RcResizeObserver from 'rc-resize-observer';
import { useState, useEffect } from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Typography, Card } from 'antd';
import { getMonthlyEarningsStats } from '@/services/billing/reporting';
const { Text } = Typography;

interface EarningsStats {
  current: number;
  previous: number;
  percentage_change: number;
  difference: number;
  trend: 'up' | 'down';
  color: 'green' | 'red';
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2
  }).format(value);
};

export default () => {
  const [responsive, setResponsive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningsStats | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getMonthlyEarningsStats();
      setEarningsData(data);
    } catch (error) {
      console.error('Failed to fetch earnings stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const getArrowsCount = (percentage: number): number => {
    const absPercentage = Math.abs(percentage);
    if (absPercentage >= 100) return 4;
    if (absPercentage >= 50) return 3;
    if (absPercentage >= 25) return 2;
    return 1;
  };

  const renderTrendIndicator = (stats: EarningsStats) => {
    const Icon = stats.trend === 'up' ? ArrowUpOutlined : ArrowDownOutlined;
    const arrowsCount = getArrowsCount(stats.percentage_change);
    
    return (
      <div className="trend-indicator" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px',
        padding: '12px',
        background: stats.color === 'green' ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 77, 79, 0.1)',
        borderRadius: '8px',
        marginTop: '8px'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          flex: 1
        }}>
          <Text style={{ 
            color: stats.color, 
            fontSize: '16px', 
            fontWeight: 500 
          }}>
            {Array(arrowsCount).fill(null).map((_, index) => (
              <Icon key={index} style={{ marginRight: '2px' }} />
            ))}
            {' '}{Math.abs(stats.percentage_change)}%
          </Text>
          <Text style={{ 
            color: stats.color, 
            fontSize: '14px',
            marginTop: '4px'
          }}>
            {stats.difference > 0 ? '+' : ''}{formatCurrency(stats.difference)}
          </Text>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: stats.color,
        }}>
          <Icon style={{ 
            fontSize: '24px', 
            color: '#fff',
            transform: stats.trend === 'up' ? 'rotate(-45deg)' : 'rotate(45deg)'
          }} />
        </div>
      </div>
    );
  };

  const renderStatisticCard = (
    title: string,
    stats: EarningsStats | undefined,
    loading: boolean
  ) => (
    <Card
      loading={loading}
      style={{
        height: '100%',
        flex: 1,
        minWidth: responsive ? '100%' : '300px',
        borderRadius: '16px', 
        marginBottom: '16px'
      }}
      bodyStyle={{
        height: '100%',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Text style={{ fontSize: '16px' }}>{title}</Text>
      <Text style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        marginBottom: '5px'
        
      }}>
        {formatCurrency(stats?.current || 0)}
      </Text>
      {stats && (
        <>
          {renderTrendIndicator(stats)}
        </>
      )}
    </Card>
  );

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 896);
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: responsive ? 'column' : 'row',
        gap: '16px',
        padding: '0px'
      }}>
        
        {renderStatisticCard("This Month's Earnings", earningsData || undefined, loading)}
      </div>
    </RcResizeObserver>
  );
};