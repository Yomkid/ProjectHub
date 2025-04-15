'use client';
import { useEffect, useState } from 'react';
import { Clipboard, Check, Download, QrCode, History } from 'lucide-react';
import QRCode from 'react-qr-code';

type CitationStyle = 'APA' | 'MLA' | 'Chicago';
type NameFormat = 'LastFirst' | 'FirstLast';

const CitationBox = () => {
  const [url, setUrl] = useState('');
  const [copiedStyle, setCopiedStyle] = useState<CitationStyle | null>(null);
  const [nameFormat, setNameFormat] = useState<NameFormat>('LastFirst');
  const [showQR, setShowQR] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const authors = [
    { first: 'Ismail', last: 'Mainbay' },
    { first: 'Mayomi', last: 'Odewaye' },
  ];

  const articleTitle = 'Building a face recognition system with React and Flask';
  const siteName = 'LearnXa';
  const publishDate = '2021, June 30';
  const shortUrl = 'https://tiny.url/face-rec';
  const doi = '10.1234/example.doi'; // Placeholder DOI

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const href = window.location.href;
      setUrl(href);
      storeCitationToHistory(href);
    }
  }, []);

  const formatAuthors = (style: NameFormat) =>
    authors
      .map((a) =>
        style === 'LastFirst' ? `${a.last}, ${a.first}` : `${a.first} ${a.last}`
      )
      .join(', ');

  const citationFormats: Record<CitationStyle, string> = {
    APA: `${formatAuthors(nameFormat)} (${publishDate}). ${articleTitle}. ${siteName}. ${url}`,
    MLA: `${formatAuthors('FirstLast')}. "${articleTitle}." *${siteName}*, ${publishDate.split(',')[1]} ${publishDate.split(',')[0]}, ${url}.`,
    Chicago: `${formatAuthors(nameFormat)}. "${articleTitle}." *${siteName}*. Last modified ${publishDate}. ${url}.`,
  };

  const bibtexAuthors = authors.map((a) => `${a.last}, ${a.first}`).join(' and ');
  const risAuthors = authors.map((a) => `AU  - ${a.last}, ${a.first}`).join('\n');

  const bibtex = `@article{mainbay2021face,
  title={${articleTitle}},
  author={${bibtexAuthors}},
  journal={${siteName}},
  year={2021},
  url={${url}},
  doi={${doi}}
}`;

  const ris = `TY  - JOUR
TI  - ${articleTitle}
${risAuthors}
JO  - ${siteName}
PY  - 2021
UR  - ${url}
DO  - ${doi}
ER  -`;

  const cslJson = JSON.stringify({
    type: 'article-journal',
    title: articleTitle,
    author: authors.map((a) => ({ given: a.first, family: a.last })),
    issued: { 'date-parts': [[2021, 6, 30]] },
    URL: url,
    DOI: doi,
    publisher: siteName,
  }, null, 2);

  const storeCitationToHistory = (currentUrl: string) => {
    const entry = {
      title: articleTitle,
      date: new Date().toISOString(),
      url: currentUrl,
    };
    const history = JSON.parse(localStorage.getItem('citationHistory') || '[]');
    const updated = [entry, ...history.filter((h: any) => h.url !== currentUrl)];
    localStorage.setItem('citationHistory', JSON.stringify(updated.slice(0, 10)));
  };

  const getCitationHistory = () => {
    return JSON.parse(localStorage.getItem('citationHistory') || '[]');
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const handleCopy = (style: CitationStyle) => {
    navigator.clipboard.writeText(citationFormats[style]).then(() => {
      setCopiedStyle(style);
      setTimeout(() => setCopiedStyle(null), 2000);
    });
  };

  return (
    <div className="bg-green-50 border border-green-200 p-5 mt-10 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-green-800">"Citation Generator"</h3>
        <select
          value={nameFormat}
          onChange={(e) => setNameFormat(e.target.value as NameFormat)}
          className="text-sm border border-green-300 rounded px-2 py-1 bg-white text-green-800"
        >
          <option value="LastFirst">Last, First</option>
          <option value="FirstLast">First Last</option>
        </select>
      </div>

      <div className="space-y-5">
        {Object.entries(citationFormats).map(([style, citation]) => (
          <div key={style} className="border-l-4 border-green-400 pl-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-green-700">{style}:</span>
              <button
                onClick={() => handleCopy(style as CitationStyle)}
                className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition"
              >
                {copiedStyle === style ? <Check size={16} /> : <Clipboard size={16} />}
                {copiedStyle === style ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm italic text-gray-800">{citation}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <button
          onClick={() => downloadFile(bibtex, 'citation.bib', 'text/plain')}
          className="flex items-center gap-2 text-green-700 hover:text-green-900"
        >
          <Download size={16} /> BibTeX
        </button>
        <button
          onClick={() => downloadFile(ris, 'citation.ris', 'text/plain')}
          className="flex items-center gap-2 text-green-700 hover:text-green-900"
        >
          <Download size={16} /> RIS
        </button>
        <button
          onClick={() => downloadFile(cslJson, 'citation.json', 'application/json')}
          className="flex items-center gap-2 text-green-700 hover:text-green-900"
        >
          <Download size={16} /> CSL JSON
        </button>
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex items-center gap-2 text-green-700 hover:text-green-900"
        >
          <QrCode size={16} /> {showQR ? 'Hide QR' : 'Show QR'}
        </button>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-green-700 hover:text-green-900"
        >
          <History size={16} /> History
        </button>
      </div>

      {showQR && (
        <div className="mt-4 flex justify-center">
          <QRCode value={url} size={128} />
        </div>
      )}

      {showHistory && (
        <div className="mt-6">
          <h4 className="font-semibold text-sm text-green-800 mb-2">Recently Cited:</h4>
          <ul className="text-xs text-gray-700 list-disc list-inside space-y-1">
            {getCitationHistory().map((entry: any, i: number) => (
              <li key={i}>
                <a href={entry.url} className="underline text-green-700" target="_blank" rel="noreferrer">
                  {entry.title}
                </a>{' '}
                — <span className="text-gray-500">{new Date(entry.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-600">
        DOI: <span className="underline">{doi}</span>
        <br />
        Short URL: <span className="underline">{shortUrl}</span>
      </div>
    </div>
  );
};

export default CitationBox;
