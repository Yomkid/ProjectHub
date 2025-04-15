// components/PdfDownloadButton.tsx
'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { ArticlePDF } from './ArticlePDF';
import { useState, useEffect } from 'react';
import PdfViewer from './PdfViewer'; // Make sure to create this component

export const PdfDownloadButton = ({ contentRef }) => {
  const [isClient, setIsClient] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const extractArticleContent = () => {
    if (!contentRef?.current) {
      return {
        title: 'Article Not Found',
        author: 'Unknown Author',
        date: '',
        image: '/fallback-image.png',
        sections: []
      };
    }

    const articleElement = contentRef.current;

    try {
      return {
        title: articleElement.querySelector('h1')?.textContent || 'Article',
        author: articleElement.querySelector('.author a')?.textContent || 'Unknown Author',
        date: articleElement.querySelector('.author')?.textContent?.match(/on (.+)$/)?.[1] || '',
        image: articleElement.querySelector('img')?.src || '/fallback-image.png',
        sections: Array.from(articleElement.querySelectorAll('section')).map(section => {
          const sectionData = {
            title: section.querySelector('h2')?.textContent || '',
            content: section.querySelector('p:not(.prose-lg p)')?.textContent || '',
            subsections: []
          };

          // Extract all content blocks
          const contentBlocks = Array.from(section.children).filter(
            child => !['H2', 'P'].includes(child.tagName)
          );

          contentBlocks.forEach(block => {
            // Handle objectives blocks
            if (block.classList.contains('bg-green-50')) {
              sectionData.subsections.push({
                title: block.querySelector('h3')?.textContent || '',
                listItems: Array.from(block.querySelectorAll('li')).map(li => li.textContent),
                type: 'objectives'
              });
            }
            // Handle code blocks
            else if (block.classList.contains('bg-gray-100')) {
              sectionData.subsections.push({
                code: block.querySelector('pre')?.textContent || '',
                type: 'code'
              });
            }
            // Handle image blocks
            else if (block.classList.contains('text-center')) {
              sectionData.subsections.push({
                image: block.querySelector('img')?.src || '',
                imageCaption: block.querySelector('p')?.textContent || '',
                type: 'image'
              });
            }
            // Handle regular subsections
            else if (block.id && block.id !== '') {
              const subsection = {
                title: block.querySelector('h3, h4')?.textContent || '',
                content: block.querySelector('p')?.textContent || '',
                listItems: Array.from(block.querySelectorAll('li')).map(li => li.textContent),
                code: block.querySelector('code')?.textContent || '',
                type: 'subsection'
              };
              sectionData.subsections.push(subsection);
            }
          });

          return sectionData;
        })
      };
    } catch (error) {
      console.error('Error extracting content:', error);
      return {
        title: 'Article',
        author: 'Unknown Author',
        date: '',
        image: '/fallback-image.png',
        sections: []
      };
    }
  };

  const handleDownload = () => {
    // Implement your analytics tracking here
    console.log('PDF downloaded:', { 
      articleTitle: contentRef.current?.querySelector('h1')?.textContent 
    });
  };

  if (!isClient) {
    return (
      <button 
        className="bg-gray-400 text-white px-4 py-2 rounded self-start mb-4"
        disabled
      >
        Loading...
      </button>
    );
  }

  const articleContent = extractArticleContent();
  const fileName = `${contentRef.current?.querySelector('h1')?.textContent || 'article'}.pdf`;

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setShowPreview(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start mb-4"
      >
        Preview PDF
      </button>

      <PDFDownloadLink
        document={<ArticlePDF content={articleContent} />}
        fileName={fileName}
        onClick={handleDownload}
      >
        {({ loading }) => (
          <button 
            className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 self-start mb-4 flex items-center gap-2 ${
              loading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              'Download Article'
            )}
          </button>
        )}
      </PDFDownloadLink>

      {showPreview && (
        <PdfViewer 
          content={articleContent} 
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};