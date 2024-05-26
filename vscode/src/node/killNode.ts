import { exec } from 'child_process';
import os from 'os';
import * as vscode from 'vscode';

export async function killNode(vscode: any, output: vscode.OutputChannel) {
  let command :string = "";
  const platform = os.platform();
  if (platform === 'win32') {
    command = `taskkill /F /IM massa-node`;
  } else if (platform === 'darwin') {
    command = `pkill massa-node`;
  } else if (platform === 'linux') {
    command = `killall massa-node`;
  } else {
    console.log('Système d\'exploitation non reconnu.');
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage("Error killing massa-node");
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
      output.appendLine(`stdout: ${stdout}`);
      output.show();
    }  
  });
  vscode.window.showInformationMessage("Node killed successfully");

  return true
}