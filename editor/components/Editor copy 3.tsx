'use client';

import React, { useEffect, useRef, useState } from 'react';
import TurndownService from 'turndown';

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
    <div className={`p-4 max-w-4xl mx-auto ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <button className={isActive('bold') ? 'bg-blue-500 text-white px-2' : 'px-2'} onClick={() => formatText('bold')}><b>B</b></button>
        <button className={isActive('italic') ? 'bg-blue-500 text-white px-2' : 'px-2'} onClick={() => formatText('italic')}><i>I</i></button>
        <button className={isActive('underline') ? 'bg-blue-500 text-white px-2' : 'px-2'} onClick={() => formatText('underline')}><u>U</u></button>
        <button className={isActive('code') ? 'bg-blue-500 text-white px-2' : 'px-2'} onClick={() => formatText('insertHTML', '<code>' + document.getSelection() + '</code>')}>{'</>'}</button>

        <select onChange={(e) => applyHeading(e.target.value)} defaultValue="">
          <option value="">Headings</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>

        <select value={fontFamily} onChange={(e) => changeFontFamily(e.target.value)}>
          {fontFamilies.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select value={fontSize} onChange={(e) => changeFontSize(e.target.value)}>
          {fontSizes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button onClick={insertLink}>🔗 Link</button>
        <button onClick={insertImage}>🖼️ Img</button>
        <button onClick={() => document.execCommand('undo')}>↺ Undo</button>
        <button onClick={() => document.execCommand('redo')}>↻ Redo</button>
        <button onClick={exportMarkdown}>📤 MD</button>
        <button onClick={() => setIsDark(!isDark)}>🌓</button>
      </div>

      <div
        ref={editorRef}
        className="border p-4 min-h-[300px] rounded shadow focus:outline-none resize-y overflow-auto"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{ fontSize, fontFamily }}
      ></div>

      <div className="mt-4 text-sm">
        <span>📝 {wordCount} words</span> | <span>🔡 {charCount} characters</span>
      </div>
    </div>
  );
};

export default Editor;
