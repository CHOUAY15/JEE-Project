import React from 'react';

export const DepartmentManager = ({ isOpen, onClose, onSave, department }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-60">
        <h2 className="text-xl font-bold mb-4">
          {department ? 'Edit Department' : 'Add Department'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const departmentData = {
              name: formData.get('name'),
            };
            onSave(departmentData);
          }}
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Department Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter department name"

              defaultValue={department?.name || ''}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
