import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const currentPage = new URLSearchParams(window.location.search).get("page");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname, currentPage]);

  return null;
};

export default ScrollToTop;
