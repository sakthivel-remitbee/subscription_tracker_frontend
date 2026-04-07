# SubTrack Frontend

SubTrack is a Next.js frontend for tracking recurring subscriptions, managing account details, and reviewing renewals in both table and calendar views.

## Overview

This app is built with:

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Redux Toolkit for client-side auth/user state
- Axios for API communication
- Formik and Yup for form handling and validation

The frontend expects a separate backend API and uses token-based authentication with automatic access-token refresh.

## Core Features

- User signup and login
- Protected dashboard routes
- Subscription listing with search, category filter, status filter, and pagination
- Add and edit subscription flows
- Toggle subscription status between active and canceled
- Calendar view for monthly renewals
- Profile management
- Password update
- Profile image upload
- Logout and account deletion

## Route Map

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Placeholder home page | Public |
| `/login` | Sign in screen | Guest only |
| `/signup` | Registration screen | Guest only |
| `/subscriptions` | Main subscription management screen | Protected |
| `/calendar` | Renewal calendar view | Protected |
| `/profile` | Profile and account settings | Protected |

`ProtectedRoute` redirects unauthenticated users to `/login`.

`GuestRoute` redirects authenticated users to `/subscriptions`.

## Project Structure

```text
my-app/
├── app/                    # App Router pages and global layout
├── components/
│   ├── atoms/              # Small reusable UI primitives
│   ├── molecules/          # Mid-level composed UI components
│   └── organisms/          # Page-level feature sections
├── hooks/                  # Shared React hooks
├── redux/                  # Store, provider, and user slice
├── service/                # API service functions
├── types/                  # Shared TypeScript types
├── utils/                  # Axios client and shared helpers
├── public/                 # Static assets
└── README.md
```

## Auth and State Flow

- Login and signup are handled through Redux async thunks in `redux/userSlice.ts`.
- After login, the app stores:
  - `accessToken` in `localStorage`
  - `user` in `localStorage`
  - `refreshToken` in a cookie
- The Axios client in `utils/api.tsx` attaches the access token to outgoing requests.
- If a protected request returns `401`, the client attempts to refresh the access token through `/auth/refresh` and retries the original request.
- Logging out clears Redux state, local storage, and the refresh token cookie.

## API Integration

The frontend talks to a separate backend API. By default, it points to:

```bash
http://localhost:5000
```

You can override that with an environment variable.

### Environment Variables

Create a `.env.local` file in `my-app/`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Backend Endpoints Used

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

User:

- `GET /user/profile`
- `PUT /user/updates/details`
- `PUT /user/updates/password`
- `PUT /user/store/img`
- `DELETE /user/delete`

Subscriptions:

- `GET /subscription/all`
- `GET /subscription/calendar`
- `POST /subscription/create`
- `PUT /subscription/update/:id`
- `PUT /subscription/status/:id`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` manually and add:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates a production build
- `npm run start` runs the production build
- `npm run lint` runs ESLint

## Key Implementation Notes

### Dashboard layout

- Protected pages use `DashboardLayout`.
- The layout includes the top header and desktop sidebar.

### Subscription data mapping

- API subscription records are transformed into UI-friendly objects in `service/subscriptionService.ts`.
- Backend status `"canceled"` is normalized to UI status `"cancelled"`.
- Costs are formatted with currency symbols before rendering.

### Calendar page

- The calendar page requests data by year and paginated month records.
- Renewals are grouped by `nextRenewal` date for day-level display.
- The month summary is calculated from current renewal data when available.

### Profile page

- The profile page refreshes backend profile data after auth becomes available.
- Profile updates, password changes, image upload, and account deletion all call the backend directly through `service/userService.tsx`.

## Current Limitations

- The `/` route is still a placeholder page.
- There is no test suite configured yet.
- There is no `.env.local.example` file in the repository right now.
- Some UI copy and metadata still contain starter values, such as the default app metadata in `app/layout.tsx`.

## Recommended Next Improvements

- Add a real landing page for `/`
- Add `.env.local.example`
- Update metadata and document title defaults
- Add unit/integration tests
- Add deployment instructions once the target hosting setup is finalized

## Useful Files

- [app/layout.tsx](/Users/remitbee/Desktop/frontend/my-app/app/layout.tsx)
- [app/subscriptions/page.tsx](/Users/remitbee/Desktop/frontend/my-app/app/subscriptions/page.tsx)
- [app/calendar/page.tsx](/Users/remitbee/Desktop/frontend/my-app/app/calendar/page.tsx)
- [app/profile/page.tsx](/Users/remitbee/Desktop/frontend/my-app/app/profile/page.tsx)
- [redux/userSlice.ts](/Users/remitbee/Desktop/frontend/my-app/redux/userSlice.ts)
- [utils/api.tsx](/Users/remitbee/Desktop/frontend/my-app/utils/api.tsx)

## Linting

Run:

```bash
npm run lint
```

This project currently uses ESLint only; there is no dedicated test command yet.
