import React, { useState } from "react";

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
    <form onSubmit={submit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Mission name"
      />
      <button type="submit" disabled={!name.trim()}>
        Create mission
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default NewMissionForm;
