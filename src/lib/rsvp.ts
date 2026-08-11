export interface RSVPPayload {
  name: string;
  response: 'accept' | 'decline';
}

export interface RSVPResult {
  success: boolean;
  error?: string;
}

export async function submitRSVP(payload: RSVPPayload): Promise<RSVPResult> {
  try {
    const res = await fetch('/api/rsvp/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to submit RSVP' };
    }

    return { success: true };
  } catch (err) {
    console.error('submitRSVP network error:', err);
    return { success: false, error: 'Network error — please try again.' };
  }
}
