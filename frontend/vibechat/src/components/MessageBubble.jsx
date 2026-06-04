export default function MessageBubble({ message }) {
  return (
    <div className="mb-2">
      {message.content}
    </div>
  );
}