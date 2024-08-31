# Loan Origination System (LOS)

This is a serverless Loan Origination System built with AWS Lambda, DynamoDB, and S3.

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- AWS CLI configured with appropriate credentials
- Docker (for running LocalStack)

## Setup

1. Clone the repository:

   ```
   git clone <repository-url>
   cd los
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start LocalStack (make sure Docker is running):

   ```
   docker-compose up -d
   ```

4. Build the TypeScript files:
   ```
   npm run build
   ```

## Running Locally

1. Start the serverless offline server:

   ```
   npm start
   ```

   This will start the server on `http://localhost:3000`.

2. You can now test the API endpoints using a tool like Postman or curl:

   - Submit an application:

     ```
     POST http://localhost:3000/applications
     ```

   - Upload a document:

     ```
     POST http://localhost:3000/documents
     ```

   - Other endpoints (credit check, underwriting) are triggered internally and don't have HTTP endpoints.

## Development

- To watch for changes and recompile automatically:

  ```
  npm run watch
  ```

- To run type checking:
  ```
  npm run typecheck
  ```

## Deployment

To deploy to AWS:

```
npm run deploy
```

Note: Make sure your AWS CLI is configured with the correct credentials and region.

## Project Structure

- `src/handlers/`: Contains Lambda function handlers
- `src/models/`: Data models and interfaces
- `src/repositories/`: Data access layer for DynamoDB
- `src/utils/`: Utility functions
- `stepFunctions/`: Step Functions definition
- `serverless.yml`: Serverless Framework configuration

## Testing

(Add information about running tests once
