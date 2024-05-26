import { WalletRepository } from './WalletRepository';
import { ContractParams } from './types';
import { EnvironmentRepository } from './EnvironmentRepository';
import { DeployContractRepository } from './DeployContractRepository';
import { fromMAS, MAX_GAS_DEPLOYMENT } from '@massalabs/massa-web3';
import { readFileSync } from 'node:fs';
import { deploySC, WalletClient } from '@massalabs/massa-sc-deployer';

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

    return await deploySC(
      environmentInfos.rpc,
      deployerAccount,
      [
        {
          data: readFileSync(contractInfos.path),
          coins: fromMAS(value),
          args: params,
        },
      ],
      BigInt(environmentInfos.chainId),
      fees,
      MAX_GAS_DEPLOYMENT,
      true,
    );
  }
}
