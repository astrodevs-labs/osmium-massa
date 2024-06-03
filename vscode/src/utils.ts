import {
  Args,
  Client,
  fromMAS,
  IBaseAccount,
  IContractData,
  MAX_GAS_DEPLOYMENT,
  u64ToBytes,
  u8toByte,
  SmartContractsClient,
} from '@massalabs/massa-web3';
import { ISCData } from './types';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';

function getNonce(): string {
  let nonce: string = '';
  const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    nonce += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return nonce;
}

async function checkBalance(web3Client: Client, account: IBaseAccount, requiredBalance: bigint) {
  const balance = await web3Client.wallet().getAccountBalance(account.address() as string);
  if (!balance?.final || balance.final < requiredBalance) {
    throw new Error('Insufficient MAS balance.');
  }
}

const deploySmartContracts = async (
  contractsToDeploy: ISCData[],
  web3Client: Client,
  deployerAccount: IBaseAccount,
  fee = fromMAS(0.01),
  maxGas = MAX_GAS_DEPLOYMENT,
  maxCoins = fromMAS(0.1),
): Promise<string> => {
  let deploymentOperationId: string;
  try {
    // do checks
    if (!deployerAccount) {
      const baseAccount = web3Client.wallet().getBaseAccount();
      if (baseAccount === null) {
        throw new Error('Failed to get base account');
      } else {
        deployerAccount = baseAccount;
      }
    }

    // check deployer account balance
    const coinsRequired = contractsToDeploy.reduce((acc, contract) => acc + contract.coins, 0n);
    //await checkBalance(web3Client, deployerAccount, coinsRequired);

    // construct a new datastore
    const datastore = new Map<Uint8Array, Uint8Array>();

    // set the number of contracts
    datastore.set(new Uint8Array([0x00]), u64ToBytes(BigInt(contractsToDeploy.length)));
    // loop through all contracts and fill datastore
    for (let i = 0; i < contractsToDeploy.length; i++) {
      const contract: ISCData = contractsToDeploy[i];

      datastore.set(u64ToBytes(BigInt(i + 1)), contract.data);
      if (contract.args) {
        datastore.set(
          new Uint8Array(
            new Args()
              .addU64(BigInt(i + 1))
              .addUint8Array(u8toByte(0))
              .serialize(),
          ),
          new Uint8Array(contract.args.serialize()),
        );
      }
      if (contract.coins > 0) {
        datastore.set(
          new Uint8Array(
            new Args()
              .addU64(BigInt(i + 1))
              .addUint8Array(u8toByte(1))
              .serialize(),
          ),
          u64ToBytes(contract.coins), // scaled value to be provided here
        );
      }
    }

    // deploy deployer contract
    console.log(`Running deployment of smart contract....`);
    try {
      const coins = contractsToDeploy.reduce(
        // scaled value to be provided here
        (acc, contract) => contract.coins + acc,
        0n,
      );
      console.log('Sending coins ... ', coins.toString());
      const baseAccount = web3Client.wallet().getBaseAccount();

      if (!baseAccount) {
        throw new Error('Failed to get base account');
      }

      deploymentOperationId = await web3Client.smartContracts().deploySmartContract(
        {
          contractDataBinary: readFileSync(path.join(__dirname, '.', '/deployer.wasm')),
          datastore,
          fee,
          maxGas,
          maxCoins,
        } as IContractData,
        baseAccount,
      );
      console.log(`Smart Contract successfully deployed to Massa Network. Operation ID ${deploymentOperationId}`);
    } catch (ex) {
      const msg = 'Error deploying deployer smart contract to Massa Network';
      console.error(msg);
      throw new Error(ex + '');
    }
  } catch (ex) {
    const msg = 'Error deploying deployer smart contract to Massa Network';
    console.error(msg);
    throw new Error(ex + '');
  }
  console.log(`Smart Contract Deployment finished!`);

  return deploymentOperationId;
};

export { getNonce, deploySmartContracts };
