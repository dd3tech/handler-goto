import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({ scheme: 'file', language: 'yaml' }, {
        provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
            const line = document.lineAt(position.line);
            const text = line.text;
            const match = text.match(/handler: (.*)\.(.*)/);
            if (match) {
                const handlerFunction = match[2];
                const fileTypes = ['js', 'ts', 'py'];
                for (let fileType of fileTypes) {
                    const filePath = path.join(vscode.workspace.rootPath || '', `${match[1]}.${fileType}`);
                    if (fs.existsSync(filePath)) {
                        return vscode.workspace.openTextDocument(filePath).then(doc => {
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
                                return [];
                            }
                        });
                    }
                }
                vscode.window.showErrorMessage(`File for handler ${handlerFunction} does not exist.`);
            }
            return [];
        }
    }));
}
