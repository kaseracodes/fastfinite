import { Route, Routes } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import HomePage from "./pages/HomePage";
import ListingPage from "./pages/ListingPage";
import DetailPage from "./pages/DetailPage";
import ProfilePage from "./pages/ProfilePage";
import AboutUsPage from "./pages/AboutUsPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bikes" element={<ListingPage />} />
        <Route path="/bikes/:id" element={<DetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
      </Routes>
    </>
  );
}

export default App;
