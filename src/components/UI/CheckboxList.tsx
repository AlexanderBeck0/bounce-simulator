import { ReactNode, useEffect, useState } from "react";

interface CheckboxListProps {
    /**
     * The text to show when the Checkbox List is closed
     */
    title: string;
    /**
     * The text to show when the Checkbox List is open. Defaults to the value within `title`
     */
    openTitle?: string;
    checkboxes: { name: string, enabled: boolean }[];
    onCheckboxChange: (name: string, checked: boolean) => void;
    removeCheckbox: (name: string) => void;

    children?: ReactNode;
    className?: string;
}

export default function CheckboxList(props: CheckboxListProps): JSX.Element {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [checkboxes, setCheckboxes] = useState<{ name: string, enabled: boolean }[]>(props.checkboxes);
    const handleCheckboxChange = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckboxes((previousCheckboxes) =>
            previousCheckboxes.map(checkbox => checkbox.name === name ?
                { ...checkbox, enabled: e.target.checked } :
                checkbox));
        props.onCheckboxChange(name, e.target.checked);
    }

    /**
     * Toggles the dropdown
     */
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    /**
     * Removes the checkbox using the provided prop's function
     * @param name The name of the checkbox to remove
     */
    const removeCheckboxByName = (name: string) => {
        setCheckboxes((previousCheckboxes) =>
            previousCheckboxes.filter(checkbox =>
                checkbox.name !== name));
        props.removeCheckbox(name);
    }

    useEffect(() => setCheckboxes(props.checkboxes), [props.checkboxes]);


    return (
        <div className={props.className}>
            <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                <input type="checkbox" className="peer" onClick={toggleDropdown} aria-label={isDropdownOpen ? (props.openTitle || props.title) : props.title} />
                <div className="collapse-title select-none font-medium">
                    {isDropdownOpen ? (props.openTitle || props.title) : props.title}
                </div>
                <div className="collapse-content">
                    {checkboxes.map((checkbox: { name: string, enabled: boolean }, index: number) => {
                        return (
                            <label key={index} className="label cursor-pointer flex flex-row items-center rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">
                                <div className="flex flex-row space-x-2">
                                    <span className="label-text text-gray-700">{checkbox.name}</span>
                                    <input type="checkbox" checked={checkbox.enabled} onChange={handleCheckboxChange(checkbox.name)} className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200" />
                                </div>
                                <button className="btn btn-outline btn-square btn-sm btn-error" onClick={() => removeCheckboxByName(checkbox.name)} aria-label={`Remove ${checkbox.name}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </label>
                        )
                    })}
                    <div className="flex flex-col">
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}