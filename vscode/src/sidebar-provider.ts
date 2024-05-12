import * as vscode from 'vscode';
import { getNonce } from './utils';
import { EnvironmentRepository } from './actions/EnvironmentRepository';
import { WalletRepository } from './actions/WalletRepository';
import { DeployContractRepository } from './actions/DeployContractRepository';
import { Message } from './types';
import { window } from 'vscode';
import { InputAction, MessageType } from './enums';
import { Address } from 'viem';
import { RpcUrl } from './actions/types';
import * as path from 'node:path';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'osmium.sidebar';
  private _view?: vscode.WebviewView;

  private _deployContractRepository?: DeployContractRepository;
  private _walletRepository?: WalletRepository;
  private _environmentRepository?: EnvironmentRepository;

  private _osmiumWatcher?: vscode.FileSystemWatcher;
  private _buildWatcher?: vscode.FileSystemWatcher;

  async _showInputsBox(inputsBox: any) {
    const tmp = inputsBox;

    for (const input of Object.keys(inputsBox)) {
      const value = await window.showInputBox({
        prompt: inputsBox[input],
        ignoreFocusOut: true,
      });
      if (!value) {
        return undefined;
      }
      tmp[input] = value;
    }

    return tmp;
  }

  async _osmiumWatcherCallback(uri: vscode.Uri) {
    if (!this._view) return;
    const basename = path.basename(uri.fsPath, '.json');
    if (basename === 'wallets') {
      this._walletRepository?.load();
      await this._view.webview.postMessage({
        type: MessageType.WALLETS,
        wallets: this._walletRepository?.getWallets(),
      });
    }
    if (basename === 'environments') {
      this._environmentRepository?.load();
      await this._view.webview.postMessage({
        type: MessageType.ENVIRONMENTS,
        environments: this._environmentRepository?.getEnvironments(),
      });
    }
  }

  async _buildWatcherCallback() {
    if (!this._view) {
      return;
    }
    this._deployContractRepository?.load();
    await this._view.webview.postMessage({
      type: MessageType.DEPLOY_CONTRACTS,
      contracts: this._deployContractRepository?.getContracts(),
    });
  }

  _init() {
    if (vscode.workspace.workspaceFolders?.length) {
      const fsPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

      this._deployContractRepository = new DeployContractRepository(fsPath);
      this._walletRepository = new WalletRepository(fsPath);
      this._environmentRepository = new EnvironmentRepository(fsPath);

      this._osmiumWatcher = vscode.workspace.createFileSystemWatcher('**/.osmium/*.json');
      this._osmiumWatcher.onDidChange((uri) => this._osmiumWatcherCallback(uri));
      this._buildWatcher = vscode.workspace.createFileSystemWatcher('**/build/*.wasm');
      this._buildWatcher.onDidChange(() => this._buildWatcherCallback());
    }
  }

  async _onMessageCallback(message: Message) {
    if (!this._view || !this._deployContractRepository || !this._walletRepository || !this._environmentRepository) {
      return;
    }
    switch (message.type) {
      case MessageType.GET_WALLETS:
        await this._view.webview.postMessage({
          type: MessageType.WALLETS,
          wallets: this._walletRepository.getWallets(),
        });
        break;
      case MessageType.GET_DEPLOY_CONTRACTS:
        await this._view.webview.postMessage({
          type: MessageType.DEPLOY_CONTRACTS,
          contracts: this._deployContractRepository.getContracts(),
        });
        break;
      case MessageType.GET_ENVIRONMENTS:
        await this._view.webview.postMessage({
          type: MessageType.ENVIRONMENTS,
          environments: this._environmentRepository.getEnvironments(),
        });
        break;
      case MessageType.EDIT_WALLETS:
        const walletAction = await window.showQuickPick([InputAction.ADD, InputAction.REMOVE], {
          title: 'Edit wallets',
          ignoreFocusOut: true,
        });

        if (walletAction === InputAction.ADD) {
          const inputs = await this._showInputsBox({
            walletName: 'Enter name',
            walletAddress: 'Enter address',
            walletPk: 'Enter private key',
          });
          if (!inputs) return;
          if (!inputs.walletAddress.startsWith('0x') || !inputs.walletPk.startsWith('0x')) return;

          this._walletRepository.createWallet(
            inputs.walletName,
            <Address>inputs.walletAddress,
            <Address>inputs.walletPk,
          );
        }

        if (walletAction === InputAction.REMOVE) {
          const walletName = await window.showQuickPick(
            this._walletRepository.getWallets().map((w) => w.name),
            {
              title: 'Remove wallet',
              ignoreFocusOut: true,
            },
          );
          if (!walletName) return;
          this._walletRepository.deleteWallet(walletName);
        }
        break;
      case MessageType.EDIT_ENVIRONMENT:
        const environmentAction = await window.showQuickPick([InputAction.ADD, InputAction.REMOVE], {
          title: 'Edit environment',
          ignoreFocusOut: true,
        });
        if (environmentAction === InputAction.ADD) {
          const inputs = await this._showInputsBox({
            environmentName: 'Enter name',
            environmentRpc: 'Enter rpc',
            environmentChainId: 'Enter chain id',
          });
          if (!inputs) return;
          if (!inputs.environmentRpc.startsWith('http') && !inputs.environmentRpc.startsWith('ws')) return;

          this._environmentRepository.createEnvironment(
            inputs.environmentName,
            <RpcUrl>inputs.environmentRpc,
            inputs.environmentChainId,
          );
        }
        if (environmentAction === InputAction.REMOVE) {
          const environmentName = await window.showQuickPick(
            this._environmentRepository.getEnvironments().map((e) => e.name),
            {
              title: 'Remove environment',
              ignoreFocusOut: true,
            },
          );
          if (!environmentName) return;
          this._environmentRepository.deleteEnvironment(environmentName);
        }
        break;
    }
  }

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;
    this._init();

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((e) => {
      this._onMessageCallback(e);
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'index.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'dist', 'index.css'));
    const nonce = getNonce();

    return `<!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Panel</title>
            <script type="module" nonce="${nonce}" crossorigin src="${scriptUri}"></script>
            <link rel="stylesheet" crossorigin href="${styleUri}">
          </head>
          <body>
            <div id="root"></div>
          </body>
        </html>`;
  }
}
