const CardTable = ({ cards, cardType, handleEdit }) => (
  <div className="manage_card_table_container">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          {cardType === "assessment" ? <th>Category</th> : null}
          <th>Icon</th>
          <th>Operation</th>
        </tr>
      </thead>
      <tbody>
        {cards.map((card) => (
          <tr key={card.card_id}>
            <td>{card.card_id}</td>
            <td>{card.card_name}</td>
            {cardType === "assessment" ? <td>{card.card_category}</td> : null}
            <td>
              <img
                className="card_icon"
                src={card.card_icon}
                alt={`${cardType} card icon`}
              />
            </td>
            <td>
              <button
                onClick={() => handleEdit(card)}
                className="button-26"
                role="button"
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CardTable;
