import { exec, execSync } from 'child_process';
import { chdir } from 'process';

const NODE_PWD = 'password';

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

export async function startNode(vscode: any) {
  const command = `massa-node -p ${NODE_PWD} |& tee logs.txt`;
  
  const path = getBinPath(vscode, 'massa-node')
  chdir(path);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage("Error executing massa-node");
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
  });
  vscode.window.showInformationMessage("Node started successfully");

  return true
}

