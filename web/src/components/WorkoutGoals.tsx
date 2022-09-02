import { Avatar, Card, createStyles, Group, Text, Title } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { ApiClient, PelotonWorkout } from "../api";

const useStyles = createStyles((theme) => ({
  calendarHeaderLevel: {
    fontSize: "32px",
    textTransform: "capitalize",
  },
  day: {
    margin: "0px",
  },
  outside: {
    opacity: 0,
  },
  weekend: {
    color: `inherit !important`,
  },
}));

export const WorkoutGoals: React.FC<{
  person: "kodey" | "maddy" | "monica";
}> = ({ person }) => {
  const { classes, theme } = useStyles();
  const api = new ApiClient();
  const [workouts, setWorkouts] = useState<PelotonWorkout[] | null>(null);
  const [lastWorkout, setLastWorkout] = useState<PelotonWorkout | null>(null);
  const today = useMemo(() => dayjs(new Date()).toDate(), []);
  const startOfMonth = useMemo(
    () => dayjs(today).startOf("month").toDate(),
    [today]
  );
  const endOfMonth = useMemo(
    () => dayjs(today).endOf("month").toDate(),
    [today]
  );

  //   const [workoutDays, lateDays, totalDays] = useMemo<
  //     [number, number, number]
  //   >(() => {
  //     let goalDays = 0;
  //     let daysWithWorkout = 0;
  //     let goalDaysWithWorkout = 0;

  //     for (let i = 1; i <= endOfMonth.getDate(); i++) {
  //       const day = dayjs(startOfMonth).add(i, "days").toDate();
  //       const hasWorkout =
  //         (workouts?.filter(
  //           (workout) => new Date(workout.created_at).getDate() == i
  //         ).length || []) > 0;
  //       const isGoalDay = [1, 3, 5].includes(day.getDay());
  //       if (isGoalDay) {
  //         goalDays++;
  //         if (hasWorkout) {
  //           goalDaysWithWorkout++;
  //         }
  //       }
  //       if (hasWorkout) {
  //         daysWithWorkout++;
  //       }
  //     }
  //     return [
  //       goalDaysWithWorkout,
  //       daysWithWorkout - goalDaysWithWorkout,
  //       goalDays,
  //     ];
  //   }, [startOfMonth, endOfMonth, workouts]);

  useEffect(() => {
    const fetch = () =>
      api.workout.getWorkoutsForPerson({ person }).then((workouts) => {
        const completedRides = workouts.filter(
          (workout) => workout.discipline === "cycling" && workout.is_complete
        );
        setWorkouts(
          completedRides.filter(
            (workout) =>
              new Date(workout.created_at) >= startOfMonth &&
              new Date(workout.created_at) < endOfMonth
          )
        );
        setLastWorkout(completedRides.length > 0 ? completedRides[0] : null);
      });
    fetch();
    const interval = setInterval(fetch, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Group direction="column" position="center" grow>
      <Calendar
        classNames={{
          day: classes.day,
          outside: classes.outside,
          weekend: classes.weekend,
          calendarHeaderLevel: classes.calendarHeaderLevel,
        }}
        month={today}
        size="sm"
        allowLevelChange={false}
        firstDayOfWeek="sunday"
        disableOutsideEvents
        onChange={() => {}}
        minDate={startOfMonth}
        maxDate={endOfMonth}
        labelFormat={`[${person}]`}
        dayStyle={(date, modifiers) => {
          const day = date.getDate();
          const workoutsForDay =
            workouts?.filter(
              (workout) => day === new Date(workout.created_at).getDate()
            ) || [];
          if (workoutsForDay.length > 0) {
            return {
              backgroundColor: theme.colors.green[8],
              fontWeight: 700,
              borderRadius: "100%",
            };
          }
          if (day === today.getDate()) {
            return {
              backgroundColor: theme.colors.gray[8],
              borderRadius: "100%",
            };
          }
          if ([1, 3, 5].includes(date.getDay())) {
            if (day > today.getDate()) {
              return {};
            }
            return {
              backgroundColor:
                day < today.getDate()
                  ? `${theme.colors.red[8]}44`
                  : theme.colors.gray[8],
              borderRadius: "100%",
            };
          }
          return {};
        }}
      />
      {lastWorkout && (
        <Card radius="md">
          <Card.Section p="md" pb={0}>
            <Text>Last Ride</Text>
            <Title order={3}>{lastWorkout.name}</Title>
            <Text>{(dayjs(lastWorkout.created_at) as any).fromNow()}</Text>
          </Card.Section>
          <Card.Section p="md" pb={0}>
            <Group direction="column" spacing="xs" align="center">
              <Avatar
                size="lg"
                radius={40}
                src={
                  lastWorkout.instructor_image ||
                  "https://s3.amazonaws.com/peloton-ride-images/just-ride.png"
                }
              />
              <Text>{lastWorkout.instructor_name}</Text>
            </Group>
          </Card.Section>
          <Card.Section p="md">
            <Group noWrap align="stretch" position="center" spacing={48}>
              <Group direction="column" spacing={0} position="center">
                <Title>{((lastWorkout.duration || 0) / 60).toFixed(0)}</Title>
                <Text>Minutes</Text>
              </Group>
              <Group direction="column" spacing={0} position="center">
                <Title>{(lastWorkout.total_output / 1000).toFixed(0)}</Title>
                <Text>Output</Text>
              </Group>
            </Group>
          </Card.Section>
        </Card>
      )}
    </Group>
  );
};
