import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from '../types';

export async function generateInsights(analysis: AnalysisResult): Promise<string> {
  if (!process.env.API_KEY) {
    return Promise.reject(new Error("A chave de API não está configurada."));
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const { total, abertos, encerrados, tempoMedio, tecnicoTop, chamadosPorTecnico, chamadosPorCategoria, satisfacaoMedia } = analysis;

  const prompt = `
    Você é um analista de dados especialista em operações de suporte técnico para a empresa "TechHelp Solutions". 
    Sua tarefa é analisar um resumo de dados de chamados de suporte e gerar um relatório conciso e útil em português do Brasil.

    O relatório deve ser formatado em Markdown e conter as seguintes seções:
    1.  **Resumo Geral:** Uma visão geral dos principais indicadores.
    2.  **Observações Principais:** Destaque 2 a 3 tendências ou pontos de atenção importantes. Por exemplo, um técnico com uma carga de trabalho muito alta, uma categoria com um volume de chamados desproporcional ou um tempo de resolução que precisa de atenção.
    3.  **Recomendações Acionáveis:** Com base nas observações, sugira 1 ou 2 ações práticas para melhorar a eficiência da equipe de suporte.

    Aqui estão os dados para sua análise:
    - **Total de Chamados:** ${total}
    - **Chamados Abertos:** ${abertos}
    - **Chamados Encerrados:** ${encerrados}
    - **Tempo Médio de Resolução:** ${tempoMedio ? `${tempoMedio.toFixed(1)} horas` : 'N/A'}
    - **Satisfação Média do Cliente:** ${satisfacaoMedia ? `${satisfacaoMedia.toFixed(1)} de 5` : 'N/A'}
    - **Técnico Mais Produtivo:** ${tecnicoTop ? `${tecnicoTop.name} com ${tecnicoTop.count} chamados` : 'N/A'}
    - **Distribuição de Chamados por Técnico:** ${JSON.stringify(chamadosPorTecnico.reduce((obj, item) => ({...obj, [item.name]: item.value}), {}))}
    - **Distribuição de Chamados por Categoria:** ${JSON.stringify(chamadosPorCategoria.reduce((obj, item) => ({...obj, [item.name]: item.value}), {}))}

    Seja claro, objetivo e forneça valor real com sua análise.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Falha ao gerar insights. Verifique a configuração da API e tente novamente.");
  }
}
