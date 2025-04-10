export type Staff = {
  id?: number;
  email: string;
  firstName: string;
  lastName: string;
  position: 'kitchen' | 'service' | 'PR';
  phoneNumber?: string;
  businessId: string;
};
