import { DeployContracts, Environments, Wallets } from '@backend/actions/types';
import { useEffect, useState } from 'react';
import { VSCode } from '@/types';
import { MessageType } from '@backend/enums.ts';

export type ResourceManager = {
  wallets: Wallets;
  environments: Environments;
  deployContracts: DeployContracts;
};

export const useResourceManager = (vscode: VSCode): ResourceManager => {
  const [wallets, setWallets] = useState<Wallets>([]);
  const [environments, setEnvironments] = useState<Environments>([]);
  const [deployContracts, setDeployContracts] = useState<DeployContracts>([]);

  useEffect(() => {
    if (!vscode) {
      return;
    }
    vscode.postMessage({ type: MessageType.GET_WALLETS });
    vscode.postMessage({ type: MessageType.GET_ENVIRONMENTS });
    vscode.postMessage({ type: MessageType.GET_DEPLOY_CONTRACTS });
  }, [vscode]);

  useEffect(() => {
    const listener = (event: WindowEventMap['message']) => {
      switch (event.data.type) {
        case MessageType.WALLETS: {
          setWallets(event.data.wallets);
          break;
        }
        case MessageType.ENVIRONMENTS: {
          setEnvironments(event.data.environments);
          break;
        }
        case MessageType.DEPLOY_CONTRACTS: {
          setDeployContracts(event.data.contracts);
          break;
        }
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return {
    wallets,
    environments,
    deployContracts,
  };
};
