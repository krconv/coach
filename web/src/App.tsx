import { AppShell, createStyles, Group, Title } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { WorkoutGoals } from "./components/WorkoutGoals";

const useStyles = createStyles(() => ({
  main: {
    minHeight: "728px",
    height: "728px",
    maxHeight: "728px",
    minWidth: "1024px",
    width: "1024px",
    maxWidth: "1024px",
    margin: "0px",
  },
}));

export const App: React.FC = () => {
  const { classes } = useStyles();

  return (
    <AppShell classNames={{ main: classes.main }}>
      <Group direction="column" position="center" spacing={0}>
        <Title style={{ fontSize: "48px" }}>{dayjs().format("MMMM")}</Title>
        <Group pt="sm" align="flex-start" spacing={0} noWrap>
          <WorkoutGoals person="maddy" />
          <WorkoutGoals person="kodey" />
          <WorkoutGoals person="monica" />
        </Group>
      </Group>
    </AppShell>
  );
};
