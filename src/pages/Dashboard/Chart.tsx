import { Column } from '@ant-design/plots';

const DemoDefaultTooltip = () => {
  const data = [
    {
      month: 'Jan',
      amount: 3000,
      client: 'Client A',
    },
    {
      month: 'Feb',
      amount: 4500,
      client: 'Client A',
    },
    {
      month: 'Jan',
      amount: 2000,
      client: 'Client B',
    },
    {
      month: 'Feb',
      amount: 2500,
      client: 'Client B',
    },
  ];

  const config = {
    data,
    isStack: false,
    xField: 'month',
    yField: 'amount',
    seriesField: 'client',
    colorField: 'client', 
    color: ['#1979C9', '#D62A0D', '#FAA219', '#0349A5', '#A0D911', '#13C2C2', '#EB2F96', '#722ED1'], 
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
      formatter: (datum: any) => `${datum.amount.toLocaleString()} DA`,
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => `${parseInt(v).toLocaleString()} DA`,
      },
    },
    meta: {
      month: { alias: 'Month' },
      amount: { 
        alias: 'Amount',
        formatter: (v: number) => `${v.toLocaleString()} DA`,
      },
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum: any) => {
        return {
          name: datum.client,
          value: `${datum.amount.toLocaleString()} DA`,
        };
      },
    },
    interactions: [
      {
        type: 'element-highlight-by-color',
      },
      {
        type: 'element-link',
      },
    ],
    legend: {
      position: 'top',
      flipPage: false,
    },
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  return <Column {...config} height={200} />;
};

export default DemoDefaultTooltip;
