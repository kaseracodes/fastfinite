import { Route, Routes } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="listing-page" element={<ListingPage />} />
      </Routes>
    </>
  );
}

export default App;
