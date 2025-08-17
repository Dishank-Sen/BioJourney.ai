export default function formatConversationForLLM(conversationArray) {
  return conversationArray
    .map(turn => {
      // Use the '??' operator to default null/undefined values to an empty string
      const userMessage = turn.user ?? '[No user message]';
      const assistantMessage = turn.assistant ?? '[No assistant message]';
      
      return `User: ${userMessage}\nAssistant: ${assistantMessage}`;
    })
    .join('\n');
}