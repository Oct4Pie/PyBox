export const keyMap = {
    RUN_CODE: 'ctrl+r, cmd+r',
    NEW_FILE: 'ctrl+n, cmd+n',
    TOGGLE_BOTTOM_PANEL: 'ctrl+b, cmd+b',
    SAVE_FILE: 'ctrl+s, cmd+s',
    OPEN_PACKAGE_MANAGER: 'ctrl+shift+p, cmd+shift+p',
  };
  
  export const createHandlers = (
    handleRunCode: () => void,
    handleAddNewFile: () => void,
    toggleBottomPanel: () => void,
    handleManualSave: () => void,
    onOpen: () => void
  ) => ({
    RUN_CODE: (event?: KeyboardEvent) => {
      if (event) event.preventDefault();
      handleRunCode();
    },
    NEW_FILE: (event?: KeyboardEvent) => {
      if (event) event.preventDefault();
      handleAddNewFile();
    },
    TOGGLE_BOTTOM_PANEL: (event?: KeyboardEvent) => {
      if (event) event.preventDefault();
      toggleBottomPanel();
    },
    SAVE_FILE: (event?: KeyboardEvent) => {
      if (event) event.preventDefault();
      handleManualSave();
    },
    OPEN_PACKAGE_MANAGER: (event?: KeyboardEvent) => {
      if (event) event.preventDefault();
      onOpen();
    },
  });
  