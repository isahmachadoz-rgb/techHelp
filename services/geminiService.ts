import { GoogleGenAI } from "@google/genai";
import type { Ticket } from '../types';

export async function generateInsights(tickets: Ticket[]): Promise<string> {
  if (!process.env.API_KEY) {
    return Promise.reject(new Error("A chave de API não está configurada."));
  }
  
  if (!tickets || tickets.length === 0) {
    return Promise.resolve("Não há dados de chamados para analisar.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // To avoid overly large prompts, we'll use a sample of the data.
  const ticketsSample = tickets.slice(0, 50);

  const prompt = `
    Você é um analista de dados sênior da "TechHelp Solutions", especialista em otimizar operações de suporte técnico.
    Sua tarefa é realizar uma análise aprofundada dos dados de chamados de suporte fornecidos e gerar um relatório estratégico em português do Brasil.

    O relatório deve ser conciso, baseado em dados e formatado em Markdown, contendo as seguintes seções:
    1.  **Análise Geral:** Um parágrafo de resumo com os principais KPIs que você puder calcular a partir da amostra (ex: total de chamados na amostra, tempo médio de resolução para chamados fechados, satisfação média).
    2.  **Principais Observações:** Destaque 2 a 3 insights ou anomalias importantes que você identificou nos dados. Procure por correlações, como:
        *   Técnicos específicos que se destacam (positiva ou negativamente) em certas categorias.
        *   Categorias de chamados com tempos de resolução ou notas de satisfação atipicamente altos ou baixos.
        *   Padrões nos chamados que permanecem abertos por mais tempo.
    3.  **Recomendações Acionáveis:** Com base nas observações, sugira 2 ações práticas e específicas para a gerência. As recomendações devem ser claras e visar a melhoria da eficiência, da satisfação do cliente ou a alocação de recursos.

    **Dados dos Chamados (Amostra de até 50 registros):**
    \`\`\`json
    ${JSON.stringify(ticketsSample.map(t => ({...t, data_abertura: t.data_abertura?.toISOString().split('T')[0], data_fechamento: t.data_fechamento?.toISOString().split('T')[0] })), null, 2)}
    \`\`\`

    Analise a amostra de dados fornecida e gere o relatório. Seja direto e foque em insights que possam gerar valor para o negócio.
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