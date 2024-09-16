import './DeployParams.css';
import { VSCodeButton, VSCodeDropdown, VSCodeOption, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import useDeployParams from '@components/DeployParams/DeployParams.logic.ts';
import { ArgTypes } from '@/enums.ts';

const DeployParams = () => {
  const logic = useDeployParams();

  return (
    <div>
      <div className="add-remove-container">
        <VSCodeButton className="add-button" onClick={logic.addParam}>
          Add param
        </VSCodeButton>
        <VSCodeButton className="remove-button" onClick={logic.removeParam}>
          Remove param
        </VSCodeButton>
      </div>
      {logic.paramsCount > 0 &&
        Array.from({ length: logic.paramsCount }).map((_, index) => {
          return (
            <div key={index}>
              <label htmlFor="param">Param {index + 1}:</label>
              <div className="param">
                <VSCodeTextField
                  className="param-textfield"
                  {...logic.form.register(`params.${index}.value` as const)}
                />
                <VSCodeDropdown className="param-dropdown" {...logic.form.register(`params.${index}.type` as const)}>
                  {Object.getOwnPropertyNames(ArgTypes)
                    .filter((value) => isNaN(Number(value)))
                    .map((argType, index) => {
                      return (
                        <VSCodeOption key={argType} value={index.toString()}>
                          {argType}
                        </VSCodeOption>
                      );
                    })}
                </VSCodeDropdown>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default DeployParams;
