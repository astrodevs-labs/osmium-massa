import { VSCode } from '@/types';
import { FormProvider } from 'react-hook-form';
import { VSCodeButton, VSCodeDivider } from '@vscode/webview-ui-toolkit/react';
import useDeployPage from '@pages/DeployPage/DeployPage.logic.ts';
import { ResourceManager } from '@hooks/useResourceManager.ts';
import DeployContracts from '@components/DeployForm/DeployForm.tsx';
import './DeployPage.css';

const DeployPage = (props: { vscode: VSCode; resourceManager: ResourceManager }) => {
  const logic = useDeployPage(props.vscode, props.resourceManager);

  return (
    <div className="page-container">
      <FormProvider {...logic.form}>
        <form onSubmit={logic.form.handleSubmit(logic.onSubmit)}>
          <DeployContracts
            wallets={logic.wallets}
            contracts={logic.contracts}
            environments={logic.environments}
            vscode={props.vscode}
          />
          <VSCodeDivider className="divider" />
          {/*<InteractParams contracts={logic.contracts} />*/}
          <VSCodeButton className="submit-button" type="submit">
            Deploy
          </VSCodeButton>
        </form>
      </FormProvider>
    </div>
  );
};

export default DeployPage;
