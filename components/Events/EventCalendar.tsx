'use client';
import React from 'react';
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import {useRouter} from "next/navigation";

export default function EventCalendar({events}: { events: any[], }) {

    const router = useRouter();

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            timeZone="UTC"
            editable={false}
            events={events.map((event) => ({
                id: event.id,
                title: event.name,
                start: event.start,
                end: event.end,
            }))}
            eventClick={(info) => {
                router.push(`/events/${info.event.id}`);
            }}
            buttonText={{
                today: "Today"
            }}
        />
    );
}