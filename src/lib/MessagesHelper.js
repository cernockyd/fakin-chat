import Messages from '../Messages';

export function SelectMessage(key, index) {
  return Messages[key][index];
}

export default function GetRandomMessage(key) {
  const MessageArray = Messages[key];
  return MessageArray[Math.floor(Math.random() * MessageArray.length)];
}

export function GetMessageByName(key, name) {
  return Messages[key][name];
}

export function GetRandomAnswer(key, option) {
  const MessageArray = Messages[key]['answers'][option];
  return MessageArray[Math.floor(Math.random() * MessageArray.length)];
}

export function GetRandomQuestion(key) {
  const MessageArray = Messages[key]['questions'];
  return MessageArray[Math.floor(Math.random() * MessageArray.length)];
}
