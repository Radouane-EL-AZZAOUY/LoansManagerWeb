import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  CreditCard,
  Users,
  FileText,
  BarChart2,
  User,
  LogOut,
  Menu,
} from "lucide-react";

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      setEmail(loginData.email);
    }
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          {/* Logo and Main Nav */}
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className="flex items-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  LoanManager
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink
                to="/dashboard"
                className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-blue-600"
              >
                <Home className="mr-1 h-4 w-4" />
                Dashboard
              </NavLink>
              {/* <NavLink
                to="/dashboard"
                className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-blue-600"
              >
                <Users className="mr-1 h-4 w-4" />
                Clients
              </NavLink>
              <NavLink
                to="/loans"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <FileText className="mr-1 h-4 w-4" />
                Loans
              </NavLink>
              <NavLink
                to="/reports"
                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
              >
                <BarChart2 className="mr-1 h-4 w-4" />
                Reports
              </NavLink> */}
            </div>
          </div>

          {/* User Profile and Mobile Menu Button */}
          <div className="flex items-center">
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 p-1">
                      <User className="h-full w-full text-blue-600" />
                    </div>
                  </button>
                  <div className="ml-2">
                    <div className="text-sm font-medium text-gray-700">
                      Profile
                    </div>
                    <div className="text-xs text-gray-500">{email}</div>
                  </div>
                  <Link
                    to="/login"
                    className="ml-4 rounded-md bg-gray-100 p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  >
                    <LogOut className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            <Link
              to="/"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            >
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </div>
            </Link>
            <Link
              to="/clients"
              className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700"
            >
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Clients
              </div>
            </Link>
            <Link
              to="/loans"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Loans
              </div>
            </Link>
            <Link
              to="/reports"
              className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
            >
              <div className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Reports
              </div>
            </Link>
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 p-1">
                  <User className="h-full w-full text-blue-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  Admin User
                </div>
                <div className="text-sm font-medium text-gray-500">{email}</div>
              </div>
              <Link
                to="/logout"
                className="ml-auto rounded-md bg-gray-100 p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              >
                <LogOut className="h-6 w-6" />
              </Link>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Your Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
