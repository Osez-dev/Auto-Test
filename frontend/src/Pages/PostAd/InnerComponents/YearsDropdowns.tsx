import { FC, ChangeEvent } from 'react';

interface YearDropdownProps {
  startYear?: number; // Optional: Starting year of the range (default: current year - 10)
  endYear?: number;   // Optional: Ending year of the range (default: current year + 10)
  onChange: (year: string) => void; // Function to handle year selection
  value?: string; // Optional: To control the selected value from the parent component
  label?: string; // Optional: Label for the dropdown
  id?: string;    // Optional: ID for accessibility and label association
  name?: string;  // Optional: Name attribute for form submission
}

const YearDropdown: FC<YearDropdownProps> = ({
  startYear,
  endYear,
  onChange,
  value,
  label,
  id,
  name,
}) => {
  const currentYear = new Date().getFullYear();
  const defaultStartYear = startYear || currentYear - 10;
  const defaultEndYear = endYear || currentYear + 10;

  const years: number[] = [];
  for (let year = defaultStartYear; year <= defaultEndYear; year++) {
    years.push(year);
  }

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="p-3 border border-gray-300 rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-200 transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10 cursor-pointer"
      >
        <option value="">Select Year</option> {/* Default placeholder option */}
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearDropdown;