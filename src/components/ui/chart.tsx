
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as ReChartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

interface ChartProps {
  type: "bar" | "line" | "pie" | "radar" | "radialBar";
  data: any[];
  height?: number;
  width?: number;
  options?: any;
}

const COLORS = ["#6366f1", "#8b5cf6", "#d946ef", "#ec4899", "#f43f5e", "#f97316"];

export function Chart({ type, data, height = 300, width = 500, options }: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={options?.xAxis || "name"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={options?.dataKey || "value"} stroke="#6366f1" activeDot={{ r: 8 }} />
          </LineChart>
        );
      case "bar":
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={options?.xAxis || "name"} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={options?.dataKey || "value"} fill="#6366f1" />
          </BarChart>
        );
      case "pie":
        return (
          <ReChartsPieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={options?.dataKey || "value"}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </ReChartsPieChart>
        );
      case "radar":
        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Score" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            <Legend />
            <Tooltip />
          </RadarChart>
        );
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
}
