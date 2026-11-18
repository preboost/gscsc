import React from "react";
import { EVENTS_DATA, ClubEvent } from "@/lib/events-data";
import EventDetailClient from "@/components/EventDetailClient";

export function generateStaticParams() {
  const ids = new Set<string>();
  EVENTS_DATA.forEach((ev) => ids.add(ev.id.toString()));
  // Pre-generate routes for dynamic IDs 1 to 100 so newly created admin events resolve cleanly
  for (let i = 1; i <= 100; i++) {
    ids.add(i.toString());
  }
  return Array.from(ids).map((id) => ({ id }));
}

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailPage({ params }: EventPageProps) {
  const event: ClubEvent = EVENTS_DATA.find((e) => e.id.toString() === params.id) || {
    id: Number(params.id) || 1,
    title: "Science Club Event",
    subtitle: "Govt. Science College Science Club",
    category: "Upcoming",
    date: "Scheduled Event",
    duration: "Full-Day Program",
    location: "Govt. Science College Campus, Tejgaon, Dhaka",
    banner_url: "/events/event-1.jpg",
    is_upcoming: true,
    is_active: true,
    description: "Event details and updates from the executive panel.",
    full_story: [
      "Welcome to this official event organized by Govt. Science College Science Club. Stay tuned as detailed schedules, segment guidelines, and delegate updates are published."
    ],
    segments: ["Project Exhibition", "Olympiad Challenge", "Workshops"],
    gallery: []
  };

  return <EventDetailClient initialEvent={event} eventId={params.id} />;
}
