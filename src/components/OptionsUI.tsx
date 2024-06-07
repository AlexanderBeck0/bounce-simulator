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
        <div className="flex flex-col options">
            <div className="flex w-full items-center mb-4">
                <div className="flex-1 flex space-x-2">
                    <select className="select select-bordered flex-1"
                        onChange={(val) => props.changeShape(val.currentTarget.value)}
                        value={props.currentShape}
                    >
                        <option disabled>Boundary Shape</option>
                        {props.shapes.map((shape, index) => {
                            return <option key={index} value={shape as Shape}>{shape}</option>
                        })}
                    </select>
                    <select
                        className="select select-bordered flex-1"
                        onChange={(val) => props.changeBallShape(val.currentTarget.value)}
                        value={props.currentBallShape}
                    >
                        <option disabled>Ball Shape</option>
                        {props.shapes.map((shape, index) => {
                            return <option key={index} value={shape as Shape}>{shape}</option>
                        })}
                    </select>
                    <input type="number" placeholder="Number of balls"
                        className="input input-bordered flex-1"
                        value={props.currentBallCount} min={0}
                        onChange={(val) => {
                            forceMinimumOfZero(val);
                            props.changeBallCount(val.currentTarget.valueAsNumber)
                        }} />
                </div>
                <div className="flex-none w-1/5 justify-center items-center">
                    {/* 
                    Put some content that will only take up 1/5 of the space here
                    I'm thinking a theme toggle
                    */}
                </div>
            </div>
            <div className="flex w-full items-center space-x-2">
                <input type="number" placeholder="Size of balls"
                    className="input input-bordered flex-1"
                    value={props.currentBallSize} min={0}
                    onChange={(val) => {
                        forceMinimumOfZero(val);
                        props.changeBallSize(val.currentTarget.valueAsNumber)
                    }} />
                <input type="number" placeholder="Size of boundary"
                    className="input input-bordered flex-1"
                    value={props.currentBoundarySize} min={0}
                    onChange={(val) => {
                        // Enforce the minimum being 0
                        forceMinimumOfZero(val);
                        props.changeBoundarySize(val.currentTarget.valueAsNumber);
                    }} />
            </div>
        </div>
    );
}