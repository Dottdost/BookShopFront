import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import { useState } from "react";
import Footer from "./components/Footer";
import BooksPage from "./pages/BooksPage";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import store from "./store";
import AuthModal from "./components/AuthModal";
import RegisterPopup from "./components/RegisterPopup";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Функция для открытия модалки
  const openAuthModal = () => setAuthModalOpen(true);

  // Функция для закрытия модалки
  const closeAuthModal = () => setAuthModalOpen(false);

  return (
    <Provider store={store}>
      <Router>
        <Navbar openAuthModal={openAuthModal} />
        <RegisterPopup />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
        {isAuthModalOpen && <AuthModal onClose={closeAuthModal} />}
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
