import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react';
import DeployPage from '@pages/DeployPage/DeployPage.tsx';
import NodePage from '@pages/NodePage/NodePage.tsx';
import { useApp } from '@/App.logic.ts';

export const App = () => {
  const logic = useApp();

  return (
    <VSCodePanels>
      <VSCodePanelTab id="tab-node">NODE</VSCodePanelTab>
      <VSCodePanelTab id="tab-deploy">DEPLOY</VSCodePanelTab>
      <VSCodePanelView id="view-node">
        <NodePage vscode={logic.vscode} />
      </VSCodePanelView>
      <VSCodePanelView id="view-deploy">
        <DeployPage vscode={logic.vscode} resourceManager={logic.resourceManager} />
      </VSCodePanelView>
    </VSCodePanels>
  );
};
