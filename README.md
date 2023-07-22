# VSCode Serverless Handler Navigation

VSCode Serverless Handler Navigation is a VSCode extension that allows you to navigate directly from your Serverless Framework configuration file to the corresponding handler function in your code.

## Features

- When you press `Ctrl` (or `Cmd` on macOS) and click on a handler specification in your Serverless Framework YAML file, VSCode will open the corresponding JavaScript, TypeScript, or Python file and navigate to the handler function.

## Supported Languages

Currently, this extension supports JavaScript (.js), TypeScript (.ts), and Python (.py) files. If your handler is not written in one of these languages, this extension may not work as expected.

## Usage

Hover over a line in your Serverless YAML file that specifies a handler function (e.g., `handler: src/handlers/myHandler.myFunction`) and press `Ctrl` (or `Cmd` on macOS) and click. VSCode will navigate you directly to `myFunction` in `src/handlers/myHandler.js` (or .ts/.py, depending on your implementation).

## Troubleshooting

- If the extension is not navigating to the expected location, ensure that the path and function name in your Serverless YAML file match exactly with the path and function name in your code file.

- If you see an error message indicating the file does not exist, ensure the file path in your Serverless YAML file is correct.

- If you see an error message indicating the function was not found, ensure the function exists in your code file.

## Future improvements

- Support for additional programming languages.
