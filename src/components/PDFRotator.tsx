'use client'

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs';
import { PDFDocument, degrees } from 'pdf-lib'

// 添加自定义CSS样式
const customStyles = `
@font-face {
  font-family: '';
  src: url('../assets/font/.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

. {
  font-family: '', serif;
}

@media (min-width: 1536px) {
    .container-pdf {
        max-width: 1536px;
    }
}

@media (min-width: 1280px) {
    .container-pdf {
        max-width: 1280px;
    }
}
@media (min-width: 1024px) {
    .container-pdf {
        max-width: 1024px;
    }
}
@media (min-width: 768px) {
    .container-pdf {
        max-width: 768px;
    }
}
@media (min-width: 640px) {
    .container-pdf {
        max-width: 640px;
    }
}

/* Tooltip 样式 */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 6px 10px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
`;

interface PDFPageProps {
  pageNumber: number
  rotation: number
  file: File
  onRotate: () => void
  size: number // 使用固定大小代替缩放比例
}

const PDFPage: React.FC<PDFPageProps> = React.memo(({ pageNumber, rotation, file, onRotate, size }) => {
  const options = useMemo(() => ({ worker: pdfjsWorker }), []);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.width = '100%';
        canvas.style.objectFit = 'contain';
   
        canvas.style.transitionProperty = 'transform';
        canvas.style.transitionTimingFunction = 'cubic-bezier(0.4, 0, 0.2, 1)';
        canvas.style.transitionDuration = '150ms';
        canvas.style.transform = `rotate(${rotation}deg)`;
        canvas.style.backgroundColor = 'transparent';
      }
      
 
      const pageDiv = canvasRef.current.querySelector('.react-pdf__Page');
      if (pageDiv instanceof HTMLElement) {
        pageDiv.style.backgroundColor = 'transparent';
      }
    }
  }, [rotation]);

  // 处理卡片点击事件
  const handleCardClick = (e: React.MouseEvent) => {
 
    if ((e.target as HTMLElement).closest('.rotate-button')) {
      return;
    }
    
   
    onRotate();
  };

  return (
    <div 
      className="m-3" 
      style={{ 
        maxWidth: `${size}px`, 
        flex: `0 0 ${size}px` 
      }}
    >
      <div className="relative cursor-pointer pdf-page" data-page-num={pageNumber - 1} onClick={handleCardClick}>
        {/* 旋转按钮 */}
        <div 
          className="absolute z-10 top-1 right-1 rounded-full p-1 hover:scale-105 hover:fill-white bg-[#ff612f] fill-white rotate-button cursor-pointer"
          onClick={onRotate}
        >
          <svg className="w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"></path>
          </svg>
        </div>

        <div className="overflow-hidden">
          <div className="relative h-full w-full flex flex-col justify-between items-center shadow-md p-3 bg-white hover:bg-gray-50">
            <div className="pointer-events-none w-full shrink" ref={canvasRef}>
              <Document file={file} options={options}>
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  rotate={0}
                  className="bg-transparent"
                  width={size - 30} // 减去内边距
                />
              </Document>
            </div>
            <div className="w-[90%] text-center shrink-0 text-xs italic overflow-hidden text-ellipsis whitespace-nowrap">
              {pageNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});


PDFPage.displayName = 'PDFPage';

