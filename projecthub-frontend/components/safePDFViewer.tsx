// 'use client';
// import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
// import { Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';

// export default function SafePDFViewer({ fileUrl }: { fileUrl: string }) {
//   return (
//     <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
//       <div style={{ height: '100vh' }}>
//         <Viewer
//           fileUrl={fileUrl}
//           defaultScale={SpecialZoomLevel.ActualSize}
//         />
//       </div>
//     </Worker>
//   );
// }


// 'use client';
// import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
// import { Worker } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';

// export default function SafePDFViewer({ fileUrl }: { fileUrl: string }) {
//   return (
//     <Worker workerUrl={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pdf.worker.js`}>
//       <div style={{ height: '100vh' }}>
//         <Viewer
//           fileUrl={fileUrl}
//           defaultScale={SpecialZoomLevel.ActualSize}
//         />
//       </div>
//     </Worker>
//   );
// }

// components/PDFViewerWrapper.tsx
'use client';
import { Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function PDFViewerWrapper({ fileUrl }: { fileUrl: string }) {
  // Verify the URL is properly formatted
  const verifiedUrl = fileUrl.startsWith('/') 
    ? `${window.location.origin}${fileUrl}`
    : fileUrl;

  return (
    <Worker workerUrl="/pdf.worker.js">
      <div style={{ height: '100vh' }}>
        <Viewer
          fileUrl={verifiedUrl}
          defaultScale={SpecialZoomLevel.ActualSize}
        />
      </div>
    </Worker>
  );
}