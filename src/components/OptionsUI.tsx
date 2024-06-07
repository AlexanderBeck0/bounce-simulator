import { JSX } from "react/jsx-runtime";
import { Shape } from "../App";

interface OptionsUIProps {
    changeShape: (newShape: Shape) => void;
    changeBallShape: (newShape: Shape) => void;
    changeBallCount: (newCount: number) => void;
    changeBallSize: (newSize: number) => void;
    changeBoundarySize: (newSize: number) => void;
    shapes: Shape[];
    currentShape?: Shape;
    currentBallShape?: Shape;
    currentBallCount?: number;
    currentBallSize?: number;
    currentBoundarySize?: number;
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
    return (
        <>
            <div className="flex w-72 flex-col gap-6">
                <select
                    // label="Select a shape"
                    onChange={(val) => props.changeShape(val.currentTarget.value)}
                    value={props.currentShape}
                // placeholder="Select a shape"
                // onPointerEnterCapture={console.log("Enter")}
                // onPointerLeaveCapture={console.log("Leave")}

                >
                    {props.shapes.map((shape, index) => {
                        return <option key={index} value={shape as Shape}>{shape}</option>
                    })}
                </select>
                <select
                    // label="Select a ball shape"
                    onChange={(val) => props.changeBallShape(val.currentTarget.value)}
                    value={props.currentBallShape}
                // placeholder="Select a ball shape"
                // onPointerEnterCapture={console.log("Enter")}
                // onPointerLeaveCapture={console.log("Leave")}

                >
                    {props.shapes.map((shape, index) => {
                        return <option key={index} value={shape as Shape}>{shape}</option>
                    })}
                </select>
                <input type="number" placeholder="Number of balls"
                    value={props.currentBallCount} min={0}
                    onChange={(val) => {
                        forceMinimumOfZero(val);
                        props.changeBallCount(val.currentTarget.valueAsNumber)
                    }} />
                <div>
                    <input type="number" placeholder="Size of balls"
                        value={props.currentBallSize} min={0}
                        onChange={(val) => {
                            forceMinimumOfZero(val);
                            props.changeBallSize(val.currentTarget.valueAsNumber)
                        }} />
                    <input type="number" placeholder="Size of boundary"
                        value={props.currentBoundarySize} min={0}
                        onChange={(val) => {
                            // Enforce the minimum being 0
                            forceMinimumOfZero(val);
                            props.changeBoundarySize(val.currentTarget.valueAsNumber);
                        }} />
                </div>
            </div>
            <div>

            </div>
        </>
    );
}