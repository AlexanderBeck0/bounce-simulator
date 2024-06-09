import { useState } from "react";

interface CheckboxListProps {
    checkboxes: string[];
    onCheckboxChange: (checked: boolean, index: number) => void;
}

export default function CheckboxList(props: CheckboxListProps): JSX.Element {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleCheckboxChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onCheckboxChange(e.target.checked, index);
    }

    /**
     * Toggles the dropdown
     */
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }


    return (
        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
            <input type="checkbox" className="peer" onClick={toggleDropdown} />
            <div className="collapse-title">
                {isDropdownOpen ? 'Hide' : 'Show'} Forces
            </div>
            <div className="collapse-content">
                {props.checkboxes.map((checkbox: string, index: number) => {
                    return (
                        <label key={index} className="label cursor-pointer flex items-center space-x-2 rounded-md hover:bg-gray-100 transition-colors duration-200">
                            <span className="label-text text-gray-700">{checkbox}</span>
                            <input type="checkbox" onChange={handleCheckboxChange(index)} className="checkbox h-5 w-5 border-gray-300 rounded" />
                        </label>
                    )
                })}
            </div>
        </div>
    );
}