import * as vscode from 'vscode';
import * as fs from 'fs';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, {
        async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
            const line = document.lineAt(position.line);
            const text = line.text;
            const match = text.match(/handler: (.*)\.(.*)/);
            if (!match) return []
        
            const [, handlerPath, handlerFunction] = match;
            const fileTypes = ['js', 'ts', 'py'].join(',');

            let resultFile: vscode.Uri;
            if (os.platform() === "win32") {
              [resultFile] = await vscode.workspace.findFiles(`**\\${handlerPath}.{${fileTypes}}`,"**\\node_modules\\**", 1);
            } else {
              [resultFile] = await vscode.workspace.findFiles(`**/${handlerPath}.{${fileTypes}}`,"**/node_modules/**", 1);
            }  
            if(!resultFile || !fs.existsSync(resultFile.path)) {
                vscode.window.showErrorMessage(`File for handler ${handlerFunction} does not exist.`)
                return []
            }

            const filePath = resultFile.path
            const doc = await vscode.workspace.openTextDocument(filePath)

            const foundRanges = doc.getText().split('\n').reduce((acc, line, i) => {
                const functionPattern = `${handlerFunction}`;
                if (line.includes(functionPattern)) {
                    acc.push(new vscode.Range(i, 0, i, line.length));
                }
                return acc;
            }, [] as vscode.Range[]);

            if (foundRanges.length > 0) {
                return new vscode.Location(vscode.Uri.file(filePath), foundRanges[0]);
            } else {
                vscode.window.showErrorMessage(`Function ${handlerFunction} was not found in ${filePath}.`);
            }
            return [];
        }
    }));
}
