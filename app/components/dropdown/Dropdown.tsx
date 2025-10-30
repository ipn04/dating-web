import { useState } from 'react';

interface FilterDropdownProps {
  filters: { minAge: number; maxAge: number; distance: number; };
  setFilters: React.Dispatch<React.SetStateAction<{ minAge: number; maxAge: number; distance: number; }>>;
}

export default function FilterDropdown({ filters, setFilters }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [ageRange, setAgeRange] = useState({ min: filters.minAge, max: filters.maxAge });
  const [distance, setDistance] = useState(filters.distance);

  const applyFilters = () => {
    setFilters({ minAge: ageRange.min, maxAge: ageRange.max, distance });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 primary-light rounded-lg p-2 px-4 bg-white/10 hover:bg-white/20 transition"
      >
        Filter
      </button>

      {isOpen && (
        <div className="absolute mt-2 right-0 bg-fa rounded-lg shadow-lg border border-gray-200 w-64 p-4 z-10">
          <div className="mb-4">
            <label className="block text-sm font-semibold primary-light mb-2">Age Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="18"
                max={ageRange.max}
                value={ageRange.min}
                onChange={(e) => setAgeRange({ ...ageRange, min: Number(e.target.value) })}
                className="w-16 border border-gray-300 rounded-md p-1 text-center flex-grow primary-light"
              />
              <span className="text-gray-500">–</span>
              <input
                type="number"
                min={ageRange.min}
                max="80"
                value={ageRange.max}
                onChange={(e) => setAgeRange({ ...ageRange, max: Number(e.target.value) })}
                className="w-16 border border-gray-300 rounded-md p-1 text-center flex-grow primary-light"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold primary-light mb-1">Distance (km)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm primary-light mt-1 text-center">{distance} km</p>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setIsOpen(false)} className="text-sm primary-light hover:text-gray-700">Cancel</button>
            <button onClick={applyFilters} className="bg-primary text-white text-sm px-3 py-1 rounded-md hover:bg-primary/80 transition">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

