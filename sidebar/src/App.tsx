import { VSCode } from '@/types';
import { MessageType } from '@backend/enums.ts';
import { useEffect, useState } from 'react';

export const App = () => {
  const [vscode, setVscode] = useState<VSCode>();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setVscode(acquireVsCodeApi());
  }, []);

  // useEffect(() => {
  //   const listener = (event: WindowEventMap['message']) => {
  //     switch (event.data.type) {
  //       case MessageType.ERROR: {
  //         console.log('error : ' + event.data.error);
  //         vscode.window.showInformationMessage(event.data.error);
  //         break;
  //       }
  //     }
  //   };
  //   window.addEventListener('message', listener);
  //   return () => window.removeEventListener('message', listener);
  // }, []);

  return (
    <>
      <p>This is the massa pannel</p>
      <button
        style={{ backgroundColor: '#296ed0', color: 'white', padding: '5px', borderRadius: '5px', border: 'none' }}
        onClick={() => {
          console.log('WIP send notification to back');
          vscode.postMessage({
            type: MessageType.START_NODE,
          });
          console.log('notification sent');
        }}
      >
        Start a node
      </button>
    </>
  );
};
