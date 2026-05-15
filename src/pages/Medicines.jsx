import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  useTheme,
} from "../context/ThemeContext";

function Medicines() {

  const { darkMode } =
    useTheme();

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
  const [medicines, setMedicines] =
    useState([]);

  const [show, setShow] =
    useState(false);

  const [edit, setEdit] =
    useState(false);

  const [currentId, setCurrentId] =
    useState(null);

  // Form
  const [form, setForm] =
    useState({
      name: "",
      category: "",
      stock: "",
      minStock: "",
      buyPrice: "",
      sellPrice: "",
      expiryDate: "",
    });

  // Firebase
  const medicinesRef =
    collection(
      db,
      "medicines"
    );

  // Fetch
  const fetchMedicines =
    async () => {

      const data =
        await getDocs(
          medicinesRef
        );

      setMedicines(

        data.docs.map(
          (d) => ({
            id: d.id,
            ...d.data(),
          })
        )
      );
    };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Reset
  const reset = () => {

    setForm({
      name: "",
      category: "",
      stock: "",
      minStock: "",
      buyPrice: "",
      sellPrice: "",
      expiryDate: "",
    });

    setShow(false);

    setEdit(false);

    setCurrentId(null);
  };

  // Save
  const save =
    async (e) => {

      e.preventDefault();

      try {

        if (edit) {

          await updateDoc(

            doc(
              db,
              "medicines",
              currentId
            ),

            form
          );

        } else {

          await addDoc(
            medicinesRef,
            form
          );
        }

        fetchMedicines();

        reset();

      } catch (err) {

        console.log(err);
      }
    };

  // Edit
  const handleEdit =
    (item) => {

      setForm(item);

      setCurrentId(
        item.id
      );

      setEdit(true);

      setShow(true);
    };

  // Delete
  const remove =
    async (id) => {

      if (
        window.confirm(
          "Delete medicine?"
        )
      ) {

        await deleteDoc(

          doc(
            db,
            "medicines",
            id
          )
        );

        fetchMedicines();
      }
    };

  return (

    <div className={`
      min-h-screen
      p-4 md:p-6
      ${ui.bg}
    `}>

      {/* Header */}
      <div className="
        flex items-center
        justify-between
        mb-6
      ">

        <div>

          <h1 className="
            text-3xl font-black
          ">
            Medicines 💊
          </h1>

          <p className={ui.text}>
            Manage pharmacy medicines
          </p>

        </div>

        <button
          onClick={() => {
            reset();
            setShow(true);
          }}
          className="
            h-14 px-6
            rounded-2xl
            bg-green-600
            hover:bg-green-700
            text-white font-bold
          "
        >
          + Add Medicine
        </button>

      </div>

      {/* Table */}
      <div className={`
        rounded-3xl border
        overflow-hidden
        ${ui.card}
      `}>

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full min-w-[900px]
          ">

            <thead>

              <tr className="
                border-b border-[#1e293b]
                text-slate-400 text-sm
              ">

                {[
                  "Name",
                  "Category",
                  "Stock",
                  "Buy",
                  "Sell",
                  "Expiry",
                  "Actions",
                ].map((h) => (

                  <th
                    key={h}
                    className="
                      p-4 text-left
                    "
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>

            <tbody>

              {!medicines.length ? (

                <tr>

                  <td
                    colSpan="7"
                    className="
                      p-10 text-center
                      text-slate-400
                    "
                  >
                    No medicines found
                  </td>

                </tr>

              ) : (

                medicines.map(
                  (item) => {

                    // Expiry
                    const expiry =
                      new Date(
                        item.expiryDate
                      );

                    const today =
                      new Date();

                    const sixtyDays =
                      new Date(
                        Date.now() +
                        60 *
                          24 *
                          60 *
                          60 *
                          1000
                      );

                    const expired =
                      expiry <
                      today;

                    const nearExpiry =
                      expiry <=
                      sixtyDays;

                    return (

                      <tr
                        key={item.id}
                        className="
                          border-b border-[#1e293b]
                          hover:bg-slate-500/5
                        "
                      >

                        {/* Name */}
                        <td className="
                          p-4 font-bold
                        ">
                          {item.name}
                        </td>

                        {/* Category */}
                        <td className="p-4">

                          <span className="
                            px-3 py-1
                            rounded-xl
                            text-xs
                            bg-slate-500/10
                          ">
                            {item.category}
                          </span>

                        </td>

                        {/* Stock */}
                        <td className="p-4">

                          <span className={`
                            font-bold

                            ${
                              Number(
                                item.stock
                              ) <=
                              Number(
                                item.minStock
                              )

                                ? "text-red-400"

                                : "text-green-400"
                            }
                          `}>

                            {item.stock}

                          </span>

                        </td>

                        {/* Buy */}
                        <td className="
                          p-4 font-bold
                          text-orange-400
                        ">
                          $
                          {item.buyPrice}
                        </td>

                        {/* Sell */}
                        <td className="
                          p-4 font-bold
                          text-green-400
                        ">
                          $
                          {item.sellPrice}
                        </td>

                        {/* Expiry */}
                        <td className="p-4">

                          <span className={`
                            px-3 py-1
                            rounded-xl
                            text-xs font-bold

                            ${
                              expired

                                ? "bg-red-500/20 text-red-400"

                                : nearExpiry

                                ? "bg-yellow-500/20 text-yellow-400"

                                : "bg-green-500/20 text-green-400"
                            }
                          `}>

                            {expired

                              ? "Expired"

                              : nearExpiry

                              ? "60 Days Left"

                              : item.expiryDate}

                          </span>

                        </td>

                        {/* Actions */}
                        <td className="p-4">

                          <div className="
                            flex gap-2
                          ">

                            <button
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              className="
                                h-10 px-4
                                rounded-xl
                                bg-blue-600
                                hover:bg-blue-700
                                text-white text-sm
                              "
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                remove(
                                  item.id
                                )
                              }
                              className="
                                h-10 px-4
                                rounded-xl
                                bg-red-600
                                hover:bg-red-700
                                text-white text-sm
                              "
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

      </div>

      {/* Modal */}
      {show && (

        <div className="
          fixed inset-0 z-50
          bg-black/70
          backdrop-blur-sm
          flex items-center
          justify-center
          p-4
        ">

          <div className="
            w-full max-w-2xl
            rounded-[32px]
            border border-[#1e293b]
            bg-[#0f172a]
            p-7 shadow-2xl
          ">

            {/* Top */}
            <div className="
              flex items-center
              justify-between
              mb-6
            ">

              <h2 className="
                text-2xl font-black
              ">

                {edit
                  ? "Edit Medicine"
                  : "Add Medicine"}

              </h2>

              <button
                onClick={reset}
                className="
                  w-11 h-11
                  rounded-2xl
                  bg-slate-500/10
                  text-xl
                "
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={save}
              className="
                grid md:grid-cols-2
                gap-5
              "
            >

              {[
                {
                  name: "name",
                  type: "text",
                  placeholder:
                    "Medicine Name",
                },

                {
                  name: "category",
                  type: "text",
                  placeholder:
                    "Category",
                },

                {
                  name: "stock",
                  type: "number",
                  placeholder:
                    "Stock",
                },

                {
                  name: "minStock",
                  type: "number",
                  placeholder:
                    "Min Stock",
                },

                {
                  name: "buyPrice",
                  type: "number",
                  placeholder:
                    "Buy Price",
                },

                {
                  name: "sellPrice",
                  type: "number",
                  placeholder:
                    "Sell Price",
                },

                {
                  name: "expiryDate",
                  type: "date",
                },
              ].map((input) => (

                <input
                  key={input.name}
                  type={input.type}
                  placeholder={
                    input.placeholder
                  }

                  value={
                    form[
                      input.name
                    ]
                  }

                  onChange={(e) =>
                    setForm({
                      ...form,

                      [input.name]:
                        e.target.value,
                    })
                  }

                  className={`
                    w-full h-14 px-5
                    rounded-2xl border
                    outline-none
                    ${ui.input}
                  `}
                />

              ))}

              {/* Buttons */}
              <div className="
                md:col-span-2
                flex gap-4 pt-2
              ">

                <button
                  type="button"
                  onClick={reset}
                  className="
                    w-full h-14
                    rounded-2xl
                    bg-slate-500/10
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    w-full h-14
                    rounded-2xl
                    bg-green-600
                    hover:bg-green-700
                    text-white font-bold
                  "
                >

                  {edit
                    ? "Update"
                    : "Save"}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Medicines;