import { IDeployForm, VSCode } from '@/types';
import { ResourceManager } from '@hooks/useResourceManager.ts';
import { SubmitHandler, useForm } from 'react-hook-form';
import { MessageType } from '@backend/enums.ts';
import { useEffect, useState } from 'react';

const useDeployPage = (vscode: VSCode, resourceManager: ResourceManager) => {
  const form = useForm<IDeployForm>({
    defaultValues: {
      environmentId: '',
      contractId: '',
      walletId: '',
      fees: 0,
      value: 0,
      params: [],
    },
  });
  const [response, setResponse] = useState<{ responseType: MessageType; data: string }>();

  const onSubmit: SubmitHandler<IDeployForm> = (data) => {
    if (isNaN(data.fees)) {
      form.setError('fees', { type: 'manual', message: 'Invalid number' });
      return;
    }

    if (isNaN(data.value)) {
      form.setError('value', { type: 'manual', message: 'Invalid number' });
      return;
    }

    vscode.postMessage({
      type: MessageType.DEPLOY_CONTRACT,
      data,
    });
  };

  useEffect(() => {
    form.setValue(
      'walletId',
      resourceManager.wallets && resourceManager.wallets.length ? resourceManager.wallets[0].id : '',
    );
  }, [resourceManager.wallets]);

  useEffect(() => {
    form.setValue(
      'contractId',
      resourceManager.deployContracts && resourceManager.deployContracts.length
        ? resourceManager.deployContracts[0].id
        : '',
    );
  }, [resourceManager.deployContracts]);

  useEffect(() => {
    form.setValue(
      'environmentId',
      resourceManager.environments && resourceManager.environments.length ? resourceManager.environments[0].id : '',
    );
  }, [resourceManager.environments]);

  useEffect(() => {
    const listener = (event: WindowEventMap['message']) => {
      switch (event.data.type) {
        case MessageType.DEPLOY_CONTRACT_RESPONSE:
          setResponse({ responseType: MessageType.DEPLOY_CONTRACT_RESPONSE, data: event.data.response });
          break;
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  return {
    form,
    vscode,
    wallets: resourceManager.wallets,
    contracts: resourceManager.deployContracts,
    environments: resourceManager.environments,
    onSubmit,
    response,
  };
};

export default useDeployPage;
