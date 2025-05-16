export type Appointment = {
  appointment_id: number;
  appointment_name: string;
  start_time: string;
  end_time: string;
  formatted_date: string;
  location: string;
  user_id: number;
  user_name: string;
  participants:
    | {
        email: string;
        user_id: string;
        user_name: string;
        remind: boolean;
      }[]
    | null;
  host: {
    email: string;
    user_id: string;
    user_name: string;
    remind: boolean;
  };
};

export interface User {
  user_id: string;
  email: string;
  user_name: string;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
};
