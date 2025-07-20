import type { User, Session } from "@prisma/client";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import prisma from "./db";
import { cookies } from "next/headers";
import { cache } from "react";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
  };

  await prisma.session.create({
    data: session
  });

  return session;
}

export async function validateSessionToken(token: string): Promise<UserSessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId
    },
    include: {
      user: true
    }
  });

  if (result === null) {
    return { session: null, user: null };
  }

  const { user, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 60 * 24 * 30);
    await prisma.session.update({
      where: {
        id: session.id
      },
      data: {
        expiresAt: session.expiresAt
      }
    });
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: {
      userId: userId
    }
  })
}

export async function setSessionToken(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  })
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  })
}

export const getCurrentSession = cache(async (): Promise<UserSessionValidationResult> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return { session: null, user: null };
  }
  const result = await validateSessionToken(token);
  return result;
})

export type UserSessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null }; 