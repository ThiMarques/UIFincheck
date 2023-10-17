import { sleep } from "../../utils/sleep";
import { httpClient } from "../httpClient";

export interface CreateBankAccountParams {
  name: string;
  initialBalance: number;
  color: string;
  type: 'CHECKING' | 'INVESTMENT' | 'CASH';
}

export async function create(params: CreateBankAccountParams) {
  await sleep();

  const { data } = await httpClient.post('/bank-accounts', params);

  return data;
}