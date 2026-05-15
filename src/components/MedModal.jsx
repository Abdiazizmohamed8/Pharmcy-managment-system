function MedModal({
  form,
  setForm,
  onSave,
  onClose,
  mode,
}) {
  // Input style
  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-green-500";

  // Label style
  const labelClass =
    "block mb-2 text-sm font-semibold text-gray-700";

  // Handle form update
  const handleChange = (
    key,
    value
  ) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4">
      {/* Modal */}
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl
        max-h-[90vh] overflow-y-auto p-5 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {mode === "add"
                ? "Add Medicine"
                : "Edit Medicine"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Pharmacy medicine management
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {/* Medicine Name */}
          <div>
            <label className={labelClass}>
              Medicine Name
            </label>

            <input
              type="text"
              placeholder="Medicine name"
              value={form.name}
              onChange={(e) =>
                handleChange(
                  "name",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>
              Category
            </label>

            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                handleChange(
                  "category",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Stock */}
          <div>
            <label className={labelClass}>
              Stock Quantity
            </label>

            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                handleChange(
                  "stock",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Minimum Stock */}
          <div>
            <label className={labelClass}>
              Minimum Stock
            </label>

            <input
              type="number"
              value={form.minStock}
              onChange={(e) =>
                handleChange(
                  "minStock",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Buy Price */}
          <div>
            <label className={labelClass}>
              Buy Price
            </label>

            <input
              type="number"
              value={form.buyPrice}
              onChange={(e) =>
                handleChange(
                  "buyPrice",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Sell Price */}
          <div>
            <label className={labelClass}>
              Sell Price
            </label>

            <input
              type="number"
              value={form.sellPrice}
              onChange={(e) =>
                handleChange(
                  "sellPrice",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Barcode */}
          <div>
            <label className={labelClass}>
              Barcode
            </label>

            <input
              type="text"
              placeholder="Barcode"
              value={form.barcode}
              onChange={(e) =>
                handleChange(
                  "barcode",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* SKU */}
          <div>
            <label className={labelClass}>
              SKU
            </label>

            <input
              type="text"
              placeholder="SKU"
              value={form.sku}
              onChange={(e) =>
                handleChange(
                  "sku",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Expiry */}
          <div>
            <label className={labelClass}>
              Expiry Date
            </label>

            <input
              type="date"
              value={form.expiry}
              onChange={(e) =>
                handleChange(
                  "expiry",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Batch */}
          <div>
            <label className={labelClass}>
              Batch Number
            </label>

            <input
              type="text"
              placeholder="Batch"
              value={form.batch}
              onChange={(e) =>
                handleChange(
                  "batch",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>

          {/* Supplier */}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>
              Supplier
            </label>

            <input
              type="text"
              placeholder="Supplier name"
              value={form.supplier}
              onChange={(e) =>
                handleChange(
                  "supplier",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition"
          >
            Save Medicine
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedModal;