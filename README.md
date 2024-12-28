# Elysia with Bun runtime

# LINE Travel Companion Chatbot

A LINE chatbot built to enhance travel convenience and enjoyment. Powered by Bun with Elysia.js for high-performance API and webhook handling, this chatbot provides real-time currency exchange rates (THB ↔ JPY), trip planning assistance, and nearby location recommendations. The frontend, crafted with Next.js 15, ensures an engaging user experience.

## Features

Trip Planning: Manage and display travel agendas.
Currency Exchange: Get live THB ↔ JPY exchange rates using Gemini API.
Nearby Locations: Find maps and popular spots around you.
Rich Menu: Interactive options for easy navigation.
Reminders: Notify users when to move to their next destination.
Animations: Enhance user experience during wait times.
Tech Stack
Backend: Elysia.js (via Bun) for webhooks and APIs.
Frontend: Next.js 15 (App Router).
Database: Postgres DB for secure data storage.
API Integration: Gemini API for real-time internet access.
Security
Tokens and port numbers stored securely using .env files.
Encrypted communication and database protection.
This chatbot combines practicality with innovation, making it a perfect travel assistant. 🚀

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Project Structure

```
src/
├── config/
│   └── app.config.ts         # Application configuration
├── controllers/
│   └── healthController.ts    # Logic for health check
├── middleware/
│   └── logger.ts              # Request logging middleware
├── routes/
│   └── health.ts              # Health check route
├── types/
│   └── index.ts               # TypeScript type definitions
├── utils/
│   └── response.ts            # Utility functions for API responses
└── index.ts                   # Main application entry point
```

## Documentation

- **Health Check Endpoint**:
  - **URL**: `/health`
  - **Method**: `GET`
  - **Response**:
    ```json
    {
      "status": "ok from health",
      "timestamp": "2024-12-15T20:13:01.000Z"
    }
    ```
  - **Description**: Returns the status of the application and the current timestamp.
