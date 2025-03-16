import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DiscussionFeature = ({
  user,
  discussions,
  onSelectDiscussion,
  onAddDiscussion,
  onDeleteDiscussion,
}) => {
  const navigate = useNavigate();
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");

  const handleAddDiscussion = () => {
    if (newDiscussionTitle.trim()) {
      onAddDiscussion(newDiscussionTitle);
      setNewDiscussionTitle("");
    }
  };

  const main = () => {
    navigate("/main");
  };

  return (
    <div className="container">
      <h2 className="title">Forum Dyskusyjne</h2>{" "}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <form className="form form-container" style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Nowa dyskusja..."
            value={newDiscussionTitle}
            onChange={(e) => setNewDiscussionTitle(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              fontSize: "16px",
            }}
          />
        </form>
        <button
          onClick={handleAddDiscussion}
          className="btn btn-course"
          style={{
            flex: 1,
          }}
        >
          Dodaj dyskusję
        </button>
      </div>
      <h3 className="subtitle">Lista dyskusji:</h3>
      <ul>
        {discussions.map((discussion) => (
          <li key={discussion.id}>
            <button
              onClick={() => onSelectDiscussion(discussion)}
              className="btn"
            >
              {discussion.title}
            </button>
            {discussion.createdBy === user.username && (
              <button
                onClick={() => onDeleteDiscussion(discussion.id)}
                className="btn btn-course"
                style={{ backgroundColor: " #e74c3c", width: "200px" }}
              >
                Usuń dyskusję
              </button>
            )}
          </li>
        ))}
      </ul>
      <button onClick={main} className="btn">
        Wróć do strony głównej
      </button>
    </div>
  );
};

export default DiscussionFeature;
