// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { parseCode } = require('./utils');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "autocode-docs" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('autocode-docs.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders) {
			const folderPath = workspaceFolders[0].uri.fsPath;
			generateDocumentation(folderPath);
		} else {
			vscode.window.showErrorMessage('No workspace folder found');
		}
	});

	context.subscriptions.push(disposable);
}

function generateDocumentation(folderPath) {
	const readmePath = path.join(folderPath, 'README.md');
	let documentation = '# Project Documentation\n\n';

	fs.readdir(folderPath, (err, files) => {
		if (err) {
			vscode.window.showErrorMessage('Error reading directory');
			return;
		}

		files.forEach(file => {
			const filePath = path.join(folderPath, file);
			if (fs.lstatSync(filePath).isFile() && file.endsWith('.js')) {
				const content = fs.readFileSync(filePath, 'utf-8');
				documentation += `## ${file}\n\n`;
				documentation += parseCode(content);
			}
		});

		fs.writeFileSync(readmePath, documentation);
		vscode.window.showInformationMessage('Documentation generated in README.md');
	});
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
