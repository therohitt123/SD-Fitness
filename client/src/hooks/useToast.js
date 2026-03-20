import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function useToast() {
  const success = useCallback((message) => toast.success(message), []);
  const error = useCallback((message) => toast.error(message), []);
  const info = useCallback((message) => toast(message), []);

  return { success, error, info };
}
