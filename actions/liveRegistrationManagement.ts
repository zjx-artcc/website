'use server';
import { RegistrantType, Prisma } from "@prisma/client";
import prisma from "@/lib/db";
import { z } from "zod";
import { GridFilterItem, GridPaginationModel, GridSortModel } from "@mui/x-data-grid";
import { redirect } from 'next/navigation';
import { ZodErrorSlimResponse } from "@/types";
import { SafeParseReturnType, z } from "zod";

// Do this because formData is annoying

const toBool = z.preprocess((t) => {
  if (typeof t === 'boolean') return t;
  if (typeof t === 'string') return t.toLowerCase() === 'true';
  if (typeof t === 'number') return t === 1;
  return t;
}, z.boolean());

export const validateRegistrant = async (input: { [key: string]: any }, zodResponse?: boolean): Promise<ZodErrorSlimResponse | SafeParseReturnType<any, any>> => {
  const registrantZ = z.object({
    id: z.string().optional(),
    fName: z.string().min(1, { message: "Must be between 1 and 255 characters" }).max(255, { message: "Name must be between 1 and 255 characters" }),
    lName: z.string().min(1, { message: "Must be between 1 and 255 characters" }).max(255, { message: "Name must be between 1 and 255 characters" }),
    preferredName: z.preprocess((v) => {
      if (typeof v === 'string' && v.trim() === '') {
        return undefined;
      }
      return v;
    },
      z.string()
        .min(3, { message: "Must be between 1 and 255 characters" })
        .max(255, { message: "Name must be between 1 and 255 characters" })
        .optional()),
    registrantType: z.nativeEnum(RegistrantType, { required_error: 'Please select your controller type' }),
    cid: z.string(),
    attendingLive: toBool,
    usingHotelLink: toBool,
  })

  const data = registrantZ.safeParse(input);

  if (zodResponse) {
    return data;
  }

  return {
    errors: Array.isArray(data.error?.errors) ? data.error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    })) : [],
  }
}


export const createRegistrant = async (formData: FormData) => {

  const result = await validateRegistrant({
    id: formData.get('id') ?? undefined,
    fName: formData.get('fName') ?? '',
    lName: formData.get('lName') ?? '',
    preferredName: formData.get('preferredName') ?? undefined,
    attendingLive: formData.get('attendingLive') ?? 'false',
    usingHotelLink: formData.get('usingHotelLink') ?? 'false',
    registrantType: formData.get('registrantType') ?? '',
    cid: formData.get('cid') ?? '',
  }, true) as SafeParseReturnType<any, any>;

  if (!result.success) {
    return { errors: result.errors };
  }

  const data = result.data;

  try {
    const registrant = await prisma.liveRegistrant.create({
      data: {
        fName: data.fName,
        lName: data.lName,
        cid: data.cid,
        preferredName: data.preferredName ?? '',
        registrantType: data.registrantType,
        attendingLive: data.attendingLive,
        usingHotelLink: data.usingHotelLink,
        paymentSuccessful: false,
      }
    })
    return { registrant };
  }
  catch (e: any) {
    if (e.code === 'P2002') {
      redirect(`/live/error?cid=${data.cid}`);
    }
    throw e;
  }
}
export const confirmPaymentStatus = async (registrantId: string) => {
  console.log("Updating payment status for registrant:", registrantId);
  const updatePaymentStatus = await prisma.liveRegistrant.update({
    where: { id: registrantId, },
    data: { paymentSuccessful: true, },
  });
  console.log("Update result:", updatePaymentStatus);
}

export const fetchRegistrants = async (pagination: GridPaginationModel, sort: GridSortModel) => {
  const { page, pageSize } = pagination;

  const orderBy = sort.map(s => ({ [s.field]: s.sort }));

  const [total, users] = await Promise.all([
    prisma.liveRegistrant.count(),
    prisma.liveRegistrant.findMany({
      skip: page * pageSize,
      take: pageSize,
      orderBy,
    }),
  ]);

  return [total, users];

}


