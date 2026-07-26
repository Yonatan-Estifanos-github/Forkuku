import { useState } from 'react';
import { submitRSVP as submitRSVPRequest, RSVPPayload, RSVPResult } from '@/lib/rsvp';

export interface UseRSVP {
  submitRSVP: (payload: RSVPPayload) => Promise<RSVPResult>;
  isSubmitting: boolean;
  error: string | null;
}

export function useRSVP(): UseRSVP {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitRSVP(payload: RSVPPayload): Promise<RSVPResult> {
    setIsSubmitting(true);
    setError(null);

    const result = await submitRSVPRequest(payload);

    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
    }
    setIsSubmitting(false);

    return result;
  }

  return { submitRSVP, isSubmitting, error };
}
