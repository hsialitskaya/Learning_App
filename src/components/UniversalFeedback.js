import FeedbackFeature from "../feedback/FeedbackFeature";
const FeedbackSection = ({
  entity,
  feedbackKey,
  onFeedbackSubmit,
  navigate,
  entityType,
}) => {
  return (
    <div className="container">
      <h2 className="title">
        {entityType === "instructor" ? (
          <div>
            Opinie o prowadzącym: <div>{entity.imie}</div>
          </div>
        ) : (
          <div>
            Opinie dla kursu: <div>{entity.nazwa}</div>
          </div>
        )}
      </h2>

      {entity[feedbackKey] && entity[feedbackKey].length > 0 ? (
        <>
          <ul>
            {entity[feedbackKey].map((fb, index) => (
              <li key={index}>
                <strong>{fb.anonymous ? "Anonim" : fb.userName}</strong>:{" "}
                {fb.comment} (Ocena: {fb.rating}/5)
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>
          Brak opinii o {entityType === "instructor" ? "prowadzącym" : "kursie"}
          .
        </p>
      )}
      <FeedbackFeature
        courseId={entity.id}
        onFeedbackSubmit={onFeedbackSubmit}
        isForInstructor={entityType === "instructor"}
      />

      <button onClick={() => navigate("/courses-search")} className="btn">
        Wróć do kursów
      </button>
    </div>
  );
};

export default FeedbackSection;
