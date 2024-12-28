# Elysia with Bun runtime

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