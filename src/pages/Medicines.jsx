import {
  useState,
} from "react";

/* =========================
   FIREBASE
========================= */

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

function Medicines({
  medicines,
  dark,
}) {

  /* =========================
     STATES
  ========================= */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");

  const [
    sortStock,
    setSortStock,
  ] = useState("default");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingMedicine,
    setEditingMedicine,
  ] = useState(null);

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    category: "",
    stock: "",
    minStock: "",
    buyPrice: "",
    sellPrice: "",
    expiryDate: "",
    supplier: "",
  });

  /* =========================
     FILTER
  ========================= */

  let filteredMedicines =
    medicines.filter(
      (medicine) => {

        const matchesSearch =
          medicine.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          categoryFilter ===
          "All"

            ? true

            : medicine.category ===
              categoryFilter;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

  /* =========================
     SORT
  ========================= */

  if (
    sortStock === "low"
  ) {

    filteredMedicines.sort(
      (a, b) =>
        a.stock - b.stock
    );
  }

  if (
    sortStock === "high"
  ) {

    filteredMedicines.sort(
      (a, b) =>
        b.stock - a.stock
    );
  }

  /* =========================
     CATEGORIES
  ========================= */

  const categories = [
    "All",

    ...new Set(
      medicines.map(
        (medicine) =>
          medicine.category
      )
    ),
  ];

  /* =========================
     SAVE MEDICINE
  ========================= */

  const saveMedicine =
    async () => {

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

      try {

        const medicineData = {

          name:
            formData.name.trim(),

          category:
            formData.category.trim(),

          stock:
            Number(
              formData.stock
            ),

          minStock:
            Number(
              formData.minStock || 0
            ),

          buyPrice:
            Number(
              formData.buyPrice
            ),

          sellPrice:
            Number(
              formData.sellPrice
            ),

          expiryDate:
            formData.expiryDate,

          supplier:
            formData.supplier.trim(),
        };

        if (
          editingMedicine
        ) {

          await updateDoc(

            doc(
              db,
              "medicines",
              editingMedicine.id
            ),

            medicineData
          );

        } else {

          await addDoc(

            collection(
              db,
              "medicines"
            ),

            medicineData
          );
        }

        resetForm();

      } catch (error) {

        console.log(
          error
        );

        alert(
          "Failed to save medicine"
        );
      }
    };

  /* =========================
     RESET
  ========================= */

  const resetForm =
    () => {

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

      setEditingMedicine(
        null
      );

      setShowModal(
        false
      );
    };

  /* =========================
     EDIT
  ========================= */

  const editMedicine =
    (medicine) => {

      setEditingMedicine(
        medicine
      );

      setFormData({
        name:
          medicine.name,

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

      setShowModal(
        true
      );
    };

  /* =========================
     DELETE
  ========================= */

  const deleteMedicine =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this medicine?"
        );

      if (
        !confirmDelete
      )
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "medicines",
            id
          )
        );

      } catch (error) {

        console.log(
          error
        );

        alert(
          "Delete failed"
        );
      }
    };

  /* =========================
     EXPIRY
  ========================= */

  const isExpiringSoon =
    (date) => {

      if (!date)
        return false;

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
    <div
      style={{
        width: "100%",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          flexWrap:
            "wrap",

          gap: "18px",

          marginBottom:
            "26px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,

              fontSize:
                "34px",

              color:
                dark
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            Medicines 💊
          </h1>

          <p
            style={{
              marginTop:
                "8px",

              color:
                dark
                  ? "#94a3b8"
                  : "#6b7280",

              fontSize:
                "15px",
            }}
          >
            Manage pharmacy medicines
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(
              true
            )
          }

          style={{
            background:
              "#16a34a",

            color:
              "#ffffff",

            border:
              "none",

            padding:
              "14px 22px",

            borderRadius:
              "16px",

            fontWeight:
              "bold",

            cursor:
              "pointer",

            fontSize:
              "15px",

            width:
              "100%",

            maxWidth:
              "220px",
          }}
        >
          + Add Medicine
        </button>
      </div>

      {/* FILTERS */}

      <div
        style={{
          display:
            "flex",

          gap: "14px",

          flexWrap:
            "wrap",

          marginBottom:
            "24px",
        }}
      >

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
              "220px",

            padding:
              "14px 16px",

            borderRadius:
              "14px",

            border:
              dark
                ? "1px solid #374151"
                : "1px solid #d1d5db",

            fontSize:
              "14px",

            outline:
              "none",

            background:
              dark
                ? "#111827"
                : "#ffffff",

            color:
              dark
                ? "#ffffff"
                : "#111827",
          }}
        />

        <select
          value={
            categoryFilter
          }

          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }

          style={
            select(dark)
          }
        >

          {categories.map(
            (category) => (

              <option
                key={
                  category
                }

                value={
                  category
                }
              >
                {category}
              </option>
            )
          )}
        </select>

        <select
          value={
            sortStock
          }

          onChange={(e) =>
            setSortStock(
              e.target.value
            )
          }

          style={
            select(dark)
          }
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
            dark
              ? "#111827"
              : "#ffffff",

          borderRadius:
            "24px",

          overflowX:
            "auto",

          border:
            dark
              ? "1px solid #1f2937"
              : "1px solid #e5e7eb",
        }}
      >

        <table
          style={{
            width: "100%",

            minWidth:
              "1100px",

            borderCollapse:
              "collapse",
          }}
        >

          <thead
            style={{
              background:
                dark
                  ? "#0f172a"
                  : "#f9fafb",
            }}
          >

            <tr>

              {[
                "Medicine",
                "Category",
                "Stock",
                "Buy",
                "Sell",
                "Profit",
                "Expiry",
                "Supplier",
                "Status",
                "Action",
              ].map(
                (
                  item
                ) => (

                  <th
                    key={
                      item
                    }

                    style={th(
                      dark
                    )}
                  >
                    {item}
                  </th>
                )
              )}
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
                      "70px 20px",

                    textAlign:
                      "center",

                    color:
                      dark
                        ? "#94a3b8"
                        : "#9ca3af",

                    fontSize:
                      "16px",
                  }}
                >
                  No medicines available
                </td>
              </tr>

            ) : (

              filteredMedicines.map(
                (
                  medicine
                ) => {

                  const profit =
                    (
                      medicine.sellPrice -
                      medicine.buyPrice
                    ).toFixed(
                      2
                    );

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
                    >

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          medicine.name
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          medicine.category
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          medicine.stock
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        $
                        {
                          medicine.buyPrice
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        $
                        {
                          medicine.sellPrice
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        $
                        {
                          profit
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          medicine.expiryDate ||
                          "N/A"
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >
                        {
                          medicine.supplier ||
                          "N/A"
                        }
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >

                        {lowStock ? (

                          <Status
                            bg="#fee2e2"
                            color="#dc2626"
                            text="Low"
                          />

                        ) : expiring ? (

                          <Status
                            bg="#fef3c7"
                            color="#92400e"
                            text="Expiring"
                          />

                        ) : (

                          <Status
                            bg="#dcfce7"
                            color="#166534"
                            text="Good"
                          />
                        )}
                      </td>

                      <td
                        style={td(
                          dark
                        )}
                      >

                        <div
                          style={{
                            display:
                              "flex",

                            gap: "10px",
                          }}
                        >

                          <button
                            onClick={() =>
                              editMedicine(
                                medicine
                              )
                            }

                            style={
                              editBtn
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteMedicine(
                                medicine.id
                              )
                            }

                            style={
                              deleteBtn
                            }
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

            inset: 0,

            background:
              "rgba(0,0,0,0.6)",

            display:
              "flex",

            justifyContent:
              "center",

            alignItems:
              "center",

            zIndex: 999,

            padding:
              "20px",
          }}
        >

          <div
            style={{
              background:
                dark
                  ? "#111827"
                  : "#ffffff",

              width: "100%",

              maxWidth:
                "750px",

              borderRadius:
                "24px",

              padding:
                "28px",
            }}
          >

            <h2
              style={{
                marginTop: 0,

                marginBottom:
                  "24px",

                color:
                  dark
                    ? "#ffffff"
                    : "#111827",
              }}
            >
              {editingMedicine
                ? "Edit Medicine"
                : "Add Medicine"}
            </h2>

            <div
              style={{
                display:
                  "grid",

                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",

                gap: "16px",
              }}
            >

              {[
                {
                  key:
                    "name",

                  placeholder:
                    "Medicine name",
                },

                {
                  key:
                    "category",

                  placeholder:
                    "Category",
                },

                {
                  key:
                    "stock",

                  placeholder:
                    "Stock",

                  type:
                    "number",
                },

                {
                  key:
                    "minStock",

                  placeholder:
                    "Minimum stock",

                  type:
                    "number",
                },

                {
                  key:
                    "buyPrice",

                  placeholder:
                    "Buy price",

                  type:
                    "number",
                },

                {
                  key:
                    "sellPrice",

                  placeholder:
                    "Sell price",

                  type:
                    "number",
                },

                {
                  key:
                    "expiryDate",

                  type:
                    "date",
                },

                {
                  key:
                    "supplier",

                  placeholder:
                    "Supplier",
                },
              ].map(
                (
                  field
                ) => (

                  <input
                    key={
                      field.key
                    }

                    type={
                      field.type ||
                      "text"
                    }

                    placeholder={
                      field.placeholder
                    }

                    value={
                      formData[
                        field.key
                      ]
                    }

                    onChange={(
                      e
                    ) =>
                      setFormData(
                        {
                          ...formData,

                          [field.key]:
                            e.target.value,
                        }
                      )
                    }

                    style={
                      input(
                        dark
                      )
                    }
                  />
                )
              )}
            </div>

            <div
              style={{
                display:
                  "flex",

                gap: "14px",

                marginTop:
                  "24px",

                flexWrap:
                  "wrap",
              }}
            >

              <button
                onClick={
                  saveMedicine
                }

                style={
                  saveBtn
                }
              >
                {editingMedicine
                  ? "Update Medicine"
                  : "Save Medicine"}
              </button>

              <button
                onClick={
                  resetForm
                }

                style={
                  cancelBtn(
                    dark
                  )
                }
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

/* =========================
   STATUS
========================= */

function Status({
  bg,
  color,
  text,
}) {

  return (
    <span
      style={{
        background:
          bg,

        color:
          color,

        padding:
          "8px 14px",

        borderRadius:
          "999px",

        fontWeight:
          "bold",

        fontSize:
          "12px",
      }}
    >
      {text}
    </span>
  );
}

/* =========================
   STYLES
========================= */

const th = (
  dark
) => ({
  textAlign:
    "left",

  padding:
    "18px",

  fontSize:
    "14px",

  color:
    dark
      ? "#ffffff"
      : "#374151",
});

const td = (
  dark
) => ({
  padding:
    "18px",

  color:
    dark
      ? "#e5e7eb"
      : "#111827",
});

const input = (
  dark
) => ({
  width: "100%",

  padding:
    "14px",

  borderRadius:
    "14px",

  border:
    dark
      ? "1px solid #374151"
      : "1px solid #d1d5db",

  background:
    dark
      ? "#0f172a"
      : "#ffffff",

  color:
    dark
      ? "#ffffff"
      : "#111827",

  outline:
    "none",

  boxSizing:
    "border-box",
});

const select = (
  dark
) => ({
  padding:
    "14px",

  borderRadius:
    "14px",

  border:
    dark
      ? "1px solid #374151"
      : "1px solid #d1d5db",

  background:
    dark
      ? "#111827"
      : "#ffffff",

  color:
    dark
      ? "#ffffff"
      : "#111827",

  outline:
    "none",
});

const editBtn = {
  background:
    "#2563eb",

  color:
    "#ffffff",

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
};

const deleteBtn = {
  background:
    "#dc2626",

  color:
    "#ffffff",

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
};

const saveBtn = {
  flex: 1,

  background:
    "#16a34a",

  color:
    "#ffffff",

  border:
    "none",

  padding:
    "16px",

  borderRadius:
    "14px",

  fontWeight:
    "bold",

  cursor:
    "pointer",
};

const cancelBtn = (
  dark
) => ({
  flex: 1,

  background:
    dark
      ? "#1f2937"
      : "#f3f4f6",

  color:
    dark
      ? "#ffffff"
      : "#111827",

  border:
    "none",

  padding:
    "16px",

  borderRadius:
    "14px",

  fontWeight:
    "bold",

  cursor:
    "pointer",
});

export default Medicines;