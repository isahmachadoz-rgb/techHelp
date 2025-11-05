import React, { useState, useCallback, useEffect } from 'react';
import type { Ticket, AnalysisResult, StatusSummary } from './types';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import { TechnicianChart, CategoryChart } from './components/Charts';
import TicketTable from './components/TicketTable';

declare const Papa: any;
declare const XLSX: any;

const initialCsvData = `id,tecnico,categoria,status,data_abertura,data_fechamento,satisfacao
CHAMADO-2024-07-01,Yago Ferre,Acesso Negado,Aberto,2024-07-01,,2
CHAMADO-2024-05-02,Maria Floi,Falha de Software,Aberto,2024-05-02,,4
CHAMADO-2025-08-01,Agata Mori,Impressora Não Funciona,Aberto,2025-08-01,,3
CHAMADO-2024-11-01,Vinicius C,Acesso Negado,Pendente,2024-11-01,,2
CHAMADO-2025-05-01,Luara Moi,Acesso Negado,Pendente,2025-05-01,,3
CHAMADO-2023-12-02,Maria Cec,Lentidão do Sistema,Pendente,2023-12-02,,4
CHAMADO-2025-01-01,Guilherme,Problema de Conexão,Em Andamento,2025-01-01,,4
CHAMADO-2025-03-02,Nicole Car,Impressora Não Funciona,Pendente,2025-03-02,,2
CHAMADO-2024-06-01,Maysa Po,Acesso Negado,Aberto,2024-06-01,,2
CHAMADO-2024-05-01,Ana Sophi,Hardware,Resolvido,2024-05-01,2024-05-02,2
CHAMADO-2025-04-02,Brenda V,Falha de Software,Resolvido,2025-04-02,2025-04-02,2
CHAMADO-2024-03-02,Felipe Gor,Instalação de Software,Em Andamento,2024-03-02,,2
CHAMADO-2023-10-02,Ryan Men,Falha de Software,Em Andamento,2023-10-02,,4
CHAMADO-2025-06-01,Rhavi Lim,Erro de Login,Aberto,2025-06-01,,3
CHAMADO-2024-04-01,Gael Henr,Acesso Negado,Pendente,2024-04-01,,3
CHAMADO-2024-10-02,Luigi Barb,Configurações,Resolvido,2024-10-02,2024-10-02,2
CHAMADO-2025-06-01,Larissa,Configurações,Fechado,2025-06-01,2025-06-01,3
CHAMADO-2024-02-02,Diego Mo,Falha de Software,Aberto,2024-02-02,,4
CHAMADO-2025-06-02,Julia Cunh,Impressora Não Funciona,Pendente,2025-06-02,,2
CHAMADO-2025-07-01,Arthur Bo,Falha de Software,Resolvido,2025-07-01,2025-07-02,4
CHAMADO-2023-10-01,Davi Luiz,Backup de Dados,Pendente,2023-10-01,,2
CHAMADO-2024-12-01,Sr. Benjan,Lentidão do Sistema,Aberto,2024-12-01,,4
CHAMADO-2025-07-02,Marcelo C,Hardware,Em Andamento,2025-07-02,,2
CHAMADO-2025-10-01,Meli Heloisa,Acesso Negado,Em Andamento,2025-10-01,,4
CHAMADO-2024-04-01,Manuela I,Falha de Software,Em Andamento,2024-04-01,,3
CHAMADO-2024-03-01,Isis Pinto,Configuração de E-mail,Pendente,2024-03-01,,3
CHAMADO-2024-11-02,Eloah Mer,Backup,Fechado,2024-11-02,2024-11-02,4
CHAMADO-2024-07-03,Luiz Migu,Configurações,Fechado,2024-07-02,2024-07-03,2
CHAMADO-2024-04-02,Maria Alic,Configuração de E-mail,Em Andamento,2024-04-02,,4
CHAMADO-2024-11-11,Emanuel S,Impressora Não Funciona,Em Andamento,2024-11-11,,3
CHAMADO-2024-12-01,Ana Luiza,Instalação,Resolvido,2024-12-01,2024-12-02,4
CHAMADO-2024-12-02,Pedro Mig,Problema Verificação,Fechado,2024-12-01,2024-12-02,3
CHAMADO-2023-10-02,Melina Gu,Instalação de Software,Em Andamento,2023-10-02,,2
CHAMADO-2025-03-01,Maya Cav,Hardware,Pendente,2025-03-01,,3
CHAMADO-2024-05-02,Nicolas Lo,Problema Verificação,Fechado,2024-05-02,2024-05-02,4
CHAMADO-2025-01-01,Sr. Miguel,Erro de Login,Resolvido,2025-01-01,2025-01-02,3
CHAMADO-2024-03-03,Isis Viana,Configuração de E-mail,Em Andamento,2024-03-03,,4
CHAMADO-2024-03-02,Leandro C,Acesso Negado,Resolvido,2024-03-02,2024-03-02,2
CHAMADO-2025-01-01,Ana Sophi,Falha de Software,Resolvido,2025-01-01,2025-01-01,2
CHAMADO-2024-10-03,Yago G,Hardware,Fechado,2024-10-02,2024-10-03,4
CHAMADO-2024-11-01,Nina Rios,Hardware,Em Andamento,2024-11-01,,4
CHAMADO-2024-03-01,Maria Lau,Hardware,Em Andamento,2024-03-01,,3
`;

