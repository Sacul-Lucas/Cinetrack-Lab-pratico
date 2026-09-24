import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard";

interface MovieOption {
  id: number;
  name: string;
}

interface MovieItem {
  id: number;
  title: string;
  synopsis: string;
  release_date: string;
  duration: number;
  rating?: number | string | null;
  poster_url?: string | null;
  director?: MovieOption | null;
  genres?: MovieOption[];
  actors?: MovieOption[];
  watched?: boolean | null;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

const API_BASE_URL = "http://localhost:8000/api";

function normalizeEntityValue<T extends { id: number; name: string }>(
  value: T | number | null | undefined,
  fallbackMap: Map<number, T>
): T | null {
  if (!value) return null;

  if (typeof value === "object") {
    return value;
  }

  return fallbackMap.get(Number(value)) ?? null;
}

function normalizeEntityList<T extends { id: number; name: string }>(
  values: Array<T | number> | undefined | null,
  fallbackMap: Map<number, T>
): T[] {
  if (!values) return [];

  return values
    .map((value) => {
      if (typeof value === "object") {
        return value;
      }

      return fallbackMap.get(Number(value)) ?? null;
    })
    .filter((value): value is T => Boolean(value));
}

async function fetchAllPages<T>(url: string): Promise<T[]> {
  let results: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);

    if (!response.ok) {
      throw new Error("Falha ao carregar os filmes.");
    }

    const data: PaginatedResponse<T> = await response.json();
    results = results.concat(data.results);
    nextUrl = data.next;
  }

  return results;
}

export default function MovieListPage() {
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [originalMovies, setOriginalMovies] = useState<MovieItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ title: "", watched: false });

  const applyFilters = (moviesToFilter: MovieItem[], filterOptions: typeof filters) => {
    return moviesToFilter
      .filter((movie) => {
        if (filterOptions.title && !movie.title.toLowerCase().includes(filterOptions.title.toLowerCase())) {
          return false;
        }
        if (filterOptions.watched && !movie.watched) {
          return false;
        }
        return true;
      });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = event.target;
    const newFilters = { ...filters, [name]: type === "checkbox" ? checked : value };
    setFilters(newFilters);
    setMovies(applyFilters(originalMovies, newFilters));
  };

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [moviesData, directorsData, genresData, actorsData] = await Promise.all([
          fetchAllPages<MovieItem>(`${API_BASE_URL}/movies/`),
          fetchAllPages<MovieOption>(`${API_BASE_URL}/directors/`),
          fetchAllPages<MovieOption>(`${API_BASE_URL}/genres/`),
          fetchAllPages<MovieOption>(`${API_BASE_URL}/actors/`),
        ]);

        const directorsMap = new Map(directorsData.map((director) => [director.id, director]));
        const genresMap = new Map(genresData.map((genre) => [genre.id, genre]));
        const actorsMap = new Map(actorsData.map((actor) => [actor.id, actor]));

        const normalizedMovies: MovieItem[] = moviesData.map((movie) => ({
          ...movie,
          director: normalizeEntityValue(movie.director as MovieOption | number | null | undefined, directorsMap),
          genres: normalizeEntityList(movie.genres as Array<MovieOption | number> | undefined, genresMap),
          actors: normalizeEntityList(movie.actors as Array<MovieOption | number> | undefined, actorsMap),
        }));

        setOriginalMovies(normalizedMovies);
        setMovies(normalizedMovies);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Não foi possível carregar os filmes."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-300">
        Carregando filmes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 px-4 text-center text-gray-300">
        <p className="text-red-400">{error}</p>
        <Link
          to="/Register/Movie"
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Cadastrar filme
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-400">
                Cinetrack
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">Filmes</h1>
            </div>

            <input 
              type="search" 
              name="title"
              placeholder="Buscar filmes..." 
              value={filters.title}
              onChange={handleFilterChange} 
              className="bg-gray-800 text-gray-300 placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 h-10 flex self-center justify-center align-center p-2 rounded-lg" 
            />
            <input 
              type="checkbox" 
              id="watched" 
              name="watched" 
              checked={filters.watched}
              onChange={handleFilterChange} 
              className="self-center" 
            />
            <label htmlFor="watched" className="self-center text-gray-300">Assistidos</label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/Register/Movie"
              className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Novo filme
            </Link>
            <Link
              to="/Register/Actor"
              className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 font-medium text-gray-200 transition hover:bg-gray-800"
            >
              Ator
            </Link>
            <Link
              to="/Register/Director"
              className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 font-medium text-gray-200 transition hover:bg-gray-800"
            >
              Diretor
            </Link>
            <Link
              to="/Register/Genre"
              className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 font-medium text-gray-200 transition hover:bg-gray-800"
            >
              Gênero
            </Link>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/60 p-10 text-center text-gray-300">
            <p className="text-lg font-medium">Nenhum filme cadastrado ainda.</p>
            <Link
              to="/Register/Movie"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              Cadastrar primeiro filme
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelect={setSelectedMovie}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl shadow-black/40">
            <button
              type="button"
              onClick={() => setSelectedMovie(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-gray-800/80 p-2 text-lg text-gray-200 transition hover:bg-gray-700"
              aria-label="Fechar detalhes"
            >
              ×
            </button>

            <div className="grid md:grid-cols-[260px_1fr]">
              <div className="bg-black">
                <img
                  src={
                    selectedMovie.poster_url ||
                    "https://placehold.co/600x900/111827/ffffff?text=Sem+poster"
                  }
                  alt={selectedMovie.title}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src =
                      "https://placehold.co/600x900/111827/ffffff?text=Sem+poster";
                  }}
                />
              </div>

              <div className="space-y-6 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
                      {selectedMovie.release_date
                        ? new Date(selectedMovie.release_date).getFullYear()
                        : "-"}
                    </p>
                    <h2 className="mt-1 text-3xl font-bold text-white">
                      {selectedMovie.title}
                    </h2>
                  </div>

                  <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-3 py-1.5 text-sm font-semibold text-yellow-300">
                    ★ {Number(selectedMovie.rating ?? 0).toFixed(1)}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Duração
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedMovie.duration} min
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Diretor
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedMovie.director?.name || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-800 bg-gray-900 p-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Gêneros
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedMovie.genres?.length
                        ? selectedMovie.genres.length
                        : 0}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-semibold text-white">Sinopse</h3>
                  <p className="leading-7 text-gray-300">
                    {selectedMovie.synopsis}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Atores</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.actors?.length ? (
                      selectedMovie.actors.map((actor) => (
                        <span
                          key={`actor-${actor.id ?? actor.name}`}
                          className="rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm text-gray-200"
                        >
                          {actor.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Nenhum ator informado</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold text-white">Gêneros</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genres?.length ? (
                      selectedMovie.genres.map((genre) => (
                        <span
                          key={`genre-${genre.id ?? genre.name}`}
                          className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-200"
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">Nenhum gênero informado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
