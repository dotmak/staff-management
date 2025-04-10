'use client';

import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import AddStaff, { Staff } from '../../components/AddStaff';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientSideRowModelModule, ColDef } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null); // New state for editing
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryBusinessId = searchParams.get('businessId');

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/businesses`)
      .then((res) => setBusinesses(res.data))
      .catch((err) => console.error('Failed to fetch businesses', err));
  }, []);

  useEffect(() => {
    if (queryBusinessId) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/staff?businessId=${queryBusinessId}`
        )
        .then((res) => setStaff(res.data))
        .catch((err) => console.error('Failed to fetch staff', err));
    }
  }, [queryBusinessId]);

  const handleSubmit = async (data: Staff) => {
    try {
      if (editingStaff) {
        const res = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/staff/${editingStaff.id}`,
          data
        );
        setStaff((prev) =>
          prev.map((s) => (s.id === editingStaff.id ? res.data : s))
        );
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/staff`,
          data
        );
        setStaff((prev) => [...prev, res.data]);
      }

      setShowForm(false);
      setEditingStaff(null); // Reset editing staff after submit
    } catch (err) {
      console.error('Error saving staff:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete staff member:', err);
    }
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember); // Set staff member to edit
    setShowForm(true);
  };

  const actionCellRenderer = (params: any) => (
    <div className="flex gap-[24px]">
      <button
        className="text-red-500 underline"
        onClick={() => handleDelete(params.data.id)}
      >
        Delete
      </button>
      <button
        className="text-blue-600 underline"
        onClick={() => handleEdit(params.data)} // Trigger edit on click
      >
        Edit
      </button>
    </div>
  );

  const columnDefs: ColDef<Staff>[] = [
    {
      headerName: 'Name',
      field: 'name',
      valueGetter: (params) =>
        `${params.data.firstName} ${params.data.lastName}`,
      sortable: true,
      filter: true,
    },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Position', field: 'position', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phoneNumber', sortable: true, filter: true },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: actionCellRenderer,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Staff Members</h1>

        {queryBusinessId && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Staff
          </button>
        )}
      </div>

      {!queryBusinessId && (
        <div className="space-y-4 max-w-md">
          <label className="block font-medium">Select a Business:</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={selectedBusinessId ?? ''}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
          >
            <option value="">Select Business</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-[#f6f3f4d1] flex justify-center items-center z-50">
          <AddStaff
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            businessId={queryBusinessId ?? selectedBusinessId ?? ''}
            initialData={editingStaff ?? undefined}
          />
        </div>
      )}

      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={staff}
          pagination={true}
          paginationPageSize={10}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}
