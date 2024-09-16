/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgTypes } from '@/enums.ts';

export type VSCode = any;

export interface IParam {
  type: ArgTypes;
  value: any;
}

export interface IDeployForm {
  environmentId: string;
  contractId: string;
  walletId: string;
  fees: number;
  value: number;
  params: Param[];
}
