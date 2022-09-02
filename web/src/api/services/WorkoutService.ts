/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PelotonWorkout } from "../models/PelotonWorkout";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class WorkoutService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Workouts For Person
   * @returns PelotonWorkout Successful Response
   * @throws ApiError
   */
  public getWorkoutsForPerson({
    person,
  }: {
    person: string;
  }): CancelablePromise<Array<PelotonWorkout>> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/workouts/",
      query: {
        person: person,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
