import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Contacts from "./pages/Contacts";
import AuthModal from "./components/AuthModal";
import { useState } from "react";
import Footer from "./components/Footer";
import BooksPage from "./pages/BooksPage";
import FavoritesPage from "./pages/FavoritesPage";
import OrdersPage from "./pages/OrdersPage";
import store from "./store";

function App() {
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route
            path="/login"
            element={<AuthModal onClose={() => setAuthModalOpen(false)} />}
          />
        </Routes>

        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
