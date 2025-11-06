'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';

export default function CheckPaymentStatusButton() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckPayment = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/live/payment-status', { method: 'POST' });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setStatus(`Checked ${data.total} registrants. Updated ${data.updated} payments.`);

      router.refresh();
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack direction="column" spacing={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckPayment}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
      >
        {loading ? 'Checking...' : 'Refresh Payment Status'}
      </Button>

      {status && (
        <Typography variant="body2" color="textSecondary">
          {status}
        </Typography>
      )}
    </Stack>
  );
}
