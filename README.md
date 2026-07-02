# Cheshire Shelf Web

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

**Cheshire Shelf Web** is a modern web bookstore application built with **React**, **TypeScript**, and **Vite**.

The project provides a complete online bookstore experience for customers and includes a protected admin dashboard for managing the main parts of the store. It is connected to a backend API and deployed to **AWS S3** with an automated **CI/CD pipeline using GitHub Actions**.

---

## Overview

Cheshire Shelf Web is the browser-based client for the Cheshire Shelf bookstore system.

Customers can browse books, open detailed book pages, manage their shopping flow, place orders, and communicate with support. Admin users can access protected management tools for handling books, users, orders, promo codes, genres, publishers, and support requests.

The project was built as a functional frontend application connected to a real backend API, not as a static UI mockup. It includes authentication, protected routes, role-based behavior, persistent user interactions, real-time communication, and automated deployment.

---

## Core Features

### Customer Interface

The customer side of the application allows users to:

- Browse the book catalog
- Search and filter books
- View detailed book information
- Add books to cart
- Save books to favorites
- Complete checkout
- View order history
- Contact support through chat
- Switch interface language

The interface is designed to provide a complete bookstore experience from discovery to order placement.

---

### Authentication and Role-Based Access

The application includes authentication and protected access logic.

Main authentication features include:

- User registration
- User login
- JWT-based authorization
- Protected pages
- Role-based access for customers, admins, and super admins
- Separate customer and admin experiences

This allows the application to show different functionality depending on the current user's permissions.

---

### Bookstore Flow

The project covers the main e-commerce flow of an online bookstore:

- Book browsing
- Book details
- Cart management
- Wishlist/favorites
- Checkout
- Order creation
- Order history
- Order status tracking

This makes the project more complete than a simple catalog because it follows the full customer journey.

---

### Admin Dashboard

The web application includes an admin dashboard for managing the bookstore system.

Admin functionality includes:

- Book management
- User management
- Order management
- Promo code management
- Genre management
- Publisher management
- Support chat management

The admin dashboard is protected by roles and is intended for internal store management.

---

### Real-Time Support

The project includes a support chat system for communication between customers and admins.

The support module demonstrates:

- Customer-side support chat
- Admin-side chat management
- Support request handling
- Real-time message updates
- SignalR integration

This is one of the stronger technical parts of the project because it goes beyond standard REST API communication.

---

## Technical Highlights

### React and TypeScript

The frontend is built with React and TypeScript, making the codebase more structured, safer, and easier to maintain.

### Vite

Vite is used for fast development, local testing, and optimized production builds.

### REST API Integration

The application communicates with a backend API for authentication, books, users, orders, promo codes, genres, publishers, and support functionality.

### SignalR Real-Time Communication

SignalR is used for real-time support chat, allowing messages to update without refreshing the page.

### Role-Based Frontend Logic

The application adapts available pages and actions depending on the current user's role.

### Internationalization

The project includes multilingual support, allowing the interface to be used in different languages.

### AWS Deployment

The frontend is deployed as a static web application using **Amazon S3 Static Website Hosting**.

### CI/CD Pipeline

The project uses **GitHub Actions** for automated deployment.

After changes are pushed to the repository, the CI/CD workflow builds the React application and deploys the production files to the AWS S3 bucket automatically.

This means the deployment process is not manual and the hosted version can be updated directly through the GitHub workflow.

---

## Deployment Architecture

The project uses a separated frontend and backend deployment structure.

### Frontend

The frontend is:

- Built with Vite
- Generated as static files
- Deployed to AWS S3
- Served through S3 Static Website Hosting
- Updated automatically through GitHub Actions CI/CD

### Backend

The frontend communicates with a backend API hosted separately on AWS.

The API base URL is configured through environment variables, allowing the frontend to connect to the deployed backend service.

---

## CI/CD Workflow

The CI/CD pipeline is responsible for automating the frontend deployment process.

A typical deployment flow is:

1. Changes are pushed to the GitHub repository.
2. GitHub Actions starts the workflow.
3. Dependencies are installed.
4. The project is built with Vite.
5. The generated production files are uploaded to the AWS S3 bucket.
6. The hosted website is updated.

This improves the development workflow because the project can be deployed consistently without manually uploading files every time.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- Axios
- SignalR
- JWT Authentication
- i18next
- React Icons
- React Toastify
- AWS S3
- GitHub Actions
- CI/CD

---

## Why This Project Stands Out

Cheshire Shelf Web is not just a visual bookstore page. It is a complete frontend client for a bookstore system with customer features, admin tools, authentication, order flow, real-time support, and automated deployment.

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
- AWS static hosting
- CI/CD deployment with GitHub Actions

This makes the project suitable for academic presentation, portfolio use, and further development as a real bookstore platform.

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Dottdost/BookShopFront.git
```
