/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PelotonWorkout } from "../models/PelotonWorkout";

import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class WorkoutService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Read Root
   * @returns PelotonWorkout Successful Response
   * @throws ApiError
   */
  public readRootApiWorkoutsGet(): CancelablePromise<
    Record<string, Array<PelotonWorkout>>
  > {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/workouts/",
    });
  }
}
