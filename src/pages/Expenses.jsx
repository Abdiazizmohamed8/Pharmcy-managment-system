import {
  useState,
} from "react";

import {
  fmt,
} from "../utils/helpers";

function Expenses({
  expenses,
  setExpenses,
  toast,
  darkMode = false,
}) {

  /* =========================
        STATES
  ========================= */

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    form,
    setForm,
  ] = useState({
    category: "",
    description: "",
    amount: "",
  });

  /* =========================
        FILTER
  ========================= */

  const filteredExpenses =
    expenses.filter(
      (expense) =>

        expense.category
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        expense.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  /* =========================
        TOTAL
  ========================= */

  const totalExpenses =
    expenses.reduce(
      (
        acc,
        expense
      ) =>

        acc +
        Number(
          expense.amount || 0
        ),

      0
    );

  /* =========================
        SAVE
  ========================= */

  const handleSave = () => {

    if (
      !form.category ||
      !form.amount
    ) {

      toast(
        "Please fill all fields",
        "error"
      );

      return;
    }

    const newExpense = {

      id:
        Date.now(),

      category:
        form.category,

      description:
        form.description,

      amount:
        Number(
          form.amount
        ),

      date:
        new Date()
          .toISOString()
          .split("T")[0],
    };

    setExpenses(
      (prev) => [
        newExpense,
        ...prev,
      ]
    );

    toast(
      "Expense added"
    );

    setForm({
      category: "",
      description: "",
      amount: "",
    });

    setShowModal(false);
  };

  /* =========================
        DELETE
  ========================= */

  const deleteExpense =
    (id) => {

      setExpenses(
        (prev) =>

          prev.filter(
            (expense) =>
              expense.id !== id
          )
      );

      toast(
        "Expense deleted",
        "error"
      );
    };

  return (

    <div style={{
      ...styles.container,

      background:
        darkMode
          ? "#020617"
          : "#f3f4f6",

      color:
        darkMode
          ? "#ffffff"
          : "#111827",
    }}>

      {/* HEADER */}

      <div style={styles.header}>

        {/* LEFT */}

        <div>

          <h1 style={{
            ...styles.title,

            color:
              darkMode
                ? "#ffffff"
                : "#111827",
          }}>
            Expenses 💸
          </h1>

          <p style={{
            ...styles.subtitle,

            color:
              darkMode
                ? "#d1d5db"
                : "#6b7280",
          }}>
            Manage pharmacy expenses
          </p>

        </div>

        {/* RIGHT */}

        <div style={styles.headerRight}>

          {/* TOTAL */}

          <div style={{
            ...styles.totalCard,

            boxShadow:
              darkMode

                ? "0 4px 18px rgba(0,0,0,0.35)"

                : "0 4px 18px rgba(220,38,38,0.2)",
          }}>

            <div style={styles.totalLabel}>
              Total Expenses
            </div>

            <div style={styles.totalAmount}>
              {fmt(totalExpenses)}
            </div>

          </div>

          {/* BUTTON */}

          <button
            onClick={() =>
              setShowModal(true)
            }

            style={styles.addButton}
          >
            + Add Expense
          </button>

        </div>

      </div>

      {/* SEARCH */}

      <div style={styles.searchWrapper}>

        <input
          type="text"

          placeholder="Search expense..."

          value={search}

          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }

          style={{
            ...styles.searchInput,

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
          }}
        />

      </div>

      {/* EMPTY */}

      {filteredExpenses.length === 0 ? (

        <div style={{
          ...styles.emptyBox,

          background:
            darkMode
              ? "#111827"
              : "#ffffff",

          color:
            darkMode
              ? "#d1d5db"
              : "#9ca3af",

          border:
            darkMode
              ? "1px solid #1f2937"
              : "none",

          boxShadow:
            darkMode

              ? "0 4px 18px rgba(0,0,0,0.35)"

              : "0 4px 18px rgba(0,0,0,0.05)",
        }}>
          No expenses found
        </div>

      ) : (

        <div style={styles.grid}>

          {filteredExpenses.map(
            (
              expense
            ) => (

              <div
                key={expense.id}

                style={{
                  ...styles.card,

                  background:
                    darkMode
                      ? "#111827"
                      : "#ffffff",

                  border:
                    darkMode
                      ? "1px solid #1f2937"
                      : "none",

                  boxShadow:
                    darkMode

                      ? "0 4px 18px rgba(0,0,0,0.35)"

                      : "0 4px 18px rgba(0,0,0,0.05)",
                }}
              >

                {/* TOP */}

                <div style={styles.cardTop}>

                  <span style={{
                    ...styles.categoryBadge,

                    background:
                      darkMode
                        ? "#14532d"
                        : "#dcfce7",
                  }}>
                    {expense.category}
                  </span>

                  <div style={{
                    color:
                      darkMode
                        ? "#d1d5db"
                        : "#6b7280",

                    fontSize: "13px",
                  }}>
                    {expense.date}
                  </div>

                </div>

                {/* DESCRIPTION */}

                <div style={{
                  color:
                    darkMode
                      ? "#ffffff"
                      : "#374151",

                  fontSize: "15px",

                  lineHeight: "24px",

                  wordBreak: "break-word",
                }}>
                  {
                    expense.description ||
                    "No description"
                  }
                </div>

                {/* BOTTOM */}

                <div style={styles.cardBottom}>

                  {/* AMOUNT */}

                  <div style={{
                    ...styles.amountBadge,

                    background:
                      darkMode
                        ? "#7f1d1d"
                        : "#fee2e2",
                  }}>
                    {fmt(expense.amount)}
                  </div>

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      deleteExpense(
                        expense.id
                      )
                    }

                    style={styles.deleteButton}
                  >
                    Delete
                  </button>

                </div>

              </div>
            )
          )}

        </div>
      )}

      {/* MODAL */}

      {showModal && (

        <div style={styles.modalOverlay}>

          <div style={{
            ...styles.modal,

            background:
              darkMode
                ? "#111827"
                : "#ffffff",

            border:
              darkMode
                ? "1px solid #1f2937"
                : "none",
          }}>

            <h2 style={{
              ...styles.modalTitle,

              color:
                darkMode
                  ? "#ffffff"
                  : "#111827",
            }}>
              Add Expense
            </h2>

            {/* FORM */}

            <div style={styles.formGrid}>

              <input
                type="text"

                placeholder="Category"

                value={
                  form.category
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    category:
                      e.target.value,
                  })
                }

                style={inputStyle(
                  darkMode
                )}
              />

              <input
                type="text"

                placeholder="Description"

                value={
                  form.description
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    description:
                      e.target.value,
                  })
                }

                style={inputStyle(
                  darkMode
                )}
              />

              <input
                type="number"

                placeholder="Amount"

                value={
                  form.amount
                }

                onChange={(e) =>
                  setForm({
                    ...form,

                    amount:
                      e.target.value,
                  })
                }

                style={inputStyle(
                  darkMode
                )}
              />

            </div>

            {/* BUTTONS */}

            <div style={styles.modalButtons}>

              <button
                onClick={
                  handleSave
                }

                style={styles.saveButton}
              >
                Save Expense
              </button>

              <button
                onClick={() =>
                  setShowModal(
                    false
                  )
                }

                style={{
                  ...styles.cancelButton,

                  background:
                    darkMode
                      ? "#1f2937"
                      : "#f3f4f6",

                  color:
                    darkMode
                      ? "#ffffff"
                      : "#111827",
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

/* =========================
      STYLES
========================= */

const styles = {

  container: {
    width: "100%",

    minHeight: "100vh",

    transition:
      "0.3s ease",

    padding: "24px",

    boxSizing: "border-box",
  },

  header: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    flexWrap: "wrap",

    gap: "16px",

    marginBottom: "24px",
  },

  title: {
    margin: 0,

    fontSize:
      "clamp(28px,5vw,34px)",
  },

  subtitle: {
    marginTop: "8px",

    fontSize: "15px",
  },

  headerRight: {
    display: "flex",

    gap: "14px",

    flexWrap: "wrap",

    alignItems: "center",
  },

  totalCard: {
    background: "#dc2626",

    color: "#ffffff",

    padding: "16px 20px",

    borderRadius: "18px",

    minWidth: "180px",

    width: "100%",

    maxWidth: "240px",

    boxSizing: "border-box",
  },

  totalLabel: {
    fontSize: "13px",

    opacity: 0.9,

    marginBottom: "6px",
  },

  totalAmount: {
    fontSize:
      "clamp(22px,5vw,26px)",

    fontWeight: "bold",
  },

  addButton: {
    background: "#16a34a",

    color: "#ffffff",

    border: "none",

    padding: "14px 22px",

    borderRadius: "16px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "14px",

    whiteSpace: "nowrap",
  },

  searchWrapper: {
    marginBottom: "22px",
  },

  searchInput: {
    width: "100%",

    maxWidth: "420px",

    padding: "15px",

    borderRadius: "16px",

    outline: "none",

    fontSize: "14px",

    boxSizing: "border-box",
  },

  emptyBox: {
    borderRadius: "24px",

    padding: "80px 20px",

    textAlign: "center",

    fontSize: "18px",
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(300px,1fr))",

    gap: "18px",
  },

  card: {
    borderRadius: "24px",

    padding: "20px",

    display: "flex",

    flexDirection: "column",

    gap: "18px",

    boxSizing: "border-box",
  },

  cardTop: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "12px",
  },

  categoryBadge: {
    color: "#16a34a",

    padding: "8px 14px",

    borderRadius: "999px",

    fontSize: "13px",

    fontWeight: "bold",
  },

  cardBottom: {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "12px",
  },

  amountBadge: {
    color: "#dc2626",

    padding: "10px 16px",

    borderRadius: "999px",

    fontWeight: "bold",

    fontSize: "14px",
  },

  deleteButton: {
    background: "#dc2626",

    color: "#ffffff",

    border: "none",

    padding: "11px 18px",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: "bold",

    fontSize: "13px",
  },

  modalOverlay: {
    position: "fixed",

    inset: 0,

    background:
      "rgba(0,0,0,0.5)",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    zIndex: 999,

    padding: "20px",
  },

  modal: {
    width: "100%",

    maxWidth: "460px",

    borderRadius: "24px",

    padding: "30px",

    boxSizing: "border-box",
  },

  modalTitle: {
    marginTop: 0,

    marginBottom: "24px",
  },

  formGrid: {
    display: "grid",

    gap: "16px",
  },

  modalButtons: {
    display: "flex",

    gap: "14px",

    marginTop: "24px",

    flexWrap: "wrap",
  },

  saveButton: {
    flex: 1,

    background: "#16a34a",

    color: "#ffffff",

    border: "none",

    padding: "14px",

    borderRadius: "14px",

    fontWeight: "bold",

    cursor: "pointer",

    minWidth: "140px",
  },

  cancelButton: {
    flex: 1,

    border: "none",

    padding: "14px",

    borderRadius: "14px",

    fontWeight: "bold",

    cursor: "pointer",

    minWidth: "140px",
  },
};

/* =========================
      INPUT STYLE
========================= */

const inputStyle = (
  darkMode
) => ({
  width: "100%",

  padding: "14px",

  borderRadius: "14px",

  border:
    darkMode
      ? "1px solid #374151"
      : "1px solid #d1d5db",

  outline: "none",

  fontSize: "14px",

  background:
    darkMode
      ? "#0f172a"
      : "#ffffff",

  color:
    darkMode
      ? "#ffffff"
      : "#111827",

  boxSizing: "border-box",
});

export default Expenses;