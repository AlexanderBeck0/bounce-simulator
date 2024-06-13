import { JSX } from "react/jsx-runtime";
import {BoundaryShape, Shape} from "../App";

interface OptionsUIProps {
    changeShape: (newShape: BoundaryShape) => void;
    changeBallShape: (newShape: Shape) => void;
    changeBallCount: (newCount: number) => void;
    shapes: Shape[];
    boundaryShapes: BoundaryShape[]
    currentShape?: BoundaryShape;
    currentBallShape?: Shape;
    currentBallCount?: number;
}
export default function OptionsUI(props: OptionsUIProps): JSX.Element {
    return (
        <>
            <div className="flex w-72 flex-col gap-6">
                <select
                    // label="Select a shape"
                    onChange={(val) => props.changeShape(val.currentTarget.value as BoundaryShape)}
                    value={props.currentShape}
                // placeholder="Select a shape"
                // onPointerEnterCapture={console.log("Enter")}
                // onPointerLeaveCapture={console.log("Leave")}

                >
                    {props.boundaryShapes.map((shape, index) => {
                        return <option key={index} value={shape as Shape}>{shape}</option>
                    })}
                </select>
                <select
                    // label="Select a ball shape"
                    onChange={(val) => props.changeBallShape(val.currentTarget.value as Shape)}
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
                    onChange={(val) => props.changeBallCount(Number(val.currentTarget.value))} />
            </div>
            <div>

            </div>
        </>
    );
}