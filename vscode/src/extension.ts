// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, window, workspace } from 'vscode';
import { LanguageClient } from 'vscode-languageclient/node';
import { SidebarProvider } from './sidebar-provider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(window.registerWebviewViewProvider(SidebarProvider.viewType, sidebarProvider));
}

// This method is called when your extension is deactivated
export function deactivate() {}
