import { IParam } from '@massalabs/massa-web3';

export type RpcUrl = `ws://${string}` | `wss://${string}` | `http://${string}` | `https://${string}`;

export interface DeployContract {
  name: string;
  path: string;
  id: string;
}

export type DeployContracts = DeployContract[];

export interface Environment {
  name: string;
  rpc: RpcUrl;
  chainId: number;
  id: string;
}

export type Environments = Environment[];

export interface Wallet {
  name: string;
  address: string;
  privateKey: string;
  id: string;
}

export type Wallets = Wallet[];

export type ContractParam = IParam;

export type ContractParams = ContractParam[];
