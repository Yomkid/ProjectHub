'use client';

import React, { useRef, useState } from 'react';

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>('');

  const applyFormat = (tagName: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();
    const el = document.createElement(tagName);
    el.appendChild(selectedText);
    range.insertNode(el);
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (!url) return;

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Embedded Image';
    img.style.maxWidth = '100%';

    const selection = window.getSelection();
    if (selection && selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.insertNode(img);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL');
    if (!url) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.textContent = selectedText;

    range.deleteContents();
    range.insertNode(anchor);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtml(content);
      console.log('Saved content:', content);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => applyFormat('strong')}>Bold</button>
        <button onClick={() => applyFormat('em')}>Italic</button>
        <button onClick={() => applyFormat('u')}>Underline</button>
        <button onClick={() => applyFormat('h2')}>H2</button>
        <button onClick={() => applyFormat('code')}>Code</button>
        <button onClick={insertLink}>Link</button>
        <button onClick={insertImage}>Image</button>
        <button onClick={handleSave}>💾 Save</button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="border p-4 min-h-[300px] rounded shadow focus:outline-none"
        onInput={() => setHtml(editorRef.current?.innerHTML || '')}
      ></div>

      {/* Preview */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold text-lg mb-2">Preview</h3>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default Editor;
