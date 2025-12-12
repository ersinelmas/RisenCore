# RisenCore Frontend

Steps to develop, test, and package the React-based RisenCore UI locally or for production.

## Prerequisites
- Node.js 18+ and npm
- (Optional) Docker and Docker Compose

## Installation and Local Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create `frontend/.env` (or `.env.local`) to set the API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
   - When running the backend via Docker Compose, the browser still reaches it at `http://localhost:8080`.
   - To add languages or adjust the default language, update `src/i18n.js` and `src/locales/*.json`. English (`en`) is the default; Turkish (`tr`) translations are available.
3. Start the development server:
   ```sh
   npm run dev
   ```
   - The app is available at [http://localhost:5173](http://localhost:5173) by default.
   - If you run inside Docker, expose the dev server with `npm run dev -- --host` (pre-set in the Dockerfile).

## Testing and Linting
- `npm run lint` — runs ESLint rules.
- `npm test` — runs unit tests with Vitest.

## Production Build
1. Set production environment values (e.g., `frontend/.env.production`):
   ```env
   VITE_API_BASE_URL=https://api.risencore.example.com
   ```
2. Build the production bundle:
   ```sh
   npm run build
   ```
3. Preview the bundle locally:
   ```sh
   npm run preview
   ```

## Running with Docker
- To build only the frontend image:
  ```sh
  docker build -t risencore-frontend --target production frontend
  docker run -p 80:80 --name risencore-frontend --env-file ./frontend/.env.production risencore-frontend
  ```
  Ensure `VITE_API_BASE_URL` is available at build time; Vite embeds it during bundling.
- To run with the full stack, use the root Docker Compose workflow:
  ```sh
  docker-compose up --build
  ```
  or with production targets:
  ```sh
  docker-compose -f docker-compose.prod.yml up --build
  ```
  The Compose files select the appropriate targets (`development` / `production`) from the frontend Dockerfile and place the frontend on the same network as the backend.
  - Set `SPRING_PROFILES_ACTIVE` in your root `.env` to pick the backend profile (`dev` or `prod`) when running through Docker Compose.

## Useful Files
- `src/api/axiosConfig.js` — API base URL and request interceptors.
- `src/i18n.js` and `src/locales/` — language detection and translation resources.
- `Dockerfile` — multi-stage Docker image with development, build, and production targets.
