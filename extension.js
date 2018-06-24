const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'extension.launchTerminalInPlace',
    function() {
      const terminal = vscode.window.createTerminal();
      terminal.show(false);

      const activeTextEditor = vscode.window.activeTextEditor;
      let focusFilePath = null;
      if (activeTextEditor) {
        if (activeTextEditor.document) {
          if (activeTextEditor.document.uri) {
            focusFilePath = activeTextEditor.document.uri.fsPath;
          }
        }
      }
      if (focusFilePath) {
        const focusDirPath = path.dirname(focusFilePath);
        if (fs.existsSync(focusDirPath)) {
          terminal.sendText(`cd "${focusDirPath}"`);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
