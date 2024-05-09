import { exec, execSync } from 'child_process';
import { chdir } from 'process';

const NODE_PWD = 'azerty';
const CLIENT_PWD = 'client';

function getBinPath(vscode: any, command: string): string {
  try {
    const path = execSync(`which ${command}`, { encoding: 'utf-8' });
    const lastIndex = path.lastIndexOf("/");
    const pathWithoutBin = path.substring(0, lastIndex);
    return pathWithoutBin;
  } catch (error) {
    vscode.window.showErrorMessage("Massa-node binary is missing. Please ensure it's installed and adjust your PATH accordingly.");
    return "";
  }
}

export function startNode(vscode: any) {
  const command = `massa-node -p ${NODE_PWD} |& tee logs.txt`;

  const path = getBinPath(vscode, 'massa-node')
  if (path == "") {
    return;
  }
  chdir(path);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showInformationMessage("Error executing massa-node");
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    console.log(`Command Executed`);
  });

  return true
}

export function startClient() {
  const command = `massa-client -p ${CLIENT_PWD}`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    
    console.log(`Command Executed`);
  });
}