import { exec } from 'child_process';
import os from 'os';

export async function killNode(vscode: any) {
  let command :string = "";
  const platform = os.platform();
  if (platform === 'win32') {
    console.log('L\'utilisateur utilise Windows.');
        command = `taskkill /F /IM massa-node`;
      } else if (platform === 'darwin') {
        console.log('L\'utilisateur utilise macOS.');
          command = `pkill massa-node`;
      } else if (platform === 'linux') {
        console.log('L\'utilisateur utilise Linux.');
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
    }  
  });
  vscode.window.showInformationMessage("Node killed successfully");

  return true
}