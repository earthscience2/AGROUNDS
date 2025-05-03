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

const OvrBarChart = ({ data, error }) => {
  const chartRef = useRef();
  console.log('barchart', data)
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const labels = ['체력', '적극성', '스피드', '가속도', '스프린트'];

  if (error) {
    return (
      <ChartContainer>
        <PlaceholderContainer>
          {labels.map((label, idx) => (
            <BarBoxWrapper key={idx}>
              <BarBox>
                <BarValue>-</BarValue>
              </BarBox>
              <BarLabel>{label}</BarLabel>
            </BarBoxWrapper>
          ))}
        </PlaceholderContainer>
      </ChartContainer>

    );
  }

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: '',
        data: data,
        backgroundColor: ['#5BECB0', '#29E2A0', '#1BD39E', '#14C19A', '#18BDA5'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
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

  return (
    <ChartContainer>
      <Bar ref={chartRef} data={chartData} options={chartOptions} />
    </ChartContainer>
  );
};

export default OvrBarChart;

const ChartContainer = styled.div`
  width: 90%;
  margin: 3vh 0 0 0;
  border: none;
  margin-top: 1.5vh;
`;

const PlaceholderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1vw;
`;

const BarBoxWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BarBox = styled.div`
  width: 100%;
  height: 7vh;
  background-color: #f2f4f8;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 16px;        
`;

const BarValue = styled.div`
  font-size: 1.7vh;
  font-weight: bold;
  color: black;
`;

const BarLabel = styled.div`
  margin-top: 2vh;
  font-size: 1.5vh;
  color: #525252;
  text-align: center;
`;
