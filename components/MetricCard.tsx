import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  secondaryLabel?: string;
  secondaryValue?: string | number;
  secondaryLabel2?: string;
  secondaryValue2?: string | number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, secondaryLabel, secondaryValue, secondaryLabel2, secondaryValue2, icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-bold text-[#333333]">{value}</p>
        {(secondaryLabel || secondaryLabel2) && (
          <div className="mt-2 flex space-x-4">
            {secondaryLabel && (
              <div className="text-left">
                <p className="text-sm font-semibold text-[#333333]">{secondaryValue}</p>
                <p className="text-xs text-gray-500">{secondaryLabel}</p>
              </div>
            )}
             {secondaryLabel2 && (
              <div className="text-left">
                <p className="text-sm font-semibold text-[#333333]">{secondaryValue2}</p>
                <p className="text-xs text-gray-500">{secondaryLabel2}</p>
              </div>
            )}
          </div>
        )}
      </div>
       <div className="text-[#0066CC] bg-[#EBF5FF] p-2 rounded-full">
         {icon}
      </div>
    </div>
  );
};

export default MetricCard;