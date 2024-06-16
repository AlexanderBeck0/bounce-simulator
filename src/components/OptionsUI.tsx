import { JSX } from "react/jsx-runtime";
import { BoundaryShape, Shape } from "../App";
import CheckboxList from "./UI/CheckboxList";

interface OptionsUIProps {
    changeShape: (newShape: BoundaryShape) => void;
    changeBallShape: (newShape: Shape) => void;
    changeBallCount: (newCount: number) => void;
    changeBallSize: (newSize: number) => void;
    changeBoundarySize: (newSize: number) => void;
    changeSegments: (newCount: number) => void;
    shapes: Shape[];
    boundaryShapes: BoundaryShape[]
    currentShape?: BoundaryShape;
    currentBallShape?: Shape;
    currentBallCount?: number;
    currentBallSize?: number;
    currentBoundarySize?: number;
    segments?: number;

    // Additional props
    className?: string;
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
                    <CheckboxList title="Open Forces" openTitle="Close Forces" checkboxes={["Gravity"]} onCheckboxChange={handleCheckboxChange} />
                </div>
            </div>
        </div>
    );
}