import { createClient } from "@libsql/client";

const EMAILS = [
  "mmaurer86@gmail.com",
  "gabriela.maurer@gmail.com",
  "info@praxis-bruderer.ch",
  "gina.kachramanow@yetnet.ch",
  "melanie_dillier@bluewin.ch",
  "beatrice.wallimann@quickline.ch",
  "lsl@braso.ch",
  "stefan.huwyler@huk.ch",
  "marcel.mueller@mt-baustoffe.ch",
  "Pascal.bieri@computare.ch",
  "monikasiegrist@hotmail.ch",
  "info@hessuhren.ch",
  "riedthofstrasse@gmail.com",
  "erichw@bluewin.ch",
  "Info@leuko.ch",
  "beat.waelti@bewa-technik.ch",
  "igor.novacac@bluewin.ch",
  "peter.maurer@sunrise.ch",
  "buehlmann.kerstin@gmail.com",
  "pmbueri@bluewin.ch",
  "info@braichet.ch",
  "andre.dennler@wirz-schriften.ch",
  "kenny@bergsport.co.uk",
  "sven_hunziker@hotmail.com",
  "info@marti-buchs.ch",
  "michi.mauch@gmail.com",
  "friedli@swissonline.ch",
];

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    console.error("TURSO_DATABASE_URL is required");
    process.exit(1);
  }

  const client = createClient({ url, authToken });

  let inserted = 0;
  let skipped = 0;

  for (const email of EMAILS) {
    try {
      await client.execute({
        sql: "INSERT OR IGNORE INTO mailing_list (email) VALUES (?)",
        args: [email.toLowerCase().trim()],
      });
      inserted++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  Error for ${email}: ${msg}`);
      skipped++;
    }
  }

  console.log(`Done: ${inserted} inserted, ${skipped} errors (of ${EMAILS.length} total)`);
}

main();
