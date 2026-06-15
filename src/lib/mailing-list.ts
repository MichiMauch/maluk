import { db } from "@/db";
import { mailingList } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

export async function addMailingListEntry(email: string, name?: string) {
  await db
    .insert(mailingList)
    .values({ email: email.toLowerCase().trim(), name: name?.trim() || null })
    .onConflictDoNothing();
}

export async function removeMailingListEntry(email: string): Promise<boolean> {
  const result = await db
    .delete(mailingList)
    .where(eq(sql`lower(${mailingList.email})`, email.toLowerCase().trim()));
  return (result.rowsAffected ?? 0) > 0;
}

export async function getMailingList() {
  return db.select().from(mailingList).orderBy(mailingList.email);
}

export async function getMailingListCount(): Promise<number> {
  const [result] = await db.select({ total: count() }).from(mailingList);
  return result.total;
}
