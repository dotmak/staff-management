'use client';

import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import { Business } from '../../types/business';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import BusinessForm from '@/app/components/BusinessForm';
import { useEffect, useState, useCallback } from 'react';
import {
  ModuleRegistry,
  ValidationModule,
  ClientSideRowModelModule,
  ColDef,
} from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule]);

export default function BusinessesPage() {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rowData, setRowData] = useState<Business[]>([]);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

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

    // Use setTimeout to update grid after current render cycle
    setTimeout(() => {
      setRowData((prev) => prev.filter((b) => String(b.id) !== String(id)));
    }, 0);
  };

  const handleFormSubmit = async (data: Business) => {
    try {
      if (editingBusiness) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/businesses/${editingBusiness.id}`,
          data
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/businesses`, data);
      }

      setShowForm(false);
      setEditingBusiness(null);
      fetchBusinesses();
    } catch (err) {
      console.error('Error submitting business:', err);
    }
  };

  const actionCellRenderer = (params: any) => (
    <div className="flex gap-[24px]">
      <button
        className="text-blue-600 underline"
        onClick={() => {
          setEditingBusiness(params.data);
          setShowForm(true);
        }}
      >
        Edit
      </button>
      <button
        className="text-blue-600 underline"
        onClick={() => {
          window.location.href = `/staff?businessId=${params.data.id}`;
        }}
      >
        View Staff
      </button>
      <button
        className="text-red-500 underline"
        onClick={() => handleDelete(params.data.id)}
      >
        Delete
      </button>
    </div>
  );

  const columnDefs: ColDef<Business>[] = [
    { headerName: 'ID', field: 'id', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true },
    {
      headerName: 'Location',
      field: 'location',
      sortable: true,
    },
    { headerName: 'Type', field: 'type', sortable: true },
    {
      headerName: 'Actions',
      cellRenderer: actionCellRenderer,
      sortable: false,
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
          />
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-[#f6f3f4d1] flex justify-center items-center z-50">
          <BusinessForm
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            initialData={editingBusiness ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
