import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

interface DataPoint {
  x: number;
  y: number;
}

const CorrelationExplorer = () => {
  const [correlation, setCorrelation] = useState(0.45);
  const [inputValue, setInputValue] = useState("0.45");
  const [data, setData] = useState<DataPoint[]>([]);
  const [regressionLine, setRegressionLine] = useState<DataPoint[]>([]);

  const generateData = (correlation: number, n: number = 50) => {
    const result: DataPoint[] = [];
    for (let i = 0; i < n; i++) {
      const x = Math.random();
      const yMean = correlation * x + (1 - Math.abs(correlation)) * 0.5;
      const yStd = Math.sqrt(1 - correlation * correlation);
      const y = yMean + yStd * (Math.random() + Math.random() + Math.random() - 1.5) / 2.1;
      result.push({ x: x * 100, y: y * 100 });
    }
    return result;
  };

  const calculateRegressionLine = (data: DataPoint[]) => {
    const n = data.length;
    const sumX = data.reduce((sum, point) => sum + point.x, 0);
    const sumY = data.reduce((sum, point) => sum + point.y, 0);
    const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = data.reduce((sum, point) => sum + point.x * point.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return [
      { x: 0, y: intercept },
      { x: 100, y: slope * 100 + intercept }
    ];
  };

  useEffect(() => {
    const newData = generateData(correlation);
    setData(newData);
    setRegressionLine(calculateRegressionLine(newData));
  }, [correlation]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let value = parseFloat(inputValue);
      if (isNaN(value)) {
        value = 0;
      } else {
        if (value < -1) {
          value = -1;
        } else if (value > 1) {
          value = 1;
        }
      }
      value = Math.round(value * 100) / 100; // Round to 2 decimal places
      setCorrelation(value);
      setInputValue(value.toString());
    }
  };

  const getCorrelationDescription = (corr: number) => {
    if (corr === 0) return "No correlation";
    if (corr > 0.7) return "Strong positive correlation";
    if (corr > 0.3) return "Moderate positive correlation";
    if (corr > 0) return "Weak positive correlation";
    if (corr < -0.7) return "Strong negative correlation";
    if (corr < -0.3) return "Moderate negative correlation";
    return "Weak negative correlation";
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-[2rem] font-bold mb-6 text-center text-indigo-800 pt-6">Correlation Coefficient Explorer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex items-center mb-4">
          <label className="text-xl font-medium text-indigo-700 mr-4" htmlFor="correlation-input">
            Set Correlation Coefficient:
          </label>
          <div className="flex items-center">
            <input
              id="correlation-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="w-20 px-2 py-1 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500 text-center text-lg"
            />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Enter a value between -1 and 1, then press Enter to update the chart.
        </p>
        <div className="mb-8">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a0aec0" />
              <XAxis type="number" dataKey="x" name="Variable X" stroke="#4a5568" tick={{fill: 'transparent'}} />
              <YAxis type="number" dataKey="y" name="Variable Y" stroke="#4a5568" tick={{fill: 'transparent'}} />
              <ZAxis type="number" range={[20]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter 
                name="Data Points" 
                data={data} 
                fill="#7C3AED"
                cursor="pointer"
              />
              <Line 
                type="linear" 
                dataKey="y" 
                data={regressionLine} 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={false}
              />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <span className="text-2xl font-bold text-indigo-600">
              {getCorrelationDescription(correlation)}
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .recharts-scatter-symbol {
          transition: fill 0.3s ease;
        }
        .recharts-scatter-symbol:hover {
          fill: #5B21B6;
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  );
};

export default CorrelationExplorer;
