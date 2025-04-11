'use client';

import { Staff } from '../types/staff';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type Props = {
  onSubmit: (data: Staff) => void;
  onCancel: () => void;
  businessId: string;
  initialData?: Staff;
};

const positions = ['kitchen', 'service', 'PR'];

export default function AddStaff({
  onSubmit,
  onCancel,
  businessId,
  initialData,
}: Props) {
  const defaultValues: Staff = initialData ?? {
    email: '',
    firstName: '',
    lastName: '',
    position: 'service',
    phoneNumber: '',
    businessId: String(businessId),
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Staff Member' : 'Add a new Staff Member'}
      </h2>

      <Formik
        initialValues={defaultValues}
        onSubmit={onSubmit}
        enableReinitialize
      >
        <Form className="space-y-4">
          <div>
            <label className="block font-medium">First Name</label>
            <Field
              name="firstName"
              className="w-full border px-3 py-2 rounded"
              placeholder="First Name"
            />
            <ErrorMessage
              name="firstName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Last Name</label>
            <Field
              name="lastName"
              className="w-full border px-3 py-2 rounded"
              placeholder="Last Name"
            />
            <ErrorMessage
              name="lastName"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <Field
              name="email"
              type="email"
              className="w-full border px-3 py-2 rounded"
              placeholder="Email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <Field
              name="phoneNumber"
              className="w-full border px-3 py-2 rounded"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block font-medium">Position</label>
            <Field
              as="select"
              name="position"
              className="w-full border px-3 py-2 rounded"
            >
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </Field>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {initialData ? 'Save Changes' : 'Create'}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
