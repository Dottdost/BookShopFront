import RegisterPopup from "./components/RegisterPopup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <Navbar />
        <RegisterPopup />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
