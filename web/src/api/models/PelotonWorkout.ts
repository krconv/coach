/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PelotonDiscipline } from "./PelotonDiscipline";

export type PelotonWorkout = {
  id: string;
  name: string;
  created_at: string;
  is_complete: boolean;
  discipline: PelotonDiscipline | string;
  duration?: number;
};
