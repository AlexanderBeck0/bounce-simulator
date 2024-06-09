import { useEffect, useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';
import { Vector } from 'p5';

const Shapes = ["Square", "Circle", "Triangle"];
export type Shape = typeof Shapes[number];

export type Force = {
	name: string;
	value: Vector;
	enabled: boolean;
}

export default function App() {
	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	const [currentBallSize, setCurrentBallSize] = useState<number>(10);
	const [currentBoundarySize, setCurrentBoundarySize] = useState<number>(100);
	// const [forces, setForces] = useState<Force[]>([]);
	const [isDarkMode, setIsDarkMode] = useState(JSON.parse(localStorage.getItem('isDarkMode') ?? "false"));

	useEffect(() => {
		localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
	}, [isDarkMode]);


	return (
		<>
			<OptionsUI changeShape={setCurrentShape}
				changeBallShape={setCurrentBallShape}
				changeBallCount={setCurrentBallCount}
				changeBallSize={setCurrentBallSize}
				changeBoundarySize={setCurrentBoundarySize}
				setIsDarkMode={setIsDarkMode}
				shapes={Shapes}
				currentShape={currentShape}
				currentBallShape={currentBallShape}
				currentBallCount={currentBallCount}
				currentBallSize={currentBallSize}
				currentBoundarySize={currentBoundarySize}
				isDarkMode={isDarkMode}
			/>
			<P5Canvas shape={currentShape}
				ballShape={currentBallShape}
				ballCount={currentBallCount}
				ballSize={currentBallSize}
				boundarySize={currentBoundarySize}
			/>
		</>
	)
}
