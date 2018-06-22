// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "terminal-inplace" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.launchTerminalInPlace',
    function() {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      // vscode.window.showInformationMessage('Hello World!');

      let finalPath = vscode.workspace.rootPath;
      const openFiles = vscode.workspace.textDocuments;
      if (openFiles.length > 0) {
        const focusFilePath = openFiles[openFiles.length - 1].fileName;
        finalPath = path.dirname(focusFilePath);
      }
      console.log(finalPath);

      const terminal = vscode.window.createTerminal();
      terminal.show(false);
      terminal.sendText(`cd "${finalPath}"`);
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
