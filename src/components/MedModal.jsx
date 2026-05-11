function MedModal({
  form,
  setForm,
  onSave,
  onClose,
  mode,
}) {

  const inputStyle = {
    width: "100%",

    padding: "14px",

    borderRadius: "14px",

    border:
      "1px solid #d1d5db",

    outline: "none",

    fontSize: "14px",

    background:
      "#f9fafb",
  };

  const labelStyle = {
    display: "block",

    marginBottom: "8px",

    fontSize: "14px",

    fontWeight: "600",

    color: "#374151",
  };

  return (
    <div
      style={{
        position: "fixed",

        inset: 0,

        background:
          "rgba(0,0,0,0.55)",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        zIndex: 999,

        padding: "20px",
      }}
    >

      {/* MODAL */}

      <div
        style={{
          width: "100%",

          maxWidth: "850px",

          background:
            "#fff",

          borderRadius:
            "24px",

          padding: "30px",

          maxHeight:
            "90vh",

          overflowY:
            "auto",

          boxShadow:
            "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              "28px",
          }}
        >

          <div>

            <h2
              style={{
                margin: 0,

                fontSize:
                  "28px",

                color:
                  "#111827",
              }}
            >
              {mode ===
              "add"
                ? "Add Medicine"
                : "Edit Medicine"}
            </h2>

            <p
              style={{
                color:
                  "#6b7280",

                marginTop:
                  "6px",
              }}
            >
              Pharmacy medicine
              management
            </p>
          </div>

          <button
            onClick={
              onClose
            }

            style={{
              border: "none",

              background:
                "#f3f4f6",

              width: "42px",

              height:
                "42px",

              borderRadius:
                "12px",

              cursor:
                "pointer",

              fontSize:
                "18px",
            }}
          >
            ✕
          </button>
        </div>

        {/* FORM */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(240px,1fr))",

            gap: "18px",
          }}
        >

          {/* NAME */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Medicine Name
            </label>

            <input
              type="text"

              placeholder="Medicine name"

              value={
                form.name
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  name:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* CATEGORY */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Category
            </label>

            <input
              type="text"

              placeholder="Category"

              value={
                form.category
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  category:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* STOCK */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Stock Quantity
            </label>

            <input
              type="number"

              value={
                form.stock
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  stock:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* MIN STOCK */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Minimum Stock
            </label>

            <input
              type="number"

              value={
                form.minStock
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  minStock:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* BUY PRICE */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Buy Price
            </label>

            <input
              type="number"

              value={
                form.buyPrice
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  buyPrice:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* SELL PRICE */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Sell Price
            </label>

            <input
              type="number"

              value={
                form.sellPrice
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  sellPrice:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* BARCODE */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Barcode
            </label>

            <input
              type="text"

              placeholder="Barcode"

              value={
                form.barcode
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  barcode:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* SKU */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              SKU
            </label>

            <input
              type="text"

              placeholder="SKU"

              value={
                form.sku
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  sku:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* EXPIRY */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Expiry Date
            </label>

            <input
              type="date"

              value={
                form.expiry
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  expiry:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* BATCH */}

          <div>
            <label
              style={
                labelStyle
              }
            >
              Batch Number
            </label>

            <input
              type="text"

              placeholder="Batch"

              value={
                form.batch
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  batch:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>

          {/* SUPPLIER */}

          <div
            style={{
              gridColumn:
                "1 / -1",
            }}
          >
            <label
              style={
                labelStyle
              }
            >
              Supplier
            </label>

            <input
              type="text"

              placeholder="Supplier name"

              value={
                form.supplier
              }

              onChange={(
                e
              ) =>
                setForm({
                  ...form,

                  supplier:
                    e.target
                      .value,
                })
              }

              style={
                inputStyle
              }
            />
          </div>
        </div>

        {/* BUTTONS */}

        <div
          style={{
            display: "flex",

            gap: "14px",

            marginTop:
              "30px",

            flexWrap:
              "wrap",
          }}
        >

          <button
            onClick={
              onSave
            }

            style={{
              flex: 1,

              minWidth:
                "180px",

              padding:
                "14px",

              background:
                "#16a34a",

              color: "#fff",

              border: "none",

              borderRadius:
                "14px",

              fontWeight:
                "bold",

              fontSize:
                "15px",

              cursor:
                "pointer",
            }}
          >
            Save Medicine
          </button>

          <button
            onClick={
              onClose
            }

            style={{
              flex: 1,

              minWidth:
                "180px",

              padding:
                "14px",

              background:
                "#e5e7eb",

              color:
                "#111827",

              border: "none",

              borderRadius:
                "14px",

              fontWeight:
                "bold",

              fontSize:
                "15px",

              cursor:
                "pointer",
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