import { sleep } from "../../utils/sleep";
import { httpClient } from "../httpClient";

export interface UpdateBankAccountParams {
  id: string;
  name: string;
  initialBalance: number;
  color: string;
  type: 'CHECKING' | 'INVESTMENT' | 'CASH';
}

export async function remove(bankAccountId: string) {
  await sleep();

  const { data } = await httpClient.delete(`/bank-accounts/${bankAccountId}`);

  return data;
}