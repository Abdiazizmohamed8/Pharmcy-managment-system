import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

function Medicines() {
  const { darkMode } = useTheme();

  const [medicines, setMedicines] = useState([
    {
      id: 1,
      name: "Paracetamol",
      category: "Tablet",
      price: 5,
      stock: 100,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const [showModal, setShowModal] = useState(false);

  const styles = {
    container: {
      width: "100%",
      minHeight: "100vh",
      padding: "20px",
      background: darkMode ? "#020617" : "#f3f4f6",
      color: darkMode ? "#ffffff" : "#111827",
      boxSizing: "border-box",
    },

    topBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      flexWrap: "wrap",
      gap: "10px",
    },

    title: {
      fontSize: "32px",
      fontWeight: "bold",
      margin: 0,
      color: darkMode ? "#ffffff" : "#111827",
    },

    addButton: {
      background: "#16a34a",
      color: "#ffffff",
      border: "none",
      padding: "12px 18px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
    },

    tableWrapper: {
      overflowX: "auto",
      borderRadius: "10px",
    },

    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: darkMode ? "#0f172a" : "#ffffff",
    },

    th: {
      background: darkMode ? "#111827" : "#e5e7eb",
      color: darkMode ? "#ffffff" : "#111827",
      padding: "14px",
      textAlign: "left",
      fontWeight: "bold",
    },

    td: {
      padding: "14px",
      color: darkMode ? "#e5e7eb" : "#111827",
      borderBottom: darkMode
        ? "1px solid #1f2937"
        : "1px solid #e5e7eb",
    },

    actionButtons: {
      display: "flex",
      gap: "10px",
    },

    editBtn: {
      background: "#2563eb",
      color: "#ffffff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
    },

    deleteBtn: {
      background: "#dc2626",
      color: "#ffffff",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
    },

    modalOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      zIndex: 1000,
    },

    modal: {
      width: "100%",
      maxWidth: "400px",
      background: darkMode ? "#0f172a" : "#ffffff",
      color: darkMode ? "#ffffff" : "#111827",
      borderRadius: "14px",
      padding: "20px",
      boxSizing: "border-box",
    },

    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "14px",
      borderRadius: "8px",
      border: darkMode
        ? "1px solid #374151"
        : "1px solid #d1d5db",
      background: darkMode ? "#111827" : "#ffffff",
      color: darkMode ? "#ffffff" : "#111827",
      boxSizing: "border-box",
      outline: "none",
    },

    saveBtn: {
      width: "100%",
      background: "#16a34a",
      color: "#ffffff",
      border: "none",
      padding: "12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  const handleAddMedicine = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill all fields");
      return;
    }

    const newMedicine = {
      id: medicines.length + 1,
      ...formData,
    };

    setMedicines([...medicines, newMedicine]);

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const filteredMedicines = medicines.filter(
      (medicine) => medicine.id !== id
    );

    setMedicines(filteredMedicines);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <h1 style={styles.title}>Medicines</h1>

        <button
          style={styles.addButton}
          onClick={() => setShowModal(true)}
        >
          + Add Medicine
        </button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id}>
                <td style={styles.td}>{medicine.id}</td>
                <td style={styles.td}>{medicine.name}</td>
                <td style={styles.td}>{medicine.category}</td>
                <td style={styles.td}>${medicine.price}</td>
                <td style={styles.td}>{medicine.stock}</td>

                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button style={styles.editBtn}>
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() =>
                        handleDelete(medicine.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Add Medicine</h2>

            <input
              type="text"
              placeholder="Medicine Name"
              style={styles.input}
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              placeholder="Category"
              style={styles.input}
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Price"
              style={styles.input}
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Stock"
              style={styles.input}
              value={formData.stock}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  stock: e.target.value,
                })
              }
            />

            <button
              style={styles.saveBtn}
              onClick={handleAddMedicine}
            >
              Save Medicine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Medicines;