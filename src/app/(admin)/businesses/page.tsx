'use client';

import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useEffect, useState, useCallback } from 'react';
import { ClientSideRowModelModule, ColDef } from 'ag-grid-community';
import BusinessForm, { Business } from '../../components/AddBusiness';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export default function BusinessesPage() {
  const [rowData, setRowData] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/businesses`
      );
      setRowData(res.data);
    } catch (err) {
      console.error('Failed to fetch businesses:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleDelete = async (id: number) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}`);
    fetchBusinesses();
  };

  const handleFormSubmit = async (data: Business) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/businesses`, data);
      setShowForm(false);
      fetchBusinesses();
    } catch (err) {
      console.error('Error creating business:', err);
    }
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
        onClick={() => {
          window.location.href = `/staff?businessId=${params.data.id}`;
        }}
      >
        View Staff
      </button>
    </div>
  );

  const columnDefs: ColDef<Business>[] = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    {
      headerName: 'Location',
      field: 'location',
      sortable: true,
      filter: true,
    },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
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
        <h1 className="text-2xl font-semibold">Businesses</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Add Business
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowModelType="clientSide"
            pagination={true}
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-[#f6f3f4d1] flex justify-center items-center z-50">
          <BusinessForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
}
