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

    /**
     * TODO: ###############
     * Properly set up themes
     */
    // TODO: Disable autofill
    return (
        <div>
            <div className="flex flex-col">
                <div className="flex flex-nowrap items-center mb-4">
                    <div className="flex space-x-2 basis-5/6">
                        <div className="flex flex-col flex-1 basis-1/3">
                            <div className="label">
                                <span className="label-text">Boundary Shape</span>
                            </div>
                            <select className="select select-bordered"
                                onChange={(val) => props.changeShape(val.currentTarget.value)}
                                value={props.currentShape}>
                                <option disabled>Boundary Shape</option>
                                {props.shapes.map((shape, index) => {
                                    return <option key={index} value={shape as Shape}>{shape}</option>
                                })}
                            </select>
                        </div>
                        <div className="flex flex-col flex-1 basis-1/3">
                            <div className="label">
                                <span className="label-text">Ball Shape</span>
                            </div>
                            <select
                                className="select select-bordered"
                                onChange={(val) => props.changeBallShape(val.currentTarget.value)}
                                value={props.currentBallShape}>
                                <option disabled>Ball Shape</option>
                                {props.shapes.map((shape, index) => {
                                    return <option key={index} value={shape as Shape}>{shape}</option>
                                })}
                            </select>
                        </div>
                        <div className="flex flex-col flex-1 basis-1/3">
                            <div className="label">
                                <span className="label-text">Number of balls</span>
                            </div>
                            <input type="number" placeholder="Number of balls"
                                className="input input-bordered w-full"
                                value={props.currentBallCount} min={0}
                                onChange={(val) => {
                                    forceMinimumOfZero(val);
                                    props.changeBallCount(val.currentTarget.valueAsNumber)
                                }} />
                        </div>
                    </div>
                    <div className="flex flex-col flex-initial basis-1/6 max-w-fit">
                        <div className="label">
                            <span className="label-text">{props.isDarkMode ? 'Dark' : 'Light'} Mode</span>
                        </div>
                        <label className="swap swap-rotate">
                            <input type="checkbox" onChange={() => props.setIsDarkMode(!props.isDarkMode)} checked={props.isDarkMode} />
                            <svg className="swap-on fill-current w-9 h-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                            <svg className="swap-off fill-current w-9 h-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
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
                <div className="flex-initial flex-nowrap">
                    <CheckboxList title="Open Forces" openTitle="Close Forces" checkboxes={["Gravity", "Left Force"]} onCheckboxChange={handleCheckboxChange} />
                </div>
            </div>
        </div>
    );
}