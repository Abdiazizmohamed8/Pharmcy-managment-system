import { useState } from "react";

import { fmt } from "../utils/helpers";

function Expenses({
  expenses,
  setExpenses,
  toast,
}) {
  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] =
    useState({
      category: "",
      description: "",
      amount: "",
    });

  const totalExpenses =
    expenses.reduce(
      (acc, exp) =>
        acc + exp.amount,
      0
    );

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
      id: Date.now(),

      date: new Date()
        .toISOString()
        .split("T")[0],

      category:
        form.category,

      description:
        form.description,

      amount: Number(
        form.amount
      ),

      user: "Admin",
    };

    setExpenses((prev) => [
      newExpense,
      ...prev,
    ]);

    toast(
      "Expense added successfully"
    );

    setShowModal(false);

    setForm({
      category: "",
      description: "",
      amount: "",
    });
  };

  const deleteExpense = (
    id
  ) => {
    setExpenses((prev) =>
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
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
            }}
          >
            Expenses 💸
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "6px",
            }}
          >
            Manage pharmacy
            expenses
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding:
              "12px 18px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add Expense
        </button>
      </div>

      {/* Total */}
      <div
        style={{
          background: "#dc2626",
          color: "#fff",
          padding: "18px",
          borderRadius: "14px",
          marginBottom: "20px",
          fontSize: "22px",
          fontWeight: "bold",
        }}
      >
        Total Expenses:
        {" "}
        {fmt(totalExpenses)}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.05)",
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
                "#f3f4f6",
            }}
          >
            <tr>
              <th
                style={thStyle}
              >
                Date
              </th>

              <th
                style={thStyle}
              >
                Category
              </th>

              <th
                style={thStyle}
              >
                Description
              </th>

              <th
                style={thStyle}
              >
                Amount
              </th>

              <th
                style={thStyle}
              >
                User
              </th>

              <th
                style={thStyle}
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map(
              (expense) => (
                <tr
                  key={
                    expense.id
                  }
                >
                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      expense.date
                    }
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      expense.category
                    }
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      expense.description
                    }
                  </td>

                  <td
                    style={{
                      ...tdStyle,
                      color:
                        "#dc2626",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {fmt(
                      expense.amount
                    )}
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    {
                      expense.user
                    }
                  </td>

                  <td
                    style={
                      tdStyle
                    }
                  >
                    <button
                      onClick={() =>
                        deleteExpense(
                          expense.id
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
                          "8px 12px",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position:
              "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
          }}
        >
          <div
            style={{
              background:
                "#fff",
              padding:
                "30px",
              borderRadius:
                "14px",
              width: "100%",
              maxWidth:
                "420px",
            }}
          >
            <h2
              style={{
                marginBottom:
                  "20px",
              }}
            >
              Add Expense
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: "14px",
              }}
            >
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
                      e
                        .target
                        .value,
                  })
                }
                style={
                  inputStyle
                }
              />

              <input
                type="text"
                placeholder="Description"
                value={
                  form.description
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    description:
                      e
                        .target
                        .value,
                  })
                }
                style={
                  inputStyle
                }
              />

              <input
                type="number"
                placeholder="Amount"
                value={
                  form.amount
                }
                onChange={(
                  e
                ) =>
                  setForm({
                    ...form,
                    amount:
                      e
                        .target
                        .value,
                  })
                }
                style={
                  inputStyle
                }
              />

              <button
                onClick={
                  handleSave
                }
                style={{
                  background:
                    "#16a34a",
                  color:
                    "#fff",
                  border:
                    "none",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
                  fontWeight:
                    "bold",
                  cursor:
                    "pointer",
                }}
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
                  background:
                    "#e5e7eb",
                  border:
                    "none",
                  padding:
                    "12px",
                  borderRadius:
                    "8px",
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

const thStyle = {
  textAlign: "left",
  padding: "14px",
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px",
  borderTop:
    "1px solid #f3f4f6",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
};

export default Expenses;