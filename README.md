# Ceres Bitez 🍴

### Connecting Surplus food with the people who needs it

The project explores how mobile technology can support food redistribution by connecting people who have surplus food with organizations and volunteers who can help deliver it to those who need it.

## Overview

Food waste and food affordability are important challenges and it also effects the environments as well. At the same time restaurants and other food businesses may have surplus food that could be redirected to people who need it.

**Ceres-Bitez aims to bridge this gap** through a platform that facilitates communication and coordination between students, food donors, NGOs, Homes and volunteers.

The project focuses on:

- Making food assistance more accessible to students.
- Encouraging the responsible redistribution of surplus food.
- Connecting food donors with organizations and volunteers.
- Exploring location-based services for food collection and delivery.
- Providing an affordable, technology-driven approach to community food sharing.

## ❗ The Problem

Students can struggle to afford regular meals while food businesses may have surplus food that goes unused.

Without an effective coordination system, connecting these two groups can be difficult. Food donation and delivery may require several parties, including donors, charitable organizations, and volunteers.

Ceres-Bitez explores a centralized mobile platform to make this process more organized and accessible.

## 💡 Our Solution

Ceres-Bitez introduces a food-sharing workflow that connects students, food donors, NGOs, and volunteers through a mobile application.

The proposed platform supports two main approaches:

1. **NGO-coordinated food assistance:** Students submit food requests, donors are contacted, volunteers collect available food, and NGOs coordinate preparation and delivery.
2. **Discounted food from businesses:** Participating businesses can offer eligible surplus food at reduced prices for direct delivery to students.

These workflows are designed to support food accessibility, reduce avoidable food waste, and encourage community participation.


## User Roles

| User Role | Definition |
| --------- | ---------- |
| Student | University Students |
| Businesses | Food related businesses that give surplus foods |
| Volunteers | People who deliver foods |
| NGO | NGO Organization |
| Home | Children and Elderly Homes |

## 🔁 How it works

### Student Workflow
   1. Restaurant post when surplus food is available
   2. Student request for food
   3. Restaurants can accept and package the food
   4. Student can view the current state of the food
   5. Nearby Volunteers can accept the request
   6. Food is delivered to the student

### Home Workflow
   1. Restaurant Post when surplus food is available
   2. Home make a food request
   3. The NGO accept the request
   4. NGO select and request restaurant for packaging food
   5. Restaurants can accept and package the food
   6. Home can view the current state of the food
   7. Nearby volunteers can accept the request
   8. Volunteers deliver to NGO
   9. NGO checks the food and package the food
   10. NGO request volunteers for pick up
   11. Volunteer can the accept the request
   12. Food is delivered to the Home

## 🛠 Techstack

| Technology | Purpose |
| ---------- | ------- |
| React Native | Cross-platform mobile application development |
| Firebase Authentication | User authentication |
| Cloud Firestore | Storing data | 
| Geoapify | Location-related services |
| Supabase | Storing Images |
| EmailJs | Sending email |


## 🚀 Getting Started

### Prerequesites

- [Node.js](https://nodejs.org/)
- [Git](https://git-scm.com/)
- ExpoGo (For mobile device)

### 1. Clone the Repository

```bash
git clone https://github.com/vividMilan/Ceres-Bitez.git
```

### 2. Navigate to the Project

```bash
cd Ceres-Bitez
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment variables

```env
EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key
```

### 5. Start the Development Server

```bash
npx expo start
```

### 5. Scan the QR code with mobile device


> **Important:** The variable above is an example. Use the exact variable names referenced in the project source code. Do not commit real API keys, service credentials, or private configuration files to the repository.

## 🎯 Project Goals

Ceres-Bitez aims to explore how software engineering can address a practical social challenge.

The main goals are to:

- Improve access to food assistance for students and Homes.
- Encourage the redistribution of surplus food.
- Support collaboration between businesses, NGOs, and volunteers.
- Explore location-aware mobile application design.
- Build practical experience with mobile development, authentication, cloud databases, and third-party services.

---

## 👥 Project Information

**Project:** Ceres-Bitez  
**Category:** Mobile Application / Social Impact  
**Primary Focus:** Food Redistribution and Student Food Accessibility  
**Repository:** [vividMilan/Ceres-Bitez](https://github.com/vividMilan/Ceres-Bitez)

---


