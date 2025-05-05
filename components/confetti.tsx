"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  x: number
  y: number
  size: number
  color: string
  velocity: {
    x: number
    y: number
  }
  rotation: number
  rotationSpeed: number
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    // Tạo các mảnh confetti
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#f97316"]
    const newPieces: ConfettiPiece[] = []

    for (let i = 0; i < 100; i++) {
      newPieces.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: Math.random() * 3 + 2,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    setPieces(newPieces)

    // Thiết lập animation
    let animationFrameId: number
    let lastTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = (currentTime - lastTime) / 1000
      lastTime = currentTime

      setPieces(
        (prevPieces) =>
          prevPieces
            .map((piece) => ({
              ...piece,
              x: piece.x + piece.velocity.x,
              y: piece.y + piece.velocity.y,
              rotation: piece.rotation + piece.rotationSpeed,
              velocity: {
                x: piece.velocity.x,
                y: piece.velocity.y + 0.1, // Gravity
              },
            }))
            .filter((piece) => piece.y < window.innerHeight + 100), // Remove pieces that are off-screen
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${piece.x}px`,
            top: `${piece.y}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  )
}
