import React from "react";
import { Users } from "lucide-react";

function StatisticsCard(props) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center">
        <div className="mr-4 rounded-full bg-blue-100 p-3">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Total Clients</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {clientsData.length.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default StatisticsCard;
