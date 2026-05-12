function MedModal({
  form,
  setForm,
  onSave,
  onClose,
  mode,
}) {

  /* =========================
        INPUT STYLE
  ========================= */

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    background: "#f9fafb",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  };

  return (

    <div style={styles.overlay}>

      {/* MODAL */}

      <div style={styles.modal}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <h2 style={styles.title}>
              {
                mode === "add"
                  ? "Add Medicine"
                  : "Edit Medicine"
              }
            </h2>

            <p style={styles.subtitle}>
              Pharmacy medicine management
            </p>

          </div>

          <button
            onClick={onClose}
            style={styles.closeBtn}
          >
            ✕
          </button>

        </div>

        {/* FORM */}

        <div style={styles.formGrid}>

          {/* NAME */}

          <div>
            <label style={labelStyle}>
              Medicine Name
            </label>

            <input
              type="text"
              placeholder="Medicine name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label style={labelStyle}>
              Category
            </label>

            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* STOCK */}

          <div>
            <label style={labelStyle}>
              Stock Quantity
            </label>

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({
                  ...form,
                  stock: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* MIN STOCK */}

          <div>
            <label style={labelStyle}>
              Minimum Stock
            </label>

            <input
              type="number"
              value={form.minStock}
              onChange={(e) =>
                setForm({
                  ...form,
                  minStock:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* BUY PRICE */}

          <div>
            <label style={labelStyle}>
              Buy Price
            </label>

            <input
              type="number"
              value={form.buyPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  buyPrice:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* SELL PRICE */}

          <div>
            <label style={labelStyle}>
              Sell Price
            </label>

            <input
              type="number"
              value={form.sellPrice}
              onChange={(e) =>
                setForm({
                  ...form,
                  sellPrice:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* BARCODE */}

          <div>
            <label style={labelStyle}>
              Barcode
            </label>

            <input
              type="text"
              placeholder="Barcode"
              value={form.barcode}
              onChange={(e) =>
                setForm({
                  ...form,
                  barcode:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* SKU */}

          <div>
            <label style={labelStyle}>
              SKU
            </label>

            <input
              type="text"
              placeholder="SKU"
              value={form.sku}
              onChange={(e) =>
                setForm({
                  ...form,
                  sku:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* EXPIRY */}

          <div>
            <label style={labelStyle}>
              Expiry Date
            </label>

            <input
              type="date"
              value={form.expiry}
              onChange={(e) =>
                setForm({
                  ...form,
                  expiry:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* BATCH */}

          <div>
            <label style={labelStyle}>
              Batch Number
            </label>

            <input
              type="text"
              placeholder="Batch"
              value={form.batch}
              onChange={(e) =>
                setForm({
                  ...form,
                  batch:
                    e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* SUPPLIER */}

          <div style={styles.fullWidth}>

            <label style={labelStyle}>
              Supplier
            </label>

            <input
              type="text"
              placeholder="Supplier name"
              value={form.supplier}
              onChange={(e) =>
                setForm({
                  ...form,
                  supplier:
                    e.target.value,
                })
              }
              style={inputStyle}
            />

          </div>

        </div>

        {/* BUTTONS */}

        <div style={styles.buttonGroup}>

          <button
            onClick={onSave}
            style={styles.saveBtn}
          >
            Save Medicine
          </button>

          <button
            onClick={onClose}
            style={styles.cancelBtn}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================
      RESPONSIVE STYLES
========================= */

const styles = {

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 999,
  },

  modal: {
    width: "100%",
    maxWidth: "850px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "28px",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "clamp(24px,4vw,30px)",
    color: "#111827",
    fontWeight: "700",
  },

  subtitle: {
    color: "#6b7280",
    marginTop: "6px",
    fontSize: "14px",
  },

  closeBtn: {
    border: "none",
    background: "#f3f4f6",
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "18px",
    flexShrink: 0,
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "18px",
  },

  fullWidth: {
    gridColumn: "1 / -1",
  },

  buttonGroup: {
    display: "flex",
    gap: "14px",
    marginTop: "30px",
    flexWrap: "wrap",
  },

  saveBtn: {
    flex: 1,
    minWidth: "180px",
    padding: "14px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },

  cancelBtn: {
    flex: 1,
    minWidth: "180px",
    padding: "14px",
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default MedModal;