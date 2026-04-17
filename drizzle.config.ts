import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local if it exists
config({ path: ".env.local" });

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!
    }
});