// --- Helper Functions ---
const tryParseDate = (s: string): Date | null => {
    if (!s) return null;
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) return iso;
    const parts = s.split(/[\/\-.\s:]/).map(p => p.trim());
    if (parts.length >= 3) {
        const day = parseInt(parts[0], 10);
        const mon = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(mon) && !isNaN(year)) {
            const date = new Date(year, mon, day);
            if (!isNaN(date.getTime())) return date;
        }
    }
    return null;
};

const analyzeData = (rows: any[]): { tickets: Ticket[], analysis: AnalysisResult } => {
    if (!rows || rows.length === 0) {
        return { tickets: [], analysis: { total: 0, abertos: 0, encerrados: 0, tempoMedio: null, satisfacaoMedia: null, tecnicoTop: null, chamadosPorTecnico: [], chamadosPorCategoria: [], statusSummary: [] } };
    }

    const norm = rows.map(r => {
        const out: { [key: string]: string } = {};
        for (const k in r) {
            out[k.trim().toLowerCase()] = (r[k] === null || r[k] === undefined) ? '' : String(r[k]).trim();
        }
        return out;
    });

    const findKey = (obj: any, keywords: string[]) => Object.keys(obj).find(k => keywords.some(kw => k.includes(kw)));

    const firstRowKeys = Object.keys(norm[0]);
    const idKey = findKey(norm[0], ['id']);
    const tecnicoKey = findKey(norm[0], ['tecnico', 'tech', 'agent', 'técnico']);
    const categoriaKey = findKey(norm[0], ['categoria', 'category']);
    const statusKey = findKey(norm[0], ['status', 'estado']);
    const abertoKey = findKey(norm[0], ['data_abertura', 'data abertura', 'open', 'aberto']);
    const fechadoKey = findKey(norm[0], ['data_fechamento', 'data fechamento', 'close', 'fechamento']);
    const satKey = findKey(norm[0], ['satisf', 'satisfaction', 'sat']);

    let totalHours = 0;
    let countResolved = 0;
    const byTech: { [key: string]: number } = {};
    const byCat: { [key: string]: number } = {};
    let totalSatisfaction = 0;
    let countSatisfaction = 0;
    
    const processedTickets: Ticket[] = norm.map((r, index) => {
        const status = statusKey ? (r[statusKey] || 'Aberto') : 'Aberto';
        const isClosed = /encerrad|fechad|closed|finalizad|done|resolvido/i.test(status);
        const openDate = abertoKey ? tryParseDate(r[abertoKey]) : null;
        const closeDate = fechadoKey ? tryParseDate(r[fechadoKey]) : null;
        const tecnico = tecnicoKey ? (r[tecnicoKey] || 'N/A') : 'N/A';
        const categoria = categoriaKey ? (r[categoriaKey] || 'N/A') : 'N/A';
        
        const parsedSat = satKey ? parseInt(r[satKey], 10) : NaN;
        const satisfacao = !isNaN(parsedSat) ? parsedSat : null;

        if (satisfacao !== null) {
            totalSatisfaction += satisfacao;
            countSatisfaction++;
        }
        
        byTech[tecnico] = (byTech[tecnico] || 0) + 1;
        byCat[categoria] = (byCat[categoria] || 0) + 1;

        let resolutionHours: number | null = null;
        if (openDate && closeDate) {
            const diff = (closeDate.getTime() - openDate.getTime()) / (1000 * 60 * 60);
            if (!isNaN(diff) && diff >= 0) {
                resolutionHours = diff;
                totalHours += diff;
                countResolved++;
            }
        }
        
        return {
            id: idKey ? r[idKey] : String(index + 1),
            tecnico,
            categoria,
            status,
            data_abertura: openDate,
            data_fechamento: closeDate,
            satisfacao,
            isClosed,
            resolutionHours,
        };
    });

    const byStatus: { [key: string]: { tickets: Ticket[] } } = {};
    processedTickets.forEach(t => {
        const status = t.status || 'N/A';
        if (!byStatus[status]) {
            byStatus[status] = { tickets: [] };
        }
        byStatus[status].tickets.push(t);
    });

    const statusSummary: StatusSummary[] = Object.entries(byStatus).map(([status, data]) => {
        const satisfactionScores = data.tickets
            .map(t => t.satisfacao)
            .filter((s): s is number => s !== null && !isNaN(s));
        
        const avgSatisfaction = satisfactionScores.length > 0
            ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
            : null;

        return {
            status,
            count: data.tickets.length,
            avgSatisfaction
        };
    }).sort((a,b) => b.count - a.count);

    const abertos = processedTickets.filter(t => !t.isClosed).length;
    const encerrados = processedTickets.length - abertos;
    const avgHours = countResolved ? (totalHours / countResolved) : null;
    const avgSatisfaction = countSatisfaction > 0 ? totalSatisfaction / countSatisfaction : null;

    const techEntries = Object.entries(byTech).sort((a, b) => b[1] - a[1]);
    const topTech = techEntries.length > 0 ? { name: techEntries[0][0], count: techEntries[0][1] } : null;
    
    const MAX_TECHNICIANS_IN_CHART = 10;
    let finalTechData;
    if (techEntries.length > MAX_TECHNICIANS_IN_CHART) {
        const topN = techEntries.slice(0, MAX_TECHNICIANS_IN_CHART - 1);
        const othersCount = techEntries.slice(MAX_TECHNICIANS_IN_CHART - 1).reduce((acc, [, value]) => acc + value, 0);
        finalTechData = [...topN.map(([name, value]) => ({ name, value })), { name: 'Outros', value: othersCount }];
    } else {
        finalTechData = techEntries.map(([name, value]) => ({ name, value }));
    }
    
    const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
    const MAX_CATEGORIES_IN_CHART = 5; // Display top 4 and group the rest
    let finalCatData;
    if (catEntries.length > MAX_CATEGORIES_IN_CHART) {
        const topN = catEntries.slice(0, MAX_CATEGORIES_IN_CHART - 1);
        const othersCount = catEntries.slice(MAX_CATEGORIES_IN_CHART - 1).reduce((acc, [, value]) => acc + value, 0);
        finalCatData = [...topN.map(([name, value]) => ({ name, value })), { name: 'Outras', value: othersCount }];
    } else {
        finalCatData = catEntries.map(([name, value]) => ({ name, value }));
    }


    const analysis: AnalysisResult = {
        total: processedTickets.length,
        abertos,
        encerrados,
        tempoMedio: avgHours,
        satisfacaoMedia: avgSatisfaction,
        tecnicoTop: topTech,
        chamadosPorTecnico: finalTechData,
        chamadosPorCategoria: finalCatData,
        statusSummary,
    };

    return { tickets: processedTickets, analysis };
};


