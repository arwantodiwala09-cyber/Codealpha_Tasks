export default function TypingIndicator({
  typingUser,
}) {
  if (!typingUser)
    return null;

  return (
    <div className="text-sm text-cyan-400 animate-pulse px-2">
      {typingUser} is typing...
    </div>
  );
}