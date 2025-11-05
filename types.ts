export interface Ticket {
  id: string;
  tecnico: string;
  categoria: string;
  status: string;
  data_abertura: Date | null;
  data_fechamento: Date | null;
  satisfacao: number | null;
  isClosed: boolean;
  resolutionHours: number | null;
}

export interface StatusSummary {
  status: string;
  count: number;
  avgSatisfaction: number | null;
}

export interface AnalysisResult {
  total: number;
  abertos: number;
  encerrados: number;
  tempoMedio: number | null;
  satisfacaoMedia: number | null;
  tecnicoTop: { name: string; count: number } | null;
  categoriaTop: { name: string; count: number } | null;
  chamadosPorTecnico: { name: string; value: number }[];
  chamadosPorCategoria: { name: string; value: number }[];
  statusSummary: StatusSummary[];
}