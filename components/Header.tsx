import React, { useRef } from 'react';

interface HeaderProps {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSampleDownload: () => void;
    fileName: string | null;
    isParsing: boolean;
    theme: string;
    toggleTheme: () => void;
    onClearData: () => void;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const SunIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onFileChange, onSampleDownload, fileName, isParsing, theme, toggleTheme, onClearData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0066CC] flex items-center justify-center text-white font-bold text-xl">
                            TH
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">TechHelp Solutions</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard de Suporte Técnico</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                           <span title={fileName || undefined}>{fileName || 'Nenhum arquivo selecionado'}</span>
                           {fileName && (
                               <button
                                   onClick={onClearData}
                                   className="flex-shrink-0 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                   title="Remover arquivo"
                               >
                                   <CloseIcon />
                               </button>
                           )}
                        </div>
                         <button
                            onClick={onSampleDownload}
                            className="flex items-center text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 sm:px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                            title="Baixar CSV de exemplo"
                            disabled={isParsing}
                        >
                            <DownloadIcon />
                            <span className="hidden sm:inline sm:ml-2">Exemplo</span>
                        </button>
                         <button
                            onClick={toggleTheme}
                            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            title="Alterar tema"
                         >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                         </button>
                        <input
                            type="file"
                            id="csvFile"
                            accept=".csv, .xlsx, .xls, .json"
                            onChange={onFileChange}
                            ref={fileInputRef}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isParsing}
                            className="flex items-center justify-center space-x-2 bg-[#0066CC] text-white px-3 py-2 rounded-md hover:bg-[#0052a3] transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-wait"
                        >
                            {isParsing ? <SpinnerIcon/> : <UploadIcon />}
                            {isParsing && <span>Processando...</span>}
                            {!isParsing && <span className="hidden sm:inline">Enviar Arquivo</span>}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;