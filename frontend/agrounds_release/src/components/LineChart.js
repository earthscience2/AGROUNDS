import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Title,
  Tooltip,
  Legend
);

const CustomLineChart = ({ data, speed, dates }) => {
  const isEmpty = !data || data.length !== 5;
  
  const placeholderData = [0, 0, 0, 0, 0];
  const processedData = isEmpty ? placeholderData : data.map((value) => value * 10);

  // 날짜 포맷팅 함수 (월.일 형식)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}.${day}`;
  };

  const minY = Math.min(...processedData);
  const maxY = Math.max(...processedData);

  const lineChartData = {
    labels: ['_', '_', '_', '_', '_'],
    datasets: [
      {
        label: '_',
        data: processedData,
        borderColor: isEmpty ? 'rgba(0,0,0,0)' : data[4] > data[3] ? '#10CC7E' : '#EC5858',
        borderWidth: 2,
        backgroundColor: 'rgba(0,0,0,0)',
        tension: 0.3,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        display: true,
        grid: {
          drawBorder: true,
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        display: true,
        min: isEmpty ? 0 : Math.floor(minY - 5),
        max: isEmpty ? 100 : Math.ceil(maxY + 5),
        ticks: { display: false },
        grid: {
          drawBorder: false,
          drawOnChartArea: !isEmpty,
          drawTicks: false,
          color: '#E0E0E0',
        },
      },
    },
  };


  return (
    <div style={{ width: '100%', height: '6vh', position: 'relative' }}>
      <Line data={lineChartData} options={lineChartOptions} />

      {isEmpty && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '8%',
            right: '8%',
            display: 'flex',
            justifyContent: 'space-between',
            transform: 'translateY(-50%)',
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '2px',
                backgroundColor: '#DADADA',
                width: '7%',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}

      {/* 시작과 끝 점에 날짜 표시 */}
      {!isEmpty && dates && dates.length >= 2 && (
        <>
          {/* 시작점 날짜 */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              left: '8%',
              fontSize: '1.2vh',
              color: '#525252',
              fontWeight: '500',
              transform: 'translateX(-50%)',
            }}
          >
            {formatDate(dates[0])}
          </div>
          {/* 끝점 날짜 */}
          <div
            style={{
              position: 'absolute',
              top: '-15%',
              right: '8%',
              fontSize: '1.2vh',
              color: '#525252',
              fontWeight: '500',
              transform: 'translateX(50%)',
            }}
          >
            {formatDate(dates[dates.length - 1])}
          </div>
        </>
      )}

      {/* {!isEmpty && (
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            transform: 'translateY(-50%)',
            fontSize: '1.5vh',
            color: '#525252',
            fontWeight: 'bold',
          }}
        >
          {speed ? data[4] : data[4] * 10 || 'N/A'}
        </div>
      )} */}
    </div>
  );
};


export default CustomLineChart;
