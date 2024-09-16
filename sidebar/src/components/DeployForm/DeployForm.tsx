import { DeployContracts, Environments, Wallets } from '@backend/actions/types';
import { VSCode } from '@/types';
import './DeployForm.css';
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import useDeployForm from '@components/DeployForm/DeployForm.logic.ts';

interface DeployFormProps {
  wallets: Wallets;
  contracts: DeployContracts;
  environments: Environments;
  vscode: VSCode;
}

const DeployForm = ({ wallets, contracts, environments, vscode }: DeployFormProps) => {
  const logic = useDeployForm(vscode);

  return (
    <div>
      <div className="dropdown-container">
        <label htmlFor="dropdown-wallets" className="label">
          Select account:
        </label>
        <div className="wallet-container">
          <VSCodeDropdown
            id="dropdown-wallets"
            className="dropdown-wallets"
            {...logic.register('walletId', {
              required: true,
            })}
          >
            {wallets?.map((wallet) => (
              <VSCodeOption value={wallet.id}>
                {wallet.name} - {wallet.address}
              </VSCodeOption>
            ))}
          </VSCodeDropdown>
          <VSCodeButton className="add-wallet-button" onClick={logic.editWallet}>
            Edit
          </VSCodeButton>
        </div>
      </div>
      <div className="dropdown-container">
        <label htmlFor="dropdown-environments" className="label">
          Select environment:
        </label>
        <div className="environment-container">
          <VSCodeDropdown
            id="dropdown-environments"
            className="dropdown-environments"
            {...logic.register('environmentId', {
              required: true,
            })}
          >
            {environments?.map((environment) => (
              <VSCodeOption value={environment.id}>
                {environment.name} ({environment.rpc})
              </VSCodeOption>
            ))}
          </VSCodeDropdown>
          <VSCodeButton className="add-environment-button" onClick={logic.editEnvironment}>
            Edit
          </VSCodeButton>
        </div>
      </div>
      <div className="dropdown-container">
        <label htmlFor="dropdown-contracts" className="label">
          Select contract:
        </label>
        <VSCodeDropdown id="dropdown-contracts" {...logic.register('contractId', { required: true })}>
          {contracts?.map((contract) => {
            return (
              <VSCodeOption value={contract.id}>
                {contract.name} ({contract.path})
              </VSCodeOption>
            );
          })}
        </VSCodeDropdown>
      </div>
      <div className="fees-container">
        <VSCodeTextField
          className="fees-textfield"
          {...logic.register('fees', {
            required: true,
            valueAsNumber: true,
          })}
        >
          Fees (in MAS)
        </VSCodeTextField>
        {logic.errors.fees && <span className="error-message">Invalid number</span>}
      </div>
      <div className="value-container">
        <VSCodeTextField
          className="value-textfield"
          {...logic.register('value', {
            required: true,
            valueAsNumber: true,
          })}
        >
          Value (in MAS)
        </VSCodeTextField>
        {logic.errors.value && <span className="error-message">Invalid number</span>}
      </div>
    </div>
  );
};

export default DeployForm;
