# Tukituki Core

**Tukituki Core** is a robust backend service built with NestJS, designed to facilitate DeFi yield optimization and multisignature (multisig) operations across multiple blockchain networks. Leveraging integrations with prominent DeFi protocols like Aave and Uniswap V3, as well as utilizing Safe for secure multisig wallet management, Tukituki Core provides a comprehensive platform for managing and optimizing decentralized financial activities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Multisig Wallet Management**: Deploy and manage Safe multisignature wallets across supported blockchain networks.
- **DeFi Yield Optimization**: Integrate with Aave and Uniswap V3 to fetch lending, borrowing, and liquidity pool data for optimal yield strategies.
- **Automated Strategy Recommendations**: Utilize OpenAI's GPT models to analyze DeFi data and suggest profitable strategies while assessing associated risks.
- **Comprehensive API**: Expose RESTful endpoints for interacting with multisig wallets and DeFi strategies.
- **Secure and Scalable**: Built with NestJS and Prisma, ensuring security, scalability, and maintainability.
- **Swagger Integration**: Automatically generated API documentation for easy exploration and integration.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/) ORM
- **Blockchain Interaction**: [ethers.js](https://docs.ethers.io/v5/)
- **Multisig Wallets**: [Safe (Gnosis Safe)](https://safe.global/)
- **DeFi Protocols**: Aave, Uniswap V3
- **API Documentation**: [Swagger](https://swagger.io/)
- **Testing**: [Jest](https://jestjs.io/)
- **External APIs**: [CoinGecko](https://www.coingecko.com/en/api)
- **AI Integration**: [OpenAI](https://openai.com/)

## Architecture

The application is divided into several modules to ensure separation of concerns and scalability:

- **Core Module**: Handles DeFi interactions, strategy analysis, and communications with external services.
- **Multisig Module**: Manages multisignature wallet operations, including deployment and transaction proposals.
- **Connectors**: Interfaces for interacting with various external APIs and blockchain networks.
- **Prisma Service**: Manages database interactions using Prisma ORM.
- **Agents and Handlers**: Utilize OpenAI for strategy recommendations and handle complex actions based on suggested strategies.

## Installation

### Prerequisites

- **Node.js** (v16 or later)
- **npm** or **yarn**
- **PostgreSQL** database
- **Git**

### Steps

1. **Clone the Repository**

   ```bash
   git clone git@github.com:tukituki-ai/tukituki-core.git
   cd tukituki-core
   ```

2. **Install Dependencies**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root directory and configure the necessary environment variables:

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
   OPENAI_API_KEY=your_openai_api_key
   COINGECKO_API_KEY=your_coingecko_api_key
   AGENT_PRIVATE_KEY=your_agent_private_key
   AGENT1_ADDRESS=your_agent1_address
   AGENT2_ADDRESS=your_agent2_address
   RPC_URL_ARBITRUM=https://your_arbitrum_rpc_url
   RPC_URL_OPTIMISM=https://your_optimism_rpc_url
   RPC_URL_BASE=https://your_base_rpc_url
   RPC_URL_LINEA=https://your_linea_rpc_url
   RPC_URL_AVALANCHE=https://your_avalanche_rpc_url
   ```

   Ensure all required variables are set, replacing placeholder values with your actual configurations.

4. **Run Database Migrations**

   Apply Prisma migrations to set up the PostgreSQL database schema:

   ```bash
   npx prisma migrate deploy
   ```

   Or, if you haven't generated the client yet:

   ```bash
   npx prisma migrate dev
   ```

## Configuration

Configuration is managed using NestJS's `ConfigModule`. Ensure all environment variables are correctly set in the `.env` file as outlined in the installation steps.

## Running the Application

### Development Mode

Start the application in development mode with hot-reloading:

```bash
npm run start:dev
```

Or using yarn:

```bash
yarn start:dev
```

### Production Mode

Build and start the application:

```bash
npm run build
npm run start:prod
```

Or using yarn:

```bash
yarn build
yarn start:prod
```

## API Documentation

Swagger is integrated for API documentation. Once the application is running, access the Swagger UI at:

```
http://localhost:3000/api
```

This interface provides detailed information about available endpoints, request/response schemas, and allows you to interact with the API directly.

## Testing

The project utilizes Jest for unit and integration testing.

### Run Tests

```bash
npm run test
```

Or using yarn:

```bash
yarn test
```

### Watch Mode

For development, you can run tests in watch mode:

```bash
npm run test:watch
```

Or using yarn:

```bash
yarn test:watch
```

### Coverage Report

Generate a coverage report:

```bash
npm run test:cov
```

Or using yarn:

```bash
yarn test:cov
```

Coverage reports will be available in the `coverage/` directory.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/YourFeature
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeature
   ```

5. **Open a Pull Request**

   Describe your changes and submit a pull request for review.

## License

This project is licensed under the [MIT License](LICENSE).

---

**Disclaimer**: This project interacts with blockchain networks and DeFi protocols. Ensure you understand the risks involved in such operations, including potential financial losses. Use responsibly and at your own risk.
