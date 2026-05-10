import { useState } from "react";

function Medicines({
  medicines,
  setMedicines,
}) {

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [sortStock, setSortStock] =
    useState("default");

  const [showModal, setShowModal] =
    useState(false);

  const [editingMedicine, setEditingMedicine] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      category: "",
      stock: "",
      minStock: "",
      buyPrice: "",
      sellPrice: "",
      expiryDate: "",
      supplier: "",
    });

  /* FILTERED */
  let filteredMedicines =
    medicines.filter((medicine) => {

      const matchesSearch =
        medicine.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        categoryFilter === "All"
          ? true
          : medicine.category ===
            categoryFilter;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  /* SORT */
  if (sortStock === "low") {

    filteredMedicines.sort(
      (a, b) =>
        a.stock - b.stock
    );
  }

  if (sortStock === "high") {

    filteredMedicines.sort(
      (a, b) =>
        b.stock - a.stock
    );
  }

  /* UNIQUE CATEGORIES */
  const categories = [
    "All",

    ...new Set(
      medicines.map(
        (medicine) =>
          medicine.category
      )
    ),
  ];

  /* ADD / EDIT */
  const saveMedicine = () => {

    if (
      !formData.name ||
      !formData.category ||
      !formData.stock ||
      !formData.buyPrice ||
      !formData.sellPrice
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    const medicineData = {
      id:
        editingMedicine?.id ||
        Date.now(),

      name: formData.name,

      category:
        formData.category,

      stock: Number(
        formData.stock
      ),

      minStock: Number(
        formData.minStock
      ),

      buyPrice: Number(
        formData.buyPrice
      ),

      sellPrice: Number(
        formData.sellPrice
      ),

      expiryDate:
        formData.expiryDate,

      supplier:
        formData.supplier,
    };

    if (editingMedicine) {

      setMedicines(
        medicines.map(
          (medicine) =>

            medicine.id ===
            editingMedicine.id

              ? medicineData

              : medicine
        )
      );

    } else {

      setMedicines([
        ...medicines,
        medicineData,
      ]);
    }

    resetForm();
  };

  /* RESET */
  const resetForm = () => {

    setFormData({
      name: "",
      category: "",
      stock: "",
      minStock: "",
      buyPrice: "",
      sellPrice: "",
      expiryDate: "",
      supplier: "",
    });

    setEditingMedicine(null);

    setShowModal(false);
  };

  /* EDIT */
  const editMedicine = (
    medicine
  ) => {

    setEditingMedicine(
      medicine
    );

    setFormData({
      name: medicine.name,

      category:
        medicine.category,

      stock:
        medicine.stock,

      minStock:
        medicine.minStock,

      buyPrice:
        medicine.buyPrice,

      sellPrice:
        medicine.sellPrice,

      expiryDate:
        medicine.expiryDate,

      supplier:
        medicine.supplier,
    });

    setShowModal(true);
  };

  /* DELETE */
  const deleteMedicine = (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this medicine?"
      );

    if (!confirmDelete) return;

    setMedicines(
      medicines.filter(
        (medicine) =>
          medicine.id !== id
      )
    );
  };

  /* EXPIRY WARNING */
  const isExpiringSoon = (
    date
  ) => {

    if (!date) return false;

    const today =
      new Date();

    const expiry =
      new Date(date);

    const diff =
      expiry - today;

    const days =
      diff /
      (1000 *
        60 *
        60 *
        24);

    return days <= 30;
  };

  return (
    <div>

      {/* HEADER */}
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom:
            "30px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              fontSize: "46px",
            }}
          >
            Medicines 💊
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "8px",
            }}
          >
            Pharmacy inventory
            management
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          style={{
            background:
              "#16a34a",

            color: "#fff",

            border: "none",

            padding:
              "16px 28px",

            borderRadius:
              "14px",

            fontWeight:
              "bold",

            fontSize:
              "17px",

            cursor:
              "pointer",
          }}
        >
          + Add Medicine
        </button>
      </div>

      {/* FILTERS */}
      <div
        style={{
          display: "flex",

          gap: "16px",

          marginBottom:
            "24px",

          flexWrap: "wrap",
        }}
      >

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          style={{
            flex: 1,

            minWidth:
              "240px",

            padding:
              "16px",

            borderRadius:
              "14px",

            border:
              "1px solid #d1d5db",

            fontSize:
              "16px",
          }}
        />

        {/* CATEGORY */}
        <select
          value={
            categoryFilter
          }
          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }
          style={select}
        >

          {categories.map(
            (category) => (

              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            )
          )}
        </select>

        {/* SORT */}
        <select
          value={sortStock}
          onChange={(e) =>
            setSortStock(
              e.target.value
            )
          }
          style={select}
        >

          <option value="default">
            Sort Stock
          </option>

          <option value="low">
            Low Stock
          </option>

          <option value="high">
            High Stock
          </option>
        </select>
      </div>

      {/* TABLE */}
      <div
        style={{
          background:
            "#fff",

          borderRadius:
            "24px",

          overflow:
            "hidden",

          boxShadow:
            "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",
          }}
        >

          <thead
            style={{
              background:
                "#f9fafb",
            }}
          >

            <tr>

              <th style={th}>
                Medicine
              </th>

              <th style={th}>
                Category
              </th>

              <th style={th}>
                Stock
              </th>

              <th style={th}>
                Buy
              </th>

              <th style={th}>
                Sell
              </th>

              <th style={th}>
                Profit
              </th>

              <th style={th}>
                Expiry
              </th>

              <th style={th}>
                Supplier
              </th>

              <th style={th}>
                Status
              </th>

              <th style={th}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {filteredMedicines.length ===
            0 ? (

              <tr>

                <td
                  colSpan="10"
                  style={{
                    padding:
                      "40px",

                    textAlign:
                      "center",

                    color:
                      "#9ca3af",
                  }}
                >
                  No medicines found
                </td>
              </tr>

            ) : (

              filteredMedicines.map(
                (medicine) => {

                  const profit =
                    (
                      medicine.sellPrice -
                      medicine.buyPrice
                    ).toFixed(2);

                  const lowStock =
                    medicine.stock <=
                    medicine.minStock;

                  const expiring =
                    isExpiringSoon(
                      medicine.expiryDate
                    );

                  return (
                    <tr
                      key={
                        medicine.id
                      }
                      style={{
                        borderBottom:
                          "1px solid #f3f4f6",
                      }}
                    >

                      {/* NAME */}
                      <td
                        style={{
                          ...td,

                          fontWeight:
                            "bold",
                        }}
                      >
                        {
                          medicine.name
                        }
                      </td>

                      {/* CATEGORY */}
                      <td style={td}>

                        <span
                          style={{
                            background:
                              "#dcfce7",

                            color:
                              "#16a34a",

                            padding:
                              "8px 14px",

                            borderRadius:
                              "999px",

                            fontWeight:
                              "bold",
                          }}
                        >
                          {
                            medicine.category
                          }
                        </span>
                      </td>

                      {/* STOCK */}
                      <td style={td}>

                        <span
                          style={{
                            color:
                              lowStock

                                ? "#dc2626"

                                : "#16a34a",

                            fontWeight:
                              "bold",

                            fontSize:
                              "18px",
                          }}
                        >
                          {
                            medicine.stock
                          }
                        </span>
                      </td>

                      {/* BUY */}
                      <td style={td}>
                        $
                        {
                          medicine.buyPrice
                        }
                      </td>

                      {/* SELL */}
                      <td
                        style={{
                          ...td,

                          color:
                            "#16a34a",

                          fontWeight:
                            "bold",
                        }}
                      >
                        $
                        {
                          medicine.sellPrice
                        }
                      </td>

                      {/* PROFIT */}
                      <td
                        style={{
                          ...td,

                          color:
                            "#14b8a6",

                          fontWeight:
                            "bold",
                        }}
                      >
                        $
                        {profit}
                      </td>

                      {/* EXPIRY */}
                      <td style={td}>

                        <span
                          style={{
                            color:
                              expiring

                                ? "#dc2626"

                                : "#111827",

                            fontWeight:
                              expiring
                                ? "bold"
                                : "normal",
                          }}
                        >
                          {
                            medicine.expiryDate
                          }
                        </span>
                      </td>

                      {/* SUPPLIER */}
                      <td style={td}>
                        {
                          medicine.supplier
                        }
                      </td>

                      {/* STATUS */}
                      <td style={td}>

                        {lowStock ? (

                          <span
                            style={{
                              background:
                                "#fee2e2",

                              color:
                                "#dc2626",

                              padding:
                                "8px 14px",

                              borderRadius:
                                "999px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Low Stock
                          </span>

                        ) : expiring ? (

                          <span
                            style={{
                              background:
                                "#fef3c7",

                              color:
                                "#92400e",

                              padding:
                                "8px 14px",

                              borderRadius:
                                "999px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Expiring
                          </span>

                        ) : (

                          <span
                            style={{
                              background:
                                "#dcfce7",

                              color:
                                "#16a34a",

                              padding:
                                "8px 14px",

                              borderRadius:
                                "999px",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Good
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td style={td}>

                        <div
                          style={{
                            display:
                              "flex",

                            gap: "10px",
                          }}
                        >

                          {/* EDIT */}
                          <button
                            onClick={() =>
                              editMedicine(
                                medicine
                              )
                            }
                            style={{
                              background:
                                "#2563eb",

                              color:
                                "#fff",

                              border:
                                "none",

                              padding:
                                "10px 14px",

                              borderRadius:
                                "10px",

                              cursor:
                                "pointer",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Edit
                          </button>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              deleteMedicine(
                                medicine.id
                              )
                            }
                            style={{
                              background:
                                "#dc2626",

                              color:
                                "#fff",

                              border:
                                "none",

                              padding:
                                "10px 14px",

                              borderRadius:
                                "10px",

                              cursor:
                                "pointer",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (

        <div
          style={{
            position:
              "fixed",

            top: 0,
            left: 0,

            width: "100%",
            height: "100%",

            background:
              "rgba(0,0,0,0.5)",

            display: "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            zIndex: 999,
          }}
        >

          <div
            style={{
              background:
                "#fff",

              width: "700px",

              borderRadius:
                "24px",

              padding:
                "30px",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                marginBottom:
                  "24px",
              }}
            >
              {editingMedicine
                ? "Edit Medicine"
                : "Add Medicine"}
            </h2>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "1fr 1fr",

                gap: "18px",
              }}
            >

              <input
                placeholder="Medicine name"
                value={
                  formData.name
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                placeholder="Category"
                value={
                  formData.category
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                type="number"
                placeholder="Stock"
                value={
                  formData.stock
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                type="number"
                placeholder="Minimum stock"
                value={
                  formData.minStock
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                type="number"
                step="0.01"
                placeholder="Buy price"
                value={
                  formData.buyPrice
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buyPrice:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                type="number"
                step="0.01"
                placeholder="Sell price"
                value={
                  formData.sellPrice
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellPrice:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                type="date"
                value={
                  formData.expiryDate
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryDate:
                      e.target
                        .value,
                  })
                }
                style={input}
              />

              <input
                placeholder="Supplier"
                value={
                  formData.supplier
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supplier:
                      e.target
                        .value,
                  })
                }
                style={input}
              />
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",

                gap: "16px",

                marginTop:
                  "24px",
              }}
            >

              <button
                onClick={
                  saveMedicine
                }
                style={{
                  flex: 1,

                  background:
                    "#16a34a",

                  color: "#fff",

                  border: "none",

                  padding:
                    "18px",

                  borderRadius:
                    "16px",

                  fontWeight:
                    "bold",

                  fontSize:
                    "18px",

                  cursor:
                    "pointer",
                }}
              >
                {editingMedicine
                  ? "Update Medicine"
                  : "Save Medicine"}
              </button>

              <button
                onClick={
                  resetForm
                }
                style={{
                  flex: 1,

                  background:
                    "#e5e7eb",

                  border: "none",

                  padding:
                    "18px",

                  borderRadius:
                    "16px",

                  fontWeight:
                    "bold",

                  fontSize:
                    "18px",

                  cursor:
                    "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* TABLE */
const th = {
  padding: "18px",
  textAlign: "left",
};

const td = {
  padding: "18px",
};

/* INPUT */
const input = {
  padding: "16px",

  borderRadius: "14px",

  border:
    "1px solid #d1d5db",

  fontSize: "16px",
};

/* SELECT */
const select = {
  padding: "16px",

  borderRadius: "14px",

  border:
    "1px solid #d1d5db",

  fontSize: "16px",

  minWidth: "180px",
};

export default Medicines;