import { Vector } from 'p5';
import { useRef, useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';
import Ball from './components/p5/Ball';
import { P5CanvasInstance } from '@p5-wrapper/react';

const Shapes = ["Square", "Circle", "Triangle"];
const BoundaryShapes = ["Square", "Circle", "Triangle", "Random", "Draw"]
export type Shape = typeof Shapes[number];
export type BoundaryShape = typeof BoundaryShapes[number];

export type Force = {
	name: string;
	value: Vector | ((p5Reference: P5CanvasInstance, size: number) => Vector);
	enabled: boolean;
}

export default function App() {
	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	const [currentBallSize, setCurrentBallSize] = useState<number>(5);
	const [currentBoundarySize, setCurrentBoundarySize] = useState<number>(100);
	const [segments, setSegments] = useState<number>(30);
	const [isRaycastingEnabled, setIsRaycastingEnabled] = useState<boolean>(false);
	const [isCollisionRaysEnabled, setIsCollisionRaysEnabled] = useState<boolean>(false);
	const [isBallDroppingEnabled, setIsBallDroppingEnabled] = useState<boolean>(false)
	const ballsRef = useRef<Ball[]>([]);
	// const collisionsRef = useRef<boolean[]>([true, true]);
	const forcesRef = useRef<Force[]>([
		{
			name: "Gravity",
			value: (p5Reference: P5CanvasInstance, size: number) => p5Reference.createVector(0, 0.1 * size),
			enabled: true
		},
		{
			name: "Anti-Gravity",
			value: (p5Reference: P5CanvasInstance, size: number) => p5Reference.createVector(0, -0.1 * size),
			enabled: false
		},
		{
			name: "Right Force",
			value: (p5Reference: P5CanvasInstance, size: number) => p5Reference.createVector(0.1 * size, 0),
			enabled: false
		},
		{
			name: "Left Force",
			value: (p5Reference: P5CanvasInstance, size: number) => p5Reference.createVector(-0.1 * size, 0),
			enabled: false
		},
	]);

	/**
	 * Adds a force to {@link forcesRef}
	 * @param force The force to add
	 */
	function addForce(force: Force): void {
		const isDuplicate = forcesRef.current.some(newForce => newForce.name === force.name);
		if (!isDuplicate) {
			forcesRef.current.push(force);
		} else {
			forcesRef.current.find(existingForce => existingForce.name === force.name)!.enabled = force.enabled;
		}
	}

	/**
	 * Removes a force from {@link forcesRef}
	 * @param forceName The name of the force to remove
	 */
	function removeForce(forceName: string): void {
		const indexOfForce = forcesRef.current.findIndex(existingForce => existingForce.name === forceName);
		if (indexOfForce !== -1) {
			forcesRef.current.splice(indexOfForce, 1);
		}
	}

	// function addCollision(collisionIndex: number) {
	// 	throw "not finished"
	// }

	/**
	 * Adds a ball to {@link ballsRef}
	 * @param ball The ball to add
	 */
	function addBall(ball: Ball) {
		ballsRef.current.push(ball);
		// if (ball.isUserDropped) setNumberOfUserDropped(numberOfUserDropped + 1);
	}

	// /**
	//  * Removes all the computer dropped balls. Determined using {@link Ball.isUserDropped}
	//  * @param count The number of computer dropped balls to remove
	//  */
	// function removeComputerDroppedBalls(count: number): void {
	// 	let removeCount = count;
	// 	console.log("Remove count: ", removeCount);
	// 	console.log("Before removal: ", ballsRef.current);
	// 	ballsRef.current = ballsRef.current.filter(ball => {
	// 		if (!ball.isUserDropped && removeCount > 0) {
	// 			removeCount--;
	// 			return false;
	// 		}
	// 		return true;
	// 	});
	// 	console.log("After removal: ", ballsRef.current);
	// }

	// /**
	//  * @returns The number of balls to add
	//  */
	// function removeComputerDroppedOrGetNumOfBallsToAdd(): number {
	// 	// Update numberOfUserDropped
	// 	const userDropCount = ballsRef.current.filter(ball => ball.isUserDropped).length;
	// 	console.log("User drop count: ", userDropCount);
	// 	const computerDroppedCount = ballsRef.current.length - userDropCount;
	// 	console.log("Computer drop count: ", computerDroppedCount)
	// 	if (computerDroppedCount > currentBallCount) {
	// 		removeComputerDroppedBalls(computerDroppedCount - currentBallCount);
	// 		return 0;
	// 	} else if (computerDroppedCount < currentBallCount) {
	// 		const addCount = currentBallCount - computerDroppedCount;
	// 		console.log("Add count: ", addCount);
	// 		return addCount;
	// 	}
	// 	return 0;
	// }

	/**
	 * Removes balls from {@link ballsRef}
	 * @param index The zero-based location in the array from which to start removing balls.
	 * @param count The number of balls to remove.
	 */
	function removeBalls(index: number, count: number) {
		ballsRef.current.splice(index, count);
	}

	/**
	 * Calls {@link removeBalls()} to remove all the balls from {@link ballsRef}
	 */
	function clearBalls() {
		removeBalls(0, ballsRef.current.length);
		setCurrentBallCount(0);
	}

	return (
		<div className="flex-col">
			<div>
				<OptionsUI changeShape={setCurrentShape}
					changeBallShape={setCurrentBallShape}
					changeBallCount={setCurrentBallCount}
					changeBallSize={setCurrentBallSize}
					changeBoundarySize={setCurrentBoundarySize}
					changeSegments={setSegments}
					changeRayCasting={setIsRaycastingEnabled}
					changeCollisionRays={setIsCollisionRaysEnabled}
					changeBallDropping={setIsBallDroppingEnabled}
					clearBalls={clearBalls}
					removeForce={removeForce}
					addForce={addForce}
					shapes={Shapes}
					boundaryShapes={BoundaryShapes}
					currentShape={currentShape}
					currentBallShape={currentBallShape}
					currentBallCount={currentBallCount}
					currentBallSize={currentBallSize}
					currentBoundarySize={currentBoundarySize}
					segments={segments}
					isRaycastingEnabled={isRaycastingEnabled}
					isCollisionRaysEnabled={isCollisionRaysEnabled}
					isBallDroppingEnabled={isBallDroppingEnabled}
					forces={forcesRef.current}
				/>
			</div>
			<div className="mt-2 flex items-center justify-center">
				<P5Canvas
					// changeForces={setForces}
					addForce={addForce}
					addBall={addBall}
					removeBalls={removeBalls}
					// addOrRemoveBalls={removeComputerDroppedOrGetNumOfBallsToAdd}
					balls={ballsRef.current}
					shape={currentShape}
					segments={segments}
					ballShape={currentBallShape}
					ballCount={currentBallCount}
					ballSize={currentBallSize}
					boundarySize={currentBoundarySize}
					isRaycastingEnabled={isRaycastingEnabled}
					isCollisionRaysEnabled={isCollisionRaysEnabled}
					isBallDroppingEnabled={isBallDroppingEnabled}
					forces={forcesRef.current}
				/>
			</div>
		</div>
	)
}
