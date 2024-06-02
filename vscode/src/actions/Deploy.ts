import { WalletRepository } from './WalletRepository.js';
import { ContractParams } from './types.js';
import { EnvironmentRepository } from './EnvironmentRepository.js';
import { DeployContractRepository } from './DeployContractRepository.js';
import {
  Client,
  ClientFactory,
  fromMAS,
  IContractData,
  IProvider,
  MAX_GAS_DEPLOYMENT,
  ProviderType,
  WalletClient,
} from '@massalabs/massa-web3';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

export interface DeployContractOptions {
  environmentId: string;
  contractId: string;
  walletId: string;
  fees: bigint;
  value: bigint;
  params: ContractParams[];
}

export class Deploy {
  private _contractRepository: DeployContractRepository;
  private _walletRepository: WalletRepository;
  private _environmentRepository: EnvironmentRepository;

  constructor(
    contractRepository: DeployContractRepository,
    walletRepository: WalletRepository,
    environmentRepository: EnvironmentRepository,
  ) {
    this._contractRepository = contractRepository;
    this._walletRepository = walletRepository;
    this._environmentRepository = environmentRepository;
  }

  public async deployContract({
    contractId,
    environmentId,
    walletId,
    fees,
    value,
    params,
  }: DeployContractOptions): Promise<any> {
    const environmentInfos = this._environmentRepository.getEnvironment(environmentId);
    const contractInfos = this._contractRepository.getContract(contractId);
    const walletInfos = this._walletRepository.getWallet(walletId);

    if (!environmentInfos) {
      throw new Error(`environment id ${environmentId} not found`);
    }
    if (!contractInfos) {
      throw new Error(`contract id ${contractId} not found`);
    }
    if (!walletInfos) {
      throw new Error(`wallet id ${walletId} not found`);
    }

    const deployerAccount = await WalletClient.getAccountFromSecretKey(walletInfos.privateKey);

    const web3Client: Client = await ClientFactory.createCustomClient(
      [{ url: environmentInfos.rpc, type: ProviderType.PUBLIC } as IProvider],
      BigInt(environmentInfos.chainId),
      true,
      deployerAccount,
    );

    return await web3Client.smartContracts().deploySmartContract(
      {
        contractDataBinary: readFileSync(contractInfos.path),
        fee: fees,
        maxGas: MAX_GAS_DEPLOYMENT,
        //datastore
        maxCoins: fromMAS(value),
      } as IContractData,
      web3Client.wallet().getBaseAccount()!,
    );
  }
}
