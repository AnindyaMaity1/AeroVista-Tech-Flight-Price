import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import flightImage from './assets/Flight.jpg'; // ✅ Make sure the image exists in src/assets

function FlightPricePredictor() {
  const [formData, setFormData] = useState({
    airline: '',
    source_city: '',
    departure_time: '',
    stops: '',
    arrival_time: '',
    destination_city: '',
    class: '',
    departure_date: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [graphData, setGraphData] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setPrediction(response.data.prediction);
      setGraphData([
        { name: 'Predicted Price', value: response.data.prediction }
      ]);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-indigo-800 mb-10 drop-shadow-md">AeroVista Tech</h1>

      <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-5xl">
        {/* Left Side Image */}
        <div className="md:w-1/2">
          <img src={flightImage} alt="Flight" className="w-full h-full object-cover" />
        </div>

        {/* Right Side Form */}
        <form onSubmit={handleSubmit} className="p-8 md:w-1/2 grid grid-cols-1 gap-6">
          {[
            { label: 'Airline', name: 'airline', options: ['SpiceJet', 'AirAsia', 'Vistara', 'GO_FIRST', 'Indigo', 'Air_India'] },
            { label: 'Source City', name: 'source_city', options: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Chennai'] },
            { label: 'Departure Time', name: 'departure_time', options: ['Evening', 'Early_Morning', 'Morning', 'Afternoon', 'Night', 'Late_Night'] },
            { label: 'Stops', name: 'stops', options: ['zero', 'one', 'two_or_more'] },
            { label: 'Arrival Time', name: 'arrival_time', options: ['Night', 'Morning', 'Early_Morning', 'Afternoon', 'Evening', 'Late_Night'] },
            { label: 'Destination City', name: 'destination_city', options: ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Hyderabad', 'Chennai'] },
            { label: 'Class', name: 'class', options: ['Economy', 'Business'] },
          ].map((field) => (
            <div key={field.name} className="w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
              <select
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Departure Date</label>
            <input
              type="date"
              name="departure_date"
              min={new Date().toISOString().split('T')[0]}
              value={formData.departure_date}
              onChange={handleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="w-full">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Predict Price
            </button>
          </div>
        </form>
      </div>

      {prediction !== null && (
        <div className="mt-12 w-full max-w-xl">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-green-600 mb-4 text-center">Predicted Price: ₹{prediction}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData}>
                <XAxis dataKey="name" stroke="#4B5563" />
                <YAxis stroke="#4B5563" />
                <Tooltip />
                <Bar dataKey="value" fill="#6366F1" barSize={60} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default FlightPricePredictor;