const App: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const processData = useCallback((data: any[], sourceName: string) => {
        setFileName(sourceName);
        const { tickets, analysis } = analyzeData(data);
        setTickets(tickets);
        setAnalysis(analysis);
    }, []);
    
    useEffect(() => {
        if (!analysis) { // Only load initial data once
            Papa.parse(initialCsvData, {
                header: true,
                skipEmptyLines: true,
                complete: (results: any) => {
                    processData(results.data, "dados_da_planilha.csv");
                },
            });
        }
    }, [analysis, processData]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        
        const reader = new FileReader();

        if (fileExtension === 'csv' || fileExtension === 'txt') {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: any) => {
                    if(results.errors.length > 0){
                        console.error('CSV parsing errors:', results.errors);
                        alert('Ocorreram erros ao processar o arquivo CSV. Verifique o console para mais detalhes.');
                        return;
                    }
                    processData(results.data, file.name);
                },
                error: (err: any) => {
                    console.error('CSV parsing error:', err);
                    alert('Erro ao ler o arquivo: ' + err.message);
                }
            });
        } else if (fileExtension === 'json') {
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const data = JSON.parse(text);
                        if (Array.isArray(data)) {
                            processData(data, file.name);
                        } else {
                            alert('O arquivo JSON deve conter um array de objetos.');
                        }
                    }
                } catch (err: any) {
                    console.error('JSON parsing error:', err);
                    alert('Erro ao ler o arquivo JSON: ' + err.message);
                }
            };
            reader.readAsText(file);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);
                    processData(json, file.name);
                } catch (err: any) {
                    console.error('Excel parsing error:', err);
                    alert('Erro ao ler o arquivo Excel: ' + err.message);
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Tipo de arquivo não suportado. Por favor, envie um CSV, JSON ou Excel.');
        }
    };
    
    const handleSampleDownload = () => {
        const blob = new Blob([initialCsvData], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exemplo_chamados_completos.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };
    
    const fmtHour = (hrs: number | null) => {
        if (hrs === null || isNaN(hrs)) return '—';
        const h = Math.floor(hrs);
        const m = Math.round((hrs - h) * 60);
        return `${h}h ${m}m`;
    }

    const TotalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
    const TimeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const TechIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;


    return (
        <div className="min-h-screen bg-[#F5F5F5]">
            <Header onFileChange={handleFileChange} onSampleDownload={handleSampleDownload} fileName={fileName} />
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {analysis === null ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <h2 className="text-2xl font-bold text-[#333333]">Carregando dados da planilha...</h2>
                        <p className="mt-2 text-gray-500">Por favor, aguarde um momento.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                           <MetricCard 
                                label="Total de Chamados" 
                                value={analysis.total} 
                                icon={<TotalIcon />}
                                secondaryLabel="Abertos" 
                                secondaryValue={analysis.abertos}
                                secondaryLabel2="Encerrados"
                                secondaryValue2={analysis.total > 0 ? `${analysis.encerrados} (${(analysis.encerrados / analysis.total * 100).toFixed(0)}%)` : analysis.encerrados}
                            />
                            <MetricCard 
                                label="Tempo Médio Resolução" 
                                value={fmtHour(analysis.tempoMedio)} 
                                icon={<TimeIcon />}
                            />
                            <MetricCard 
                                label="Satisfação Média" 
                                value={analysis.satisfacaoMedia ? `${analysis.satisfacaoMedia.toFixed(1)}/5` : '—'} 
                                icon={<StarIcon />}
                            />
                            <MetricCard 
                                label="Técnico Mais Produtivo" 
                                value={analysis.tecnicoTop?.name || '—'}
                                icon={<TechIcon />}
                                secondaryLabel="Chamados"
                                secondaryValue={analysis.tecnicoTop?.count}
                            />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <TechnicianChart data={analysis.chamadosPorTecnico} />
                            <CategoryChart data={analysis.chamadosPorCategoria} />
                        </div>
                        <TicketTable summary={analysis.statusSummary} totalTickets={analysis.total} />
                    </div>
                )}
                 <footer className="text-center mt-8 text-sm text-gray-500">
                    <p>Dica: Use um arquivo (CSV, JSON, XLSX) com colunas como: <strong>id, tecnico, categoria, status, data_abertura, data_fechamento, satisfacao</strong>.</p>
                </footer>
            </main>
        </div>
    );
};

export default App;