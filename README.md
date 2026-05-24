# Coachy AI Frontend

<!-- Insert 4-5 relevant professional badges here. Mimic this style: -->
[![Version](https://img.shields.io/badge/Version-0.1.0-blue.svg)]()
[![Tech Stack](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20TailwindCSS-blue.svg)]()
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-yellow.svg)]()
[![Hackathon](https://img.shields.io/badge/Hackathon-Build__with__AI-ff69b4.svg)](https://ai.gdgtashkent.uz/hackathon)

## Overview

The Coachy AI Frontend is a highly interactive, modern web application that serves as the primary interface for students preparing for the BMBA Milliy Sertifikat exams. Designed with an emphasis on rich aesthetics and a smooth user experience, it acts as a digital companion that seamlessly blends rigorous assessment with engaging, gamified learning.

By leveraging React 19 and Vite, the platform ensures rapid load times and fluid state transitions. The UI delivers an immersive environment where students can take timed mock exams, analyze their mistakes through an interactive AI coach, track their adaptive study roadmaps, and compete against peers or AI in real-time knowledge battles.

## Features & Functionality

- **Immersive Exam Experience:** A focused, distraction-free environment for taking diagnostic and full mock exams, complete with timers, scratchpads, and integrated formula sheets.
- **Interactive AI Coach Interface:** A dynamic chat UI powered by Framer Motion and WebSockets that renders mathematical formulas (LaTeX), code, and diagrams in real-time as the AI tutor guides the student through complex problems.
- **Live Battle Arena:** A real-time gamified arena where users can challenge friends or AI bots. Features immediate feedback, live opponent tracking, and post-match ELO updates.
- **Adaptive Roadmaps & Analytics:** Visualizes the student's personalized learning journey and performance analytics, providing granular breakdowns of strengths, weaknesses, and required study milestones.
- **Offline & Mock Mode Capability:** Built-in mock data fallback (`VITE_USE_MOCK_DATA`) ensuring the application remains testable and demonstrable even when disconnected from the backend API.

## Getting Started

### Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm or yarn

### Installation & Configuration

1. Clone the repository and navigate to this directory.
2. Copy the example environment file and configure your keys:
   ```bash
   cp .env.example .env
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Members
- **Muhammad Jabborov:** Team Member 1 - Backend Engineer
- **Sukhrob Tokhirov:** Team Member 2 - FrontEnd Engineer
- **Ali Sultonov:** Team Member 3 - AI/ML Englineer

## License
Proprietary — bwi-edtech-hackathon.
