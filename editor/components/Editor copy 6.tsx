'use client';

import React, { useEffect, useRef, useState } from 'react';
import TurndownService from 'turndown';
import { marked } from 'marked';
import 'remixicon/fonts/remixicon.css';

const turndownService = new TurndownService();
const fontSizes = ['12px', '14px', '16px', '18px', '24px', '32px'];
const fontFamilies = ['Arial', 'Georgia', 'Courier New', 'Times New Roman', 'sans-serif'];

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [markdown, setMarkdown] = useState('');
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [formats, setFormats] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // Focus the editor when switching modes or clicking buttons
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('editorContent');
    if (saved && editorRef.current && !isMarkdownMode) {
      editorRef.current.innerHTML = saved;
      countText(saved);
    }
  }, [isMarkdownMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (editorRef.current && !isMarkdownMode) {
        localStorage.setItem('editorContent', editorRef.current.innerHTML);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isMarkdownMode]);

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
    focusEditor();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const active: string[] = [];
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const container = range.commonAncestorContainer as HTMLElement;

    // Check if we're in a list item (both ul and ol contain li elements)
    const listItem = container.closest('li');
    if (listItem) {
      if (listItem.parentElement?.tagName === 'UL') active.push('unorderedList');
      if (listItem.parentElement?.tagName === 'OL') active.push('orderedList');
    }

    if (document.queryCommandState('bold')) active.push('bold');
    if (document.queryCommandState('italic')) active.push('italic');
    if (document.queryCommandState('underline')) active.push('underline');
    if (container.closest('code')) active.push('code');
    if (container.closest('blockquote')) active.push('quote');
    if (container.closest('a')) active.push('link');

    // Check heading levels
    for (let i = 1; i <= 6; i++) {
      if (container.closest(`h${i}`)) {
        active.push(`h${i}`);
        break;
      }
    }

    setFormats(active);
  };

  const insertLink = () => {
    const url = prompt('Enter link URL');
    if (url) {
      formatText('createLink', url);
    }
    focusEditor();
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (url) {
      formatText('insertImage', url);
    }
    focusEditor();
  };

  const applyHeading = (level: string) => {
    if (level === '') {
      // Convert to paragraph if empty option selected
      formatText('formatBlock', '<p>');
    } else {
      formatText('formatBlock', `<${level}>`);
    }
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = range.toString();
    pre.appendChild(code);
    range.deleteContents();
    range.insertNode(pre);
    
    // Move cursor inside the code block
    const newRange = document.createRange();
    newRange.selectNodeContents(code);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    focusEditor();
  };

  const insertQuote = () => {
    formatText('formatBlock', 'blockquote');
  };

  const insertList = (ordered: boolean) => {
    // Check if we're already in a list of the opposite type
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer as HTMLElement;
    const listItem = container.closest('li');
    
    if (listItem) {
      // If we're in a list item, toggle the list type
      const currentList = listItem.parentElement;
      if (currentList) {
        const newList = document.createElement(ordered ? 'ol' : 'ul');
        while (currentList.firstChild) {
          newList.appendChild(currentList.firstChild);
        }
        currentList.parentNode?.replaceChild(newList, currentList);
      }
    } else {
      // Otherwise create a new list
      formatText(ordered ? 'insertOrderedList' : 'insertUnorderedList');
    }
    
    focusEditor();
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
    focusEditor();
  };

  const changeFontFamily = (font: string) => {
    setFontFamily(font);
    formatText('fontName', font);
  };

  const clearFormatting = () => {
    formatText('removeFormat');
    formatText('unlink');
    // Special handling for headings and blocks
    formatText('formatBlock', '<p>');
    focusEditor();
  };

  const isActive = (cmd: string) => formats.includes(cmd);

  const toggleMode = async () => {
    if (isMarkdownMode) {
      const html = await Promise.resolve(marked.parse(markdown));
      if (editorRef.current) {
        editorRef.current.innerHTML = html;
        // Focus the editor after switching modes
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
            // Move cursor to end
            const range = document.createRange();
            range.selectNodeContents(editorRef.current);
            range.collapse(false);
            const selection = window.getSelection();
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }, 0);
      }
    } else {
      const html = editorRef.current?.innerHTML || '';
      setMarkdown(turndownService.turndown(html));
    }
    setIsMarkdownMode(!isMarkdownMode);
  };

  return (
    <div className={`p-6 max-w-5xl mx-auto rounded-lg shadow-md transition-all duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        {!isMarkdownMode && (
          <>
            <div className="flex items-center gap-1">
              <button 
                className={`toolbar-btn ${isActive('bold') ? 'active' : ''}`} 
                onClick={() => formatText('bold')} 
                title="Bold (Ctrl+B)"
              >
                <i className="ri-bold text-lg" />
              </button>
              <button 
                className={`toolbar-btn ${isActive('italic') ? 'active' : ''}`} 
                onClick={() => formatText('italic')} 
                title="Italic (Ctrl+I)"
              >
                <i className="ri-italic text-lg" />
              </button>
              <button 
                className={`toolbar-btn ${isActive('underline') ? 'active' : ''}`} 
                onClick={() => formatText('underline')} 
                title="Underline (Ctrl+U)"
              >
                <i className="ri-underline text-lg" />
              </button>
              <button 
                className="toolbar-btn" 
                onClick={clearFormatting} 
                title="Clear formatting"
              >
                <i className="ri-format-clear" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <div className="flex items-center gap-1">
              <button 
                className={`toolbar-btn ${formats.some(f => f.startsWith('h')) ? 'active' : ''}`} 
                onClick={() => applyHeading('h2')} 
                title="Heading"
              >
                <i className="ri-heading" />
              </button>
              <select 
                className="toolbar-select" 
                value={formats.find(f => f.startsWith('h')) || ''} 
                onChange={(e) => applyHeading(e.target.value)}
                title="Heading level"
              >
                <option value="">Normal</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="h4">Heading 4</option>
                <option value="h5">Heading 5</option>
                <option value="h6">Heading 6</option>
              </select>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <div className="flex items-center gap-1">
              <button 
                className={`toolbar-btn ${isActive('unorderedList') ? 'active' : ''}`} 
                onClick={() => insertList(false)} 
                title="Bullet list"
              >
                <i className="ri-list-unordered" />
              </button>
              <button 
                className={`toolbar-btn ${isActive('orderedList') ? 'active' : ''}`} 
                onClick={() => insertList(true)} 
                title="Numbered list"
              >
                <i className="ri-list-ordered" />
              </button>
              <button 
                className={`toolbar-btn ${isActive('quote') ? 'active' : ''}`} 
                onClick={insertQuote} 
                title="Blockquote"
              >
                <i className="ri-double-quotes-l" />
              </button>
              <button 
                className={`toolbar-btn ${isActive('code') ? 'active' : ''}`} 
                onClick={insertCodeBlock} 
                title="Code block"
              >
                <i className="ri-code-line" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <div className="flex items-center gap-1">
              <button 
                className="toolbar-btn" 
                onClick={() => formatText('justifyLeft')} 
                title="Align left"
              >
                <i className="ri-align-left" />
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => formatText('justifyCenter')} 
                title="Align center"
              >
                <i className="ri-align-center" />
              </button>
              <button 
                className="toolbar-btn" 
                onClick={() => formatText('justifyRight')} 
                title="Align right"
              >
                <i className="ri-align-right" />
              </button>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <div className="flex items-center gap-1">
              <select 
                className="toolbar-select" 
                value={fontFamily} 
                onChange={(e) => changeFontFamily(e.target.value)}
                title="Font family"
              >
                {fontFamilies.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select 
                className="toolbar-select" 
                value={fontSize} 
                onChange={(e) => changeFontSize(e.target.value)}
                title="Font size"
              >
                {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <div className="flex items-center gap-1">
              <button 
                className={`toolbar-btn ${isActive('link') ? 'active' : ''}`} 
                onClick={insertLink} 
                title="Insert link"
              >
                <i className="ri-links-line" />
              </button>
              <button 
                className="toolbar-btn" 
                onClick={insertImage} 
                title="Insert image"
              >
                <i className="ri-image-line" />
              </button>
            </div>
          </>
        )}
        
        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <div className="flex items-center gap-1">
          <button 
            className="toolbar-btn" 
            onClick={toggleMode}
            title={isMarkdownMode ? 'Switch to rich text editor' : 'Switch to markdown'}
          >
            {isMarkdownMode ? (
              <>
                <i className="ri-markdown-line mr-1" /> Rich Text
              </>
            ) : (
              <>
                <i className="ri-markdown-line mr-1" /> Markdown
              </>
            )}
          </button>
          {isMarkdownMode && (
            <button 
              className={`toolbar-btn ${showPreview ? 'active' : ''}`} 
              onClick={() => setShowPreview(!showPreview)}
              title={showPreview ? 'Hide preview' : 'Show preview'}
            >
              <i className="ri-eye-line mr-1" /> {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          )}
          <button 
            className="toolbar-btn" 
            onClick={() => setIsDark(!isDark)} 
            title="Toggle dark mode"
          >
            <i className={isDark ? 'ri-sun-line' : 'ri-moon-line'} />
          </button>
          <button 
            className="toolbar-btn" 
            onClick={() => setIsToolbarVisible(!isToolbarVisible)}
            title={isToolbarVisible ? 'Hide toolbar' : 'Show toolbar'}
          >
            <i className={isToolbarVisible ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-b-lg">
        {isMarkdownMode ? (
          <div className="grid md:grid-cols-2 gap-4 p-4">
            <textarea
              className="w-full min-h-[300px] p-3 border dark:bg-gray-950 border-gray-300 dark:border-gray-600 rounded-md font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Write Markdown here..."
            />
            {showPreview && (
              <div 
                className="w-full min-h-[300px] p-3 bg-gray-50 dark:bg-gray-800 rounded-md overflow-auto prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }} 
              />
            )}
          </div>
        ) : (
          <div
            ref={editorRef}
            className="min-h-[400px] p-4 focus:outline-none prose dark:prose-invert max-w-none"
            contentEditable
            onInput={handleInput}
            onMouseUp={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            style={{ fontFamily, fontSize }}
            placeholder="Start typing here..."
            suppressContentEditableWarning
          />
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-4">
        <span className="flex items-center">
          <i className="ri-file-word-line mr-1"></i> {wordCount} words
        </span>
        <span className="flex items-center">
          <i className="ri-character-recognition-line mr-1"></i> {charCount} characters
        </span>
      </div>

      <style jsx>{`
        .toolbar-btn {
          padding: 0.5rem;
          background-color: ${isDark ? '#374151' : 'white'};
          border: 1px solid ${isDark ? '#4B5563' : '#D1D5DB'};
          border-radius: 0.375rem;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isDark ? '#E5E7EB' : '#4B5563'};
          min-width: 2rem;
          height: 2rem;
        }
        .toolbar-btn:hover {
          background-color: ${isDark ? '#4B5563' : '#F3F4F6'};
        }
        .toolbar-btn.active {
          background-color: ${isDark ? '#1E40AF' : '#3B82F6'};
          color: white;
          border-color: ${isDark ? '#1E40AF' : '#3B82F6'};
        }
        .toolbar-select {
          padding: 0.5rem;
          border: 1px solid ${isDark ? '#4B5563' : '#D1D5DB'};
          border-radius: 0.375rem;
          background-color: ${isDark ? '#374151' : 'white'};
          color: ${isDark ? '#E5E7EB' : '#4B5563'};
          cursor: pointer;
          height: 2rem;
          font-size: 0.875rem;
        }
        .toolbar-select:focus {
          outline: none;
          border-color: ${isDark ? '#3B82F6' : '#3B82F6'};
        }
        [contenteditable] {
          caret-color: ${isDark ? '#E5E7EB' : '#111827'};
        }
        [contenteditable][placeholder]:empty:before {
          content: attr(placeholder);
          color: ${isDark ? '#6B7280' : '#9CA3AF'};
          pointer-events: none;
          display: block;
        }
        .prose :where(ul, ol):not(:where([class~="not-prose"] *)) {
          padding-left: 1.5em;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
        .prose :where(ul):not(:where([class~="not-prose"] *)) {
          list-style-type: disc;
        }
        .prose :where(ol):not(:where([class~="not-prose"] *)) {
          list-style-type: decimal;
        }
      `}</style>
    </div>
  );
};

export default Editor;