export default function formatConversationToString(conversationArray) {
  const formattedTurns = conversationArray.map(turn => 
    `user: ${turn.user}\nassistant: ${turn.assistant}`
  );

  return formattedTurns.join('\n');
}