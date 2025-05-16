import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import { useState } from "react";
import Footer from "./components/Footer";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import store from "./store";
import AuthModal from "./components/AuthModal";
import RegisterPopup from "./components/RegisterPopup";
import AdminPanel from "./components/AdminPanel";
import BookDetails from "./components/BookDetails";
import BooksPage from "./pages/BooksPage";
import ResetPasswordModal from "./components/ResetPasswordModal";
import CartPage from "./pages/CartPage";
import { ToastContainer } from "react-toastify";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isResetModalOpen, setResetModalOpen] = useState(false);

  const openAuthModal = () => {
    setResetModalOpen(false);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  const openResetModal = () => {
    setAuthModalOpen(false);
    setResetModalOpen(true);
  };

  const closeResetModal = () => setResetModalOpen(false);

  return (
    <Provider store={store}>
      <Router>
        <Navbar openAuthModal={openAuthModal} />
        <RegisterPopup />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>

        {isAuthModalOpen && (
          <AuthModal
            onClose={closeAuthModal}
            onResetPasswordClick={openResetModal}
          />
        )}
        {isResetModalOpen && <ResetPasswordModal onClose={closeResetModal} />}
        <ToastContainer />

        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
