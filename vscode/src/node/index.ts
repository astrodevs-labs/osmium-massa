import { exec, execSync } from 'child_process';
import { chdir } from 'process';
import * as vscode from 'vscode';

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

export async function startNode(vscode: any, output: vscode.OutputChannel) {
  const command = `massa-node -p ${NODE_PWD} |& tee logs.txt`;
  
  const path = getBinPath(vscode, 'massa-node')
  chdir(path);
  const childProcess = exec(command);
  childProcess.stdout?.on('data', (data) => {
    console.log(data.toString('utf8'));
    const printableData = data.replace(/[^\x20-\x7E]|(\[2m|\[0m|\[32m)/g, '');
    output.appendLine(printableData);
  });
  childProcess.stderr?.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });
  childProcess.on('error', (error) => {
    console.error(`Error executing massa-node: ${error}`);
    vscode.window.showErrorMessage("Error executing massa-node");
  });
  childProcess.on('close', (code) => {
    console.log(`massa-node process exited with code ${code}`);
    output.show();
  });
  vscode.window.showInformationMessage("Node started successfully");

  return true
}

