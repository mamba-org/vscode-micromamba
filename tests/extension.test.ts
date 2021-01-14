const extensionName = 'micromamba';
jest.mock('../src/appGlobals', () => ({ extensionName }));

// import * as vscode from 'vscode';
import { deactivate } from '../src/extension';

describe('Extension', () => {
  describe('activate()', () => {
    it('dummy', () => {
      expect(true).toBeTruthy();
    });
  });
  describe('deactivate()', () => {
    it('do nothing', () => {
      deactivate();
      expect(true).toBeTruthy();
    });
  });
});
