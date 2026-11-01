import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // No hash: new page opens from the top
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Hash present: keep trying until the section exists on the page
    const id = hash.slice(1);
    let tries = 0;

    const timer = setInterval(() => {
      const el = document.getElementById(id);
      tries += 1;

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(timer);
      } else if (tries > 20) {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [pathname, hash, key]);

  return null;
}