/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from "../core/CancelablePromise";
import type { BaseHttpRequest } from "../core/BaseHttpRequest";

export class WeightService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Read Root
   * @returns any Successful Response
   * @throws ApiError
   */
  public readRootApiWeightsGet(): CancelablePromise<any> {
    return this.httpRequest.request({
      method: "GET",
      url: "/api/weights/",
    });
  }
}
