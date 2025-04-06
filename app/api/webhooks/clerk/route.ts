import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    await db.user.create({
      data: {
        externaluserId: payload.data.id,
        username: payload.data.username,
        email: payload.data.email_addresses[0].email_address,
        imageUrl: payload.data.profile_image_url,
      },
    });
  }

  if (eventType === "user.updated") {
    const currUser = await db.user.findUnique({
      where: {
        externaluserId: payload.data.id,
      },
    });

    if (!currUser) {
      return new Response("Error: User not found", {
        status: 404,
      });
    }

    await db.user.update({
      where: {
        externaluserId: payload.data.id,
      },
      data: {
        username: payload.data.username,
        email: payload.data.email_addresses[0].email_address,
        imageUrl: payload.data.profile_image_url,
      },
    });

    console.log("User updated:", payload.data.id);
    return new Response("User updated", {
      status: 200,
    });
  }

  if (eventType === "user.deleted") {
    const currUser = await db.user.findUnique({
      where: {
        externaluserId: payload.data.id,
      },
    });

    if (!currUser) {
      return new Response("Error: User not found", {
        status: 404,
      });
    }

    await db.user.delete({
      where: {
        externaluserId: payload.data.id,
      },
    });

    console.log("User deleted:", payload.data.id);
    return new Response("User deleted", {
      status: 200,
    });
  }

  console.log("Webhook event:", eventType, payload.data);

  return new Response("Webhook received", { status: 200 });
}
