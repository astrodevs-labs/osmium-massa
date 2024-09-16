import { MessageType } from './enums';
import { Args } from '@massalabs/massa-web3';

type Message = {
  type: MessageType;
  data: any;
};

type ISCData = {
  data: Uint8Array;
  args?: Args;
  coins: bigint;
};

export { Message, ISCData };
