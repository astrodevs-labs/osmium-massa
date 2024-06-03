import { WalletRepository } from './WalletRepository.js';
import { ContractParams } from './types.js';
import { EnvironmentRepository } from './EnvironmentRepository.js';
import { DeployContractRepository } from './DeployContractRepository.js';
import {
  Args,
  ArgTypes,
  CHAIN_ID,
  Client,
  ClientFactory,
  fromMAS,
  IContractData,
  IProvider,
  MAX_GAS_DEPLOYMENT,
  ProviderType,
  SmartContractsClient,
  u64ToBytes,
  u8toByte,
  WalletClient,
} from '@massalabs/massa-web3';
import { readFileSync } from 'node:fs';
import { deploySmartContracts } from '../utils';
import path from 'node:path';

export interface DeployContractOptions {
  environmentId: string;
  contractId: string;
  walletId: string;
  fees: bigint;
  value: bigint;
  params: ContractParams;
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

    //const datastore = new Map<Uint8Array, Uint8Array>();
    //
    //datastore.set(new Uint8Array([0x00]), u64ToBytes(BigInt(1)));
    //datastore.set(u64ToBytes(BigInt(1)), readFileSync(contractInfos.path));
    //
    //if (params.length) {
    //  const args = new Args();
    //
    //  for (const param of params) {
    //    if (param.type === ArgTypes.STRING) args.addString(param.value);
    //    if (param.type === ArgTypes.BOOL) args.addBool(param.value);
    //    if (param.type === ArgTypes.U8) args.addU8(param.value);
    //    if (param.type === ArgTypes.U32) args.addU32(param.value);
    //    if (param.type === ArgTypes.U64) args.addU64(param.value);
    //    if (param.type === ArgTypes.I128) args.addI128(param.value);
    //    if (param.type === ArgTypes.U128) args.addU128(param.value);
    //    if (param.type === ArgTypes.U256) args.addU256(param.value);
    //    if (param.type === ArgTypes.I32) args.addI32(param.value);
    //    if (param.type === ArgTypes.I64) args.addI64(param.value);
    //    if (param.type === ArgTypes.F32) args.addF32(param.value);
    //    if (param.type === ArgTypes.F64) args.addF64(param.value);
    //    if (param.type === ArgTypes.UINT8ARRAY) args.addUint8Array(param.value);
    //    if (param.type === ArgTypes.SERIALIZABLE) args.addSerializable(param.value);
    //    if (param.type === ArgTypes.SERIALIZABLE_OBJECT_ARRAY) args.addSerializableObjectArray(param.value);
    //  }
    //
    //  datastore.set(
    //    new Uint8Array(new Args().addU64(BigInt(1)).addUint8Array(u8toByte(0)).serialize()),
    //    new Uint8Array(args.serialize()),
    //  );
    //}
    //if (value > 0) {
    //  datastore.set(
    //    new Uint8Array(new Args().addU64(BigInt(1)).addUint8Array(u8toByte(1)).serialize()),
    //    u64ToBytes(fromMAS(value)), // scaled value to be provided here
    //  );
    //}
    //
    const deployerAccount = await WalletClient.getAccountFromSecretKey(walletInfos.privateKey);

    const web3Client: Client = await ClientFactory.createCustomClient(
      [
        { url: environmentInfos.rpc, type: ProviderType.PUBLIC } as IProvider,
        { url: environmentInfos.rpc, type: ProviderType.PRIVATE } as IProvider,
      ],
      BigInt(environmentInfos.chainId),
      true,
      deployerAccount,
    );
    CHAIN_ID.BuildNet;
    //
    //console.log(fromMAS(fees))

    // return await web3Client.smartContracts().deploySmartContract(
    //   {
    //     contractDataBinary: readFileSync(contractInfos.path),
    //     fee: fromMAS(fees),
    //     maxGas: MAX_GAS_DEPLOYMENT,
    //     datastore,
    //     maxCoins: fromMAS(value),
    //   } as IContractData,
    //   web3Client.wallet().getBaseAccount()!,
    // );

    return await web3Client.smartContracts().deploySmartContract({
      fee: fromMAS(fees),
      maxCoins: 0n,
      maxGas: 0n,
      contractDataBinary: readFileSync(contractInfos.path),
    });

    //return deploySmartContracts(
    //  [
    //    {
    //      data: readFileSync(path.join(__dirname, '.', '/sc.wasm')),
    //      coins: fromMAS(value),
    //    },
    //  ],
    //  web3Client,
    //  web3Client.wallet().getBaseAccount()!,
    //  fromMAS(fees),
    //  3000_000_000n,
    //  fromMAS(value),
    //);
  }
}
