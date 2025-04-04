import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import AuthModal from "./components/AuthModal";
import RegisterPopup from "./components/RegisterPopup"; // Добавляем компонент RegisterPopup
import { ThemeProvider } from "./context/ThemeContext";
import Footer from "./components/Footer";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
    setAuthModalOpen(false);
  };

  return (
    <Router>
      <ThemeProvider>
        <Navbar user={user} onLoginClick={() => setAuthModalOpen(true)} />
        {isAuthModalOpen && (
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        <main>
          <RegisterPopup /> {/* Добавляем RegisterPopup сюда */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contacts" element={<Contacts />} />
          </Routes>
        </main>

        <Footer />
      </ThemeProvider>
    </Router>
  );
}

export default App;
