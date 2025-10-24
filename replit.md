# Jira Viewer - LXC Client Extension

## Overview

This is a Liferay Client Extension (LXC) built with Next.js 13 that integrates with Jira to display projects, issues, and user-assigned tasks. The application serves as an iframe-embedded client extension within Liferay Portal, providing a modern interface for viewing Jira data using the Jira REST API. It demonstrates practical implementation of LXC client extensions with real-world third-party service integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 13 with App Router
- Uses the experimental App Directory structure (`app/` instead of `pages/`)
- Server Components by default for improved performance and SEO
- TypeScript for type safety throughout the application

**UI Framework**: Bulma CSS
- Class-based CSS framework for responsive layouts
- No JavaScript dependencies, keeping the client bundle lean
- Grid system (`columns`, `is-multiline`) for responsive project and issue cards

**Component Structure**:
- **Reusable Components**: Card, Table, Navbar components for consistent UI
- **Route-based Pages**: `/` (projects), `/issues/[project]` (project issues), `/issues/assigned-to-me` (user tasks)
- **Server-side Data Fetching**: All API calls happen on the server, reducing client-side JavaScript and improving initial load times

**Rationale**: Next.js 13's App Router with Server Components reduces bundle size and improves performance by rendering on the server. Bulma provides a lightweight, responsive UI without additional JavaScript overhead.

### Backend Architecture

**API Integration Pattern**: Server-side API proxy
- No direct client-to-Jira communication
- Environment variables store credentials securely on the server
- All Jira API calls execute in Next.js Server Components or API routes

**Jira Client Configuration**:
- Supports both Jira Cloud (API v3) and Jira Server (API v2)
- Environment variable `JIRA_CLIENT_VERSION` determines which client to instantiate
- Basic authentication using email and API token
- Centralized client instance exported from `services/jiraClient.ts`

**Data Flow**:
1. User requests page → Next.js Server Component
2. Server Component calls Jira API via `jiraClient`
3. Response transformed into simplified data structures
4. HTML rendered on server with data
5. Static HTML sent to client

**Rationale**: Server-side API calls keep credentials secure, reduce client bundle size, and improve SEO since content is rendered on the server. Supporting both v2 and v3 provides flexibility for different Jira deployments.

### Deployment Architecture

**Containerization**: LXC Deployment
- Standalone Next.js build (`output: 'standalone'`)
- Configured via `LCP.json` for Liferay Cloud Platform
- 1 CPU, 5GB memory allocation per instance
- Load balancer targets port 3000 with CDN enabled for production

**Environment Separation**:
- `dev`: CDN disabled for faster iteration
- `infra`: Deployment disabled (configuration only)
- Production: CDN enabled for static asset optimization

**Integration Method**: iFrame embedding
- Application runs on separate domain/subdomain
- Embedded in Liferay Portal pages via Custom Apps → Client Extensions
- Communicates independently without tight coupling to Liferay

**Rationale**: Standalone builds are optimized for containerized deployments. iFrame embedding allows independent development, deployment, and scaling separate from the main Liferay Portal. CDN improves global performance for static assets.

### Authentication & Authorization

**Authentication Flow**:
- No user authentication in the application itself
- Relies on Jira API authentication via Basic Auth
- API credentials stored in environment variables
- Single service account for all users (current implementation)

**Current Limitation**: The "My Tasks" feature uses `currentUser()` in JQL, which resolves to the service account, not the actual portal user. For true multi-user support, the architecture would need to:
1. Accept user credentials from Liferay Portal
2. Implement OAuth 2.0 flow for user-specific Jira access
3. Use session management to maintain user context

**Rationale**: Basic authentication with a service account simplifies initial implementation and is suitable for read-only dashboards or single-user scenarios. Production systems displaying user-specific data would require OAuth integration.

## External Dependencies

### Third-Party Services

**Jira REST API**:
- Primary data source for all project and issue information
- Endpoints used:
  - `projects.getAllProjects()` - Fetch all accessible projects
  - `projects.getProject()` - Get project details and issue types
  - `issueSearch.searchForIssuesUsingJql()` - Query issues using JQL (Jira Query Language)
- Requires: `JIRA_HOST`, `JIRA_API_USERNAME`, `JIRA_API_TOKEN`, `JIRA_CLIENT_VERSION`

**Liferay Portal** (Host Platform):
- Provides the container environment for the client extension
- Application embedded as iframe via Liferay's Custom Apps functionality
- No direct API integration with Liferay in current implementation

### NPM Packages

**Core Dependencies**:
- `next` (^13.2.3) - React framework with SSR/SSG capabilities
- `react` (^18.2.0) - UI library
- `jira.js` (^2.16.1) - Official Jira API client with TypeScript support
- `bulma` (^0.9.4) - CSS-only UI framework

**Development Dependencies**:
- `typescript` (4.9.5) - Type checking and improved DX
- `eslint` & `eslint-config-next` - Code quality and Next.js best practices

### Configuration Requirements

**Environment Variables** (via `.env` file):
```
JIRA_HOST=<your-jira-instance.atlassian.net>
JIRA_API_USERNAME=<email-address>
JIRA_API_TOKEN=<api-token>
JIRA_CLIENT_VERSION=v3  # v3 for Jira Cloud, v2 for Jira Server
```

**Port Configuration**:
- Development: Port 5000 (`-p 5000`)
- Production: Port 3000 (load balancer target)
- Binds to `0.0.0.0` for container accessibility

## Replit-Specific Configuration

**Recent Changes** (October 24, 2025): Migrated from Vercel to Replit & Updated Jira API

**Development Environment**:
- Modified `package.json` scripts to bind to port 5000 with host 0.0.0.0 for Replit's environment
- Added `output: 'standalone'` to `next.config.js` for optimized containerized builds
- Configured workflow to run `yarn dev` with automatic restart on port 5000
- All Jira credentials stored securely in Replit Secrets as environment variables
- **Updated to JIRA_CLIENT_VERSION=v3** for Jira Cloud compatibility

**Jira API Migration (CHANGE-2046)**:
- Migrated from deprecated `/rest/api/3/search` endpoint to new `/rest/api/3/search/jql` endpoint
- Created custom `jiraSearchJql.ts` wrapper to call the new endpoint directly
- The new endpoint uses token-based pagination (`nextPageToken`) instead of offset-based (`startAt`)
- By default, new endpoint only returns issue IDs; must explicitly request fields using `fields: ['*navigable']`

**Deployment Configuration**:
- Deployment target: `autoscale` (suitable for stateless web applications)
- Build command: `yarn build`
- Start command: `yarn start` (binds to port 5000 on 0.0.0.0)

**Important Notes**:
- The project structure remains unchanged to maintain compatibility with Liferay PAAS deployment
- The Dockerfile and LCP.json files are preserved for Liferay Cloud Platform deployment
- Replit configuration only affects local development environment, not production deployment to Liferay