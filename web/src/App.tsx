import { AppShell, createStyles, Group } from "@mantine/core";
import React from "react";
import { WeightGoals } from "./components/WeightGoals";
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
      <Group position="center" align="stretch" grow noWrap>
        <WorkoutGoals />
        <WeightGoals />
      </Group>
    </AppShell>
  );
};
