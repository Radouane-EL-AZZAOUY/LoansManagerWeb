import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
  Eye,
  Edit,
  Trash2,
  X,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import NavBar from "../Layout/NavBar";

function ClientsDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [formErrors, setFormErrors] = useState({});
  const [refreshData, setRefreshData] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    firstName: "",
    lastName: "",
    phone: "",
    status: "active",
  });

  const [clientsData, setClientsData] = useState([]);
  const [stats, setStats] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/clients/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setClientsData(data.data);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });

    fetch(`${process.env.REACT_APP_API_URL}/loans/statistics/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setStats(data[0]);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
      });
  }, [refreshData, userId]);

  const filteredClients = clientsData
    .filter((client) =>
      (client.firstName + " " + client.lastName)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((client) => {
      return {
        ...client,
        totalAmount: client.totalAmount || 0,
        totalLoans: client.totalLoans || 0,
        createdDate:
          client.createdDate || new Date().toISOString().split("T")[0],
      };
    });

  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === "firstName") {
      return sortOrder === "asc"
        ? a.firstName.localeCompare(b.firstName)
        : b.firstName.localeCompare(a.firstName);
    } else if (sortBy === "lastName") {
      return sortOrder === "asc"
        ? a.lastName.localeCompare(b.lastName)
        : b.lastName.localeCompare(a.lastName);
    } else if (sortBy === "totalLoans") {
      return sortOrder === "asc"
        ? a.totalLoans - b.totalLoans
        : b.totalLoans - a.totalLoans;
    } else if (sortBy === "createdDate") {
      return sortOrder === "asc"
        ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
        : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    }
    return 0;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(sortedClients.length / itemsPerPage);
  const paginatedClients = sortedClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleAddClient = () => {
    setModalMode("add");
    setFormData({
      id: null,
      firstName: "",
      lastName: "",
      phone: "",
      status: "active",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditClient = (client) => {
    setModalMode("edit");
    setFormData({
      ...client,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveClient = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const clientData = formData;
    clientData.createdDate = new Date().toISOString().split("T")[0];

    if (modalMode === "add") {
      fetch(`${process.env.REACT_APP_API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...clientData, userId: userId }),
      })
        .then((response) => {
          if (response.ok) {
            window.alert("Client added successfully");
            setRefreshData(true);
          }
        })
        .catch((error) => {
          window.alert("Error adding client");
          console.error("Error adding client:", error);
        });
    } else {
      fetch(`${process.env.REACT_APP_API_URL}/clients/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clientData),
      })
        .then((response) => {
          if (response.ok) {
            window.alert("Client updated successfully");
            setRefreshData(true);
          }
        })
        .catch((error) => {
          window.alert("Error updating client");
          console.error("Error updating client:", error);
        });
    }

    setIsModalOpen(false);
  };

  const deleteClient = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      fetch(`${process.env.REACT_APP_API_URL}/clients/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            window.alert("Client deleted successfully");
            setRefreshData(true);
          }
        })
        .catch((error) => {
          window.alert("Error deleting client");
          console.error("Error deleting client:", error);
        });
    }
  };

  function ClientItem(props) {
    return (
      <tr key={props.client.id} className="hover:bg-gray-50">
        <td className="whitespace-nowrap px-6 py-4">
          <div className="flex items-center">
            <User className="mr-3 h-10 w-10 rounded-full bg-gray-100 text-blue-950" />
            <div className="text-sm text-gray-500">{props.client.id}</div>
          </div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-gray-900">{props.client.firstName}</div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-gray-900">{props.client.lastName}</div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-gray-900">{props.client.phone}</div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-gray-900">{props.client.totalLoans}</div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-gray-900">
            {formatCurrency(props.client.totalAmount)}
          </div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="text-gray-900">
            {formatDate(props.client.createdDate)}
          </div>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              props.client.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {props.client.status === "active" ? "Active" : "Inactive"}
          </span>
        </td>
        <td className="whitespace-nowrap px-6 py-4">
          <div className="flex space-x-2">
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-blue-600">
              <Link to={`/client/${props.client.id}`} key={props.client.id}>
                <Eye className="h-5 w-5" />
              </Link>
            </button>
            <button
              onClick={() => handleEditClient(props.client)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-amber-600"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => deleteClient(props.client.id)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-2xl font-bold text-gray-800 md:text-3xl">
            Clients Dashboard
          </h1>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Clients
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats?.totalClients?.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-green-100 p-3">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Loans
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats.totalLoans?.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-purple-100 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Average Loan
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {formatCurrency(stats.averageLoanValue)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="flex items-center">
                <div className="mr-4 rounded-full bg-amber-100 p-3">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Loans
                  </p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {stats?.activeLoans?.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow-md">
            <div className="border-b border-gray-200 p-4 md:p-6">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <h2 className="text-xl font-semibold text-gray-800">Clients</h2>

                <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-64"
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>

                  <button
                    onClick={handleAddClient}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Add Client
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-3">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center gap-1"
                      >
                        Client
                        {sortBy === "name" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              sortOrder === "desc" ? "rotate-180 transform" : ""
                            }`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => handleSort("firstName")}
                        className="flex items-center gap-1"
                      >
                        First name
                        {sortBy === "firstName" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              sortOrder === "desc" ? "rotate-180 transform" : ""
                            }`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => handleSort("lastName")}
                        className="flex items-center gap-1"
                      >
                        Last name
                        {sortBy === "lastName" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              sortOrder === "desc" ? "rotate-180 transform" : ""
                            }`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => handleSort("phone")}
                        className="flex items-center gap-1"
                      >
                        Phone
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => handleSort("totalLoans")}
                        className="flex items-center gap-1"
                      >
                        Total Loans
                        {sortBy === "totalLoans" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              sortOrder === "desc" ? "rotate-180 transform" : ""
                            }`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">Total Amount</th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => handleSort("createdDate")}
                        className="flex items-center gap-1"
                      >
                        Creation Date
                        {sortBy === "createdDate" && (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              sortOrder === "desc" ? "rotate-180 transform" : ""
                            }`}
                          />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client) => (
                      <ClientItem key={client.id} client={client} />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      currentPage * itemsPerPage,
                      filteredClients.length
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredClients.length}</span>{" "}
                  clients
                </p>
              </div>
              <div className="flex flex-1 justify-between gap-x-2 sm:justify-end">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === 1
                      ? "cursor-not-allowed text-gray-400"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                    currentPage === totalPages
                      ? "cursor-not-allowed text-gray-400"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Client Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90 p-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalMode === "add" ? "Add New Client" : "Edit Client"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={saveClient}>
                <div className="p-6">
                  <div className="mb-4">
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      First name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.firstName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      First name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.lastName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Phone number
                    </label>
                    <input
                      type="phone"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {formErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="status"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    {modalMode === "add" ? "Add Client" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientsDashboard;
