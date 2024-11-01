const CardDecks = ({
  onCardClick,
  whoIsAssessed,
  theAssessor,
  assessmentArtefact,
  assessmentFormat,
  context,
  assessmentTiming,
}) => {
  return (
    <div className="cardDecks">
      <div>
        <div
          className={`cardDeck who is assessed ${whoIsAssessed.length == 0 ? "DISABLED" : ""}`}
          onClick={() => onCardClick(whoIsAssessed)}
        >
          <img
            className="card_icon"
            src={`http://localhost:5353/uploads/icon-assessed.png`}
            alt="assessed icon"
          />
        </div>
        <span className="cardDeckCategoryText">
          <span>Assessed</span>
          <span className="categoryDotLength">({whoIsAssessed.length})</span>
        </span>
      </div>

      <div>
        <div
          className={`cardDeck the assessor ${theAssessor.length == 0 ? "DISABLED" : ""}`}
          onClick={() => onCardClick(theAssessor)}
        >
          <img
            className="card_icon"
            src={`http://localhost:5353/uploads/icon-assessor.png`}
            alt="assessor icon"
          />
        </div>
        <span className="cardDeckCategoryText">
          <span>Assessor</span>
          <span className="categoryDotLength">({theAssessor.length})</span>
        </span>
      </div>

      <div>
        <div
          className={`cardDeck assessment artefact ${assessmentArtefact.length == 0 ? "DISABLED" : ""}`}
          onClick={() => onCardClick(assessmentArtefact)}
        >
          <img
            className="card_icon"
            src={`http://localhost:5353/uploads/icon-artefact.png`}
            alt="artefact icon"
          />
        </div>
        <span className="cardDeckCategoryText">
          <span>Format</span>
          <span className="categoryDotLength">
            ({assessmentArtefact.length})
          </span>
        </span>
      </div>

      <div>
        <div
          className={`cardDeck assessment format ${assessmentFormat.length == 0 ? "DISABLED" : ""}`}
          onClick={() => onCardClick(assessmentFormat)}
        >
          <img
            className="card_icon"
            src={`http://localhost:5353/uploads/icon-format.png`}
            alt="format icon"
          />
        </div>
        <span className="cardDeckCategoryText">
          <span>Format</span>
          <span className="categoryDotLength">({assessmentFormat.length})</span>
        </span>
      </div>

      <div>
        <div
          className={`cardDeck context ${context.length == 0 ? "DISABLED" : ""}`}
          onClick={() => onCardClick(context)}
        >
          <img
            className="card_icon"
            src={`http://localhost:5353/uploads/icon-context.png`}
            alt="context icon"
          />
        </div>
        <span className="cardDeckCategoryText">
          <span>Context</span>
          <span className="categoryDotLength">({context.length})</span>
        </span>
      </div>

      <div>
        <div
          className={`cardDeck assessment timing ${assessmentTiming.length == 0 ? "DISABLED" : ""}`}
          onClick={() => onCardClick(assessmentTiming)}
        >
          <img
            className="card_icon"
            src={`http://localhost:5353/uploads/icon-timing.png`}
            alt="timing icon"
          />
        </div>
        <span className="cardDeckCategoryText">
          <span>Timing</span>
          <span className="categoryDotLength">({assessmentTiming.length})</span>
        </span>
      </div>
    </div>
  );
};

export default CardDecks;
