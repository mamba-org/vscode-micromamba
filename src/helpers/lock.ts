import * as vscode from 'vscode';

const state = {
  runningTaskCount: 0,
};

export const lock = async (action: () => Promise<void>): Promise<void> => {
  if (state.runningTaskCount) {
    vscode.window.showInformationMessage('Another micromamba command is running');
    return;
  }
  state.runningTaskCount++;
  try {
    await action();
    state.runningTaskCount--;
  } catch (err) {
    state.runningTaskCount--;
    vscode.window.showErrorMessage('Failed to run micromamba command');
    throw err;
  }
};
