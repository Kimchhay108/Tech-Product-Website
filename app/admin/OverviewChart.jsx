"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function OverviewChart({ data, title }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">Loading chart...</p>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500">No chart data yet</p>
            </div>
        );
    }

    const chartData = {
        labels: data.map((d) => d.date),
        datasets: [
            {
                label: title,
                data: data.map((d) => d.value),
                borderWidth: 2,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: true },
        },
    };

    return (
        <div className="bg-white p-4 rounded shadow">
            <Line data={chartData} options={options} />
        </div>
    );
}
