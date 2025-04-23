'use client';

import React, { useEffect, useRef, useState } from 'react';
import TurndownService from 'turndown';
import 'remixicon/fonts/remixicon.css';


const turndownService = new TurndownService();

const fontSizes = ['12px', '14px', '16px', '18px', '24px', '32px'];
const fontFamilies = ['Arial', 'Georgia', 'Courier New', 'Times New Roman', 'sans-serif'];

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [formats, setFormats] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');

  useEffect(() => {
    const saved = localStorage.getItem('editorContent');
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
      countText(saved);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current) {
        localStorage.setItem('editorContent', editorRef.current.innerHTML);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const countText = (text: string) => {
    const div = document.createElement('div');
    div.innerHTML = text;
    const plain = div.textContent || '';
    setWordCount(plain.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(plain.length);
  };

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    countText(html);
    updateActiveFormats();
  };

  const formatText = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const active: string[] = [];
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const container = range.commonAncestorContainer as HTMLElement;

    if (container.closest('strong') || container.closest('b')) active.push('bold');
    if (container.closest('em') || container.closest('i')) active.push('italic');
    if (container.closest('u')) active.push('underline');
    if (container.closest('code')) active.push('code');
    if (container.closest('a')) active.push('link');

    setFormats(active);
  };

  const insertLink = () => {
    const url = prompt('Enter link URL');
    if (url) formatText('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (url) formatText('insertImage', url);
  };

  const exportMarkdown = () => {
    const content = editorRef.current?.innerHTML || '';
    const markdown = turndownService.turndown(content);
    alert('Markdown:\n\n' + markdown);
  };

  const applyHeading = (tag: string) => {
    formatText('formatBlock', tag);
  };

  const changeFontSize = (size: string) => {
    setFontSize(size);
    document.execCommand('fontSize', false, '7');
    const fontElements = editorRef.current?.getElementsByTagName('font');
    if (fontElements) {
      for (const el of Array.from(fontElements)) {
        if (el.size === '7') {
          el.removeAttribute('size');
          el.style.fontSize = size;
        }
      }
    }
  };

  const changeFontFamily = (font: string) => {
    setFontFamily(font);
    formatText('fontName', font);
  };

  const isActive = (cmd: string) => formats.includes(cmd);

  return (
    <div className={`p-6 max-w-5xl mx-auto  shadow-md transition-all duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-5xl mx-auto my-6">
        <div className="bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700  overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <button className={`toolbar-btn ${isActive('bold') ? 'active' : ''}`} onClick={() => formatText('bold')} title="Bold">
              <i className="ri-bold text-lg" />
            </button>
            <button className={`toolbar-btn ${isActive('italic') ? 'active' : ''}`} onClick={() => formatText('italic')} title="Italic">
              <i className="ri-italic text-lg" />
            </button>
            <button className={`toolbar-btn ${isActive('underline') ? 'active' : ''}`} onClick={() => formatText('underline')} title="Underline">
              <i className="ri-underline text-lg" />
            </button>
            <button className={`toolbar-btn ${isActive('code') ? 'active' : ''}`} onClick={() => formatText('insertHTML', `<code>${document.getSelection()}</code>`)} title="Code">
              <i className="ri-code-line text-lg" />
            </button>

            <select className="toolbar-select" onChange={(e) => applyHeading(e.target.value)} defaultValue="">
              <option value="">Heading</option>
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>

            <select className="toolbar-select" value={fontFamily} onChange={(e) => changeFontFamily(e.target.value)}>
              {fontFamilies.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            <select className="toolbar-select" value={fontSize} onChange={(e) => changeFontSize(e.target.value)}>
              {fontSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button className="toolbar-btn" onClick={insertLink} title="Insert Link"><i className="ri-links-line" /></button>
            <button className="toolbar-btn" onClick={insertImage} title="Insert Image"><i className="ri-image-line" /></button>
            <button className="toolbar-btn" onClick={() => document.execCommand('undo')} title="Undo"><i className="ri-arrow-go-back-line" /></button>
            <button className="toolbar-btn" onClick={() => document.execCommand('redo')} title="Redo"><i className="ri-arrow-go-forward-line" /></button>
            <button className="toolbar-btn" onClick={exportMarkdown} title="Export Markdown"><i className="ri-upload-2-line" /></button>
            <button className="toolbar-btn" onClick={() => setIsDark(!isDark)} title="Toggle Dark Mode"><i className="ri-moon-clear-line" /></button>
          </div>

          {/* Editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="min-h-[400px] p-5 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 focus:outline-none resize-y overflow-auto"
            style={{ fontFamily, fontSize }}
          />
        </div>
      </div>

      {/* Word + Character Count */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span>📝 {wordCount} words</span> | <span>🔡 {charCount} characters</span>
      </div>

      <style jsx>{`
        .toolbar-btn {
          padding: 0.5rem 0.75rem;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
          transition: all 0.2s ease-in-out;
        }
        .toolbar-btn:hover {
          background-color: #f0f0f0;
        }
        .toolbar-btn.active {
          background-color: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        .toolbar-select {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
          background-color: white;
        }
        .dark .toolbar-select {
          background-color: #1f2937;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Editor;
