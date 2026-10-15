import React, { useState } from "react";
import {
  X,
  ChartNoAxesColumn,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import "../styles/CreatePollModal.css";

function CreatePollModal({ onClose, onCreate }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    setOptions((prev) =>
      prev.map((option, i) => (i === index ? value : option))
    );
    setError("");
  };

  const addOption = () => {
    if (options.length >= 10) {
      setError("You can add a maximum of 10 options.");
      return;
    }

    setOptions((prev) => [...prev, ""]);
    setError("");
  };

  const removeOption = (index) => {
    if (options.length <= 2) return;

    setOptions((prev) => prev.filter((_, i) => i !== index));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedQuestion = question.trim();
    const filteredOptions = options
      .map((option) => option.trim())
      .filter(Boolean);

    if (!trimmedQuestion) {
      setError("Please enter a poll question.");
      return;
    }

    if (filteredOptions.length < 2) {
      setError("Add at least 2 non-empty options.");
      return;
    }

    if (new Set(filteredOptions.map((option) => option.toLowerCase())).size !== filteredOptions.length) {
      setError("Each option must be unique.");
      return;
    }

    setSubmitting(true);

    try {
      await onCreate({
        question: trimmedQuestion,
        options: filteredOptions.map((option) => ({
          option,
          votes: [],
        })),
      });

      onClose();
    } catch (err) {
      setError(err?.message || "Failed to create poll. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="poll-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <section
        className="poll-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="poll-modal-title"
      >
        <button
          type="button"
          className="poll-close-btn"
          onClick={onClose}
          disabled={submitting}
          aria-label="Close poll dialog"
        >
          <X size={19} />
        </button>

        <div className="poll-heading">
          <div className="poll-heading-icon">
            <ChartNoAxesColumn size={25} />
            <span className="poll-heading-sparkle">
              <Sparkles size={12} />
            </span>
          </div>

          <span className="poll-eyebrow">LET EVERYONE HAVE A SAY</span>
          <h2 id="poll-modal-title" className="poll-modal-title">
            Create a poll
          </h2>
          <p className="poll-subtitle">
            Ask your room a question and collect everyone's votes.
          </p>
        </div>

        {error && (
          <div className="poll-error" role="alert">
            <span className="poll-error-mark">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="poll-form">
          <div className="poll-field-heading">
            <label htmlFor="poll-question" className="poll-label">
              Your question
            </label>
            <span className="poll-character-count">
              {question.length}/200
            </span>
          </div>

          <textarea
            id="poll-question"
            placeholder="What should we decide together?"
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              setError("");
            }}
            className="poll-input question-input"
            maxLength={200}
            rows={3}
            required
            disabled={submitting}
          />

          <div className="poll-options-heading">
            <div>
              <label className="poll-label">Answer options</label>
              <p>At least 2 options are required.</p>
            </div>
            <span className="poll-option-count">
              {options.length}/10
            </span>
          </div>

          <div className="poll-options-container">
            {options.map((option, index) => (
              <div key={index} className="poll-option-row">
                <span className="poll-option-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                  className="poll-input option-input"
                  maxLength={100}
                  required
                  disabled={submitting}
                  aria-label={`Poll option ${index + 1}`}
                />

                {options.length > 2 && (
                  <button
                    type="button"
                    className="remove-option-btn"
                    onClick={() => removeOption(index)}
                    title="Remove option"
                    aria-label={`Remove option ${index + 1}`}
                    disabled={submitting}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="add-option-btn"
            onClick={addOption}
            disabled={options.length >= 10 || submitting}
          >
            <Plus size={17} />
            Add another option
          </button>

          <div className="poll-actions">
            <button
              type="button"
              className="poll-cancel-btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="poll-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="poll-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  Create poll
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreatePollModal;