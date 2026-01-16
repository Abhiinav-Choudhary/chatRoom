import React, { useState } from "react";
import "../styles/CreatePollModal.css";

function CreatePollModal({ onClose, onCreate }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!question.trim()) return alert("Question required");

    const filteredOptions = options
      .map(o => o.trim())
      .filter(Boolean);

    if (filteredOptions.length < 2) {
      return alert("At least 2 options required");
    }

    onCreate({
      question,
      options: filteredOptions.map(o => ({
        option: o,
        votes: []
      }))
    });

    onClose();
  };

  return (
    <div className="poll-overlay">
      <div className="poll-modal">
        <h3 className="poll-modal-title">Create Poll</h3>

        <input
          placeholder="Poll question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          className="poll-input question-input"
        />

        <div className="poll-options-container">
          {options.map((opt, i) => (
            <div key={i} className="poll-option-row">
              <input
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => handleOptionChange(i, e.target.value)}
                className="poll-input option-input"
              />
              {options.length > 2 && (
                <button 
                  className="remove-option-btn"
                  onClick={() => removeOption(i)}
                  title="Remove option"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>

        <button className="add-option-btn" onClick={addOption}>
          ➕ Add Option
        </button>

        <div className="poll-actions">
          <button className="poll-submit-btn" onClick={handleSubmit}>
            Create
          </button>
          <button className="poll-cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePollModal;