MGMotores - Official Website

This repository contains the source code for the official website of MGMotores, a company specializing in the installation and maintenance of water pumping systems. The project is a modern, single-page application designed to inform potential clients about services and products, and to generate qualified leads through an interactive budget assistant.
About The Project

The primary goal of this website is to provide a clean, professional online presence for MGMotores. It replaces a simple contact form with a smart, guided "Budget Assistant" that helps users specify their needs for domestic, pool, or agricultural water systems. This process provides the company with detailed, high-quality information, enabling faster and more accurate quotes.

The project also includes a simple backend system for a few administrators to manage the product catalog, associated images, and promotional banners displayed on the site.
Key Features

    Responsive Single-Page Design: Fully functional and visually appealing on all devices, from mobile phones to desktops.

    Dynamic Product Showcase: Product information is fetched directly from a database, allowing for easy updates without changing the site's code.

    Interactive Budget Assistant: A guided form that dynamically changes its questions based on the user's selected application type (Domestic, Pool, or Agriculture) to gather precise requirements.

    Admin Functionality: A secure area for administrators to log in and perform CRUD (Create, Read, Update, Delete) operations on products, banners, and product images.

    Cloud-Based Backend: Leverages a modern BaaS (Backend as a Service) platform for database, authentication, and file storage, ensuring scalability and security.

Technology Stack

This project combines a classic static frontend with a modern, cloud-based backend for a robust and efficient solution.
Frontend

    HTML5: For the core structure and content of the website.

    CSS3: For all styling, layout, and responsiveness.

    JavaScript (ES6+): For all client-side logic, interactivity, DOM manipulation, and communication with the Supabase backend.

Backend & Database (BaaS)

    Supabase: The all-in-one backend platform providing:

        Supabase Postgres DB: A robust, scalable SQL database for storing all application data (products, banners, product_images).

        Supabase Auth: Handles authentication for the three administrator accounts, secured with Row Level Security (RLS) policies.

        Supabase Storage: Used for hosting and serving all product images.

        Supabase APIs: Auto-generated APIs for secure interaction between the frontend and the database.

Hosting & Deployment

    Version Control: Git

    Code Repository: GitHub