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
        const pythonPath = path.join(projectRoot, 'python', 'kase_builder_full.py');
        const exeFile = filePath.replace(/\.ks$/, '.exe');
        const terminal = vscode.window.createTerminal('Kase Build & Run');

        // 1. ビルド
        terminal.show();
        terminal.sendText(`python "${pythonPath}" "${filePath}"`);
        // 2. 実行（適当なディレイの後や、ユーザーに「実行」指示でもOK）
        terminal.sendText(`"${exeFile}"`);
    });

    context.subscriptions.push(disposable);
}