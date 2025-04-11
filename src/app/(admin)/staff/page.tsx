'use client';

import axios from 'axios';
import { Staff } from '../../types/staff';
import { useEffect, useState } from 'react';
import { Business } from '@/app/types/business';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import StaffForm from '@/app/components/StaffForm';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientSideRowModelModule, ColDef } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
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
      setEditingStaff(null); // Reset after submit
    } catch (err) {
      console.error('Error saving staff:', err);
    }
  };

  const handleSelect = () => {
    if (selectedBusinessId) {
      router.push(`/staff?businessId=${selectedBusinessId}`);
    }
  };

  const actionCellRenderer = (params: any) => (
    <div className="flex gap-[24px]">
      <button
        className="text-blue-600 underline"
        onClick={() => {
          setEditingStaff(params.data);
          setShowForm(true);
        }}
      >
        Edit
      </button>
      <button
        className="text-red-500 underline"
        onClick={() => handleDelete(params.data.id)}
      >
        Delete
      </button>
    </div>
  );

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`);

      if (queryBusinessId) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/staff?businessId=${queryBusinessId}`
        );
        setStaff(res.data);
      }
    } catch (err) {
      console.error('Failed to delete staff member:', err);
    }
  };

  const columnDefs: ColDef<Staff>[] = [
    {
      headerName: 'Name',
      valueGetter: (params) => {
        const data = params.data;
        return data ? `${data.firstName} ${data.lastName}` : '';
      },
      sortable: true,
    },
    { headerName: 'Email', field: 'email', sortable: true },
    { headerName: 'Position', field: 'position', sortable: true },
    { headerName: 'Phone', field: 'phoneNumber', sortable: true },
    {
      headerName: 'Actions',
      cellRenderer: actionCellRenderer,
      sortable: false,
      filter: false,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold mb-4">Staff Members</h1>

        {queryBusinessId && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
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
          <button
            onClick={handleSelect}
            disabled={!selectedBusinessId}
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            View Staff
          </button>
        </div>
      )}

      {queryBusinessId && (
        <>
          {staff.length === 0 ? (
            <p className="mt-6">No staff members found for this business.</p>
          ) : (
            <div
              className="ag-theme-alpine mt-6"
              style={{ height: 500, width: '100%' }}
            >
              <AgGridReact
                rowData={staff}
                columnDefs={columnDefs}
                rowModelType="clientSide"
                getRowId={(params) => String(params.data.id)}
              />
            </div>
          )}
        </>
      )}

      {showForm && queryBusinessId && (
        <div className="fixed inset-0 bg-[#f6f3f4d1] flex justify-center items-center z-50">
          <StaffForm
            businessId={queryBusinessId}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingStaff(null);
            }}
            initialData={editingStaff ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
