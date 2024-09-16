import * as path from 'path';
import * as fs from 'fs';
import { DeployContract, DeployContracts } from './types';
import { v4 as uuidv4 } from 'uuid';

export class DeployContractRepository {
  private _contracts: DeployContracts = [];
  private readonly _buildFolderPath: string;

  constructor(workspacePath: string) {
    this._buildFolderPath = path.join(workspacePath, 'build');

    this.load();
  }

  public async load(): Promise<void> {
    this._contracts = [];

    if (!fs.existsSync(this._buildFolderPath)) {
      return;
    }

    const buildFiles = fs
      .readdirSync(this._buildFolderPath, { recursive: true })
      .filter((f) => f.toString().endsWith('.wasm'));

    for (const buildFile of buildFiles) {
      const target = path.join(this._buildFolderPath, buildFile.toString());

      this._contracts.push({
        name: path.basename(target.toString(), '.wasm'),
        path: target,
        id: uuidv4(),
      });
    }
  }

  public getContracts(): DeployContracts {
    return this._contracts;
  }

  public getContract(id: DeployContract['id']): DeployContract | undefined {
    return this._contracts.find((c) => c.id === id);
  }
}
