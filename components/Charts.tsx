import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface TechnicianChartProps {
  data: ChartData[];
}

export const TechnicianChart: React.FC<TechnicianChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-80 flex flex-col">
      <div>
        <h3 className="font-bold text-[#333333]">Produtividade por Técnico</h3>
        <p className="text-xs text-gray-500 mt-1">Exibindo os técnicos com mais chamados.</p>
      </div>
      <div className="flex-grow mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={60} tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} />
            <Bar dataKey="value" name="Chamados" fill="#0066CC" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

interface CategoryChartProps {
  data: ChartData[];
}

const COLORS = ['#0066CC', '#339966', '#FF9933', '#CC3333', '#6699CC', '#993399'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  // Only render label if the slice is large enough to contain it
  if (percent < 0.05) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '12px', fontWeight: 'bold', pointerEvents: 'none' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm h-80 flex flex-col">
      <div>
        <h3 className="font-bold text-[#333333]">Chamados por Categoria</h3>
        <p className="text-xs text-gray-500 mt-1">Distribuição das categorias mais comuns.</p>
      </div>
       <div className="flex-grow mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={85}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string, props) => [`${value} chamados (${(props.payload.percent * 100).toFixed(1)}%)`, name]} />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
};
