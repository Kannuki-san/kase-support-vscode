import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('kase.buildAndRun', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor.');
            return;
        }
        const filePath = editor.document.fileName;
        if (!filePath.endsWith('.ks')) {
            vscode.window.showErrorMessage('Not a .ks file.');
            return;
        }

        const projectRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath ?? '';
        const pythonPath = path.join(projectRoot, 'python', 'kase_build_full.py');
        const basename = path.parse(filePath).name;
        const outDir = path.join(projectRoot, 'out');
        const exeFile = path.join(projectRoot, 'out', basename, `${basename}.exe`);
        const terminal = vscode.window.createTerminal('Kase Build & Run');

        terminal.show();
        // 1. ビルド（成果物は out/ ディレクトリへ）
        terminal.sendText(`python "${pythonPath}" "${filePath}"`);
        // 2. 実行（ビルド後にout/のexeを実行）
        terminal.sendText(`"${exeFile}"`);
    });

    context.subscriptions.push(disposable);
}
