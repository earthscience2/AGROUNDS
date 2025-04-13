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

const RayderChart = ({ data, error}) => {
  const chartRef = useRef();

  const convertedData = error ? [50, 50, 50, 50, 50, 50] : data.map(value => value * 10);

  const chartData = {
    labels: ['평점', '스프린트', '가속도', '스피드', '적극성', '체력'],
    datasets: [
      {
        label: '',
        data: convertedData,
        backgroundColor: error ? 'rgba(193,199,205, 0.2)' : 'rgba(0, 255, 0, 0.2)',
        borderColor: error ? '#C1C7CD' : '#10CC7E80',
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
  width: 42vh;
  height: 42vh;
`;
