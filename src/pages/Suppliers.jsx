import { useState } from "react";

import { useTheme } from "../context/ThemeContext";

function Suppliers({
  suppliers = [],
  setSuppliers,
  toast,
  openSidebar,
}) {
  const { darkMode } = useTheme();

  // Theme
  const ui = {
    bg: darkMode
      ? "bg-[#050816] text-white"
      : "bg-slate-100 text-black",

    card: darkMode
      ? "bg-[#0f172a] border-[#1e293b]"
      : "bg-white border-slate-200",

    input: darkMode
      ? "bg-[#091225] border-[#1e293b] text-white"
      : "bg-white border-slate-300 text-black",

    text: darkMode
      ? "text-slate-400"
      : "text-slate-500",
  };

  // States
  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      contact: "",
      email: "",
      city: "",
    });

  // Search
  const filteredSuppliers =
    suppliers.filter((supplier) =>
      supplier.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // Input Change
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // Add Supplier
  const addSupplier = () => {

    if (!form.name.trim()) {

      toast?.(
        "Supplier name required",
        "error"
      );

      return;
    }

    const newSupplier = {
      id: Date.now(),

      name: form.name,

      contact: form.contact,

      email: form.email,

      city: form.city,

      joined: new Date()
        .toISOString()
        .split("T")[0],
    };

    setSuppliers((prev) => [
      newSupplier,
      ...prev,
    ]);

    toast?.(
      "Supplier added",
      "success"
    );

    setForm({
      name: "",
      contact: "",
      email: "",
      city: "",
    });

    setShowModal(false);
  };

  // Delete
  const deleteSupplier = (id) => {

    if (
      !window.confirm(
        "Delete supplier?"
      )
    )
      return;

    setSuppliers((prev) =>
      prev.filter(
        (supplier) =>
          supplier.id !== id
      )
    );

    toast?.(
      "Supplier deleted",
      "success"
    );
  };

  return (
    <div className={`min-h-screen p-4 md:p-6 ${ui.bg}`}>

      {/* Header */}
      <div className="
        flex items-center gap-4
        mb-6
      ">

        <button
          onClick={openSidebar}
          className={`
            md:hidden w-12 h-12
            rounded-2xl border text-xl
            ${ui.card}
          `}
        >
          ☰
        </button>

        <div>

          <h1 className="text-3xl md:text-5xl font-black">
            Suppliers 🏭
          </h1>

          <p className={ui.text}>
            Manage pharmacy suppliers
          </p>

        </div>

      </div>

      {/* Top */}
      <div className="
        flex flex-col lg:flex-row
        gap-4 mb-6
      ">

        {/* Search */}
        <input
          type="text"
          placeholder="Search supplier..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className={`
            w-full lg:max-w-md h-14 px-5
            rounded-2xl border outline-none
            ${ui.input}
          `}
        />

        {/* Add */}
        <button
          onClick={() =>
            setShowModal(true)
          }
          className="
            h-14 px-8 rounded-2xl
            bg-green-600 hover:bg-green-700
            active:scale-95
            transition-all
            text-white font-bold
          "
        >
          + Add Supplier
        </button>

      </div>

      {/* Empty */}
      {!filteredSuppliers.length ? (

        <div
          className={`
            p-20 rounded-3xl border
            text-center text-slate-400
            ${ui.card}
          `}
        >
          No suppliers available
        </div>

      ) : (

        /* Table */
        <div
          className={`
            rounded-3xl border overflow-hidden
            ${ui.card}
          `}
        >

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead>

                <tr className="
                  border-b border-[#1e293b]
                  text-left text-sm
                  text-slate-400
                ">

                  {[
                    "Supplier",
                    "Contact",
                    "Email",
                    "City",
                    "Joined",
                    "Action",
                  ].map((head) => (
                    <th
                      key={head}
                      className="p-5"
                    >
                      {head}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody>

                {filteredSuppliers.map(
                  (supplier) => (

                    <tr
                      key={supplier.id}
                      className="
                        border-b border-[#1e293b]
                        hover:bg-slate-500/5
                      "
                    >

                      {/* Name */}
                      <td className="
                        p-5 font-semibold
                      ">
                        {supplier.name}
                      </td>

                      {/* Contact */}
                      <td className="
                        p-5 text-slate-300
                      ">
                        {supplier.contact || "N/A"}
                      </td>

                      {/* Email */}
                      <td className="
                        p-5 text-slate-300
                      ">
                        {supplier.email || "N/A"}
                      </td>

                      {/* City */}
                      <td className="
                        p-5 text-slate-300
                      ">
                        {supplier.city || "N/A"}
                      </td>

                      {/* Joined */}
                      <td className="
                        p-5 text-slate-300
                      ">
                        {supplier.joined}
                      </td>

                      {/* Action */}
                      <td className="p-5">

                        <button
                          onClick={() =>
                            deleteSupplier(
                              supplier.id
                            )
                          }
                          className="
                            h-12 px-6 rounded-2xl
                            bg-red-600 hover:bg-red-700
                            active:scale-95
                            transition-all
                            text-white font-bold
                          "
                        >
                          🗑 Delete
                        </button>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* Modal */}
      {showModal && (

        <div className="
          fixed inset-0 z-50
          bg-black/70 backdrop-blur-sm
          flex items-center justify-center
          p-4
        ">

          <div className="
            w-full max-w-xl
            rounded-[32px]
            border border-[#1e293b]
            bg-[#0f172a]
            p-7
          ">

            {/* Title */}
            <div className="
              flex items-center justify-between
              mb-6
            ">

              <h2 className="
                text-2xl font-black
              ">
                Add Supplier
              </h2>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  w-11 h-11 rounded-2xl
                  bg-slate-500/10
                  text-xl
                "
              >
                ×
              </button>

            </div>

            {/* Inputs */}
            <div className="
              grid md:grid-cols-2 gap-5
            ">

              {[
                {
                  name: "name",
                  placeholder:
                    "Supplier Name",
                  type: "text",
                },
                {
                  name: "contact",
                  placeholder:
                    "Contact Number",
                  type: "text",
                },
                {
                  name: "email",
                  placeholder:
                    "Email Address",
                  type: "email",
                },
                {
                  name: "city",
                  placeholder: "City",
                  type: "text",
                },
              ].map((input) => (

                <input
                  key={input.name}
                  type={input.type}
                  name={input.name}
                  placeholder={
                    input.placeholder
                  }

                  value={
                    form[input.name]
                  }

                  onChange={handleChange}

                  className={`
                    w-full h-14 px-5
                    rounded-2xl border
                    outline-none
                    ${ui.input}
                  `}
                />

              ))}

            </div>

            {/* Buttons */}
            <div className="
              flex gap-4 mt-7
            ">

              <button
                onClick={addSupplier}
                className="
                  w-full h-14 rounded-2xl
                  bg-green-600 hover:bg-green-700
                  active:scale-95
                  transition-all
                  text-white font-bold
                "
              >
                Save Supplier
              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  w-full h-14 rounded-2xl
                  bg-slate-500/10
                  font-bold
                "
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

export default Suppliers;