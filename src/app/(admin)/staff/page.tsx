'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { ClientSideRowModelModule, ColDef } from 'ag-grid-community';

type Business = {
  id: number;
  name: string;
};

type Staff = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  position: 'kitchen' | 'service' | 'PR';
  phoneNumber?: string;
  businessId: number;
};

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
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

  const handleSelect = () => {
    if (selectedBusinessId) {
      router.push(`/staff?businessId=${selectedBusinessId}`);
    }
  };

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
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Staff Members</h1>

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
                pagination={true}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
