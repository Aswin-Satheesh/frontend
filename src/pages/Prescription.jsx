import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Prescription() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [medications, setMedications] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [description, setDescription] = useState('');
  const [loadingMedications, setLoadingMedications] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('jwt'));
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:8000/api/features/medicines/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch medications');
        }

        const data = await response.json();
        setMedications(data);
      } catch (error) {
        console.error('Error fetching medications:', error);
        toast.error("Failed to load medications");
      } finally {
        setLoadingMedications(false);
      }
    };

    fetchMedications();
  }, []);

  const handleCreatePrescription = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('jwt'));
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const formattedMedications = selectedMedications.map(med => ({
        medicine: med.id,
        dosage: med.dosage,
        quantity: med.quantity,
        days: med.days
      }));

      const payload = {
        description: description.trim(),
        medications: formattedMedications
      };

      const response = await fetch(`http://localhost:8000/api/features/prescription/${appointmentId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create prescription');
      }

      const data = await response.json();
      toast.success('Prescription created successfully');
      navigate(`/bill/${appointmentId}`);
    } catch (error) {
      console.error('Error creating prescription:', error);
      toast.error(error.message || 'Failed to create prescription');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Prescription</h1>
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Diagnosis & Description</label>
        <textarea
          className="w-full min-h-[100px] p-3 border rounded-lg resize-none"
          placeholder="Enter patient's diagnosis and prescription details..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">Available Medicines</label>
        {loadingMedications ? (
          <div className="flex items-center justify-center h-[200px]">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <div className="border rounded-lg p-4 min-h-[200px] space-y-2">
            {medications.map(medicine => (
              <div
                key={medicine.id}
                className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => {
                  if (!selectedMedications.some(m => m.id === medicine.id)) {
                    setSelectedMedications(prev => [...prev, { 
                      ...medicine, 
                      dosage: "1 tablet",
                      quantity: 1,
                      days: 1
                    }]);
                  }
                }}
              >
                <div>
                  <p className="font-medium">{medicine.name}</p>
                  <p className="text-sm text-muted-foreground">{medicine.type}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!selectedMedications.some(m => m.id === medicine.id)) {
                      setSelectedMedications(prev => [...prev, { 
                        ...medicine, 
                        dosage: "1 tablet",
                        quantity: 1,
                        days: 1
                      }]);
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mb-6">
        <h3 className="font-medium mb-4">Selected Medicines</h3>
        <div className="border rounded-lg p-4 min-h-[200px] space-y-2">
          {selectedMedications.map((medicine) => (
            <div
              key={medicine.id}
              className="flex items-center justify-between p-2 bg-accent/50 rounded-md"
            >
              <div>
                <p className="font-medium">{medicine.name}</p>
                <p className="text-sm text-muted-foreground">{medicine.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm">Days:</label>
                  <Input
                    type="number"
                    min="1"
                    value={medicine.days}
                    onChange={(e) => setSelectedMedications(prev =>
                      prev.map(med =>
                        med.id === medicine.id
                          ? { ...med, days: parseInt(e.target.value) || 1 }
                          : med
                      )
                    )}
                    className="w-16 h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Dosage:</label>
                  <Input
                    value={medicine.dosage}
                    onChange={(e) => setSelectedMedications(prev =>
                      prev.map(med =>
                        med.id === medicine.id
                          ? { ...med, dosage: e.target.value }
                          : med
                      )
                    )}
                    className="w-32"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => setSelectedMedications(prev => prev.filter(med => med.id !== medicine.id))}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          {selectedMedications.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              No medicines selected
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setDescription("");
            setSelectedMedications([]);
          }}
        >
          Clear All
        </Button>
        <Button
          disabled={selectedMedications.length === 0 || !description.trim()}
          onClick={handleCreatePrescription}
        >
          Create Prescription
        </Button>
      </div>
    </div>
  );
}
