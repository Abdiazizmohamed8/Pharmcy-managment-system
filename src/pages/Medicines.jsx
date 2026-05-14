import {
  useState,
  useEffect,
} from "react";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import {
  db,
} from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Medicines({
  toast,
  openSidebar,
}) {

  const {
    darkMode,
  } = useTheme();

  /* =========================
        STATES
  ========================= */

  const [
    medicines,
    setMedicines,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] = useState("All");

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
    buyPrice: "",
    sellPrice: "",
    expiryDate: "",
    supplier: "",
    minStock: "",
  });

  /* =========================
        REALTIME FIRESTORE
  ========================= */

  useEffect(() => {

    const unsubscribe =
      onSnapshot(

        collection(
          db,
          "medicines"
        ),

        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setMedicines(data);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* =========================
        FILTER
  ========================= */

  const filteredMedicines =
    medicines.filter(
      (medicine) => {

        const matchesSearch =
          medicine.name
            ?.toLowerCase()
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
      }
    );

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

        toast?.(
          "Fill all fields",
          "error"
        );

        return;
      }

      try {

        const medicineData = {

          name:
            formData.name,

          category:
            formData.category,

          stock:
            Number(
              formData.stock
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
            formData.supplier,

          minStock:
            Number(
              formData.minStock || 0
            ),
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

          toast?.(
            "Medicine updated",
            "success"
          );

        } else {

          await addDoc(

            collection(
              db,
              "medicines"
            ),

            medicineData
          );

          toast?.(
            "Medicine added",
            "success"
          );
        }

        resetForm();

      } catch (error) {

        console.log(error);

        toast?.(
          "Operation failed",
          "error"
        );
      }
    };

  /* =========================
        RESET FORM
  ========================= */

  const resetForm = () => {

    setFormData({
      name: "",
      category: "",
      stock: "",
      buyPrice: "",
      sellPrice: "",
      expiryDate: "",
      supplier: "",
      minStock: "",
    });

    setEditingMedicine(
      null
    );

    setShowModal(false);
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
        ...medicine,
      });

      setShowModal(true);
    };

  /* =========================
        DELETE
  ========================= */

  const deleteMedicine =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete medicine?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(

          doc(
            db,
            "medicines",
            id
          )
        );

        toast?.(
          "Medicine deleted",
          "success"
        );

      } catch (error) {

        console.log(error);

        toast?.(
          "Delete failed",
          "error"
        );
      }
    };

  /* =========================
        STATUS
  ========================= */

  const getStatus =
    (medicine) => {

      if (
        medicine.stock <=
        medicine.minStock
      ) {

        return {
          text: "Low",
          bg: "#7f1d1d",
          color: "#fca5a5",
        };
      }

      return {
        text: "Good",
        bg: "#14532d",
        color: "#86efac",
      };
    };

  return (

    <div style={{
      ...styles.container,

      background:
        darkMode
          ? "#020617"
          : "#f3f4f6",
    }}>

      {/* HEADER */}

      <div style={styles.topBar}>

        <div style={styles.mobileTop}>

          <button
            onClick={openSidebar}

            style={{
              ...styles.menuButton,

              background:
                darkMode
                  ? "#111827"
                  : "#ffffff",

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}
          >
            ☰
          </button>

          <div>

            <h1 style={{
              ...styles.title,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}>
              Medicines 💊
            </h1>

            <p style={{
              ...styles.subtitle,

              color:
                darkMode
                  ? "#94a3b8"
                  : "#6b7280",
            }}>
              Manage pharmacy medicines
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }

          style={
            styles.addButton
          }
        >
          + Add Medicine
        </button>

      </div>

      {/* FILTERS */}

      <div style={styles.filters}>

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
            ...styles.searchInput,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            border:
              darkMode
                ? "1px solid #374151"
                : "1px solid #d1d5db",

            color:
              darkMode
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

          style={select(darkMode)}
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

      </div>

      {/* TABLE */}

      <div style={{
        ...styles.tableWrapper,

        background:
          darkMode
            ? "#111827"
            : "#ffffff",

        border:
          darkMode
            ? "1px solid #1f2937"
            : "1px solid #e5e7eb",
      }}>

        <table style={styles.table}>

          <thead>

            <tr>

              <th style={th(darkMode)}>
                Medicine
              </th>

              <th style={th(darkMode)}>
                Category
              </th>

              <th style={th(darkMode)}>
                Stock
              </th>

              <th style={th(darkMode)}>
                Buy
              </th>

              <th style={th(darkMode)}>
                Sell
              </th>

              <th style={th(darkMode)}>
                Profit
              </th>

              <th style={th(darkMode)}>
                Expiry
              </th>

              <th style={th(darkMode)}>
                Supplier
              </th>

              <th style={th(darkMode)}>
                Status
              </th>

              <th style={th(darkMode)}>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filteredMedicines.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"

                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color:
                        darkMode
                          ? "#94a3b8"
                          : "#6b7280",
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

                    const status =
                      getStatus(
                        medicine
                      );

                    return (

                      <tr
                        key={medicine.id}
                      >

                        <td style={td(darkMode)}>
                          {medicine.name}
                        </td>

                        <td style={td(darkMode)}>
                          {medicine.category}
                        </td>

                        <td style={{
                          ...td(darkMode),

                          color:
                            medicine.stock <=
                            medicine.minStock

                              ? "#ef4444"

                              : "#22c55e",

                          fontWeight:
                            "bold",
                        }}>
                          {medicine.stock}
                        </td>

                        <td style={td(darkMode)}>
                          $
                          {
                            medicine.buyPrice
                          }
                        </td>

                        <td style={td(darkMode)}>
                          $
                          {
                            medicine.sellPrice
                          }
                        </td>

                        <td style={{
                          ...td(darkMode),

                          color:
                            "#22c55e",

                          fontWeight:
                            "bold",
                        }}>
                          ${profit}
                        </td>

                        <td style={td(darkMode)}>
                          {
                            medicine.expiryDate ||
                            "N/A"
                          }
                        </td>

                        <td style={td(darkMode)}>
                          {
                            medicine.supplier ||
                            "N/A"
                          }
                        </td>

                        <td style={td(darkMode)}>

                          <span style={{
                            background:
                              status.bg,

                            color:
                              status.color,

                            padding:
                              "5px 8px",

                            borderRadius:
                              "999px",

                            fontSize:
                              "10px",

                            fontWeight:
                              "bold",
                          }}>
                            {status.text}
                          </span>

                        </td>

                        <td style={td(darkMode)}>

                          <div style={
                            styles.actionButtons
                          }>

                            <button
                              onClick={() =>
                                editMedicine(
                                  medicine
                                )
                              }

                              style={
                                styles.editBtn
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
                                styles.deleteBtn
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
              )
            }

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={{
            ...styles.modal,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",
          }}>

            <h2 style={{
              marginTop: 0,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}>
              {
                editingMedicine
                  ? "Edit Medicine"
                  : "Add Medicine"
              }
            </h2>

            <div style={styles.formGrid}>

              <input
                type="text"
                placeholder="Medicine"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

              <input
                type="text"
                placeholder="Category"
                value={
                  formData.category
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

              <input
                type="number"
                placeholder="Buy Price"
                value={
                  formData.buyPrice
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buyPrice:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

              <input
                type="number"
                placeholder="Sell Price"
                value={
                  formData.sellPrice
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sellPrice:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

              <input
                type="number"
                placeholder="Minimum Stock"
                value={
                  formData.minStock
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

              <input
                type="text"
                placeholder="Supplier"
                value={
                  formData.supplier
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    supplier:
                      e.target.value,
                  })
                }
                style={input(darkMode)}
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
                      e.target.value,
                  })
                }
                style={input(darkMode)}
              />

            </div>

            <div style={styles.modalButtons}>

              <button
                onClick={
                  saveMedicine
                }

                style={
                  styles.saveBtn
                }
              >
                {
                  editingMedicine
                    ? "Update"
                    : "Save"
                }
              </button>

              <button
                onClick={
                  resetForm
                }

                style={
                  cancelBtn(darkMode)
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
      STYLES
========================= */

const styles = {

  container: {
    width: "100%",
    minHeight: "100vh",
    padding: "14px",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  topBar: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "20px",
  },

  mobileTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    width: "100%",
  },

  menuButton: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    flexShrink: 0,
  },

  title: {
    margin: 0,
    fontSize:
      "clamp(26px,5vw,34px)",
    lineHeight: 1.2,
    wordBreak: "break-word",
  },

  subtitle: {
    marginTop: "8px",
    fontSize: "14px",
    wordBreak: "break-word",
  },

  addButton: {
    width: "100%",
    maxWidth: "220px",
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "13px 18px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },

  filters: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "14px",
    marginBottom: "20px",
  },

  searchInput: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "14px",
    minWidth: 0,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "hidden",
    borderRadius: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },

  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  editBtn: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px",
    width: "100%",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "8px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px",
    width: "100%",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent:
      "center",
    alignItems: "center",
    zIndex: 999,
    padding: "16px",
    overflowY: "auto",
  },

  modal: {
    width: "100%",
    maxWidth: "700px",
    borderRadius: "24px",
    padding: "20px",
    boxSizing: "border-box",
    maxHeight: "95vh",
    overflowY: "auto",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
  },

  modalButtons: {
    display: "flex",
    gap: "14px",
    marginTop: "24px",
    flexWrap: "wrap",
  },

  saveBtn: {
    flex: 1,
    background: "#16a34a",
    color: "#ffffff",
    border: "none",
    padding: "15px",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "140px",
  },
};

