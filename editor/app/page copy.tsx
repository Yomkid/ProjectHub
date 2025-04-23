import React from 'react';
import dynamic from 'next/dynamic';
import Editor from '@/components/Editor';


const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">📝 ProjectHub Text-Editor</h1>
      <Editor />
    </main>
  );
};

export default HomePage;
