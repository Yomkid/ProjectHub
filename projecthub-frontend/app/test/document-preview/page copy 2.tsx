// 'use client';
// import dynamic from 'next/dynamic';

// const PDFViewer = dynamic(
//   () => import('@/components/SafePDFViewer'),
//   {
//     ssr: false,
//     loading: () => <div className="p-4">Loading PDF viewer...</div>
//   }
// );

// export default function DocumentPreview() {
//   // Absolute path to PDF in public folder
//   const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/documents/election.pdf`;
  
//   return (
//     <div className="w-full">
//       <PDFViewer fileUrl={pdfUrl} />
//     </div>
//   );
// }



// // components/EnhancedPDFViewer.tsx
// 'use client';
// import { Viewer } from '@react-pdf-viewer/core';
// import { toolbarPlugin, searchPlugin, thumbnailPlugin } from '@react-pdf-viewer/plugins';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/plugins/lib/styles/index.css';

// export default function EnhancedPDFViewer({ fileUrl }: { fileUrl: string }) {
//   const toolbar = toolbarPlugin();
//   const search = searchPlugin();
//   const thumbnails = thumbnailPlugin();

//   return (
//     <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//       <toolbar.Toolbar />
//       <div style={{ flex: 1, display: 'flex' }}>
//         <thumbnails.Thumbnails />
//         <Viewer
//           fileUrl={fileUrl}
//           plugins={[toolbar, search, thumbnails]}
//         />
//       </div>
//     </div>
//   );
// }

// 'use client';
// import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
// import { searchPlugin } from '@react-pdf-viewer/search';
// import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/toolbar/lib/styles/index.css';
// import '@react-pdf-viewer/search/lib/styles/index.css';
// import '@react-pdf-viewer/thumbnail/lib/styles/index.css';

// export default function EnhancedPDFViewer({ fileUrl }: { fileUrl: string }) {
//   const toolbar = toolbarPlugin();
//   const search = searchPlugin();
//   const thumbnails = thumbnailPlugin();

//   return (
//     <Worker workerUrl="/pdf.worker.js">
//       <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
//         <toolbar.Toolbar />
//         <div style={{ flex: 1, display: 'flex' }}>
//           <thumbnails.Thumbnails />
//           <Viewer
//             fileUrl={fileUrl}
//             plugins={[toolbar, search, thumbnails]}
//           />
//         </div>
//       </div>
//     </Worker>
//   );
// }


'use client';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import { searchPlugin } from '@react-pdf-viewer/search';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import '@react-pdf-viewer/thumbnail/lib/styles/index.css';

export default function EnhancedPDFViewer() {
  // Use absolute URL in production, relative in development
  const fileUrl = process.env.NODE_ENV === 'production'
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ''}/documents/election.pdf`
    : '/documents/election.pdf';

  const toolbar = toolbarPlugin();
  const search = searchPlugin();
  const thumbnails = thumbnailPlugin();

  return (
    <Worker workerUrl="/pdf.worker.js">
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <toolbar.Toolbar />
        <div style={{ flex: 1, display: 'flex' }}>
          {/* <thumbnails.Thumbnails /> */}
          <Viewer
            fileUrl={fileUrl}
            plugins={[toolbar, search, thumbnails]}
            defaultScale={SpecialZoomLevel.ActualSize}
          />
        </div>
      </div>
    </Worker>
  );
}