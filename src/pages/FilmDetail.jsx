// src/pages/FilmDetail.jsx 
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import useFilms from '../hooks/useFilms.js'

/** 
 * Página de detalle: 
 * - Lee :id de la URL. 
 * - Intenta encontrar la película en la lista del hook (cache/memoria). 
 * - Si no la encuentra, hace un fetch por id (ruta /films/:id). 
 * - Muestra estados de carga y error. 
 */
export default function FilmDetail() {
    const navigate = useNavigate()
    const { id } = useParams()                  // 1) Parametro dinámico de la URL 
    const { films } = useFilms()                // 2) Lista (posiblemente cacheada) 
    const [film, setFilm] = useState(null)      // 3) Película a mostrar 
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // 4) ¿Está ya en memoria? Lo buscamos por id. 
    const filmFromMemory = useMemo(
        () => films.find(f => f.id === id),
        [films, id]
    )

    useEffect(() => {
        // Si la tenemos en memoria, usamos esa y listo. 
        if (filmFromMemory) {
            setFilm(filmFromMemory)
            setLoading(false)
            setError(null)
            return
        }

        // Si no está en memoria, pedimos a la API por id. 
        setLoading(true)
        setError(null)

        fetch(`https://ghibliapi.vercel.app/films/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error('HTTP ' + res.status)
                return res.json()
            })
            .then((raw) => {
                // Normalizamos de la misma manera que en el hook 
                const normalized = {
                    id: raw.id,
                    name: raw.title ?? 'Untitled',
                    image: raw.image ?? raw.movie_banner ?? '',
                    description: raw.description ?? 'Sin descripción'
                }
                setFilm(normalized)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [filmFromMemory, id])

    // Estados visuales 
    if (loading) return <p>Cargando detalle…</p>
    if (error) {
        return (
            <section>
                <p>Error al cargar: {error.message}</p>
                <button onClick={() => navigate(-1)}>Volver</button>
            </section>
        )
    }
    if (!film) {
        return (
            <section>
                <p>No se encontró la película solicitada.</p>
                <Link to="/characters">Volver al listado</Link>
            </section>
        )
    }

    // Vista de detalle 
    return (
        <section>
            <div style={{ marginBottom: '12px' }}>
                <button onClick={() => navigate(-1)}>Volver</button>
                {' '}
                <Link to="/characters">Ir al listado</Link>
            </div>

            <h2>{film.name}</h2>
            {film.image && (
                <img
                    src={film.image}
                    alt={film.name}
                    style={{
                        width: '100%', height: 'auto', borderRadius: 6, margin: '12px 0'
                    }}
                />
            )}
            <p style={{ lineHeight: 1.6 }}>{film.description}</p>
        </section>
    )
}