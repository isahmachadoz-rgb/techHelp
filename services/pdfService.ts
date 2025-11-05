import { GoogleGenAI, Type } from "@google/genai";

// pdf.js is loaded from a CDN in index.html, so we declare its global variable here
declare const pdfjsLib: any;

/**
 * Extracts all text from a given PDF file.
 * @param file The PDF file object.
 * @returns A promise that resolves to a single string containing all text from the PDF.
 */
async function extractTextFromPdf(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }

    return fullText;
}

/**
 * Parses a PDF file containing ticket data using the Gemini API.
 * It extracts text from the PDF and sends it to Gemini with a specific JSON schema
 * to get structured ticket data back.
 * @param file The PDF file to parse.
 * @returns A promise that resolves to an array of ticket objects.
 */
export async function parsePdfToTickets(file: File): Promise<any[]> {
    if (!process.env.API_KEY) {
        throw new Error("A chave de API não está configurada.");
    }

    const pdfText = await extractTextFromPdf(file);
    if (!pdfText.trim()) {
        throw new Error("O PDF parece estar vazio ou não contém texto legível.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        Você é um especialista em extração de dados. Analise o seguinte texto, extraído de um relatório de chamados de suporte em PDF. Sua tarefa é converter este texto não estruturado em um array JSON de objetos, onde cada objeto representa um único chamado de suporte.

        Siga estas regras estritamente:
        1.  Mapeie as informações para as seguintes chaves: "id", "tecnico", "categoria", "status", "data_abertura", "data_fechamento", "satisfacao".
        2.  Datas devem estar no formato "YYYY-MM-DD". Se a data não estiver completa, tente inferir o ano atual, mas priorize o que está no texto.
        3.  Se um campo (especialmente data_fechamento ou satisfacao) não for encontrado para um chamado, use o valor nulo (null).
        4.  O campo "satisfacao" deve ser um número, não uma string.
        5.  A resposta DEVE ser apenas o array JSON, sem nenhum texto, explicação ou formatação de markdown adicional.

        Texto extraído do PDF:
        ---
        ${pdfText}
        ---
    `;

    const ticketSchema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING, description: "O identificador único do chamado." },
            tecnico: { type: Type.STRING, description: "O nome do técnico responsável." },
            categoria: { type: Type.STRING, description: "A categoria do problema." },
            status: { type: Type.STRING, description: "O status atual do chamado (Ex: Aberto, Resolvido)." },
            data_abertura: { type: Type.STRING, description: "A data de abertura no formato YYYY-MM-DD." },
            data_fechamento: { type: Type.STRING, description: "A data de fechamento no formato YYYY-MM-DD ou null." },
            satisfacao: { type: Type.NUMBER, description: "A nota de satisfação como um número ou null." },
        },
        required: ['id', 'tecnico', 'categoria', 'status', 'data_abertura']
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: ticketSchema
                }
            }
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Erro ao chamar a API Gemini ou ao processar a resposta:", error);
        throw new Error("A IA não conseguiu processar os dados do PDF. Verifique o formato do arquivo ou a chave da API.");
    }
}