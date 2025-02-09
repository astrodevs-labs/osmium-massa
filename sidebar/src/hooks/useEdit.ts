import { VSCode } from '@/types';
import { MessageType } from '@backend/enums.ts';

export const useEdit = (vscode: VSCode) => {
  const editEnvironment = () => {
    vscode.postMessage({ type: MessageType.EDIT_ENVIRONMENT });
  };

  const editWallet = () => {
    vscode.postMessage({ type: MessageType.EDIT_WALLETS });
  };

  return {
    editEnvironment,
    editWallet,
  };
};
