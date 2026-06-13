import axios from 'axios';
import PDFParser from 'pdf2json';

export const extractResumeText = async (url: string): Promise<string> => {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      const text = pdfData.Pages.map((page: any) =>
        page.Texts.map((t: any) => decodeURIComponent(t.R[0].T)).join(' '),
      ).join(' ');

      resolve(text);
    });

    pdfParser.on('pdfParser_dataError', (err: any) => {
      reject(err);
    });

    pdfParser.parseBuffer(Buffer.from(res.data));
  });
};
