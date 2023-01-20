import { ipcMain } from "electron";
import { IPC_HANDLERS, IPC_FUNCTIONS } from "./constants";
const fileSystemUtility = require("./FileSystemUtility");

ipcMain.handle(IPC_HANDLERS.FILE_SYSTEM, async (event, args) => {
  switch (args.func) {
    case IPC_FUNCTIONS.PRINT_PDF:
      return fileSystemUtility.printPDF(args.data);
    default:
      return null;
  }
});
