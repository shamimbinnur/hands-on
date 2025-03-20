## Backend Setup

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Create your environment file:

   ```
   cp .env.example .env
   ```

3. Configure your environment variables in the `.env` file

4. Install dependencies:

   ```
   npm install
   ```

5. Init database schema:

   ```
   npx prisma db push
   ```

6. Seed the database:

   ```
   npx prisma seed
   ```

7. Start the development server:
   ```
   npm run dev
   ```

## Frontend Setup

1. Navigate to the web directory:

   ```
   cd web
   ```

2. Create your environment file:

   ```
   cp .env.example .env
   ```

3. Configure your environment variables in the `.env` file

4. Install dependencies:

   ```
   npm install
   ```

5. Start the development server:
   ```
   npm run dev
   ```
