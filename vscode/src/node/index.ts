import { exec, execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import net from 'net';
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

async function getIPAddress(): Promise<string> {
  try {
      const response = await fetch('https://api.ipify.org/');
      if (!response.ok) {
          throw new Error(`Failed to fetch IP address, status ${response.status}`);
      }
      const data = await response.text();
      return data;
  } catch (error) {
      console.error('Error fetching IP address:', error);
      throw error;
  }
}

function isPortOpen(port: number, host: string = 'localhost'): Promise<boolean> {
  return new Promise((resolve) => {
      const socket = new net.Socket();
      
      socket.setTimeout(2000); // Set timeout to 2 seconds
      
      socket.on('connect', () => {
          socket.end();
          resolve(true);
      });
      
      socket.on('error', () => {
          resolve(false);
      });
      
      socket.connect(port, host);
  });
}

function editConfigFile(ipAddress: string, configFilePath : string): void {
  const newConfigContent = `[protocol]\n`;
  const routableIpConfig = `routable_ip = "${ipAddress}"\n`;

  try {
        // Lecture du contenu actuel du fichier
        let currentContent = '';
        if (existsSync(configFilePath)) {
            currentContent = readFileSync(configFilePath, 'utf-8');
        }

        // Mise à jour du contenu avec la nouvelle configuration
        const updatedContent = currentContent + newConfigContent + routableIpConfig;

        // Écriture du contenu mis à jour dans le fichier
        writeFileSync(configFilePath, updatedContent);     
        console.log(`Le fichier ${configFilePath} a été modifié avec succès.`);
  } catch (error) {
      console.error(`Une erreur est survenue lors de la modification du fichier ${configFilePath}:`, error);
  }
}

export async function startNode(vscode: any) {
  const command = `massa-node -p ${NODE_PWD} |& tee logs.txt`;

  if (!(await isPortOpen(31244) && await isPortOpen(31244))) {
    vscode.window.showErrorMessage("Please allow incoming TCP connections on ports 31244 and 31245. You can see the doc : https://docs.massa.net/docs/node/routability#how-to-make-your-node-routable");
    // return;
  }

  const path = getBinPath(vscode, 'massa-node')
  if (path == "") {
    return;
  }
  
  const address = await getIPAddress();
  const configFilePath = path + '/config/config.toml';
  editConfigFile(address, configFilePath);

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