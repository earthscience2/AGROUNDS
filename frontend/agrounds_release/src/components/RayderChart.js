import React, { useRef, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import styled from 'styled-components';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const RayderChart = ({ data, rate }) => {
  const chartRef = useRef();

  const convertedData = data.map(value => value * 10);

  const chartData = {
    labels: ['평점', '스프린트', '가속도', '스피드', '적극성', '체력'],
    datasets: [
      {
        label: '',
        data: convertedData,
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: '#10CC7E80',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(0,0,0,0)', 
        pointBorderColor: 'rgba(0, 0, 0, 0)', 
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold',
          },
          color: '#525252',
          padding: 20,
        },
        angleLines: {
          color: '#E0E0E0',
        },
        grid: {
          color: '#E0E0E0',
          circular: true,
        },
        ticks: {
          display: false,
          stepSize: 25,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, 
      },
      datalabels: {
        display: false, 
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
    <RaderStyle>
      <Radar ref={chartRef} data={chartData} options={chartOptions} />
    </RaderStyle>
  );
};

export default RayderChart;

const RaderStyle = styled.div`
  width: 38vh;
  height: 38vh;
  margin-top: -10vh;
`;
