function MedModal({
  form,
  setForm,
  onSave,
  onClose,
  mode,
}) {

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "100%",
          maxWidth: "600px",
          borderRadius: "16px",
          padding: "30px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Title */}
        <h2
          style={{
            marginBottom: "20px",
            color: "#111827",
          }}
        >
          {mode === "add"
            ? "Add Medicine"
            : "Edit Medicine"}
        </h2>

        {/* Form Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "16px",
          }}
        >
          {/* Name */}
          <div>
            <label>
              Medicine Name
            </label>

            <input
              type="text"
              placeholder="Enter medicine name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Category */}
          <div>
            <label>
              Category
            </label>

            <input
              type="text"
              placeholder="Enter category"
              value={
                form.category
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Barcode */}
          <div>
            <label>
              Barcode
            </label>

            <input
              type="text"
              placeholder="Barcode"
              value={
                form.barcode
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  barcode:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* SKU */}
          <div>
            <label>SKU</label>

            <input
              type="text"
              placeholder="SKU"
              value={form.sku}
              onChange={(e) =>
                setForm({
                  ...form,
                  sku:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Stock */}
          <div>
            <label>
              Stock Quantity
            </label>

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Min Stock */}
          <div>
            <label>
              Minimum Stock
            </label>

            <input
              type="number"
              value={
                form.minStock
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  minStock:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Buy Price */}
          <div>
            <label>
              Buy Price
            </label>

            <input
              type="number"
              value={
                form.buyPrice
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  buyPrice:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Sell Price */}
          <div>
            <label>
              Sell Price
            </label>

            <input
              type="number"
              value={
                form.sellPrice
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  sellPrice:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Expiry */}
          <div>
            <label>
              Expiry Date
            </label>

            <input
              type="month"
              value={
                form.expiry
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  expiry:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Batch */}
          <div>
            <label>
              Batch Number
            </label>

            <input
              type="text"
              placeholder="Batch Number"
              value={form.batch}
              onChange={(e) =>
                setForm({
                  ...form,
                  batch:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* Supplier */}
          <div
            style={{
              gridColumn:
                "1 / span 2",
            }}
          >
            <label>
              Supplier
            </label>

            <input
              type="text"
              placeholder="Supplier Name"
              value={
                form.supplier
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  supplier:
                    e.target
                      .value,
                })
              }
              style={inputStyle}
            />
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "25px",
          }}
        >
          <button
            onClick={onSave}
            style={{
              flex: 1,
              background:
                "#16a34a",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Save Medicine
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              background:
                "#e5e7eb",
              color: "#111827",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedModal;