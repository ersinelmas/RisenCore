import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ data }) {
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        label: 'Expenses',
        data: data.map(item => item.totalAmount),
        backgroundColor: [
          '#818cf8', // Indigo 400
          '#f87171', // Red 400
          '#fbbf24', // Amber 400
          '#4ade80', // Green 400
          '#60a5fa', // Blue 400
          '#fb923c', // Orange 400
          '#a78bfa', // Violet 400
          '#2dd4bf', // Teal 400
        ],
        borderColor: 'var(--color-bg-card)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Konteynerin boyutlarına daha iyi uymasını sağlar
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'var(--color-text-secondary)',
          font: {
            weight: '500',
          },
          boxWidth: 12,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: 'Expense Distribution by Category',
        color: 'var(--color-text-primary)',
        font: {
            size: 16,
            weight: '600'
        },
        padding: {
            bottom: 20
        }
      },
    },
  };

  // Chart.js'in boyut sorunlarını çözmek için sarmalayıcı div.
  return (
    <div style={{ position: 'relative', height: '400px', width: '100%', maxWidth: '400px', margin: 'auto' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}

export default ExpenseChart;