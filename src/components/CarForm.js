// This component provides a reusable form for creating or editing a car.
// It includes input fields for car details (make, model, registration, price, description).
// The form is controlled using props (car, setCar, onSubmit, onCancel, submitLabel).

const CarForm = ({ car, setCar, onSubmit, onCancel, submitLabel }) => {
  return (
    // Form wrapper with onSubmit handler passed from parent component
    <form onSubmit={onSubmit}>
      {/* Car Make field */}
      <div className="form-group">
        <label>Make:</label>
        <input
          type="text"
          value={car.make}
          onChange={(e) => setCar({ ...car, make: e.target.value })}
          required
        />
      </div>

      {/* Car Model field */}
      <div className="form-group">
        <label>Model:</label>
        <input
          type="text"
          value={car.model}
          onChange={(e) => setCar({ ...car, model: e.target.value })}
          required
        />
      </div>

      {/* Car Registration field */}
      <div className="form-group">
        <label>Registration:</label>
        <input
          type="text"
          value={car.registration}
          onChange={(e) => setCar({ ...car, registration: e.target.value })}
          required
        />
      </div>

      {/* Car Price field */}
      <div className="form-group">
        <label>Price:</label>
        <input
          type="number"
          value={car.price}
          onChange={(e) => setCar({ ...car, price: e.target.value })}
          required
        />
      </div>

      {/* Car Description field */}
      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={car.description}
          onChange={(e) => setCar({ ...car, description: e.target.value })}
          required
        />
      </div>

      {/* Form action buttons (Submit and optional Cancel) */}
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