export default function PDFRotator() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [rotations, setRotations] = useState<number[]>([])
  const [numPages, setNumPages] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [pageSize, setPageSize] = useState(200) // 设置默认页面大小为200px
  const [isLoading, setIsLoading] = useState(false) // 初始值为false


  useEffect(() => {
    const updatePageSize = () => {
    
      const containerElement = document.querySelector('.container-pdf');
      const containerWidth = containerElement?.clientWidth || 2000;
      
   
      console.log('Container width:', containerWidth);
      setPageSize(200); // 固定为200px
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, [pdfFile]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setPdfFile(file)
    setRotations(new Array(numPages).fill(0))
  }


  const handleZoomIn = useCallback(() => {
    setPageSize(prev => Math.min(prev + 50, 400)); // 每次放大50px，最大400px
  }, []);

 
  const handleZoomOut = useCallback(() => {
    setPageSize(prev => Math.max(prev - 50, 100)); // 每次缩小50px，最小100px
  }, []);

  // 检查是否达到缩放限制
  const isMaxSize = pageSize >= 400;
  const isMinSize = pageSize <= 100;

  // 修改旋转处理，始终累加旋转值以确保顺时针旋转
  const handleRotate = useCallback((pageIndex: number) => {
    setRotations(prev => {
      const newRotations = [...prev];
      newRotations[pageIndex] = newRotations[pageIndex] + 90; // 不取模，允许超过360度
      return newRotations;
    });
  }, []);

  // 旋转所有页面
  const handleRotateAll = useCallback(() => {
    setRotations(prev => prev.map(rotation => rotation + 90));
  }, []);

  // 移除PDF
  const handleRemovePDF = useCallback(() => {
    setPdfFile(null);
    setRotations([]);
    setNumPages(0);
  }, []);

  // 下载PDF
  const handleDownload = async () => {
    if (!pdfFile) return;
    
    try {
      setIsDownloading(true);
      
      // 读取原始PDF文件
      const fileArrayBuffer = await pdfFile.arrayBuffer();
      
      // 使用pdf-lib加载PDF文档
      const pdfDoc = await PDFDocument.load(fileArrayBuffer);
      
      // 获取所有页面
      const pages = pdfDoc.getPages();
      
      // 应用旋转到每个页面
      pages.forEach((page, index) => {
        if (index < rotations.length) {
          // 获取当前页面的旋转角度 (模360后)
          const rotationAngle = rotations[index] % 360;
          // 应用旋转，使用degrees函数将角度转换为pdf-lib需要的格式
          page.setRotation(degrees(rotationAngle));
        }
      });
      
      // 将修改后的PDF保存为Uint8Array
      const pdfBytes = await pdfDoc.save();
      
      // 创建Blob对象
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // 创建下载链接
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = pdfFile.name.replace(/\.pdf$/i, '_rotated.pdf');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      setIsDownloading(false);
    } catch (error) {
      console.error('Download failed:', error);
      setIsDownloading(false);
      alert('下载失败，请重试');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setRotations(new Array(numPages).fill(0))
    setIsLoading(false) // 加载完成
  }

  // 处理加载错误
  const onDocumentLoadError = () => {
    console.error('PDF加载失败')
    setIsLoading(false) // 加载失败时也结束加载状态
    alert('PDF加载失败，请重试')
  }

  const documentOptions = useMemo(() => ({ worker: pdfjsWorker }), []);

  // 添加样式到文档
  useEffect(() => {
    // 检查是否已经存在样式
    let styleEl = document.getElementById('pdf-rotator-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'pdf-rotator-styles';
      styleEl.innerHTML = customStyles;
      document.head.appendChild(styleEl);
    }
    
    return () => {
      const styleToRemove = document.getElementById('pdf-rotator-styles');
      if (styleToRemove) {
        document.head.removeChild(styleToRemove);
      }
    };
  }, []);

  return (
    <div className="w-full space-y-5">
      {!pdfFile ? (
        <div className="w-full flex justify-center">
          <div className="h-[350px] relative text-center w-[275px]">
            <input 
              className="cursor-pointer hidden" 
              type="file" 
              id="input-file-upload" 
              accept=".pdf"
              onChange={handleFileUpload}
            />
            <label 
              className="h-full flex items-center justify-center border rounded transition-all bg-white border-dashed border-stone-300" 
              htmlFor="input-file-upload"
            >
              <div className="cursor-pointer flex flex-col items-center space-y-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="1.5" 
                  stroke="currentColor" 
                  className="w-8 h-8"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  ></path>
                </svg>
                <p className="pointer-events-none font-medium text-sm leading-6 pointer opacity-75 ">
                  Click to upload or drag and drop
                </p>
              </div>
            </label>
          </div>
        </div>
      ) : isLoading ? (
        <div className="w-full flex justify-center items-center h-[350px]">
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 rounded-full absolute border-2 border-solid border-gray-200"></div>
            <div className="w-10 h-10 rounded-full animate-spin absolute border-2 border-solid border-[#ff612f] border-t-transparent"></div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 控制按钮组 */}
          <div className="flex justify-center items-center space-x-3">
            <div className="tooltip">
              <button 
                className="bg-[#ff612f] text-white px-4 py-2 rounded shadow hover:opacity-90 transition-opacity cursor-pointer grow-0 shrink-0 "
                onClick={handleRotateAll}
              >
                Rotate all
              </button>
              <span className="tooltiptext ">Rotate all pages by 90 degrees</span>
            </div>
            
            <div className="tooltip">
              <button 
                className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-gray-900 transition-colors cursor-pointer grow-0 shrink-0 "
                onClick={handleRemovePDF}
              >
                Remove PDF
              </button>
              <span className="tooltiptext ">Remove this PDF and select a new one</span>
            </div>
            
            <div className="tooltip">
              <button 
                className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 cursor-pointer grow-0 shrink-0 disabled:opacity-50 !bg-white"
                onClick={handleZoomIn}
                disabled={isMaxSize}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6"></path>
                </svg>
              </button>
              <span className="tooltiptext ">Zoom in</span>
            </div>
            
            <div className="tooltip">
              <button 
                className="bg-[#ff612f] shadow rounded-full p-2 flex items-center justify-center hover:scale-105 cursor-pointer grow-0 shrink-0 disabled:opacity-50 !bg-white"
                onClick={handleZoomOut}
                disabled={isMinSize}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6"></path>
                </svg>
              </button>
              <span className="tooltiptext ">Zoom out</span>
            </div>
          </div>

          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            className="hidden"
            options={documentOptions}
          />
          
          <div className="flex flex-wrap justify-center">
            {Array.from({ length: numPages }, (_, i) => (
              <PDFPage
                key={i}
                pageNumber={i + 1}
                rotation={rotations[i]}
                file={pdfFile}
                onRotate={() => handleRotate(i)}
                size={pageSize}
              />
            ))}
          </div>
          

          <div className="flex justify-center mt-6">
            <div className="tooltip">
              <button 
                className="bg-[#ff612f] text-white px-4 py-2 rounded shadow hover:opacity-90 transition-opacity cursor-pointer grow-0 shrink-0 "
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
              <span className="tooltiptext ">Download rotated PDF</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 