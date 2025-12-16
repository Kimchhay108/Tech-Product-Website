"use client";
import dynamic from "next/dynamic";

// ApexCharts must be dynamically imported in Next.js
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OverviewChart({ data, type = "line", title, color = "#22c55e" }) {
  const options = {
    chart: { id: "overview-chart", toolbar: { show: false } },
    xaxis: { categories: data.map(d => d.date) },
    stroke: { curve: "smooth" },
    colors: [color],
    title: { text: title, align: "left", style: { fontSize: "16px" } },
    tooltip: { theme: "light" },
  };

  const series = [{ name: title, data: data.map(d => d.value) }];

  return <Chart options={options} series={series} type={type} height={300} />;
}
