'use server'
import metarParser, { MetarObject } from '@/lib/metar'
import z from 'zod/v4'

export async function getAirportWeather(icao: string): Promise<MetarObject | undefined> {
    const isIcao = z.string().length(4)
    const parsedIcao = isIcao.safeParse(icao)

    if (parsedIcao.success) {
        const response: Response = await fetch(`https://aviationweather.gov/api/data/metar?${new URLSearchParams({ids: icao})}`, {
            next: {
                revalidate: 250
            }
        })
        console.log(response)
        if (response.ok) {
            return metarParser(await response.text())
        } else {
            console.error('Unable to get airport data: ' + icao)
            console.error(parsedIcao.error)
        }
    }

    return undefined
}