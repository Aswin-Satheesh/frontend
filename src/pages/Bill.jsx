import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function Bill() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState('upi');
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const generateQrCode = async () => {
      if (paymentType === 'upi' && amount) {
        try {
          const token = JSON.parse(localStorage.getItem('jwt'));
          if (!token) {
            toast.error('Authentication required');
            return;
          }

          const qrResponse = await fetch('http://localhost:8000/api/features/generate-upi-qr/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: parseFloat(amount) })
          });

          if (!qrResponse.ok) {
            const errorData = await qrResponse.json();
            throw new Error(errorData.message || 'Failed to generate UPI QR code');
          }

          const qrData = await qrResponse.json();
          console.log('qrData', qrData)
          setQrCode(qrData.qr_url);
        } catch (error) {
          console.error('Error generating QR code:', error);
          toast.error(error.message || 'Failed to generate QR code');
        }
      } else {
        setQrCode(null);
      }
    };

    generateQrCode();
  }, [amount, paymentType]);

  const handleCreateBill = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt'));
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const payload = {
        total_amount: parseFloat(amount),
        payment_type: paymentType
      };

      const response = await fetch(`http://localhost:8000/api/features/bill/${appointmentId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create bill');
      }

      const data = await response.json();
      toast.success('Bill created successfully');

      if (paymentType === 'upi') {
        navigate('/'); // Navigate to home or another page after UPI payment
      } else {
        navigate('/'); // Navigate to home or another page after cash payment
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(error.message || 'Failed to create bill');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Bill</h1>
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Amount</label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Payment Type</label>
        <Select value={paymentType} onValueChange={setPaymentType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upi">UPI</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {paymentType !== 'cash' && qrCode && (
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">UPI QR Code</label>
          <img src={`http://localhost:8000${qrCode}`} alt="UPI QR Code" className="w-48 h-48" />
        </div>
      )}
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setAmount('');
            setPaymentType('upi');
            setQrCode(null);
          }}
        >
          Clear
        </Button>
        <Button
          disabled={!amount || !paymentType}
          onClick={handleCreateBill}
        >
          Create Bill
        </Button>
      </div>
    </div>
  );
}
