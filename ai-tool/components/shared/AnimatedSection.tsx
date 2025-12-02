import React, { useRef, useEffect, useState } from 'react';

interface AnimatedSectionProps {
  isExpanded: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedSection({ isExpanded, children, className = '' }: AnimatedSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [shouldRender, setShouldRender] = useState(isExpanded);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isExpanded) {
      // Render content first
      setShouldRender(true);
      
      // Then measure and animate
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const contentHeight = contentRef.current.scrollHeight;
          setHeight(contentHeight);
        }
      });
    } else {
      // Before collapsing, set to current height
      if (contentRef.current) {
        const contentHeight = contentRef.current.scrollHeight;
        setHeight(contentHeight);
      }
      
      // Then animate to 0
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setHeight(0);
          
          // Remove from DOM after animation
          timeoutRef.current = setTimeout(() => {
            setShouldRender(false);
          }, 300);
        });
      });
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isExpanded]);

  // Update height when content changes (e.g., window resize)
  useEffect(() => {
    if (!isExpanded || !contentRef.current) return;
    
    const updateHeight = () => {
      if (contentRef.current && isExpanded) {
        setHeight(contentRef.current.scrollHeight);
      }
    };
    
    const resizeObserver = new ResizeObserver(updateHeight);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, [isExpanded, children]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{
        maxHeight: `${height}px`,
        opacity: isExpanded && height > 0 ? 1 : 0,
        transform: isExpanded && height > 0 ? 'translateY(0)' : 'translateY(-8px)',
      }}
    >
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}

