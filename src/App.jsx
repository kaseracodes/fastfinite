import { Route, Routes } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import HomePage from "./pages/HomePage";
import { HelmetProvider } from "react-helmet-async";
import ListingPage from "./pages/ListingPage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import AboutUsPage from "./pages/AboutUsPage";
import TncPage from "./pages/TncPage";

function App() {
  return (
    <>
    <HelmetProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/vehicles" element={<ListingPage />} />
        <Route path="/vehicles/:id" element={<DetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/tnc" element={<TncPage />} />
      </Routes>
      </HelmetProvider>
    </>
  );
}

export default App;
