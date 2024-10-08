## Serverless system for lending

This project is an experiment to see how far I could go with relying almost entirely on **Generative AI** to build a fully functional system.

It is built with the Serverless Framework and leverages AWS services such as API Gateway, Lambda, DynamoDB, and Cognito. Please read the [requirements](./requirements.md) document for more details.

| Sample Frontend | Backend underwriting workflow |
| :-------------: | :---------------------------: |
| ![](./ss1.png)  |        ![](./ss2.png)         |

## Prerequisites

- Node.js (v22.7.0)
- npm (v10.8.2)
- Docker (v27.1.1)

### Running LOS

1. cd los
2. npm install
3. docker compose up -d
4. npm run build
5. npm run deploy:dev

### Running UI

1. cd ui
2. npm install
3. Create a `.env.local` file in the `ui` directory with the following content:
   ```
   NEXT_PUBLIC_API_BASE_URL=<your_api_gateway_url>
   ```
   Replace `<your_api_gateway_url>` with the actual API Gateway URL from your serverless deployment.
4. npm run dev
