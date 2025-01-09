# Elysia with Bun runtime

# LINE Travel Companion Chatbot

A LINE chatbot built to enhance travel convenience and enjoyment. Powered by Bun with Elysia.js for high-performance API and webhook handling, this chatbot provides real-time currency exchange rates (THB ↔ JPY), trip planning assistance, and nearby location recommendations. The frontend, crafted with Next.js 15, ensures an engaging user experience.

## Features

- **Rich Menu Integration**:
  - Agenda: Display comprehensive trip planning
  - Real-time Currency Exchange: THB ↔ JPY conversion
  - Location Services: Maps and nearby points of interest
  - Popular Locations: Discover trending spots in your vicinity
- **Smart Notifications**: Timely reminders for next destinations
- **Interactive UI**: Loading animations for better user experience
- **Multilingual Support**: Japanese language integration for orders and payments
- **AI-Powered Responses**: Integration with Gemini 1.5/2.0 for real-time internet access
- Trip Planning: Manage and display travel agendas.
- Currency Exchange: Get live THB ↔ JPY exchange rates using Gemini API.
- Nearby Locations: Find maps and popular spots around you.
- Rich Menu: Interactive options for easy navigation.
- Reminders: Notify users when to move to their next destination.
- Animations: Enhance user experience during wait times.

## Tech Stack

- **Backend**:
  - Elysia.js with Bun runtime for high-performance webhook handling
  - Environment-based configuration (.env.local, .env.dev, .env)
  - Port configuration (default: 3001)
- **Frontend**:
  - Next.js 15 (App Router) for modern, responsive UI
- **Database**:
  - PostgreSQL for reliable data persistence
- **AI Integration**:
  - Google Gemini API for intelligent responses and real-time data
- **External APIs**:
  - LINE Messaging API
  - Currency Exchange API
  - Maps and Location Services
- Elysia.js (via Bun) for webhooks and APIs.
- Next.js 15 (App Router).
- Postgres DB for secure data storage.
- Gemini API for real-time internet access.

## Security

Tokens and port numbers stored securely using .env files.
Encrypted communication and database protection.

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
│   ├── app.config.ts         # Application configuration
│   └── line.config.ts        # LINE bot configuration
├── constants/
│   └── agenda.constant.ts    # Agenda-related constants
├── controllers/
│   └── webhookController.ts  # LINE webhook handling logic
│   └── healthController.ts   # Logic for health check
├── interfaces/
│   └── agenda.interface.ts   # Type definitions for agenda
│   └── line-event.interface.ts # LINE webhook event types
├── middleware/
│   └── logger.ts            # Request logging middleware
├── models/
│   └── db.ts               # Database models and connections
│   └── models/                  # Database models
├── routes/
│   ├── health.ts           # Health check route
│   └── webhook.ts          # LINE webhook handler
├── services/
│   ├── gemini.service.ts   # Gemini AI integration
│   ├── ai.service.ts       # AI service integration (Gemini, OpenAI)
│   ├── exchange.service.ts # Currency exchange service
│   └── places.service.ts   # Location and mapping services
├── types/
│   ├── index.ts            # Type definitions exports
├── utils/
│   ├── quick-reply.ts      # Quick reply message utilities
│   ├── flex-message.ts     # Flex message formatting
│   └── response.ts         # Utility functions for API responses
└── index.ts               # Main application entry point
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
