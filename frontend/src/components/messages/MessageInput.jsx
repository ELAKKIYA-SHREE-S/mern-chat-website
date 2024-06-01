import { useState, useEffect, useRef } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import Picker from "emoji-picker-react"; // Import the emoji picker

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // Ref for the emoji picker component

  const { loading, sendMessage } = useSendMessage();

  const handleEmojiClick = (emojiObject) => {
    setMessage(message + emojiObject.emoji);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");
  };

  const handleDocumentClick = (e) => {
    // Check if the click target is outside of the emoji picker
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
      setShowEmojiPicker(false); // Close the emoji picker
    }
  };

  useEffect(() => {
    // Add click event listener to the document when the emoji picker is open
    if (showEmojiPicker) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick); // Remove listener when closed
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick); // Cleanup on unmount
    };
  }, [showEmojiPicker]); // Dependency to reattach listener when emoji picker state changes

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative flex items-center gap-2" ref={emojiPickerRef}>
        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😃
        </button>
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white rounded-lg px-3 py-2 flex items-center">
          {loading ? <div className="loading loading-spinner"></div> : <BsSend />}
          <span className="ml-2">Send</span>
        </button>
        <div className="absolute bottom-full left-0 mb-1">
          {showEmojiPicker && (
            <Picker
              onEmojiClick={handleEmojiClick}
              disableSearchBar
              disableSkinTonePicker
            />
          )}
        </div>
      </div>
    </form>
  );
};

export default MessageInput;