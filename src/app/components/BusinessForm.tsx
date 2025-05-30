'use client';

import * as Yup from 'yup';
import { Business } from '../types/business';
import { Formik, Form, Field, ErrorMessage } from 'formik';

type Props = {
  onSubmit: (data: Business) => void;
  onCancel: () => void;
  initialData?: Business;
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  location: Yup.string().required('Location is required'),
  type: Yup.string()
    .oneOf(['bar', 'restaurant', 'club', 'hotel', 'cafe'], 'Invalid type')
    .required('Type is required'),
});

const businessTypes = ['bar', 'restaurant', 'club', 'hotel', 'cafe'];

export default function BusinessForm({
  onSubmit,
  onCancel,
  initialData,
}: Props) {
  const defaultValues: Business = {
    name: '',
    location: '',
    type: 'bar',
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Business' : 'Add a new business'}
      </h2>

      <Formik
        initialValues={initialData ?? defaultValues}
        onSubmit={(values) => onSubmit(values)}
        validationSchema={validationSchema}
      >
        <Form className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <Field
              name="name"
              className="w-full border px-3 py-2 rounded"
              placeholder="Business Name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Location</label>
            <Field
              name="location"
              className="w-full border px-3 py-2 rounded"
              placeholder="Location"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Type</label>
            <Field
              as="select"
              name="type"
              className="w-full border px-3 py-2 rounded"
            >
              {businessTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
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
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}
