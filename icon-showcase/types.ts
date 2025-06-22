
export interface IconProps {
  className?: string;
  size?: number; // Shortcut for width & height if they are the same
  strokeWidth?: number; 
  id?: string; // Optional id for the SVG element
}

// IconDisplayInfo is defined in App.tsx, this is just for context
// Will add svgPaths to IconDisplayInfo in App.tsx to assist with SVG copying.
// No, decided against svgPaths in IconDisplayInfo, will use ref.current.outerHTML instead.
