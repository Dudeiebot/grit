import { useState } from "react";
import { ArrowLeft, CreditCard, Lock, Coins, AlertCircle } from "lucide-react";
import api from "../req";

function FundWallet() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAmounts, setSelectedAmounts] = useState([]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
      setError("");
      setSelectedAmounts([]); // Clear quick amounts when manually typing
    }
  };

  const handleQuickAmount = (value) => {
    const numericValue = value / 100;
    let newSelectedAmounts;
    if (selectedAmounts.includes(value)) {
      newSelectedAmounts = selectedAmounts.filter((amt) => amt !== value);
    } else {
      newSelectedAmounts = [...selectedAmounts, value];
    }
    setSelectedAmounts(newSelectedAmounts);
    const total = newSelectedAmounts.reduce((sum, amt) => sum + amt / 100, 0);
    setAmount(total.toFixed(2).toString());
    setError("");
  };

  const goBack = () => {
    window.history.back();
  };

  const fundWallet = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await api.post("/wallet/fund", {
        amount: parseFloat(amount),
        redirect_url: `${window.location.origin}/payment-return`,
      });
      window.location.href = res.data.checkout_url;
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to process payment request",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex items-center">
          <button
            onClick={goBack}
            className="text-white hover:text-blue-200 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="ml-4 text-xl font-semibold text-white">
            Fund Your Wallet
          </h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start animate-in fade-in">
              <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-8">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount to Fund
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500">
                ₦
              </span>
              <input
                type="text"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                aria-describedby="amount-currency"
              />
              <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500">
                NGN
              </span>
            </div>
            <div className="mt-3 text-sm text-gray-500 flex items-center">
              <Coins size={16} className="mr-2 text-blue-500" />
              <span>Enter or select the amount to add to your wallet</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-3">
                Quick Amounts (Click to Sum)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[1000, 5000, 10000, 20000, 50000, 100000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickAmount(value)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedAmounts.includes(value)
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                  >
                    ₦{(value / 100).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={fundWallet}
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            aria-disabled={loading}
          >
            <CreditCard size={20} className="mr-2" />
            {loading ? "Processing..." : "Add Funds"}
          </button>

          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <Lock size={16} className="mr-2" />
            <p>Secure payments powered by our trusted provider</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundWallet;
