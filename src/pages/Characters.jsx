// src/pages/Characters.jsx 
import { useEffect, useMemo, useState } from 'react'
import CharacterCard from '../components/CharacterCard.jsx'
import useFilms from '../hooks/useFilms.js'

export default function Characters() {
    // 1) Traemos datos, estados y función reload desde el hook 
    const { films, loading, error, reload } = useFilms()

    // 2) Estado para el término de búsqueda (input controlado) 
    const [search, setSearch] = useState('')

    // 3) Clave para guardar el término en localStorage 
    const SEARCH_KEY = 'ghibli_films_search_v1'

    // 4) Al montar la página, intentamos recuperar el último término buscado 
    useEffect(() => {
        const saved = localStorage.getItem(SEARCH_KEY)
        if (saved) {
            setSearch(saved) // si había algo guardado, lo restauramos 
        }
    }, [])

    // 5) Cada vez que cambia "search", lo persistimos 
    useEffect(() => {
        localStorage.setItem(SEARCH_KEY, search)
    }, [search])

    // 6) Manejador del input: guarda en estado lo que escribe el usuario 
    function handleSearchChange(e) {
        // e.target.value = texto actual del input 
        setSearch(e.target.value)
    }

    // 7) Filtro simple y claro (case-insensitive) 
    //    - Normalizamos a minúsculas 
    //    - Quitamos espacios sobrantes con trim() 
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase()
        if (term === '') return films // sin filtro, devuelve todo 

        // Filtramos por "name" (que viene normalizado desde el hook) 
        return films.filter(film => film.name.toLowerCase().includes(term))
    }, [films, search])

    if (loading) return <p>Cargando películas…</p>
    if (error) {
        return (
            <section>
                <p>Error al cargar: {error.message}</p>
                <button onClick={reload}>Reintentar</button>
            </section> 
    )
    }

    return (
        <section>
            <h2>Películas de Studio Ghibli</h2>

            {/* Barra de acciones: búsqueda y recargar */}
            <div style={{ display: 'flex', gap: '8px', margin: '12px 0' }}>
                {/* Input controlado: value muestra "search", onChange actualiza "search" */}
                <input
                    type="text"
                    placeholder="Buscar por título…"
                    value={search}
                    onChange={handleSearchChange}
                    style={{
                        flex: 1,
                        padding: '0.6rem',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '1rem'
                    }}
                    aria-label="Buscar películas por título"
                />

                {/* Opción para pedir otra vez a la API si lo deseas */}
                <button onClick={reload}>Recargar</button>
            </div>

            {/* Resumen didáctico: cuántas coinciden y si hay filtro activo */}
            <p style={{ marginBottom: '8px', color: '#555' }}>
                {search.trim() === ''
                    ? `Total: ${films.length} películas`
                    : `Coincidencias para "${search.trim()}": ${filtered.length} / ${films.length}`}
            </p>

            {/* Lista (ya filtrada) */}
            {filtered.length === 0 ? (
                <p>No hay resultados para la búsqueda actual.</p>
            ) : (
                <ul>
                    {filtered.map((film) => (
                        <CharacterCard key={film.id} character={film} />
                    ))}
                </ul>
            )}
        </section>
    )
} 