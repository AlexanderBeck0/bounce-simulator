import { JSX } from "react/jsx-runtime";
import { BoundaryShape, Force, Shape } from "../App";
import CheckboxList from "./UI/CheckboxList";
import { ReactNode, useRef, useState } from "react";
import { P5CanvasInstance } from "@p5-wrapper/react";

interface OptionsUIProps {
    changeShape: (newShape: BoundaryShape) => void;
    changeBallShape: (newShape: Shape) => void;
    changeBallCount: (newCount: number) => void;
    changeBallSize: (newSize: number) => void;
    changeBoundarySize: (newSize: number) => void;
    changeSegments: (newCount: number) => void;
    changeRayCasting: (enabled: boolean) => void;
    changeCollisionRays: (enabled: boolean) => void;
    changeBallDropping: (enabled: boolean) => void
    clearBalls: () => void;
    removeForce: (name: string) => void;
    addForce: (force: Force) => void;
    shapes: Shape[];
    boundaryShapes: BoundaryShape[]
    currentShape?: BoundaryShape;
    currentBallShape?: Shape;
    currentBallCount?: number;
    currentBallSize?: number;
    currentBoundarySize?: number;
    segments?: number;
    isRaycastingEnabled?: boolean;
    isCollisionRaysEnabled?: boolean;
    isBallDroppingEnabled: boolean
    forces: Force[];

    // Additional props
    className?: string;
    children?: ReactNode;
}

