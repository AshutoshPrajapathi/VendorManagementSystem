import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'tailwindcss/tailwind.css';

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement, Tooltip, Legend, ChartDataLabels);

const SalesReport = () => {
  const [timeRange, setTimeRange] = useState('today');

  const getChartData = (range) => {
    switch (range) {
      case 'today':
        return {
          labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'],
          datasets: [
            {
              type: 'bar',
              label: 'Team A',
              data: [3, 2, 1, 3, 2, 1, 2],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Team B',
              data: [2, 3, 1, 2, 3, 1, 3],
              borderColor: '#FFA726',
              backgroundColor: 'rgba(255, 167, 38, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              type: 'line',
              label: 'Team C',
              data: [1, 2, 3, 1, 2, 3, 1],
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        };
      case 'week':
        return {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              type: 'bar',
              label: 'Team A',
              data: [20, 30, 50, 40, 30, 50, 60],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Team B',
              data: [30, 20, 40, 30, 20, 40, 50],
              borderColor: '#FFA726',
              backgroundColor: 'rgba(255, 167, 38, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              type: 'line',
              label: 'Team C',
              data: [40, 50, 20, 50, 30, 20, 30],
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        };
      case 'month':
        return {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              type: 'bar',
              label: 'Team A',
              data: [50, 60, 70, 80],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Team B',
              data: [60, 50, 80, 70],
              borderColor: '#FFA726',
              backgroundColor: 'rgba(255, 167, 38, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              type: 'line',
              label: 'Team C',
              data: [70, 80, 60, 50],
              borderColor: '#42A5F5',
              backgroundColor: 'rgba(66, 165, 245, 0.2)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        };
      default:
        return {};
    }
  };

  const combinedOptions = {
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuad',
      from: 0,
      loop: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          color: '#000',
        },
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
        ticks: {
          color: '#000',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#000',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    },
  };

  const pieData = {
    labels: ['Group A', 'Group B', 'Group C', 'Group D'],
    datasets: [
      {
        data: [20, 20, 40, 30],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: '#fff',
        formatter: (value, context) => {
          let sum = 0;
          const dataArr = context.chart.data.datasets[0].data;
          dataArr.forEach(data => {
            sum += data;
          });
          const percentage = ((value / sum) * 100).toFixed(1) + '%';
          return percentage;
        },
        font: {
          size: 16,
          weight: 'bold',
        },
        anchor: 'end',
        align: 'start',
        offset: 10,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center p-6 gap-6 bg-gray-100">
      <div className="w-full lg:w-2/3 p-4 bg-white rounded-xl shadow-lg transition-transform duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center">Sales</h2>
          <select className="border border-gray-300 rounded p-2" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="relative h-80">
          <Line data={getChartData(timeRange)} options={combinedOptions} />
        </div>
      </div>
      <div className="w-full lg:w-1/3 p-4 bg-white rounded-xl shadow-lg transition-transform duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center">Customer Engagement</h2>
          <select className="border border-gray-300 rounded p-2" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="relative h-80">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default SalesReport; 