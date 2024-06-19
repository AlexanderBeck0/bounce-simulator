import { JSX } from "react/jsx-runtime";
import { BoundaryShape, Force, Shape } from "../App";
import CheckboxList from "./UI/CheckboxList";

interface OptionsUIProps {
    changeShape: (newShape: BoundaryShape) => void;
    changeBallShape: (newShape: Shape) => void;
    changeBallCount: (newCount: number) => void;
    changeBallSize: (newSize: number) => void;
    changeBoundarySize: (newSize: number) => void;
    changeSegments: (newCount: number) => void;
    changeRayCasting: (enabled: boolean) => void;
    clearBalls: () => void;
    shapes: Shape[];
    boundaryShapes: BoundaryShape[]
    currentShape?: BoundaryShape;
    currentBallShape?: Shape;
    currentBallCount?: number;
    currentBallSize?: number;
    currentBoundarySize?: number;
    segments?: number;
    isRaycastingEnabled?: boolean;
    forces: Force[];

    // Additional props
    className?: string;
}
function dummyHandler(isChecked: boolean): void {
    console.log(isChecked);
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

    function handleCheckboxChange(force: string, checked: boolean): void {
        props.forces.find(changedForce => changedForce.name === force)!.enabled = checked;
    }

    // TODO: Disable autofill
    return (
        <div className={props.className}>
            <div className="flex flex-col max-w-2xl">
                <div className="flex flex-nowrap items-center mb-1">
                    <div className="flex space-x-1">
                        <div className={`flex flex-col flex-1 ${props.currentShape === "Circle" ? "basis-1/3" : "basis-1/4"}`}>
                            <div className="label">
                                <span className="label-text">Boundary Shape</span>
                            </div>
                            <select className="select select-bordered"
                                onChange={(val) => props.changeShape(val.currentTarget.value as BoundaryShape)}
                                value={props.currentShape}>
                                <option disabled>Boundary Shape</option>
                                {props.boundaryShapes.map((shape, index) => {
                                    return <option key={index} value={shape as Shape}>{shape}</option>
                                })}
                            </select>
                        </div>
                        <div className={`flex flex-col flex-initial basis-1/5 ${props.currentShape === "Circle" ? "visible" : "hidden"}`}>
                            <div className="label">
                                <span className="label-text">Segments</span>
                            </div>
                            <input type="number" placeholder="Segments"
                                className="input input-bordered w-full"
                                value={props.segments} min={2} max={1000}
                                onChange={(val) => {
                                    forceMinimumOfZero(val);
                                    props.changeSegments(val.currentTarget.valueAsNumber);
                                }} />
                        </div>
                        <div className={`flex flex-col flex-1 ${props.currentShape === "Circle" ? "basis-1/3" : "basis-1/4"}`}>
                            <div className="label">
                                <span className="label-text">Ball Shape</span>
                            </div>
                            <select
                                className="select select-bordered"
                                onChange={(val) => props.changeBallShape(val.currentTarget.value as Shape)}
                                value={props.currentBallShape}>
                                <option disabled>Ball Shape</option>
                                {props.shapes.map((shape, index) => {
                                    return <option key={index} value={shape as Shape}>{shape}</option>
                                })}
                            </select>
                        </div>
                        <div className={`flex flex-col flex-1 ${props.currentShape === "Circle" ? "basis-1/3" : "basis-1/4"}`}>
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
                </div>
                <div className="flex flex-row flex-nowrap space-x-1">
                    <div className="flex flex-col w-1/2">
                        <div className="label">
                            <span className="label-text">Size of Boundary</span>
                        </div>
                        <input type="number" placeholder="Size of boundary"
                            className="input input-bordered"
                            value={props.currentBoundarySize} min={0}
                            onChange={(val) => {
                                // Enforce the minimum being 0
                                forceMinimumOfZero(val);
                                props.changeBoundarySize(val.currentTarget.valueAsNumber);
                            }} />
                    </div>
                    <div className="flex flex-col w-1/2">
                        <div className="label">
                            <span className="label-text">Size of balls</span>
                        </div>
                        <input type="number" placeholder="Size of balls"
                            className="input input-bordered"
                            value={props.currentBallSize} min={0}
                            onChange={(val) => {
                                forceMinimumOfZero(val);
                                props.changeBallSize(val.currentTarget.valueAsNumber)
                            }} />
                    </div>
                </div>
                <div className="flex-initial flex-nowrap">
                    <CheckboxList title="Open Forces" openTitle="Close Forces" checkboxes={props.forces} onCheckboxChange={handleCheckboxChange} />
                </div>
                <div className="flex flex-row flex-nowrap mt-1 select-none">
                    <label className="label basis-1/3 cursor-pointer items-center border border-base-300 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">
                        <span className="label-text">Enable Ray-casting lines</span>
                        <input type="checkbox" className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200"
                            checked={props.isRaycastingEnabled}
                            onChange={val => props.changeRayCasting(val.currentTarget.checked)} />
                    </label>
                    <label className="label basis-1/3 cursor-pointer items-center border border-base-300 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">
                        <span className="label-text">DUMMY OPTION</span>
                        <input type="checkbox" className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200"
                            onChange={val => dummyHandler(val.currentTarget.checked)} />
                    </label>
                    <label className="label basis-1/3 cursor-pointer items-center border border-base-300 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">
                        <span className="label-text">DUMMY OPTION</span>
                        <input type="checkbox" className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200"
                            onChange={val => dummyHandler(val.currentTarget.checked)} />
                    </label>
                </div>
                <div className="flex flex-row flex-nowrap mt-1 select-none">
                    <button onClick={props.clearBalls} className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">Clear Balls</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                </div>
            </div>
        </div>
    );
}