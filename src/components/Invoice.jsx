import React, {
  forwardRef,
} from "react";

const Invoice = forwardRef(
  (
    {
      cart,
      customerName,
      customerPhone,
      total,
      subtotal,
      taxAmount,
      discount,
      paid,
      debt,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="w-full max-w-5xl mx-auto bg-white text-black border border-gray-300"
      >
        {/* Header */}
        <div
          className="bg-cyan-800 text-white
          px-5 sm:px-10 py-8
          flex flex-col md:flex-row
          justify-between gap-6"
        >
          {/* Invoice Title */}
          <div>
            <h1
              className="text-4xl sm:text-6xl
              font-light tracking-widest"
            >
              INVOICE
            </h1>
          </div>

          {/* Company Info */}
          <div
            className="text-sm leading-7
            md:text-right"
          >
            <strong>
              ANFAC PHARMACY
            </strong>

            <br />

            Mogadishu Somalia

            <br />

            +252615189953

            <br />

            anfac@gmail.com
          </div>
        </div>

        {/* Invoice Info */}
        <div
          className="grid grid-cols-1 md:grid-cols-2
          gap-10 px-5 sm:px-10 py-10"
        >
          {/* Left Info */}
          <div>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-bold pb-4 w-[140px]">
                    Invoice No.
                  </td>

                  <td>
                    #
                    {Math.floor(
                      Math.random() *
                        100000
                    )}
                  </td>
                </tr>

                <tr>
                  <td className="font-bold pb-4">
                    Date
                  </td>

                  <td>
                    {new Date().toLocaleDateString()}
                  </td>
                </tr>

                <tr>
                  <td className="font-bold pb-4">
                    Status
                  </td>

                  <td>
                    {debt > 0
                      ? "Debt"
                      : "Paid"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customer Info */}
          <div className="md:text-right">
            <h3 className="text-2xl font-bold mb-4">
              Bill To
            </h3>

            <p className="font-bold mb-2">
              Customer Name:
            </p>

            <h2
              className="text-xl sm:text-2xl
              text-cyan-800 font-bold mb-5"
            >
              {customerName ||
                "Customer Name"}
            </h2>

            <p className="font-bold mb-2">
              Phone:
            </p>

            <p>
              {customerPhone ||
                "No Phone"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="px-3 sm:px-10 overflow-x-auto">
          <table className="w-full border-collapse min-w-[700px]">
            <thead>
              <tr
                className="border-y-2 border-gray-600
                bg-slate-50"
              >
                <th className={tableHead}>
                  Item
                </th>

                <th className={tableHead}>
                  Medicine
                </th>

                <th className={tableHead}>
                  Qty
                </th>

                <th className={tableHead}>
                  Rate
                </th>

                <th className={tableHead}>
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {cart.map(
                (item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-300"
                  >
                    <td className={tableCell}>
                      {index + 1}
                    </td>

                    <td className={tableCell}>
                      {item.name}
                    </td>

                    <td className={tableCell}>
                      {item.qty}
                    </td>

                    <td className={tableCell}>
                      $
                      {
                        item.sellPrice
                      }
                    </td>

                    <td className={tableCell}>
                      $
                      {(
                        item.sellPrice *
                        item.qty
                      ).toFixed(2)}
                    </td>
                  </tr>
                )
              )}

              {/* Empty Rows */}
              {Array.from({
                length: Math.max(
                  0,
                  5 - cart.length
                ),
              }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="h-[50px] border-b border-gray-300"
                >
                  <td className={tableCell}></td>
                  <td className={tableCell}></td>
                  <td className={tableCell}></td>
                  <td className={tableCell}></td>
                  <td className={tableCell}></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <table className="w-full max-w-sm">
              <tbody>
                <tr>
                  <td className={totalLabel}>
                    Subtotal
                  </td>

                  <td className={totalValue}>
                    $
                    {subtotal.toFixed(
                      2
                    )}
                  </td>
                </tr>

                <tr>
                  <td className={totalLabel}>
                    Discount
                  </td>

                  <td className={totalValue}>
                    $
                    {discount.toFixed(
                      2
                    )}
                  </td>
                </tr>

                <tr>
                  <td className={totalLabel}>
                    Tax
                  </td>

                  <td className={totalValue}>
                    $
                    {taxAmount.toFixed(
                      2
                    )}
                  </td>
                </tr>

                <tr>
                  <td className={totalLabel}>
                    Paid
                  </td>

                  <td className={totalValue}>
                    $
                    {paid.toFixed(2)}
                  </td>
                </tr>

                <tr className="border-t-2 border-gray-600">
                  <td
                    className={`${totalLabel}
                    text-lg font-bold`}
                  >
                    Total
                  </td>

                  <td
                    className={`${totalValue}
                    text-lg font-bold
                    bg-sky-100`}
                  >
                    $
                    {total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div
          className="bg-cyan-800 text-white
          text-center font-bold
          py-5 mt-10"
        >
          Thank you for your business!
        </div>
      </div>
    );
  }
);

/* Table Styles */

const tableHead =
  "text-left p-4 text-sm font-bold";

const tableCell =
  "p-4 text-sm";

const totalLabel =
  "p-3 font-bold";

const totalValue =
  "p-3 text-right";

export default Invoice;