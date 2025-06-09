'use server'
import z from 'zod/v4'

export async function getAirportWeather(icao: string): Promise<AirportMETAR | undefined> {
    const isIcao = z.string().length(4)
    const parsedIcao = isIcao.safeParse(icao)

    if (parsedIcao.success) {
        const response: Response = await fetch(`https://api.aviationapi.com/v1/weather/metar` + new URLSearchParams({apt: icao}), {
            next: {
                revalidate: 250
            }
        })
        
        if (response.ok) {
            const jsonData = await response.json()
            return jsonData
        } else {
            console.error('Unable to get airport data: ' + icao)
        }
    }
}