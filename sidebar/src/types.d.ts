/* eslint-disable @typescript-eslint/no-explicit-any */
export type VSCode = any;

export interface IDeployForm {
  environmentId: string;
  contractId: string;
  walletId: string;
  fees: bigint;
  maxGas: bigint;
  waitFirstEvent: boolean;
  value: bigint;
}
