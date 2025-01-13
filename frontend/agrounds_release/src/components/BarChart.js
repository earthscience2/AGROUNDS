import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OvrBarChart = ({ data }) => {
  const chartRef = useRef();

  const convertedData = data.map(value => value * 10);
  const chartData = {
    labels: ['체력', '순발력', '스피드', '가속도', '스프린트'],
    datasets: [
      {
        label: '',
        data: convertedData,
        backgroundColor: ['#5BECB0', '#29E2A0', '#1BD39E', '#14C19A', '#18BDA5'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      dataLabelPlugin: {
        afterDatasetsDraw: (chart) => {
          const { ctx } = chart;
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((bar, index) => {
              const value = dataset.data[index];
              ctx.save();
              ctx.font = 'bold 14px Arial';
              ctx.fillStyle = '#000';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText(value, bar.x, bar.y + 30);
              ctx.restore();
            });
          });
        },
      },
    },
    scales: {
      x: {
        barPercentage: 1.0,
        categoryPercentage: 1,
        ticks: {
          color: '#666',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <ChartContainer>
      <Bar ref={chartRef} data={chartData} options={chartOptions} />
    </ChartContainer>
  );
};

export default OvrBarChart;

const ChartContainer = styled.div`
  width: 90%;
  margin: 0;
  border: none;
  margin-top: 1.5vh;
`;
