import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FundWallet from "./pages/FundWallet";
import PaymentReturn from "./pages/PaymentReturn";
import ProtectedRoute from "./components/ProtectedRoutes";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("access");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("access");
    sessionStorage.removeItem("refresh");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <Navbar
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="container mx-auto px-4 py-8 pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route path="/payment-return" element={<PaymentReturn />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fund-wallet"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <FundWallet />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function Navbar({
  isAuthenticated,
  handleLogout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white backdrop-blur-lg bg-opacity-80 text-gray-800 py-4 px-6 shadow-lg fixed w-full z-10 transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        <div
          className="font-bold text-xl cursor-pointer flex items-center"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-md">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-extrabold">
            Dexter<span className="font-normal">Pay</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-2">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center text-gray-700"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  ></path>
                </svg>
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center shadow-md"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  ></path>
                </svg>
                Register
              </button>
            </>
          ) : (
            <>
              {location.pathname === "/" && (
                <>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      ></path>
                    </svg>
                    Dashboard
                  </button>

                  <button
                    onClick={() => navigate("/fund-wallet")}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition flex items-center shadow-md"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      ></path>
                    </svg>
                    Fund Wallet
                  </button>
                </>
              )}

              {/* Logout button is always shown when authenticated */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white bg-opacity-95 backdrop-blur-lg border-t border-gray-200 py-3 animate-fade-in-down">
          <div className="flex flex-col space-y-3 px-6">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition flex items-center shadow-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left rounded-lg hover:bg-gray-100 transition flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate("/fund-wallet");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:opacity-90 transition flex items-center shadow-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  Fund Wallet
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
        <div className="md:w-1/2 text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            Simple, Secure, Swift
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            The Smart Way to Manage Your Money
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Experience seamless financial management with our cutting-edge
            digital wallet. Send money, track expenses, and watch your savings
            grow — all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition transform hover:-translate-y-1 shadow-lg font-medium text-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 bg-white border border-gray-300 text-gray-800 rounded-xl hover:bg-gray-50 transition transform hover:-translate-y-1 shadow-md font-medium text-lg"
            >
              Sign In
            </button>
          </div>

          <div className="mt-16 flex justify-center md:justify-start space-x-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-gray-500">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1M+</div>
              <div className="text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">₦0</div>
              <div className="text-gray-500">Monthly Fee</div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>

            {/* Glass card effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl transform rotate-3 scale-105 opacity-20 shadow-xl"></div>

            <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                    D
                  </div>
                  <div className="ml-3">
                    <div className="font-bold text-gray-800 text-lg">
                      DexterPay
                    </div>
                    <div className="text-sm text-gray-500">Premium Account</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-medium">
                    Balance
                  </div>
                  <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ₦1,500,000.00
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">
                        Recent Transaction
                      </div>
                      <div className="font-medium text-gray-800">
                        Coffee Shop
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-500 font-medium">
                        -₦15,000.00
                      </div>
                      <div className="text-xs text-gray-400">
                        Today, 9:32 AM
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm text-gray-500 font-medium">
                        Recent Transaction
                      </div>
                      <div className="font-medium text-gray-800">
                        Salary Deposit
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-500 font-medium">
                        +₦1,000,000.50
                      </div>
                      <div className="text-xs text-gray-400">May 18, 2025</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">
                        Ready to grow your money?
                      </div>
                      <div className="text-sm text-gray-600">
                        Fund your wallet in seconds
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card control buttons */}
              <div className="mt-8 grid grid-cols-3 gap-2">
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  <span className="text-xs mt-1 text-gray-600">Send</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                  <span className="text-xs mt-1 text-gray-600">Top Up</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  <span className="text-xs mt-1 text-gray-600">Stats</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Our Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DexterPay
            </span>
            ?
          </h2>
          <p className="text-gray-600">
            We've built a digital wallet with the features you need and none of
            the complexity you don't.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Bank-Level Security
            </h3>
            <p className="text-gray-600">
              Your money is protected with end-to-end encryption and advanced
              fraud detection systems. We prioritize your financial safety with
              regular security audits.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Instant Transfers
            </h3>
            <p className="text-gray-600">
              Send money to anyone, anywhere, instantly. No waiting periods, no
              hidden fees, just fast and reliable transfers every time.
            </p>
          </div>

          <div className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              Financial Insights
            </h3>
            <p className="text-gray-600">
              Gain valuable insights into your spending habits with intelligent
              analytics. Make smarter financial decisions with personalized
              reports.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              DexterPay
            </span>{" "}
            Works
          </h2>
          <p className="text-gray-600">
            Getting started with DexterPay is quick and easy. Just follow these
            simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 h-full">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Sign Up</h3>
              <p className="text-gray-600">
                Create your account in under 2 minutes with just your email
                address
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 h-full">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Fund Your Wallet
              </h3>
              <p className="text-gray-600">
                Add money securely via bank transfer, card, or other payment
                methods
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 h-full">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Send & Receive
              </h3>
              <p className="text-gray-600">
                Transfer money instantly to friends and family, pay bills, or
                receive payments
              </p>
            </div>
            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
              <svg
                className="w-8 h-8 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          {/* Step 4 */}
          <div>
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 h-full">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xl mb-4">
                4
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">
                Track & Manage
              </h3>
              <p className="text-gray-600">
                Monitor your spending, analyze trends, and grow your savings
                with smart tools
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What Our Users Are Saying
          </h2>
          <p className="text-gray-600">
            Join thousands of satisfied users who have transformed their
            financial lives with DexterPay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                C
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Chioma N.</h4>
                <p className="text-gray-500 text-sm">Lagos, Nigeria</p>
              </div>
              <div className="ml-auto flex text-yellow-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 italic mb-6">
              "DexterPay has completely changed how I manage my finances. I can
              send money to my family in the village instantly, and the expense
              tracking helps me save more each month!"
            </p>
            <div className="text-blue-600 text-sm font-medium">
              DexterPay user since 2024
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                M
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Michael T.</h4>
                <p className="text-gray-500 text-sm">Abuja, Nigeria</p>
              </div>
              <div className="ml-auto flex text-yellow-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 italic mb-6">
              "As a small business owner, DexterPay has been a game-changer. The
              invoicing feature helps me get paid faster, and the seamless
              currency conversion saves me money on international transactions."
            </p>
            <div className="text-blue-600 text-sm font-medium">
              DexterPay user since 2023
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                T
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Tobi K.</h4>
                <p className="text-gray-500 text-sm">Abuja, Nigeria</p>
              </div>
              <div className="ml-auto flex text-yellow-400">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 italic mb-6">
              "The budgeting tools in DexterPay helped me save enough for my
              university tuition. I especially love how it sends me
              notifications when I'm close to overspending in a category!"
            </p>
            <div className="text-blue-600 text-sm font-medium">
              DexterPay user since 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
