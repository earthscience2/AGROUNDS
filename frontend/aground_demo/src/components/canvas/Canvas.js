import React, { useEffect, useState, useRef } from "react";
import mapBackground from "../../assets/playground.jpeg";

const WIDTH = 340;
const HEIGHT = 180;
const INTERVAL = 10; 

const colors = [
    '#77E4C8', '#36C2CE', '#FFD0D0', '#E2E2B6', '#80C4E9',
    '#FFB22C', '#FFDE4D', '#FF6969', '#677D6A', '#D6BD98'
]; 

const Canvas = ({ positions }) => {
    const canvasRef = useRef(null);
    const [indices, setIndices] = useState(Array(10).fill(0)); 
    const indicesRef = useRef(indices);

    
    useEffect(() => {
        indicesRef.current = indices;
    }, [indices]);

    useEffect(() => {
        console.log(positions)
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = mapBackground;

        let lastUpdateTime = performance.now();
        let animationId;

        const drawBalls = () => {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);

            indicesRef.current.forEach((index, i) => {
                const pos = positions[i] || [];
                if (pos.length > 0) {
                    const x = pos[index][0];
                    const y = pos[index][1];
                    ctx.beginPath();
                    ctx.arc(x, y, 7, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fillStyle = colors[i]; 
                    ctx.fill();

                
                    ctx.fillStyle = 'black'; 
                    ctx.font = '10px Arial'; 
                    ctx.textAlign = 'center'; 
                    ctx.textBaseline = 'middle'; 
                    ctx.fillText(i+1, x, y);
                }
            });
        };

        const animate = (time) => {
            if (time - lastUpdateTime >= INTERVAL) {
                setIndices(prevIndices => 
                    prevIndices.map((prevIndex, i) => (prevIndex + 1) % (positions[i]?.length || 1))
                );
                lastUpdateTime = time;
            }
            drawBalls();
            animationId = requestAnimationFrame(animate);
        };

        image.onload = () => {
            animationId = requestAnimationFrame(animate);
        };

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [positions]);

    return <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />;
};

export default Canvas;
