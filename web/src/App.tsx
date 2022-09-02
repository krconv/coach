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
    border: "1px solid white",
  },
}));

export const App: React.FC = () => {
  const { classes } = useStyles();

  return (
    <AppShell classNames={{ main: classes.main }}>
      <Group direction="column" position="center">
        <Title style={{ fontSize: "48px" }}>{dayjs().format("MMMM")}</Title>
        <Group align="flex-start" spacing={64} noWrap>
          <WorkoutGoals person="maddy" />
          <WorkoutGoals person="kodey" />
          <WorkoutGoals person="monica" />
        </Group>
      </Group>
    </AppShell>
  );
};
