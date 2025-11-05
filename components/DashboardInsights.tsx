import React from 'react';
import type { AnalysisResult } from '../types';

interface DashboardInsightsProps {
    analysis: AnalysisResult | null;
}

const InsightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#0066CC] dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
    </svg>
);


const DashboardInsights: React.FC<DashboardInsightsProps> = ({ analysis }) => {
    
    if (!analysis || analysis.total === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm dark:border dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Insights do Dashboard</h3>
                <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                    <p>Carregue um arquivo de dados para visualizar insights automatizados.</p>
                </div>
            </div>
        );
    }
    
    const fmtPercent = (numerator: number, denominator: number): string => {
        if (denominator === 0) return '0%';
        return `${((numerator / denominator) * 100).toFixed(0)}%`;
    }
    
    const fmtHour = (hrs: number | null): string => {
        if (hrs === null || isNaN(hrs)) return 'N/A';
        const h = Math.floor(hrs);
        const m = Math.round((hrs - h) * 60);
        return `${h}h ${m}m`;
    }

    const insightsList = [
        analysis.tecnicoTop && {
            text: <><strong>{analysis.tecnicoTop.name}</strong> é o técnico mais produtivo, responsável por <strong>{analysis.tecnicoTop.count} chamados</strong> ({fmtPercent(analysis.tecnicoTop.count, analysis.total)} do total).</>
        },
        analysis.categoriaTop && {
            text: <>A categoria <strong>"{analysis.categoriaTop.name}"</strong> é a mais comum, correspondendo a <strong>{fmtPercent(analysis.categoriaTop.count, analysis.total)}</strong> dos tickets. Isso pode indicar uma área para focar em treinamentos ou melhorias de documentação.</>
        },
        analysis.categoriaMaiorTempo && {
            text: <>Os chamados de <strong>"{analysis.categoriaMaiorTempo.name}"</strong> são os que levam mais tempo para serem resolvidos, com uma média de <strong>{fmtHour(analysis.categoriaMaiorTempo.avgHours)}</strong>.</>
        },
        analysis.tecnicoMaiorSatisfacao && {
            text: <><strong>{analysis.tecnicoMaiorSatisfacao.name}</strong> se destaca com a maior média de satisfação do cliente: <strong>{analysis.tecnicoMaiorSatisfacao.avgSatisfaction.toFixed(1)} de 5</strong>.</>
        }
    ].filter(Boolean);


    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm dark:border dark:border-gray-700 transition-colors duration-300">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Insights do Dashboard</h3>
            <ul className="space-y-3">
               {insightsList.map((insight, index) => (
                   insight && (
                    <li key={index} className="flex items-start space-x-3 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex-shrink-0 pt-0.5">
                            <InsightIcon />
                        </div>
                        <span>{insight.text}</span>
                    </li>
                   )
               ))}
            </ul>
        </div>
    );
};

export default DashboardInsights;