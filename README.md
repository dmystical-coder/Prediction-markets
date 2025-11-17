# Prediction Market DApp

A decentralized prediction market application built with Next.js and Reown's AppKit, deployed on Base Mainnet.

## Features

- 🔗 **Wallet Integration** - Connect with multiple wallets using Reown AppKit
- 📊 **Market Information** - View market questions, outcomes, and real-time probabilities
- 💰 **Token Trading** - Buy and sell YES/NO outcome tokens
- 💧 **Liquidity Management** - Add or remove liquidity from the market
- 🏆 **Redeem Winnings** - Claim ETH after market resolution
- ⚡ **Base Mainnet** - Fast and low-cost transactions on Base L2

## Contract Information

- **Contract Address**: `0x0b65b804663972a37b6adba0785acde21db07fff`
- **Network**: Base Mainnet
- **Explorer**: [View on BaseScan](https://basescan.org/address/0x0b65b804663972a37b6adba0785acde21db07fff)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, WalletConnect, etc.)
- ETH on Base Mainnet for transactions

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env.local` file and add your Reown Project ID:

```env
NEXT_PUBLIC_PROJECT_ID=your_reown_project_id_here
```

To get a Project ID:

- Visit [Reown Cloud](https://cloud.reown.com)
- Create a new project
- Copy your Project ID

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### 1. Connect Your Wallet

Click the "Connect Wallet" button in the header to connect your Web3 wallet to Base Mainnet.

### 2. View Market Information

The market info card displays:

- The prediction question
- Current YES/NO probabilities
- Token reserves
- ETH collateral and trading revenue

### 3. Buy Tokens

- Select YES or NO outcome
- Enter the amount of tokens you want to buy
- View the ETH cost
- Click "Buy Tokens" to execute the transaction

### 4. Sell Tokens

- Select the outcome (YES or NO)
- Enter the amount of tokens to sell
- View how much ETH you'll receive
- Click "Sell Tokens" to execute the transaction

### 5. Manage Liquidity (Liquidity Providers)

- **Add Liquidity**: Provide ETH to the market pool
- **Remove Liquidity**: Withdraw your liquidity and trading fees

### 6. Redeem Winnings

After the market is resolved by the oracle:

- Enter the amount of winning tokens
- Click "Redeem Tokens" to exchange them for ETH

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Wallet Integration**: Reown AppKit (formerly WalletConnect)
- **Blockchain Interaction**: Wagmi + Viem
- **Network**: Base Mainnet
- **Smart Contract**: Solidity 0.8.20

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Web3Provider
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles
├── components/
│   ├── Web3Provider.tsx    # Wagmi provider wrapper
│   ├── Header.tsx          # Navigation and wallet button
│   ├── MarketInfo.tsx      # Market data display
│   ├── BuyTokens.tsx       # Buy tokens interface
│   ├── SellTokens.tsx      # Sell tokens interface
│   ├── LiquidityManager.tsx # Liquidity management
│   └── RedeemWinnings.tsx  # Redemption interface
└── lib/
    ├── appkit-config.ts    # Reown AppKit configuration
    ├── contract-abi.ts     # Contract ABI
    └── contract-config.ts  # Contract address and config
```

## Smart Contract Functions

The app interacts with these contract functions:

- `getPrediction()` - Fetch market data
- `buyTokensWithETH()` - Purchase outcome tokens
- `sellTokensForEth()` - Sell outcome tokens
- `getBuyPriceInEth()` - Calculate buy price
- `getSellPriceInEth()` - Calculate sell price
- `addLiquidity()` - Add liquidity to the pool
- `removeLiquidity()` - Remove liquidity from the pool
- `redeemWinningTokens()` - Redeem winning tokens for ETH
- `resolveMarketAndWithdraw()` - Resolve market (owner only)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_PROJECT_ID` - Your Reown Cloud Project ID (required)

## Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/overview)
- [Wagmi Documentation](https://wagmi.sh)
- [Base Documentation](https://docs.base.org)
- [Next.js Documentation](https://nextjs.org/docs)
