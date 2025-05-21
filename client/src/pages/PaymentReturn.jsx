import { useEffect, useState } from "react";
import api from "../req";

function PaymentReturn() {
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function handlePaymentReturn() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        const paymentReference = urlParams.get("paymentReference");

        if (!paymentReference) {
          setError("No payment reference found");
          setProcessing(false);
          return;
        }

        await api.get(`/wallet/verify/${paymentReference}`);
        setProcessing(false);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } catch (err) {
        console.error("Error processing payment return:", err);
        setError("Failed to process payment confirmation");
        setProcessing(false);
      }
    }

    handlePaymentReturn();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {error ? (
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-700">{error}</p>
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your payment...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentReturn;
