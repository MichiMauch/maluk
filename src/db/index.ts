import { drizzle } from "drizzle-orm/libsql";
import { turso } from "@/lib/turso";
import * as schema from "./schema";

export const db = drizzle(turso, { schema });
