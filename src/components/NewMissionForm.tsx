import React, { useState } from "react";

import "./NewMissionForm.css";

interface NewMissionFormProps {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

const NewMissionForm: React.FC<NewMissionFormProps> = ({
  onCreate,
  onCancel,
}) => {
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name);
    setName("");
  };

  return (
    <form className="new-mission-form" onSubmit={submit}>
      <input
        className="new-mission-input"
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Mission name"
      />
      <div className="new-mission-actions">
        <button
          type="button"
          className="form-btn form-btn--secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="form-btn form-btn--primary"
          disabled={!name.trim()}
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default NewMissionForm;
