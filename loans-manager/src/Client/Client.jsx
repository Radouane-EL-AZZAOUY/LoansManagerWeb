import { useEffect, useState } from "react";
import NavBar from "../Layout/NavBar";
import { useParams } from "react-router-dom";
import PaymentsTab from "../Payment/Payments";
import LoanForm from "../Loan/LoanForm";
import PaymentForm from "../Payment/PaymentForm";
import LoansTab from "../Loan/Loans";
import {
  DollarSign,
  Wallet,
  BanknoteIcon,
  CreditCard,
} from "lucide-react";

export default function LoanManagementPage() {
  const [activeTab, setActiveTab] = useState("loans");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [refreshData, setRefreshData] = useState(0);



  const { id: clientId } = useParams();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  useEffect(() => {

    if (!clientId) return;

    fetch(`${process.env.REACT_APP_API_URL}/loans/${clientId}`)
      .then((response) => response.json())
      .then((data) => {
        setLoans(data.data ?? []);
        console.log(data);
      })
      .catch((error) => console.error(error));
      
      fetch(`${process.env.REACT_APP_API_URL}/payments/${clientId}`)
      .then((respone) => respone.json())
      .then((data) => {
        setPayments(data.data ?? []);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [refreshData, clientId]);

  const totalLoans = loans?.length ?? 0;
  const totalLoanAmount = loans?.reduce((sum, loan) => sum + (loan.amount*loan.quantity), 0);
  const totalPayments = payments?.length;
  const totalPaymentAmount = payments?.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar />
      {/* Header with statistics */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Loan Management Dashboard
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <CreditCard size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Loans
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-gray-900">
                      {totalLoans}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <DollarSign size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Loan Amount
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-gray-900">
                      ${totalLoanAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <BanknoteIcon size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Payments
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-gray-900">
                      {totalPayments}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <Wallet size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    Total Payments Amount
                  </p>
                  <div className="flex items-center">
                    <p className="text-xl font-semibold text-gray-900">
                      ${totalPaymentAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("loans")}
              className={`${
                activeTab === "loans"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Loans
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`${
                activeTab === "payments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Payments
            </button>
          </nav>
        </div>

        {/* Loans Tab */}
        {activeTab === "loans" && (
          <LoansTab
            clientId={clientId}
            formatDate={formatDate}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            setShowLoanModal={setShowLoanModal}
            setEditItem={setEditItem}
            loans={loans}
          />
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <PaymentsTab
            clientId={clientId}
            formatDate={formatDate}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
            setShowPaymentModal={setShowPaymentModal}
            setEditItem={setEditItem}
            payments={payments}
          />
        )}
      </main>

      {/* Loan Modal */}
      {showLoanModal && (
        <LoanForm
          loan={editItem}
          onClose={() => {
            setShowLoanModal(false);
            setEditItem(null);
          }}
          setRefreshData={setRefreshData}
          clientId={clientId}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentForm
          payment={editItem}
          loans={loans}
          onClose={() => {
            setShowPaymentModal(false);
            setEditItem(null);
          }}
          setRefreshData={setRefreshData}
          clientId={clientId}
          setShowPaymentModal={setShowPaymentModal}
          setEditItem={setEditItem}
        />
      )}
    </div>
  );
}
