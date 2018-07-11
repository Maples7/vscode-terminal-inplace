const os = require('os');
const fs = require('fs');
const path = require('path');
const vscode = require('vscode');

function detectSpecialShells(terminalSettings) {
  if (os.platform() === 'win32') {
    const shellPath = terminalSettings.integrated.shell.windows;
    if (shellPath) {
      // Detect WSL bash according to the implementation of VS Code terminal.
      // For more details, refer to https://goo.gl/AuwULb.
      // And many thanks to
      // https://github.com/Tyriar/vscode-terminal-here/blob/master/src/extension.ts#L49-L70
      const is32ProcessOn64Windows = process.env.hasOwnProperty(
        'PROCESSOR_ARCHITEW6432'
      );
      const system32 = is32ProcessOn64Windows ? 'Sysnative' : 'System32';

      const shellKindsMap = {};
      const pathPrefix = path.join(process.env.windir, system32);
      shellKindsMap[path.join(pathPrefix, 'bash.exe').toLowerCase()] =
        'wsl-terminal';
      shellKindsMap[path.join(pathPrefix, 'cmd.exe').toLowerCase()] = 'cmd';

      return shellKindsMap[shellPath.toLowerCase()];
    }
  }
}

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
        let focusDirPath = path.dirname(focusFilePath);
        if (fs.existsSync(focusDirPath)) {
          // Patch for some special shells on Windows
          switch (
            detectSpecialShells(vscode.workspace.getConfiguration('terminal'))
          ) {
            case 'wsl-terminal':
              // c:\workspace\foo to /mnt/c/workspace/foo
              focusDirPath = focusDirPath
                .replace(/(\w):/, '/mnt/$1')
                .replace('/\\/g', '/');
              break;
            case 'cmd':
              // Send 1st two characters (drive letter and colon) to the terminal
              // so that drive letter is updated before running cd
              terminal.sendText(focusDirPath.slice(0, 2));
              break;
          }

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
