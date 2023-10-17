import { sleep } from "../../utils/sleep";
import { httpClient } from "../httpClient";

export async function remove(transactionId: string) {
  await sleep();

  const { data } = await httpClient.delete(`/transactions/${transactionId}`);

  return data;
}