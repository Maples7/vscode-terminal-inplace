import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    'extension.launchTerminalInPlace',
    () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (
        activeTextEditor &&
        activeTextEditor.document &&
        activeTextEditor.document.uri
      ) {
        const focusFilePath = activeTextEditor.document.uri.fsPath;

        if (focusFilePath) {
          const focusDirPath: string = path.dirname(focusFilePath);
          if (fs.existsSync(focusDirPath)) {
            const terminal: vscode.Terminal = vscode.window.createTerminal({
              cwd: focusDirPath
            });
            terminal.show(false);
          } else {
            vscode.window.showWarningMessage(
              `[Terminal In Place] Fail to launch a terminal in ${focusDirPath}`
            );
          }
        }
      } else {
        const terminal: vscode.Terminal = vscode.window.createTerminal();
        terminal.show(false);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
