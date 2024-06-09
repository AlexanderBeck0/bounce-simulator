import { JSX } from "react/jsx-runtime";
import { Shape } from "../App";
import CheckboxList from "./UI/CheckboxList";

interface OptionsUIProps {
    changeShape: (newShape: Shape) => void;
    changeBallShape: (newShape: Shape) => void;
    changeBallCount: (newCount: number) => void;
    changeBallSize: (newSize: number) => void;
    changeBoundarySize: (newSize: number) => void;
    setIsDarkMode: (isDark: boolean) => void;
    shapes: Shape[];
    currentShape?: Shape;
    currentBallShape?: Shape;
    currentBallCount?: number;
    currentBallSize?: number;
    currentBoundarySize?: number;
    isDarkMode: boolean;
}
export default function OptionsUI(props: OptionsUIProps): JSX.Element {

    function forceMinimumOfZero(inputChangeEvent: React.ChangeEvent<HTMLInputElement>) {
        if (inputChangeEvent.currentTarget.valueAsNumber.toString() !== inputChangeEvent.currentTarget.value) {
            inputChangeEvent.currentTarget.value = inputChangeEvent.currentTarget.valueAsNumber.toString();
        }
        if (inputChangeEvent.currentTarget.value === "") {
            inputChangeEvent.currentTarget.value = "0";
        }
    }

    function handleCheckboxChange(checked: boolean, index: number): void {
        console.log(`Checkbox at index ${index} is now ${checked ? 'checked' : 'unchecked'}`);
    }

    return (
        <div className="flex flex-col">
            <div className="flex w-full items-center mb-4">
                <div className="flex-1 flex space-x-2">
                    <select className="select select-bordered flex-1 w-1/3"
                        onChange={(val) => props.changeShape(val.currentTarget.value)}
                        value={props.currentShape}
                    >
                        <option disabled>Boundary Shape</option>
                        {props.shapes.map((shape, index) => {
                            return <option key={index} value={shape as Shape}>{shape}</option>
                        })}
                    </select>
                    <select
                        className="select select-bordered flex-1 w-1/3"
                        onChange={(val) => props.changeBallShape(val.currentTarget.value)}
                        value={props.currentBallShape}
                    >
                        <option disabled>Ball Shape</option>
                        {props.shapes.map((shape, index) => {
                            return <option key={index} value={shape as Shape}>{shape}</option>
                        })}
                    </select>
                    <input type="number" placeholder="Number of balls"
                        className="input input-bordered flex-initial w-1/6"
                        value={props.currentBallCount} min={0}
                        onChange={(val) => {
                            forceMinimumOfZero(val);
                            props.changeBallCount(val.currentTarget.valueAsNumber)
                        }} />
                </div>
                <div className="w-1/5 ml-2">
                    <label className="cursor-pointer grid place-items-center w-0">
                        <input type="checkbox" value="synthwave" className="toggle theme-controller bg-base-content row-start-1 col-start-1 col-span-2" onChange={() => props.setIsDarkMode(!props.isDarkMode)} checked={props.isDarkMode}/>
                        <svg className="col-start-1 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                        <svg className="col-start-2 row-start-1 stroke-base-100 fill-base-100" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </label>
                </div>
            </div>
            <div className="flex w-full items-center space-x-2">
                <input type="number" placeholder="Size of balls"
                    className="input input-bordered flex-initial w-1/2"
                    value={props.currentBallSize} min={0}
                    onChange={(val) => {
                        forceMinimumOfZero(val);
                        props.changeBallSize(val.currentTarget.valueAsNumber)
                    }} />
                <input type="number" placeholder="Size of boundary"
                    className="input input-bordered flex-initial w-1/2"
                    value={props.currentBoundarySize} min={0}
                    onChange={(val) => {
                        // Enforce the minimum being 0
                        forceMinimumOfZero(val);
                        props.changeBoundarySize(val.currentTarget.valueAsNumber);
                    }} />
            </div>
            <div className="flex-initial">
                <CheckboxList checkboxes={["Gravity", "Left Force"]} onCheckboxChange={handleCheckboxChange} />
            </div>
        </div>
    );
}