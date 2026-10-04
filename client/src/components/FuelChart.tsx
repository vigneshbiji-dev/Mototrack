import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Filler,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Filler)

interface FuelChartProps {
  data: { month: string; amount: number }[]
}

export default function FuelChart({ data }: FuelChartProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        data: data.map((d) => d.amount),
        backgroundColor: 'rgba(80, 145, 98, 0.5)',
        borderColor: '#509162',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#B4B1A6', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(67, 71, 70, 0.5)' },
        ticks: {
          color: '#B4B1A6',
          font: { size: 11 },
          callback: (v: number | string) => `₹${v}`,
        },
      },
    },
  }

  return (
    <div className="h-64 w-full">
      <Bar data={chartData} options={options} />
    </div>
  )
}
