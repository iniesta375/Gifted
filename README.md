# Gifted Pets Adoption Platform

Gifted Pets is a modern, full-stack web application that connects pet seekers with their future companions. This project focuses on real-time data management, secure user onboarding, and automated post-purchase documentation.



## Key Features

- **Secure Authentication**: Built with Firebase Auth, featuring Google Sign-In and Email/Password options.
- **Live Security Validation**: Includes a real-time password strength meter and strict Regex patterns to ensure user data integrity.
- **Concurrency Management**: Uses `Promise.all()` to ensure pet availability and user records are updated simultaneously, preventing double-purchases.
- **Automated Receipts**: A custom JavaScript engine that generates printable adoption certificates upon successful transaction.
- **Personalized Dashboard**: Allows users to view their adoption history and manage their profile data.
- **Responsive Teal UI**: A custom-themed interface built with Bootstrap 5, optimized for both mobile and desktop users.

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Framework:** Bootstrap 5.3.3
- **Backend-as-a-Service:** Firebase (Authentication & Realtime Database)
- **Design System:** Custom "Gifted Teal" Palette (#2d9596, #265073)

## Project Architecture

The application follows a modular architecture:
1. **Auth Module**: Handles user registration, login, and duplicate prevention.
2. **Marketplace Module**: Fetches and displays pet data dynamically from Firebase.
3. **Checkout Module**: Processes manual payments and updates the database state.
4. **Dashboard Module**: Listens for real-time changes to user-specific adoption records.

## Getting Started

1. repository: `https://github.com/iniesta375/Gifted.git`
2. live server: `gifted-sand.vercel.app`