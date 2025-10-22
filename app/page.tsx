import {
  Card,
  CardContent,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Poppins } from "next/font/google";
import prisma from "@/lib/db";
import UpcomingEventsCarousel from "@/components/HomePage/UpcomingEventsCarousel";
import { getDuration } from "@/lib/date";
import { getRating } from "@/lib/vatsim";
import Link from "next/link";
import { StackedLineChart } from "@mui/icons-material";
import { getTop3Controllers } from "@/lib/hours";
import QuickLinksList from "@/components/Hero/QuickLinksList";
import SplitViewer from "@/components/CenterSplit/SplitViewer";
import { getServerSession } from "next-auth";
import { canEditEvent, getSplitData, isEventMode } from "@/actions/centerSplit";
import { authOptions } from "@/auth/auth";
import AssignedTrainerRequestButton from "@/components/Profile/AssignedTrainerRequestButton";
import Head from "next/head";
import { getOnlineControllers } from '@/actions/statistics';

const headingFont = Poppins({ subsets: ["latin"], weight: ["400"] });

export default async function Home() {
  const session = await getServerSession(authOptions);
  const splitData = await getSplitData();
  const { eventMode, eventModeUntil } = await isEventMode();

  const upcomingEvents = await prisma.event.findMany({
    where: {
      start: {
        gt: new Date(),
      },
      hidden: false,
    },
    orderBy: {
      start: "asc",
    },
    take: 5,
  });

  const imageUrls = Object.fromEntries(
    upcomingEvents.map((event) => {
      return [
        event.id,
        event.bannerKey
          ? `https://utfs.io/f/${event.bannerKey}`
          : "/img/logo_large.png",
      ];
    })
  );

  const onlineAtc = await getOnlineControllers()

  const soloCertifications = await prisma.soloCertification.findMany({
    where: {
      expires: {
        gt: new Date(),
      },
    },
    include: {
      controller: true,
    },
  });

  const top3Logs = await prisma.controllerLogMonth.findMany({
    where: {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    },
    include: {
      log: {
        include: {
          user: true,
        },
      },
    },
  });

  const top3Controllers = getTop3Controllers(top3Logs);

  return (
    <div>
      <Head>
        <meta
          name="description"
          content="vZJX ARTCC"
          key="desc"
        />
      </Head>
      <Grid2 container columns={8} spacing={4}>
        <Grid2
          size={{
            xs: 8,
            lg: 6,
          }}
        >
          <Card sx={{ height: 600 }}>
            <CardContent>
              <Typography {...headingFont.style} variant="h5" sx={{ mb: 1 }}>
                Upcoming Events
              </Typography>
              <UpcomingEventsCarousel
                events={upcomingEvents}
                imageUrls={imageUrls}
              />
            </CardContent>
          </Card>
        </Grid2>
        <Grid2
          size={{
            xs: 8,
            lg: 2,
          }}
        >
          <Card sx={{ height: 600 }}>
            <CardContent>
              <Typography {...headingFont.style} variant="h5" sx={{ mb: 1 }}>
                Quick Links
              </Typography>
              <QuickLinksList />
            </CardContent>
          </Card>
        </Grid2>
        <Grid2
          size={{
            xs: 8,
            lg: 2,
          }}
        >
          <Card sx={{ minHeight: 600 }}>
            <CardContent>
              <Typography {...headingFont.style} variant="h5" sx={{ mb: 1 }}>
                Online ATC
              </Typography>
              <Stack direction="column" spacing={1} sx={{ maxHeight: 600 }}>
                {onlineAtc.length > 0 ? (
                  onlineAtc.map((position) => (
                    <Card
                      elevation={0}
                      key={position.start.toISOString() + position.cid}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                        >
                          <Typography>{position.callsign}</Typography>
                          <Typography>
                            {getDuration(position.start, new Date())}
                          </Typography>
                        </Stack>
                        <Link
                          href={`/controllers/${position.cid}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography variant="subtitle2">
                            {position.firstName}{" "}
                            {position.lastName} -{" "}
                            {position.controllerRating}
                          </Typography>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography>No controllers online</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2
          size={{
            xs: 8,
            lg: 4,
          }}
        >
          <Card sx={{ minHeight: 600 }}>
            <CardContent>
              <Typography {...headingFont.style} variant="h5" sx={{ mb: 1 }}>
                Top 3 Controllers
              </Typography>
              <Stack direction="column" spacing={1}>
                {top3Controllers.map((controller, idx) => (
                  <Card elevation={0} key={controller.user.cid}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h5">
                          {idx + 1} -{" "}
                          {controller.user.preferredName ||
                            `${controller.user.firstName} ${controller.user.lastName}`}
                        </Typography>
                        <Tooltip title="View Statistics for this controller">
                          <Link
                            href={`/controllers/statistics/${new Date().getFullYear()}/-/${
                              controller.user.cid
                            }`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            <IconButton size="large">
                              <StackedLineChart fontSize="large" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </Stack>
                      <Typography variant="subtitle2">
                        {controller.hours.toPrecision(3)} hours
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2
          size={{
            xs: 8,
            lg: 2,
          }}
        >
          <Card sx={{ minHeight: 600 }}>
            <CardContent>
              <Typography {...headingFont.style} variant="h5" sx={{ mb: 1 }}>
                Solo Certifications
              </Typography>
              <Stack direction="column" spacing={1}>
                {soloCertifications.length > 0 ? (
                  soloCertifications.map((solo) => (
                    <Card elevation={0} key={solo.id}>
                      <CardContent>
                        <Typography variant="h6">{solo.position}</Typography>
                        <Typography variant="body2">
                          Expires {solo.expires.toDateString()}
                        </Typography>
                        <Link
                          href={`/controllers/${solo.controller.cid}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography variant="subtitle2">
                            {solo.controller.firstName}{" "}
                            {solo.controller.lastName} -{" "}
                            {getRating(solo.controller.rating)}
                          </Typography>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography>No active solo certifications</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid2>
        <Card sx={{ minHeight: 600, width: "100%" }}>
          <CardContent>
            <SplitViewer
              canEdit={
                (session?.user.rating && session.user.rating >= 5) ||
                session?.user.roles.includes("STAFF")
              }
              sectorData={splitData}
              eventMode={eventMode}
              isEventStaff={await canEditEvent()}
            />
          </CardContent>
        </Card>
      </Grid2>
    </div>
  );
}
