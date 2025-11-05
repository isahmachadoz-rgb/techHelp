
import React from 'react';

interface GeminiInsightsProps {
    insights: string | null;
    isLoading: boolean;
    error: string | null;
    onGenerate: () => void;
    hasData: boolean;
}

const SparkleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm6 0a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0V6h-1a1 1 0 010-2h1V3a1 1 0 011-1zm-3 8a1 1 0 011 1v1h1a1 1 0 010 2h-1v1a1 1 0 01-2 0v-1H6a1 1 0 010-2h1v-1a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);


// Simple markdown-to-html converter
const renderMarkdown = (text: string) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/(\r\n|\n|\r)/g, '<br />')
        .replace(/(\d+\.\s.*?)<br \/>/g, '<p class="mt-2">$1</p>')
        .replace(/<\/strong><br \/>/g, '</strong>');
};

const GeminiInsights: React.FC<GeminiInsightsProps> = ({ insights, isLoading, error, onGenerate, hasData }) => {
    return (
        <div className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#333333]">Insights com IA (Gemini)</h3>
                <button 
                    onClick={onGenerate} 
                    disabled={isLoading || !hasData}
                    className="flex items-center space-x-2 bg-[#0066CC] text-white px-3 py-2 rounded-md hover:bg-[#0052a3] transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <SparkleIcon />
                    <span>{isLoading ? 'Analisando...' : 'Gerar Análise'}</span>
                </button>
            </div>
            <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg min-h-[120px]">
                {isLoading && <p className="text-gray-500 animate-pulse">Gerando insights, por favor aguarde...</p>}
                {error && <p className="text-[#CC3333]">{error}</p>}
                {insights && <div dangerouslySetInnerHTML={{ __html: renderMarkdown(insights) }} />}
                {!isLoading && !insights && !error && (
                    <div className="text-center text-gray-500 py-6">
                        <p>Clique em "Gerar Análise" para obter insights sobre seus dados.</p>
                        <p className="text-xs mt-1">É necessário enviar um arquivo CSV primeiro.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GeminiInsights;