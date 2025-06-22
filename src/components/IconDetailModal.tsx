import React, { useRef, useState, useEffect } from 'react';
import type { IconDisplayInfo, IconProps } from '../types/icon';

interface IconDetailModalProps {
  icon: IconDisplayInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onTagClick: (tag: string) => void;
}

const MODAL_ICON_SIZE = 128; // Define a larger size for the modal preview

const IconDetailModal: React.FC<IconDetailModalProps> = ({ icon, isOpen, onClose, onTagClick }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const iconSvgRef = useRef<SVGSVGElement>(null);
  const [copiedMessage, setCopiedMessage] = useState<string>('');
  const firstFocusableElementRef = useRef<HTMLButtonElement>(null);
  const lastFocusableElementRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [isOpen]);

  // Basic focus trapping
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(el => el.offsetParent !== null); // Filter out hidden elements

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);


  if (!isOpen || !icon) {
    return null;
  }

  const IconComponent = icon.component;

  const handleCopySvg = async () => {
    if (iconSvgRef.current) {
      try {
        let svgString = iconSvgRef.current.outerHTML;

        // Minify slightly
        svgString = svgString.replace(/\n\s*/g, '').replace(/>\s+</g, '><').trim();

        await navigator.clipboard.writeText(svgString);
        setCopiedMessage('SVG Copied!');
      } catch (err) {
        console.error('Failed to copy SVG: ', err);
        setCopiedMessage('Copy Failed!');
      }
    } else {
      setCopiedMessage('Error: SVG element not found.');
    }
    setTimeout(() => setCopiedMessage(''), 2000);
  };
  
  const handleTagClickInternal = (tag: string) => {
    onTagClick(tag);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="icon-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
      style={{ opacity: isOpen ? 1 : 0 }}
      onClick={onClose} // Close on backdrop click
    >
      <div
        ref={modalRef}
        className="relative bg-slate-800/90 backdrop-blur-md w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700/80 transform transition-all duration-300 ease-out scale-95"
        style={{ scale: isOpen ? 1 : 0.95 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          ref={firstFocusableElementRef}
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-full hover:bg-slate-700/70"
          aria-label="Close icon details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center mb-6">
          <IconComponent ref={iconSvgRef} size={MODAL_ICON_SIZE} strokeWidth={icon.defaultStrokeWidth} className="mb-4 text-slate-100" />
          <h2 id="icon-modal-title" className="text-2xl font-semibold text-sky-300 capitalize">
            {icon.name}
          </h2>
        </div>

        {icon.tags && icon.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {icon.tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClickInternal(tag)}
                  className="bg-slate-700 hover:bg-teal-500/30 text-teal-300 hover:text-teal-200 text-xs px-3 py-1 rounded-full transition-colors duration-200 border border-slate-600 hover:border-teal-500"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleCopySvg}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium py-2.5 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 transition-all duration-200"
          >
            {copiedMessage ? copiedMessage : 'Copy SVG'}
          </button>
           {/* Add other buttons here if needed, e.g., Download PNG */}
        </div>
        <button ref={lastFocusableElementRef} className="opacity-0 w-0 h-0 p-0 m-0" aria-hidden="true" tabIndex={-1}></button> {/* Helper for focus trapping */}

      </div>
    </div>
  );
};

export default IconDetailModal;
