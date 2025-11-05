import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  secondaryLabel?: string;
  secondaryValue?: string | number;
  secondaryLabel2?: string;
  secondaryValue2?: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'orange' | 'yellow' | 'green' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, secondaryLabel, secondaryValue, secondaryLabel2, secondaryValue2, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-[#0066CC] bg-[#EBF5FF]',
    orange: 'text-[#FF9933] bg-[#FFF8F0]',
    yellow: 'text-[#F59E0B] bg-[#FFFBEB]',
    green: 'text-[#339966] bg-[#F0F9F4]',
    purple: 'text-[#993399] bg-[#FBF5FB]',
  };
    
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm dark:border dark:border-gray-700 flex items-start justify-between transition-colors duration-300">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
        {(secondaryLabel || secondaryLabel2) && (
          <div className="mt-2 flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4">
            {secondaryLabel && (
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{secondaryValue}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{secondaryLabel}</p>
              </div>
            )}
             {secondaryLabel2 && (
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{secondaryValue2}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{secondaryLabel2}</p>
              </div>
            )}
          </div>
        )}
      </div>
       <div className={`${colorClasses[color]} p-2 rounded-full`}>
         {icon}
      </div>
    </div>
  );
};

export default MetricCard;