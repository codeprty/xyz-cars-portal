const CarForm = ({ car, setCar, onSubmit, onCancel, submitLabel }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label>Make:</label>
        <input
          type="text"
          value={car.make}
          onChange={(e) => setCar({ ...car, make: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Model:</label>
        <input
          type="text"
          value={car.model}
          onChange={(e) => setCar({ ...car, model: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Registration:</label>
        <input
          type="text"
          value={car.registration}
          onChange={(e) => setCar({ ...car, registration: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          value={car.price}
          onChange={(e) => setCar({ ...car, price: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">{submitLabel || "Save"}</button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CarForm;
