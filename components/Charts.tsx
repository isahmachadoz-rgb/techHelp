import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  theme: string;
}

const ChartTooltip = ({ active, payload, label, theme }: any) => {
  if (active && payload && payload.length) {
    const isDark = theme === 'dark';
    const style = {
      backgroundColor: isDark ? '#2D3748' : '#FFFFFF',
      border: `1px solid ${isDark ? '#4A5568' : '#E2E8F0'}`,
      borderRadius: '0.5rem',
      padding: '0.5rem 1rem',
      color: isDark ? '#FFFFFF' : '#000000',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    };
    const value = payload[0].value;
    const name = payload[0].name;
    const percent = payload[0].payload.percent;
    return (
      <div style={style} className="text-sm">
        <p className="font-bold mb-1">{label || name}</p>
        <p>{`Chamados: ${value}`}{percent && ` (${(percent * 100).toFixed(1)}%)`}</p>
      </div>
    );
  }
  return null;
};

export const TechnicianChart: React.FC<ChartProps> = ({ data, theme }) => {
  const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568';
  const gridColor = theme === 'dark' ? '#4A5568' : '#E2E8F0';

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm dark:border dark:border-gray-700 h-80 flex flex-col transition-colors duration-300">
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Produtividade por Técnico</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Exibindo os técnicos com mais chamados.</p>
      </div>
      <div className="flex-grow mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={60} tick={{ fontSize: 12, fill: tickColor }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tickColor }} />
            <Tooltip content={<ChartTooltip theme={theme} />} cursor={{ fill: theme === 'dark' ? 'rgba(113, 128, 150, 0.2)' : 'rgba(239, 246, 255, 0.7)' }} />
            <Bar dataKey="value" name="Chamados" fill="#0066CC" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

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


export const CategoryChart: React.FC<ChartProps> = ({ data, theme }) => {
  const tickColor = theme === 'dark' ? '#A0AEC0' : '#4A5568';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768); // Tailwind's md breakpoint
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);


  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm dark:border dark:border-gray-700 h-80 flex flex-col transition-colors duration-300">
      <div>
        <h3 className="font-bold text-gray-800 dark:text-gray-100">Chamados por Categoria</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Distribuição das categorias mais comuns.</p>
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
                outerRadius={isMobile ? 70 : 85}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip theme={theme} />} />
              <Legend 
                iconSize={10} 
                layout={isMobile ? 'horizontal' : 'vertical'} 
                verticalAlign={isMobile ? 'bottom' : 'middle'} 
                align={isMobile ? 'center' : 'right'} 
                wrapperStyle={{ color: tickColor, fontSize: '12px', paddingTop: isMobile ? '10px' : '0' }} 
              />
            </PieChart>
          </ResponsiveContainer>
       </div>
    </div>
  );
};