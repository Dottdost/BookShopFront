# Cheshire Shelf Web

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)

**Cheshire Shelf Web** is a modern web bookstore application built with React, TypeScript, and Vite.  
It provides a complete online bookshop experience for customers and includes an admin interface for managing the main parts of the store.

The project is connected to a backend API and focuses on real bookstore functionality: authentication, book browsing, cart and wishlist actions, checkout, order management, admin tools, and real-time support communication.

---

## Overview

Cheshire Shelf Web is the browser-based client for the Cheshire Shelf bookstore system.

Customers can explore the book catalog, view detailed book pages, manage their shopping flow, place orders, and communicate with support. Admin users can access protected management tools for handling books, users, orders, promo codes, and other store data.

The project was built as a functional frontend application, not only as a static UI. It works with backend services, protected routes, user roles, persistent state, and real-time features.

---

## Core Features

### Customer Interface

The customer side of the application allows users to:

- Browse the bookstore catalog
- Open detailed book pages
- Add books to cart
- Save books to wishlist
- Complete checkout
- View order history
- Use support chat
- Switch interface language
- Work with a responsive and styled UI

The customer experience is designed to be simple, visual, and close to a real e-commerce flow.

---

### Authentication and Protected Access

The app includes authentication and role-based behavior.

Main authentication features include:

- User registration
- User login
- JWT-based authorization
- Protected pages
- Role-based admin access
- User session handling

This allows the application to separate regular customer functionality from admin-only functionality.

---

### Bookstore Flow

The project covers the main flow of an online bookstore:

- Book discovery
- Book details
- Cart management
- Wishlist interaction
- Checkout
- Order creation
- Order history

This makes the application more complete than a simple catalog because it follows the full customer journey from browsing to order placement.

---

### Admin Dashboard

The web app includes an admin area for managing bookstore data.

Admin functionality includes:

- Book management
- User management
- Order management
- Promo code management
- Genre and publisher-related management
- Support request handling

The admin panel is protected by user roles and is intended for store management rather than regular customer usage.

---

### Real-Time Support

The application includes support chat functionality connected with SignalR.

The support system allows communication between customers and admins and demonstrates real-time frontend behavior, authenticated hub connections, and live message handling.

This is one of the stronger technical parts of the project because it goes beyond standard REST API requests.

---

## Technical Highlights

### React and TypeScript Architecture

The frontend is built with React and TypeScript, which helps keep the project structured, typed, and easier to maintain.

### Vite Development Environment

Vite is used for fast development, local testing, and optimized production builds.

### Redux Toolkit State Management

Redux Toolkit is used to manage shared application state and make the customer shopping flow more predictable.

### REST API Integration

The app communicates with a backend API for authentication, books, users, orders, promo codes, and other business features.

### SignalR Integration

SignalR is used for real-time support communication, allowing the frontend to receive updates without manual page refreshes.

### Internationalization

The project includes multilingual support through i18n tools, making the interface prepared for more than one language.

### Role-Based User Experience

The app adapts available pages and actions depending on the current user's role, separating customer functionality from admin functionality.

---

## Tech Stack

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- SignalR
- JWT authentication
- i18next
- React Icons
- React Toastify
- CSS styling

---

## Why This Project Stands Out

Cheshire Shelf Web is not just a visual bookstore page. It is a full web client for a bookstore system with customer features, admin tools, authentication, order flow, and real-time support.

The project demonstrates:

- Modern React frontend development
- Type-safe application structure
- API-based architecture
- Authentication and protected routes
- Role-based functionality
- E-commerce user flow
- Admin dashboard logic
- Real-time communication with SignalR
- Multilingual interface support
- Persistent and interactive user experience

This makes the project suitable for academic presentation, portfolio use, and further development as a real bookstore platform.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Dottdost/BookShopFront.git
```
