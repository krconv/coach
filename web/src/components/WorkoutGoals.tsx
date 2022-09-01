import { Indicator, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useEffect, useState } from "react";
import { ApiClient } from "../api";

export const WorkoutGoals: React.FC<{}> = () => {
  const api = new ApiClient();
  const [test, setTest] = useState<string | null>(null);
  useEffect(() => {
    setTest("test");
    try {
      api.workout
        .readRootApiWorkoutsGet()
        .then((response) => setTest(JSON.stringify(response)))
        .catch((err) => setTest(String(err)));
    } catch (err) {
      setTest(JSON.stringify(err));
    }
  }, []);
  return (
    <>
      {test && <Text>{test}</Text>}
      <Calendar
        size="lg"
        renderDay={(date) => {
          const day = date.getDate();
          return (
            <Indicator size={6} color="red" offset={8} disabled={day !== 16}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
    </>
  );
};
