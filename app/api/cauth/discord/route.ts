import { authOptions } from "@/auth/auth";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (request.nextUrl.searchParams.get('unlink')) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        discordId: null,
        discordName: null
      }
    })

    redirect(`${process.env.NEXTAUTH_URL}/profile/edit`)
  }

  const encodedCredentials = btoa(`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`);

  const data = {
    grant_type: 'authorization_code',
    code: request.nextUrl.searchParams.get('code'),
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/cauth/discord`,
  }

  let discordTokenRequest = await fetch(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${encodedCredentials}`
    },
    //@ts-expect-error idk why
    body: new URLSearchParams(data).toString()
  })

  let discordTokenRequestData: discordTokenResponse = await discordTokenRequest.json()

  let discordUserRequest = await fetch(`${process.env.DISCORD_API_ENDPOINT}/users/@me`, {
    headers: {
      'Authorization': `Bearer ${discordTokenRequestData.access_token}`
    },
  })

  let discordUserData = await discordUserRequest.json()

  await prisma.user.update({
    where: {
      id: session?.user.id
    },
    data: {
      discordId: discordUserData.id,
      discordName: `${discordUserData.username}`
    }
  })


  redirect(`${process.env.NEXTAUTH_URL}/profile/edit`)
}

type discordTokenResponse = {
  token_type: string,
  access_token: string,
  expires_in: number,
  refresh_token: string,
  scope: string
}