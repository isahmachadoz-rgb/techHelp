import React, { useRef } from 'react';

interface HeaderProps {
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSampleDownload: () => void;
    fileName: string | null;
}

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

const Header: React.FC<HeaderProps> = ({ onFileChange, onSampleDownload, fileName }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-[#0066CC] flex items-center justify-center text-white font-bold text-xl">
                            TH
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[#333333]">TechHelp Solutions</h1>
                            <p className="text-xs text-gray-500">Dashboard de Suporte Técnico</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="hidden sm:block text-sm text-gray-600 truncate max-w-xs">{fileName || 'Nenhum arquivo selecionado'}</div>
                         <button
                            onClick={onSampleDownload}
                            className="text-sm bg-gray-100 text-[#333333] px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
                            title="Baixar CSV de exemplo"
                        >
                            Exemplo
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
                            className="flex items-center space-x-2 bg-[#0066CC] text-white px-3 py-2 rounded-md hover:bg-[#0052a3] transition-colors font-semibold text-sm"
                        >
                            <UploadIcon />
                            <span>Enviar Arquivo</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;