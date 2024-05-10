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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100px',
        height: '100px',
      }}
    >
      <button
        style={{ backgroundColor: '#296ed0', color: 'white', padding: '5px', borderRadius: '2px', border: 'none' }}
        onClick={() => {
          vscode.postMessage({
            type: MessageType.START_NODE,
          });
        }}
      >
        Start a node
      </button>
      <button
        style={{
          backgroundColor: '#296ed0',
          color: 'white',
          padding: '5px',
          borderRadius: '2px',
          border: 'none',
          marginTop: '10px',
        }}
        onClick={() => {
          vscode.postMessage({
            type: MessageType.KILL_NODE,
          });
        }}
      >
        Kill nodes
      </button>
    </div>
  );
};
