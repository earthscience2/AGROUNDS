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

const CustomLineChart = ({ data }) => {
  const LineColor = () => {
    if(data[4] > data[3]){
      return '#10CC7E';
    }else {
      return '#EC5858';
    }
  }
  const lineChartData = {
    labels: ['_','_','_','_','_'] ,
    datasets: [
      {
        label: '_',
        data: data, 
        borderColor: LineColor,
        borderWidth: 2,
        backgroundColor: 'rgba(206, 212, 218, 0.2)', 
        tension: .3, 
        fill: false,
        pointRadius: 0, 
        pointHoverRadius: 0,
        color: '#FFFFFF'
      },
      
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false, 
      },
      datalabels: {
        display: false, 
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true, 
        ticks: {
          display: false, 
        },
        grid: {
          drawBorder: false, 
          drawOnChartArea: true, 
          drawTicks: false, 
        },
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '6vh', position: 'relative' }}>
      <Line data={lineChartData} options={lineChartOptions} />
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          transform: 'translateY(-50%)',
          fontSize: '1.8vh',
          color: '#525252',
          fontWeight: 'bold',
        }}
      >
          {data[4] * 10 || "N/A"}
      </div>
    </div>
  );
};

export default CustomLineChart;