const th = (darkMode) => ({
  padding: "10px 6px",

  textAlign: "left",

  background:
    darkMode
      ? "#0f172a"
      : "#f9fafb",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",

  fontWeight: "700",

  borderBottom:
    darkMode
      ? "1px solid #1f2937"
      : "1px solid #e5e7eb",

  fontSize: "11px",

  wordBreak: "break-word",
});

const td = (darkMode) => ({
  padding: "10px 6px",

  color:
    darkMode
      ? "#e5e7eb"
      : "#111827",

  borderBottom:
    darkMode
      ? "1px solid #1f2937"
      : "1px solid #f3f4f6",

  fontSize: "11px",

  wordBreak: "break-word",

  overflowWrap: "break-word",
});

const input = (darkMode) => ({
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border:
    darkMode
      ? "1px solid #374151"
      : "1px solid #d1d5db",
  background:
    darkMode
      ? "#0f172a"
      : "#ffffff",
  color:
    darkMode
      ? "#ffffff"
      : "#111827",
  outline: "none",
  boxSizing: "border-box",
  minWidth: 0,
  fontSize: "14px",
});

const select = (darkMode) => ({
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border:
    darkMode
      ? "1px solid #374151"
      : "1px solid #d1d5db",
  background:
    darkMode
      ? "#111827"
      : "#ffffff",
  color:
    darkMode
      ? "#ffffff"
      : "#111827",
  outline: "none",
  boxSizing: "border-box",
  minWidth: 0,
  fontSize: "14px",
});

const cancelBtn = (darkMode) => ({
  flex: 1,
  background:
    darkMode
      ? "#1f2937"
      : "#f3f4f6",
  color:
    darkMode
      ? "#ffffff"
      : "#111827",
  border: "none",
  padding: "15px",
  borderRadius: "14px",
  fontWeight: "bold",
  cursor: "pointer",
  minWidth: "140px",
});

export default Medicines;