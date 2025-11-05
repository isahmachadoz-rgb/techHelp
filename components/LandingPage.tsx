import React, { useRef } from 'react';

interface LandingPageProps {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onLoadSampleData: () => void;
    isParsing: boolean;
    theme: string;
    toggleTheme: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


const LandingPage: React.FC<LandingPageProps> = ({ onFileChange, onLoadSampleData, isParsing, theme, toggleTheme }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
         <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-gray-700/80 backdrop-blur-sm transition-colors"
                title="Alterar tema"
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            {/* Background shapes */}
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-50 blur-2xl"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full opacity-50 blur-2xl"></div>

            <div className="relative z-10 max-w-2xl w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-[#0066CC] flex items-center justify-center text-white font-bold text-4xl shadow-lg mb-6">
                        TH
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">TechHelp Solutions</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Dashboard de Suporte Técnico com IA</p>
                </div>

                <p className="text-gray-700 dark:text-gray-200 my-8 text-center max-w-lg mx-auto">
                    Transforme seus dados brutos em insights poderosos. Faça o upload de planilhas para visualizar métricas, gráficos e obter análises inteligentes para otimizar seu time de suporte.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <input
                        type="file"
                        id="csvFileLanding"
                        accept=".csv, .xlsx, .xls, .json"
                        onChange={onFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        disabled={isParsing}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isParsing}
                        className="w-full sm:w-auto flex items-center justify-center bg-[#0066CC] text-white px-6 py-3 rounded-lg hover:bg-[#0052a3] transition-all duration-300 font-semibold text-base shadow-md disabled:bg-gray-400 disabled:cursor-wait"
                    >
                        {isParsing ? <SpinnerIcon /> : <UploadIcon />}
                        {isParsing ? 'Analisando...' : 'Carregar Arquivo'}
                    </button>
                    <button
                        onClick={onLoadSampleData}
                        disabled={isParsing}
                        className="w-full sm:w-auto text-sm text-[#0066CC] dark:text-blue-400 font-semibold hover:underline disabled:opacity-50"
                    >
                        ou usar dados de exemplo
                    </button>
                </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-center">
                    Arquivos suportados: CSV, XLSX, JSON
                </p>
            </div>
             <footer className="absolute bottom-4 text-sm text-gray-600 dark:text-gray-400">
                TechHelp Solutions &copy; {new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default LandingPage;