export default function OptionsUI(props: OptionsUIProps): JSX.Element {
    const [isNewForceUIOpened, setIsNewForceUIOpened] = useState<boolean>(false);
    /**
     * First element: Force Name
     * Second element: Force X-Axis
     * Third element: Force Y-Axis
     */
    const [addForceValues, setAddForceValues] = useState<(string | number)[]>([]);
    const addForceNameRef = useRef(null);
    const addForceXRef = useRef(null);
    const addForceYRef = useRef(null);
    function toggleIsNewForceUIOpened(): void {
        setIsNewForceUIOpened(!isNewForceUIOpened);
    }

    /**
     * Toggles the Add Force dropdown and adds the force if all the forces are valid, or calls {@link handleInvalidAddForceValues()} 
     */
    function addForceOrToggleDropdownUI(): void {
        if (!isNewForceUIOpened) {
            toggleIsNewForceUIOpened();
            return;
        }

        const invalidAddForceValues = getInvalidAddForceIndexes();
        if (invalidAddForceValues.length > 0) {
            handleInvalidAddForceValues(invalidAddForceValues);
            return;
        }

        removeAllErrorsInAddForce();
        toggleIsNewForceUIOpened();
        const newForce: Force = {
            name: addForceValues[0].toString(),
            value: (p5Reference: P5CanvasInstance, size: number) => p5Reference.createVector(size * +addForceValues[1], size * +addForceValues[2]),
            enabled: true
        };
        props.addForce(newForce);
        setAddForceValues([]);
    }

    /**
     * Gets all the invalid option vertices from {@link addForceValues}. 
     * - Name must be alphanumeric, not undefined, and not in {@link props.forces forces[].name}.
     * - X must be a number, not undefined, and greater than or equal to -2
     * - Y must be a number, not undefined, and greater than or equal to -2
     * @returns {number[]} An array of indexes representing the invalid options in {@link addForceValues}. Empty if there are no issues
     */
    function getInvalidAddForceIndexes(): number[] {
        const invalidForceIndexes: number[] = [];
        const name = addForceValues[0];
        const x = +addForceValues[1];
        const y = +addForceValues[2];
        let isValidName = typeof name === "string";
        let isValidX = typeof x === "number";
        let isValidY = typeof y === "number";

        if (!name) isValidName = false;
        // Check if name is alphanumeric
        // Allows a-z, A-Z, 0-9, _, -, comma, ., !, ?, and spaces
        if (isValidName && !name.toString().match(/^[a-zA-Z0-9_\-&,.!?\s]*$/)) isValidName = false;
        // Check if name already exists
        if (isValidName && props.forces.map(force => force.name).includes(name.toString())) isValidName = false;

        // Check for valid x's
        if (!x && x !== 0) isValidX = false;
        if (isValidX && isNaN(x)) isValidX = false;
        if (isValidX && x < -2) isValidX = false;

        // Check for valid y's
        if (!y && y !== 0) isValidY = false;
        if (isValidY && isNaN(y)) isValidY = false;
        if (isValidY && y < -2) isValidY = false;

        if (!isValidName) invalidForceIndexes.push(0);
        if (!isValidX) invalidForceIndexes.push(1);
        if (!isValidY) invalidForceIndexes.push(2);
        return invalidForceIndexes;
    }

    function handleInvalidAddForceValues(invalidForceIndexes: number[]): void {
        if (!invalidForceIndexes || invalidForceIndexes.length === 0) return;
        // Make the element red
        const indexes = [addForceNameRef, addForceXRef, addForceYRef];
        for (const invalidForceIndex of invalidForceIndexes) {
            const input = indexes[invalidForceIndex].current as HTMLInputElement | null;
            if (input) {
                input.classList.add("border-error");
            }
        }
    }

    /**
     * Removes `border-error` from the className list of {@link addForceNameRef}, {@link addForceXRef}, and {@link addForceYRef}
     */
    function removeAllErrorsInAddForce(): void {
        const indexes = [addForceNameRef, addForceXRef, addForceYRef];
        for (const input of indexes) {
            const inputElement = input.current as HTMLInputElement | null;
            if (inputElement) {
                inputElement.classList.remove("border-error");
            }
        }
    }

    /**
     * Adds `newForceName` to `forceValues[0] = newForceName`
     * @param newForceName The new force name
     */
    function forceNameChangeHandler(newForceName: string): void {
        const forceValues: (string | number)[] = addForceValues;
        addForceValues.length > 0 ? forceValues[0] = newForceName : forceValues.push(newForceName);
        setAddForceValues(forceValues);
    }

    /**
     * Adds `newForceXAxis` to `forceValues[1]`
     * @param newForceXAxis The new force x axis.
     */
    function forceXAxisChangeHandler(newForceXAxis: number): void {
        const forceValues: (string | number)[] = addForceValues;
        forceValues[1] = newForceXAxis
        setAddForceValues(forceValues);
    }

    /**
     * Adds `newForceYAxis` to `forceValues[2]`
     * @param newForceYAxis The new force y axis.
     */
    function forceYAxisChangeHandler(newForceYAxis: number): void {
        const forceValues: (string | number)[] = addForceValues;
        forceValues[2] = newForceYAxis;
        setAddForceValues(forceValues);
    }

    function forceMinimumOfZero(inputChangeEvent: React.ChangeEvent<HTMLInputElement>): void {
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

    return (
        <div className={props.className}>
            <div className="flex flex-col max-w-2xl">
                <div className="flex flex-nowrap items-center mb-1">
                    <div className="flex space-x-1">
                        <div className={`flex flex-col ${props.currentShape === "Circle" ? "basis-1/4" : "basis-1/3"}`}>
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
                        <div className={`flex flex-col flex-initial basis-1/4 ${props.currentShape === "Circle" ? "visible" : "hidden"}`}>
                            <div className="label">
                                <span className="label-text">Segments</span>
                            </div>
                            <input type="number" placeholder="Segments"
                                className="input input-bordered w-full"
                                value={props.segments} min={2} max={1000}
                                onChange={(val) => {
                                    forceMinimumOfZero(val);
                                    props.changeSegments(val.currentTarget.valueAsNumber);
                                }}
                                autoComplete="off" />
                        </div>
                        <div className={`flex flex-col ${props.currentShape === "Circle" ? "basis-1/4" : "basis-1/3"}`}>
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
                        <div className={`flex flex-col ${props.currentShape === "Circle" ? "basis-1/4" : "basis-1/3"}`}>
                            <div className="label">
                                <span className="label-text">Number of balls</span>
                            </div>
                            <input type="number" placeholder="Number of balls"
                                className="input input-bordered w-full"
                                value={props.currentBallCount} min={0}
                                onChange={(val) => {
                                    forceMinimumOfZero(val);
                                    props.changeBallCount(val.currentTarget.valueAsNumber)
                                }}
                                autoComplete="off" />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row flex-nowrap space-x-1">
                    {props.currentShape && props.currentShape !== "Draw" && (
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
                                }}
                                autoComplete="off" />
                        </div>
                    )}
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
                            }}
                            autoComplete="off" />
                    </div>
                </div>
                <div className="flex-initial flex-nowrap">
                    <CheckboxList title="Open Forces" openTitle="Close Forces" checkboxes={props.forces} onCheckboxChange={handleCheckboxChange} removeCheckbox={props.removeForce}>
                        <div className="flex flex-row items-end space-x-1">
                            {isNewForceUIOpened && (
                                <div className="flex flex-col basis-1/4">
                                    <div className="label">
                                        <span className="label-text">Force Name</span>
                                    </div>
                                    <input type="text" ref={addForceNameRef} className="input input-bordered w-full"
                                        onChange={(val) => forceNameChangeHandler(val.currentTarget.value)} autoComplete="off" />
                                </div>
                            )}
                            {isNewForceUIOpened && (
                                <div className="flex flex-col basis-1/4">
                                    <div className="label">
                                        <span className="label-text">Force on X-Axis</span>
                                    </div>
                                    <input type="number" ref={addForceXRef} min={-2} className="input input-bordered w-full" autoComplete="off"
                                        onChange={(val) => forceXAxisChangeHandler(val.currentTarget.valueAsNumber)} />
                                </div>
                            )}
                            {isNewForceUIOpened && (
                                <div className="flex flex-col basis-1/4">
                                    <div className="label">
                                        <span className="label-text">Force on Y-Axis</span>
                                    </div>
                                    <input type="number" ref={addForceYRef} min={-2} className="input input-bordered w-full" autoComplete="off"
                                        onChange={(val) => forceYAxisChangeHandler(val.currentTarget.valueAsNumber)} />
                                </div>
                            )}
                            <div className={`${isNewForceUIOpened ? "basis-1/4" : "basis-full"}`}>
                                <button className={`btn border-neutral w-full h-full`} onClick={addForceOrToggleDropdownUI}>Add a new force</button>
                            </div>
                        </div>
                    </CheckboxList>
                </div>
                {/*<div className="flex-initial flex-nowrap">
                    <CheckboxList title="Open Collisions" openTitle="Close Collisions" checkboxes={props.collisions} onCheckboxChange={handleCheckboxChange} />
                </div>*/}
                <div className="flex flex-row flex-nowrap mt-1 select-none space-x-1">
                    <label className="label basis-1/3 cursor-pointer items-center border border-base-300 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">
                        <span className="label-text">Enable Ray-casting lines</span>
                        <input type="checkbox" className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200"
                            checked={props.isRaycastingEnabled}
                            onChange={val => props.changeRayCasting(val.currentTarget.checked)} />
                    </label>
                    <label className="label basis-1/3 cursor-pointer items-center border border-base-300 rounded-md hover:bg-gray-200 active:bg-gray-300 transition-colors duration-200">
                        <span className="label-text">Enable Collision Rays</span>
                        <input type="checkbox" className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200"
                            checked={props.isCollisionRaysEnabled}
                            onChange={val => props.changeCollisionRays(val.currentTarget.checked)} />
                    </label>
                    <label className="label basis-1/3 cursor-pointer items-center hover:bg-gray-200 border border-base-300 rounded-md transition-colors duration-200">
                        <span className="label-text">Drop Balls on Click</span>
                        <input type="checkbox" className="checkbox h-5 w-5 border-gray-400 rounded transition-colors duration-200"
                            onChange={val => props.changeBallDropping(val.currentTarget.checked)} />
                    </label>
                </div>
                <div className="flex flex-row flex-nowrap mt-1 select-none space-x-1">
                    <button onClick={props.clearBalls} className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">Clear Balls</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                    <button className="flex flex-row basis-1/5 btn btn-outline active:bg-gray-100">DUMMY BUTTON</button>
                </div>
            </div>
            {props.children}
        </div>
    );
}