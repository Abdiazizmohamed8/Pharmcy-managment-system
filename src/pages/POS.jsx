import { useState, useEffect, useRef } from "react";
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";
import { useTheme } from "../context/ThemeContext";
import { useReactToPrint } from "react-to-print";
import Invoice from "../components/Invoice";

function POS({ sales = [], setSales, toast, openSidebar }) {
  const { darkMode } = useTheme();
  const invoiceRef = useRef(null);

  /* ==========================================================================
     STATE
     ========================================================================== */
  const [medicines, setMedicines] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const [discountType, setDiscountType] = useState("percent");
  const [discountValue, setDiscountValue] = useState("");

  const [tax, setTax] = useState("");

  /* ==========================================================================
     FIRESTORE REALTIME
     ========================================================================== */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "medicines"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMedicines(data);
      }
    );

    return () => unsubscribe();
  }, []);

  /* ==========================================================================
     PRINT
     ========================================================================== */
  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
  });

  /* ==========================================================================
     SEARCH
     ========================================================================== */
  const filteredMedicines = medicines.filter((medicine) => {
    const text = search.toLowerCase().trim();

    return (
      medicine.name?.toLowerCase().includes(text) ||
      medicine.category?.toLowerCase().includes(text)
    );
  });

  /* ==========================================================================
     CART
     ========================================================================== */
  const addToCart = (medicine) => {
    if (medicine.stock <= 0) {
      toast?.("Out of stock", "error");
      return;
    }

    const exists = cart.find((item) => item.id === medicine.id);

    if (exists) {
      if (exists.qty >= medicine.stock) {
        toast?.("Stock limit reached", "error");
        return;
      }

      setCart(
        cart.map((item) =>
          item.id === medicine.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...medicine, qty: 1 }]);
    }

    toast?.(`${medicine.name} added`);
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) => {
        if (item.id === id) {
          if (item.qty >= item.stock) return item;

          return {
            ...item,
            qty: item.qty + 1,
          };
        }

        return item;
      })
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  /* ==========================================================================
     CALCULATIONS
     ========================================================================== */
  const subtotal = cart.reduce(
    (acc, item) => acc + item.sellPrice * item.qty,
    0
  );

  const discount =
    discountType === "percent"
      ? subtotal * (Number(discountValue || 0) / 100)
      : Number(discountValue || 0);

  const taxAmount = subtotal * (Number(tax || 0) / 100);

  const total = subtotal - discount + taxAmount;

  const paid = Number(paidAmount || 0);

  const debt = total - paid;

  const saleStatus =
    debt <= 0
      ? "Paid"
      : paid > 0
      ? "Partial"
      : "Unpaid";

  /* ==========================================================================
     COMPLETE SALE
     ========================================================================== */
  const completeSale = async () => {
    if (cart.length === 0) {
      toast?.("Cart empty", "error");
      return;
    }

    if (!customerName) {
      toast?.("Customer required", "error");
      return;
    }

    setLoading(true);

    try {
      // GET SALES
      const snapshot = await getDocs(collection(db, "sales"));

      // FIND LAST INVOICE NUMBER
      let lastInvoice = 0;

      snapshot.forEach((saleDoc) => {
        const data = saleDoc.data();

        if (data.invoiceNumber) {
          if (data.invoiceNumber > lastInvoice) {
            lastInvoice = data.invoiceNumber;
          }
        }
      });

      // NEW NUMBER
      const newInvoiceNumber = lastInvoice + 1;

      // SALE DATA
      const saleData = {
        invoiceNumber: newInvoiceNumber,

        customer: customerName,
        phone: customerPhone,
        address: customerAddress,

        items: cart,

        subtotal,
        discount,
        taxAmount,
        total,
        paid,
        debt,

        method: paymentMethod,
        status: saleStatus,

        createdAt: Date.now(),
        date: new Date().toISOString(),
      };

      // SAVE SALE
      await setDoc(
        doc(db, "sales", String(newInvoiceNumber)),
        saleData
      );

      // UPDATE STOCK
      for (const item of cart) {
        await updateDoc(doc(db, "medicines", item.id), {
          stock: item.stock - item.qty,
          sold: Number(item.sold || 0) + item.qty,
        });
      }

      // SAVE CUSTOMER
      await setDoc(
        doc(db, "customers", customerPhone || customerName),
        {
          name: customerName,
          phone: customerPhone,
          address: customerAddress,
          debt,
          status: debt > 0 ? "Debt" : "Paid",
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      // UPDATE LOCAL SALES
         setSales?.([
         ...sales,
        {
            id: newInvoiceNumber,
              ...saleData,
       },
    ]);

      toast?.("Sale completed", "success");

      // RESET
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");

      setPaidAmount("");
      setDiscountValue("");
      setTax("");

      setPaymentMethod("Cash");
    } catch (error) {
      console.error(error);
      toast?.("Sale failed", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================================
     THEME
     ========================================================================== */
  const themeBg = darkMode
    ? "bg-[#090d16] text-white"
    : "bg-slate-50 text-gray-950";

  const cardBg = darkMode
    ? "bg-[#131926] border-[#1e293b]"
    : "bg-white border-slate-200";

  const inputBg = darkMode
    ? "bg-[#0f172a] border-[#374151] text-white focus:border-green-600"
    : "bg-white border-gray-300 text-gray-950 focus:border-green-600";

  const subText = darkMode
    ? "text-slate-400"
    : "text-gray-500";

  /* ==========================================================================
     UI
     ========================================================================== */
  return (
    <div
      className={`w-full min-h-screen p-4 md:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] xl:grid-cols-[1.4fr_0.8fr] gap-6 overflow-x-hidden box-border ${themeBg}`}
    >
      {/* LEFT */}
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-4 flex-wrap mb-6">
          <button
            onClick={openSidebar}
            className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xl font-bold cursor-pointer shadow-sm lg:hidden ${cardBg}`}
          >
            ☰
          </button>

          <div>
            <h1 className="m-0 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              POS 🛒
            </h1>

            <p className={`mt-1 text-sm font-medium ${subText}`}>
              Pharmacy sales system
            </p>
          </div>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full p-4 rounded-xl border outline-none text-sm mb-6 transition-all ${inputBg}`}
        />

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMedicines.map((medicine) => (
            <div
              key={medicine.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between gap-5 transition-all shadow-sm ${cardBg}`}
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold tracking-wide">
                  {medicine.name}
                </h3>

                <p className={`text-xs ${subText}`}>
                  {medicine.category}
                </p>

                <p className="text-xs text-green-500 font-bold">
                  Stock: {medicine.stock}
                </p>

                <h2 className="text-xl font-extrabold text-green-500">
                  $
                  {Number(medicine.sellPrice || 0).toFixed(2)}
                </h2>
              </div>

              <button
                onClick={() => addToCart(medicine)}
                className="w-full bg-[#16a34a] text-white border-none py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-green-700 transition-colors"
              >
                Add Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div
        className={`p-4 sm:p-5 lg:p-6 rounded-2xl border h-fit lg:sticky lg:top-6 shadow-md ${cardBg}`}
      >
        <h2 className="text-lg font-extrabold tracking-wide mb-5">
          Cart 🛒
        </h2>

        {/* FORM */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={customerPhone}
            onChange={(e) =>
              setCustomerPhone(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          />

          <input
            type="text"
            placeholder="Address"
            value={customerAddress}
            onChange={(e) =>
              setCustomerAddress(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          />

          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          >
            <option>Cash</option>
            <option>EVC PLUS</option>
            <option>E-DAHAB</option>
            <option>Debt</option>
          </select>

          <input
            type="number"
            placeholder="Paid Amount"
            value={paidAmount}
            onChange={(e) =>
              setPaidAmount(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          />

          <select
            value={discountType}
            onChange={(e) =>
              setDiscountType(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          >
            <option value="percent">
              Percentage %
            </option>

            <option value="fixed">
              Fixed Amount
            </option>
          </select>

          <input
            type="number"
            placeholder="Discount"
            value={discountValue}
            onChange={(e) =>
              setDiscountValue(e.target.value)
            }
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          />

          <input
            type="number"
            placeholder="Tax / VAT %"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className={`w-full p-3.5 rounded-xl border outline-none text-sm transition-all ${inputBg}`}
          />
        </div>

        {/* CART */}
        <div className="mt-5 max-h-[280px] overflow-y-auto overflow-x-hidden pr-1 space-y-1 divide-y divide-slate-700/20">
          {cart.length === 0 ? (
            <div
              className={`text-center py-8 text-sm ${subText}`}
            >
              Cart empty
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center gap-3 flex-wrap py-3 first:pt-0"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold truncate">
                    {item.name}
                  </h4>

                  <p className="text-xs text-green-500 font-semibold">
                    $
                    {Number(
                      item.sellPrice || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <button
                    onClick={() =>
                      decreaseQty(item.id)
                    }
                    className="w-8 h-8 bg-[#16a34a] text-white border-none rounded-lg cursor-pointer font-bold flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    -
                  </button>

                  <strong className="text-sm min-w-[15px] text-center">
                    {item.qty}
                  </strong>

                  <button
                    onClick={() =>
                      increaseQty(item.id)
                    }
                    className="w-8 h-8 bg-[#16a34a] text-white border-none rounded-lg cursor-pointer font-bold flex items-center justify-center hover:bg-green-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 border-t border-slate-700/20 pt-4 space-y-2">
          <div
            className={`flex justify-between text-xs font-semibold ${subText}`}
          >
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div
            className={`flex justify-between text-xs font-semibold ${subText}`}
          >
            <span>Discount:</span>
            <span>- ${discount.toFixed(2)}</span>
          </div>

          <div
            className={`flex justify-between text-xs font-semibold ${subText}`}
          >
            <span>Tax:</span>
            <span>+ ${taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-black tracking-tight border-y border-dashed border-slate-700/20 py-2.5">
            <span>Total:</span>

            <span className="text-green-500">
              ${total.toFixed(2)}
            </span>
          </div>

          <div
            className={`flex justify-between text-xs font-semibold ${subText}`}
          >
            <span>Paid:</span>
            <span>${paid.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm font-bold">
            <span>Debt:</span>

            <span
              className={
                debt > 0
                  ? "text-red-500"
                  : "text-green-500"
              }
            >
              ${debt.toFixed(2)}
            </span>
          </div>

          {/* BUTTONS */}
          <div className="pt-3 space-y-2">
            <button
              onClick={handlePrintInvoice}
              className="w-full bg-[#0ea5e9] text-white border-none py-3.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-sky-600 transition-colors shadow-sm"
            >
              Print Invoice
            </button>

            <button
              onClick={completeSale}
              disabled={loading}
              className="w-full bg-[#16a34a] text-white border-none py-3.5 rounded-xl font-bold text-sm cursor-pointer disabled:opacity-60 hover:bg-green-700 transition-colors shadow-sm"
            >
              {loading
                ? "Processing..."
                : "Complete Sale"}
            </button>
          </div>
        </div>
      </div>

      {/* PRINT */}
      <div className="absolute left-[-9999px] top-0">
        <Invoice
          ref={invoiceRef}
          cart={cart}
          customerName={customerName}
          customerPhone={customerPhone}
          total={total}
          subtotal={subtotal}
          taxAmount={taxAmount}
          discount={discount}
          paid={paid}
          debt={debt}
        />
      </div>
    </div>
  );
}

export default POS;