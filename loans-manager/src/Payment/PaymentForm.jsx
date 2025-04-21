import { React, useState } from "react";

function PaymentForm({
  payment,
  onClose,
  setRefreshData,
  clientId,
  setShowPaymentModal,
  setEditItem,
}) {
  const [formData, setFormData] = useState(
    payment || {
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number.parseFloat(value) || "" : value,
    });
  };

  const handleCreatePayment = (e) => {
    e.preventDefault();
    if (payment) {
      fetch(`${process.env.REACT_APP_API_URL}/payments/${payment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          clientId: clientId,
          date: payment.date,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setRefreshData(prev => prev + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          clientId: clientId,
          date: new Date().toISOString().split("T")[0],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setRefreshData(prev => prev + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setShowPaymentModal(false);
    setEditItem(null);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {payment ? "Edit Payment" : "Create New Payment"}
          </h3>
        </div>
        <form onSubmit={handleCreatePayment}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Amount
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Payment Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={new Date(formData.date).toISOString().split("T")[0]}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {payment ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default PaymentForm;
