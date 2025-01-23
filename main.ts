import Cloudflare from "npm:cloudflare@4.0.0";

async function getOwnIp() {
  const url = "https://checkip.amazonaws.com";
  const response = await fetch(url);
  const text = await response.text();
  return text.trim();
}

function requireEnvVar(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getComment() {
  const now = new Date().toISOString();
  return `Automatically updated by cf-dyn-dns at ${now}`;
}

async function createARecord(
  client: Cloudflare,
  zoneId: string,
  name: string,
  ip: string
) {
  return await client.dns.records.create({
    zone_id: zoneId,
    type: "A",
    proxied: true,
    name,
    content: ip,
    comment: getComment(),
  });
}

async function updateARecord(
  client: Cloudflare,
  zoneId: string,
  recordId: string,
  ip: string
) {
  return await client.dns.records.update(recordId, {
    zone_id: zoneId,
    content: ip,
    comment: getComment(),
  });
}

if (import.meta.main) {
  const apiToken = requireEnvVar("CF_API_TOKEN");
  const zoneId = requireEnvVar("CF_ZONE_ID");
  const aRecordNames = requireEnvVar("CF_A_RECORDS")
    .split(",")
    .map((s) => s.trim());

  if (!aRecordNames.length) {
    throw new Error("No records specified");
  }

  const client = new Cloudflare({
    apiToken,
  });

  const recordsResponse = await client.dns.records.list({
    zone_id: zoneId,
  });

  const foundRecords = new Map(
    aRecordNames.map((name) => [
      name,
      recordsResponse.result.find(
        (record) => record.name === name && record.type === "A"
      ),
    ])
  );

  const ownIp = await getOwnIp();

  for (const [name, record] of foundRecords) {
    if (!record) {
      console.log(`Creating record for ${name}`);
      await createARecord(client, zoneId, name, ownIp);
    } else if (record.content !== ownIp) {
      console.log(`Updating record for ${name}`);
      await updateARecord(client, zoneId, record.id, ownIp);
    } else {
      console.log(`Record for ${name} is already up to date`);
    }
  }
}
