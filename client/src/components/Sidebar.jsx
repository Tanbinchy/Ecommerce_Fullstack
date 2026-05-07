import React from "react";

const Sidebar = () => {
  return (
    <aside className="bg-white shadow-md rounded-lg p-6 space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filter by Price
        </h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <input type="radio" name="price" />
            <label>$0 - $50</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="radio" name="price" />
            <label>$50 - $100</label>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filter by Category
        </h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label>Electronics</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label>Clothing</label>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
