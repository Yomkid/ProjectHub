'use client';

import React, { useEffect, useRef, useState } from 'react';
import TurndownService from 'turndown';

const turndownService = new TurndownService();

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('editorContent');
    if (saved && editorRef.current) {
      editorRef.current.innerHTML = saved;
      setHtml(saved);
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
    const temp = document.createElement('div');
    temp.innerHTML = text;
    const plainText = temp.textContent || '';
    setWordCount(plainText.trim().split(/\s+/).filter(Boolean).length);
    setCharCount(plainText.length);
  };

  const applyFormat = (tag: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const selected = range.extractContents();
    const element = document.createElement(tag);
    element.appendChild(selected);
    range.insertNode(element);
    pushHistory();
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (!url) return;
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    insertNode(img);
    pushHistory();
  };

  const insertLink = () => {
    const url = prompt('Enter link URL');
    if (!url) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = range.toString();
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    range.deleteContents();
    range.insertNode(anchor);
    pushHistory();
  };

  const insertNode = (node: HTMLElement) => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.insertNode(node);
    }
  };

  const exportMarkdown = () => {
    const content = editorRef.current?.innerHTML || '';
    const markdown = turndownService.turndown(content);
    alert('Markdown:\n\n' + markdown);
  };

  const pushHistory = () => {
    const content = editorRef.current?.innerHTML || '';
    setHistory((prev) => [...prev, content]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const last = history[history.length - 1];
      setRedoStack((prev) => [editorRef.current?.innerHTML || '', ...prev]);
      if (editorRef.current) {
        editorRef.current.innerHTML = last;
        countText(last);
        setHtml(last);
      }
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      if (editorRef.current) {
        editorRef.current.innerHTML = next;
        countText(next);
        setHtml(next);
      }
      setHistory((prev) => [...prev, editorRef.current?.innerHTML || '']);
      setRedoStack((prev) => prev.slice(1));
    }
  };

  const handleInput = () => {
    const content = editorRef.current?.innerHTML || '';
    setHtml(content);
    countText(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyFormat('strong');
          break;
        case 'i':
          e.preventDefault();
          applyFormat('em');
          break;
        case 'u':
          e.preventDefault();
          applyFormat('u');
          break;
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
      }
    }
  };

  return (
    <div className={`p-4 max-w-3xl mx-auto ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => applyFormat('strong')}>Bold</button>
        <button onClick={() => applyFormat('em')}>Italic</button>
        <button onClick={() => applyFormat('u')}>Underline</button>
        <button onClick={() => applyFormat('h2')}>H2</button>
        <button onClick={() => applyFormat('code')}>Code</button>
        <button onClick={insertLink}>Link</button>
        <button onClick={insertImage}>Image</button>
        <button onClick={exportMarkdown}>Export MD</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={() => setIsDark(!isDark)}>🌓 Toggle Theme</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="border p-4 min-h-[300px] rounded shadow focus:outline-none resize-y overflow-auto"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{ minHeight: '200px' }}
      ></div>

      <div className="mt-4 text-sm">
        <span>📝 {wordCount} words</span> | <span>🔡 {charCount} characters</span>
      </div>
    </div>
  );
};

export default Editor;
