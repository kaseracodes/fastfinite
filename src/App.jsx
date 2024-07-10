import { Route, Routes } from "react-router-dom";
import "./App.css";
import ScrollToTop from "./ScrollToTop";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
  );
}

export default App;
