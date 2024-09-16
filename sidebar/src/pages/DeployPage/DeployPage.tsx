import { VSCode } from '@/types';
import { FormProvider } from 'react-hook-form';
import { VSCodeButton, VSCodeDivider } from '@vscode/webview-ui-toolkit/react';
import useDeployPage from '@pages/DeployPage/DeployPage.logic.ts';
import { ResourceManager } from '@hooks/useResourceManager.ts';
import DeployForm from '@components/DeployForm/DeployForm.tsx';
import './DeployPage.css';
import DeployParams from '@components/DeployParams/DeployParams.tsx';

const Response = (response: string) => {
  return (
    <div>
      <VSCodeDivider className="divider" />
      <p>Response:</p>
      <p>{response}</p>
    </div>
  );
};

const DeployPage = (props: { vscode: VSCode; resourceManager: ResourceManager }) => {
  const logic = useDeployPage(props.vscode, props.resourceManager);

  return (
    <div className="page-container">
      <FormProvider {...logic.form}>
        <form onSubmit={logic.form.handleSubmit(logic.onSubmit)}>
          <DeployForm
            wallets={logic.wallets}
            contracts={logic.contracts}
            environments={logic.environments}
            vscode={props.vscode}
          />
          <VSCodeDivider className="divider" />
          <DeployParams />
          <VSCodeDivider className="divider" />
          <VSCodeButton className="submit-button" type="submit">
            Deploy
          </VSCodeButton>
        </form>
      </FormProvider>
      {logic.response && Response(logic.response)}
    </div>
  );
};

export default DeployPage;
