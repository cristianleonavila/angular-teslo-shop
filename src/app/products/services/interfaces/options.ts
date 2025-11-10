import { Gender } from "@products/interfaces/product-response";

export interface Options {
  limit?: number;
  offset?: number;
  gender?: Gender
}
