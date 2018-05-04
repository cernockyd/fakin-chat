import Messages from '../Messages';

export function SelectMessage(key, index) {
  return Messages[key][index];
}

export default function GetRandomMessage(key) {
  const MessageArray = Messages[key];
  return MessageArray[Math.floor(Math.random() * MessageArray.length)];
}