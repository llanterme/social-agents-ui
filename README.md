# AI Content Generation Frontend

A Next.js frontend application for AI-powered content generation that integrates with a Java Spring Boot backend. Generate engaging content for multiple platforms (Twitter, LinkedIn, Instagram, Blog) with AI-powered insights and image generation.

## Features

- **JWT Authentication**: Secure token-based authentication with automatic refresh
- **Multi-Platform Content**: Generate optimized content for different social media platforms
- **AI-Powered**: Leverages AI for content creation and web research
- **Image Generation**: Integrated DALL-E image generation
- **Responsive Design**: Mobile-first responsive UI with modern design
- **Type Safety**: Full TypeScript implementation with strict type checking

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+ with strict typing
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: Custom components with Radix-inspired design
- **Forms**: React Hook Form + Zod validation
- **State Management**: React Context for authentication
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Java AI Agents backend running on `http://localhost:8080`

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-gen-content-posting-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout with AuthProvider
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/            # Reusable React components
│   ├── auth/             # Authentication components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components
├── context/              # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication service
│   ├── api.ts            # API client
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod validation schemas
└── middleware.ts         # Next.js middleware for routing
```

## Authentication Flow

1. **Registration/Login**: Users register or login to receive JWT tokens
2. **Token Storage**: Tokens are stored in localStorage with secure handling
3. **Automatic Refresh**: Access tokens are automatically refreshed using refresh tokens
4. **Protected Routes**: Routes are protected using client-side guards
5. **API Integration**: All API calls include authentication headers

## API Integration

The frontend integrates with the Java AI Agents backend API:

- **Base URL**: `http://localhost:8080`
- **Authentication**: JWT Bearer tokens
- **Endpoints**:
  - `POST /api/v1/auth/register` - User registration
  - `POST /api/v1/auth/login` - User login
  - `POST /api/v1/auth/refresh` - Token refresh
  - `GET /api/v1/auth/me` - Get current user
  - `POST /api/v1/generate/async` - Start content generation
  - `GET /api/v1/generate/status/{taskId}` - Check generation status
  - `GET /api/v1/generate/result/{taskId}` - Get generation result

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Development Guidelines

1. **TypeScript**: Use strict TypeScript with no `any` types
2. **Components**: Create reusable, accessible components
3. **Validation**: Use Zod schemas for form validation
4. **Error Handling**: Implement comprehensive error handling
5. **Loading States**: Provide loading indicators for async operations
6. **Responsive**: Ensure mobile-first responsive design

## Security

- JWT tokens are stored in localStorage with secure handling
- Automatic token refresh prevents session expiration
- Protected routes redirect unauthenticated users
- Input validation on both client and server sides
- HTTPS recommended for production

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend allows requests from `http://localhost:3000`
2. **Token Expiration**: The app automatically handles token refresh
3. **API Connection**: Verify the backend is running on `http://localhost:8080`
4. **Build Errors**: Run `npm run type-check` to identify TypeScript issues

### Debug Mode

Enable debug mode by setting `NEXT_PUBLIC_DEBUG=true` in `.env.local` for additional logging.

## Contributing

1. Follow the existing code style and patterns
2. Write TypeScript with strict typing
3. Add proper error handling and loading states
4. Test authentication flows thoroughly
5. Ensure responsive design across devices

## License

This project is proprietary software. All rights reserved.