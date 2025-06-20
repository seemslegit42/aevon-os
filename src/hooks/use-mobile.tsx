
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with a default value, e.g., false.
  // Server will render with this default.
  // Client will initially render with this default, then useEffect updates.
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    // This function will only run on the client.
    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount
    checkDeviceSize();

    // Listen for resize events
    window.addEventListener("resize", checkDeviceSize);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount.

  return isMobile;
}

