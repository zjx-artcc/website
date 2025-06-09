import z from 'zod/v4'

export const AirportMETAR = z.object({
    station_id: z.string().min(3).max(5),
    raw: z.string(),
    temp: z.coerce.number(),
    dewpoint: z.coerce.number(),
    wind: z.coerce.number(),
    wind_vel: z.coerce.number(),
    visibility: z.coerce.number(),
    alt_hg: z.string(),
    alt_mb: z.string(),
    wx: z.unknown(),
    auto_report: z.coerce.boolean(),
    sky_conditions: z.object({
        coverage: z.string(),
        base_agl: z.coerce.number()
    }).array(),
    category: z.string(),
    report_type: z.string(),
    time_of_obs: z.iso.datetime()
})