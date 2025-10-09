import { useEffect, useState } from "react";

const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const touch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    setIsTouch(touch);
  }, []);

  return isTouch;
};

export default useIsTouchDevice;
