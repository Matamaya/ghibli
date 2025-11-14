// src/pages/Game.jsx 
import { useEffect, useState } from 'react'
// Combinaciones ganadoras: filas, columnas y diagonales 
const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas 
    [0, 4, 8], [2, 4, 6]
    // Diagonales 
]
// Función que recibe el tablero (array de 9 posiciones) 
// y devuelve 'X', 'O' o null según si alguien ha ganado 
function checkWinner(board) {
    for (const [a, b, c] of winLines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]
        }
    }
    return null
}
export default function Game() {
    // Estado del tablero y del turno 
    const [board, setBoard] = useState(Array(9).fill(null))
    const [turn, setTurn] = useState('X')
    // Calculamos ganador según el estado actual del tablero 
    const winner = checkWinner(board)
    // Cambiamos título del documento en base a ganador o turno 
    useEffect(() => {
        if (winner) {
            document.title = `Ganó ${winner} — Tres en Raya`
        } else {
            document.title = `Turno: ${turn} — Tres en Raya`
        }
    }, [winner, turn]) // se ejecuta cuando cambian winner o turn 
    // Manejo de clic de cada casilla 
    function handleClick(index) {
        // Si ya hay ganador o la casilla está ocupada, no hacemos nada 
        if (winner || board[index] !== null) {
            return alert('Movimiento inválido. Reinicia para volver a jugar.')
        }
        // Clonamos el tablero actual (nunca lo mutamos directamente) 
        const newBoard = [...board]
        newBoard[index] = turn
        // ¿Hay ganador después de este movimiento? 
        const possibleWinner = checkWinner(newBoard)
        if (possibleWinner) {
            setBoard(newBoard) // actualizamos el tablero 
            return alert(`¡${possibleWinner} ha ganado!`)
        }
        // Si no hay ganador: actualizamos tablero y turno 
        setBoard(newBoard)
        setTurn(prev => (prev === 'X' ? 'O' : 'X'))
    }
    // Reiniciar el juego 
    function resetGame() {
        setBoard(Array(9).fill(null))
        setTurn('X')
    }
    return (
        <section>
            <h2>Tres en Raya</h2>
            {!winner && <p>Turno actual: {turn}</p>}
            {winner && <p>¡Ganó {winner}!</p>}

            {/* Tablero visual como grid de 3x3 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 70px)',
                gap: '10px',
                margin: '1rem 0'
            }}>
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        style={{
                            height: '70px',
                            fontSize: '1.6rem',
                            cursor: 'pointer'
                        }}>
                        {cell}
                    </button>
                ))}
            </div>
            {/* Botón para reiniciar */}
            <button onClick={resetGame}>Reiniciar</button>
            <p style={{ marginTop: '1rem', color: '#666' }}>
                Aprendemos que <code>useState</code> guarda datos que sobreviven
                entre renders, y con <code>useEffect</code> reaccionamos a cambios
                para afectar al mundo exterior (como el título).
            </p>
        </section>
    )
} 
