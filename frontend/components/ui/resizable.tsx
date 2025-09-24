import React, { useState, useCallback, useRef } from 'react';

interface ResizableProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
  className?: string;
}

export const Resizable: React.FC<ResizableProps> = ({
  children,
  direction = 'vertical',
  minSize = 200,
  maxSize = Infinity,
  defaultSize = 400,
  className = '',
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      let newSize: number;

      if (direction === 'horizontal') {
        newSize = e.clientX - rect.left;
      } else {
        newSize = e.clientY - rect.top;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [direction, minSize, maxSize]);

  const containerStyle: React.CSSProperties = direction === 'horizontal' 
    ? { width: size, minWidth: minSize }
    : { height: size, minHeight: minSize };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={containerStyle}
    >
      <div className="h-full w-full overflow-auto">
        {children}
      </div>
      
      {/* Resize Handle */}
      <div
        className={`absolute ${
          direction === 'horizontal'
            ? 'right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500 hover:w-2 transition-all'
            : 'bottom-0 left-0 h-1 w-full cursor-row-resize hover:bg-blue-500 hover:h-2 transition-all'
        } ${
          isResizing ? 'bg-blue-500' : 'bg-gray-300'
        } z-10`}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

interface ResizablePanelProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  defaultHeight?: number;
  minHeight?: number;
  className?: string;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  title,
  defaultHeight = 300,
  minHeight = 150,
  className = '',
}) => {
  return (
    <div className={`border rounded-lg ${className}`}>
      {title && (
        <div className="px-4 py-2 border-b bg-gray-50 font-medium text-sm">
          {title}
        </div>
      )}
      <Resizable
        direction="vertical"
        defaultSize={defaultHeight}
        minSize={minHeight}
        className="w-full"
      >
        <div className="p-4">
          {children}
        </div>
      </Resizable>
    </div>
  );
};

interface SplitPaneProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplitPosition?: number;
  minLeftWidth?: number;
  minRightWidth?: number;
}

export const SplitPane: React.FC<SplitPaneProps> = ({
  leftPanel,
  rightPanel,
  defaultSplitPosition = 50,
  minLeftWidth = 300,
  minRightWidth = 300,
}) => {
  const [splitPosition, setSplitPosition] = useState(defaultSplitPosition);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const newPosition = ((e.clientX - rect.left) / rect.width) * 100;
      
      const minLeftPercent = (minLeftWidth / rect.width) * 100;
      const maxLeftPercent = 100 - (minRightWidth / rect.width) * 100;
      
      const clampedPosition = Math.max(minLeftPercent, Math.min(maxLeftPercent, newPosition));
      setSplitPosition(clampedPosition);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [minLeftWidth, minRightWidth]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      <div style={{ width: `${splitPosition}%` }} className="h-full">
        {leftPanel}
      </div>
      
      {/* Vertical Splitter */}
      <div
        className={`w-1 h-full cursor-col-resize hover:bg-blue-500 hover:w-2 transition-all ${
          isResizing ? 'bg-blue-500 w-2' : 'bg-gray-300'
        } z-10`}
        onMouseDown={handleMouseDown}
      />
      
      <div style={{ width: `${100 - splitPosition}%` }} className="h-full">
        {rightPanel}
      </div>
    </div>
  );
};