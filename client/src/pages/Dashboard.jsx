import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Clock,
  Plus,
  RefreshCw,
  ChevronRight,
  ArrowDown,
  X,
  ExternalLink,
  Clipboard,
  TrendingUp,
  Calendar,
  CreditCard,
} from "lucide-react";
import api from "../req";

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    if (!isRefreshing) {
      setIsLoading(true);
    }
    setIsRefreshing(true);
    try {
      const walletData = await api.get("/wallet");
      const txs = await api.get("/wallet/transactions");

      if (walletData.data.name) {
        const firstName = walletData.data.name.split(" ")[0];
        setUserName(firstName);
        setGreeting(getGreeting());
      }

      setBalance(walletData.data.balance);
      setTransactions(txs.data);
      setError("");
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError("Failed to load wallet data. Please try again.");
      if (isLoading) {
        setTransactions([]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100";
      case "pending":
        return "bg-yellow-100";
      case "failed":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    })
      .format(amount)
      .replace("NGN", "₦");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = (text, event) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text);
  };

  const openTransactionDetails = (tx) => {
    setSelectedTransaction(tx);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
  };

  const TransactionItem = ({ tx }) => {
    return (
      <div
        className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-blue-50 transition-all rounded-lg mb-1 cursor-pointer"
        onClick={() => openTransactionDetails(tx)}
      >
        <div className="flex items-center">
          <div className="p-3 rounded-full mr-4 bg-blue-100 text-blue-600">
            <ArrowDown size={18} />
          </div>
          <div>
            <p className="font-medium text-gray-800">Deposit</p>
            <p className="text-xs text-gray-500">{formatDate(tx.created_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-blue-600">
            {formatCurrency(tx.amount)}
          </p>
          <div
            className={`text-xs px-2 py-1 rounded-full inline-block ${getStatusBgColor(tx.status)} ${getStatusColor(tx.status)}`}
          >
            {tx.status}
          </div>
        </div>
      </div>
    );
  };

  const TransactionModal = ({ transaction }) => {
    if (!transaction) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-800">
              Transaction Details
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5">
            {/* Status Banner */}
            <div
              className={`mb-6 p-4 rounded-xl flex items-center justify-between ${getStatusBgColor(transaction.status)}`}
            >
              <span
                className={`font-semibold ${getStatusColor(transaction.status)}`}
              >
                {transaction.status}
              </span>
              <span className="text-gray-800 font-bold">
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
              <DetailItem
                label="Reference"
                value={transaction.reference}
                copyable
              />

              <DetailItem
                label="Payment Method"
                value={transaction.payment_method || "Bank Transfer"}
                icon={<CreditCard size={16} className="text-gray-400" />}
              />

              <DetailItem
                label="Date"
                value={formatDate(transaction.created_at)}
                icon={<Calendar size={16} className="text-gray-400" />}
              />

              {transaction.updated_at !== transaction.created_at && (
                <DetailItem
                  label="Last Updated"
                  value={formatDate(transaction.updated_at)}
                  icon={<Clock size={16} className="text-gray-400" />}
                />
              )}
            </div>
          </div>

          <div className="p-5 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button
              onClick={closeModal}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition mr-3"
            >
              Close
            </button>
            {transaction.status.toLowerCase() === "pending" && (
              <button
                onClick={() => fetchData()}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Check Status
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const DetailItem = ({ label, value, copyable = false, icon }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = (event) => {
      copyToClipboard(value, event);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    return (
      <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
        <span className="text-sm text-gray-500 mb-1 flex items-center gap-2">
          {icon && icon}
          {label}
        </span>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800">{value}</span>
          {copyable && (
            <button
              onClick={handleCopy}
              className="relative text-blue-500 hover:text-blue-700 bg-blue-50 p-1 rounded-full transition-all"
            >
              {copied ? (
                <span className="text-green-500 text-xs absolute -top-5 right-0 whitespace-nowrap bg-green-50 px-2 py-1 rounded-full">
                  Copied!
                </span>
              ) : null}
              <Clipboard size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="relative">
            <RefreshCw size={40} className="text-blue-500 animate-spin" />
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            </div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">
            Loading wallet data...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="bg-red-50 p-6 rounded-xl text-center max-w-md w-full shadow-lg border border-red-100">
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <button
              onClick={() => fetchData()}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto p-6 pt-10">
          {/* Header with personalized greeting */}
          <div className="mb-8">
            <p className="text-gray-500 mb-1">{greeting}</p>
            <h1 className="text-3xl font-bold text-blue-600">
              Welcome, {userName}
            </h1>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full transform -translate-x-10 translate-y-10"></div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wallet size={20} />
                  <span className="font-medium">Wallet Balance</span>
                </div>
                <button
                  onClick={() => fetchData()}
                  disabled={isRefreshing}
                  className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition"
                  aria-label="Refresh wallet balance"
                >
                  <RefreshCw
                    size={16}
                    className={isRefreshing ? "animate-spin" : ""}
                  />
                </button>
              </div>

              <h2 className="text-4xl font-bold mb-2">
                {formatCurrency(balance)}
              </h2>

              <div className="flex justify-end items-center mt-6">
                <div className="flex items-center text-sm bg-green-500 bg-opacity-90 py-1 px-3 rounded-full">
                  <TrendingUp size={14} className="mr-1" />
                  <span>Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/fund-wallet")}
                  className="bg-blue-50 text-blue-600 p-4 rounded-xl hover:bg-blue-100 transition flex flex-col items-center gap-2"
                >
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Plus size={20} className="text-blue-600" />
                  </div>
                  <span className="font-medium">Fund Wallet</span>
                </button>

                <button className="bg-green-50 text-green-600 p-4 rounded-xl hover:bg-green-100 transition flex flex-col items-center gap-2">
                  <div className="bg-green-100 p-3 rounded-full">
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                  <span className="font-medium">Withdraw</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transaction History Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-blue-600" />
                <h2 className="font-bold text-gray-800 text-lg">
                  Transaction History
                </h2>
              </div>
              <button
                onClick={() => fetchData()}
                disabled={isRefreshing}
                className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"
                aria-label="Refresh transaction history"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
              </button>
            </div>

            <div className="p-6">
              {transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((tx, index) => (
                    <TransactionItem key={index} tx={tx} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Clock size={40} className="text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">No transactions yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Fund your wallet to get started
                  </p>
                </div>
              )}
            </div>

            {transactions.length > 5 && (
              <div className="p-6 border-t border-gray-100 flex justify-center">
                <button className="text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition flex items-center gap-1 font-medium">
                  View All Transactions <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Transaction Detail Modal */}
          {showModal && <TransactionModal transaction={selectedTransaction} />}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
