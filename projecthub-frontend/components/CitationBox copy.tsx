'use client';
import { useEffect, useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

type CitationStyle = 'APA' | 'MLA' | 'Chicago';

const CitationBox = () => {
  const [url, setUrl] = useState('');
  const [copiedStyle, setCopiedStyle] = useState<CitationStyle | null>(null);

  // Replace with your actual article info
  const author = 'Mainbay, I.';
  const articleTitle = 'Building a face recognition system with React and Flask';
  const siteName = 'LearnXa';
  const publishDate = '2021, June 30';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const citationFormats: Record<CitationStyle, string> = {
    APA: `${author} (${publishDate}). *${articleTitle}*. ${siteName}. ${url}`,
    MLA: `${author.split(',')[1]} ${author.split(',')[0]}. "${articleTitle}." *${siteName}*, ${publishDate.split(',')[1]} ${publishDate.split(',')[0]}, ${url}.`,
    Chicago: `${author}. "${articleTitle}." *${siteName}*. Last modified ${publishDate}. ${url}.`,
  };

  const handleCopy = (style: CitationStyle) => {
    navigator.clipboard.writeText(citationFormats[style]).then(() => {
      setCopiedStyle(style);
      setTimeout(() => setCopiedStyle(null), 2000);
    });
  };

  return (
    <div className="bg-green-50 border border-green-200 p-5 rounded-xl mt-10 shadow-md">
      <h3 className="text-lg font-bold text-green-800 mb-4">Citation</h3>
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
    </div>
  );
};

export default CitationBox;
