type MovieEntity = {
  id: number;
  name: string;
};

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    synopsis: string;
    release_date: string;
    duration: number;
    rating?: number | string | null;
    poster_url?: string | null;
    director?: MovieEntity | null;
    genres?: MovieEntity[];
    actors?: MovieEntity[];
  };
  onSelect: (movie: MovieCardProps["movie"]) => void;
}

const getEntityName = (entity: MovieEntity | null | undefined) => {
  if (!entity) return null;
  return entity.name;
};

const getEntityNames = (entities?: MovieEntity[] | null) =>
  (entities ?? [])
    .map((entity) => entity?.name ?? null)
    .filter((name): name is string => Boolean(name));

export default function MovieCard({ movie, onSelect }: MovieCardProps) {
  const posterUrl =
    movie.poster_url ||
    "https://placehold.co/600x900/111827/ffffff?text=Sem+poster";

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "-";

  const directorName = getEntityName(movie.director) || "Não informado";
  const genreNames = getEntityNames(movie.genres);
  const handleOpen = () => onSelect(movie);

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-blue-950/30"
      onClick={handleOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Abrir detalhes do filme ${movie.title}`}
    >
      <div className="relative overflow-hidden bg-gray-950">
        <img
          src={posterUrl}
          alt={movie.title}
          className="h-72 w-full object-cover transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.src =
              "https://placehold.co/600x900/111827/ffffff?text=Sem+poster";
          }}
        />

        <div className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-yellow-300 backdrop-blur-sm">
          ★ {Number(movie.rating ?? 0).toFixed(1)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-blue-400">
              {releaseYear}
            </p>
            <h3 className="mt-1 text-xl font-bold text-white line-clamp-2">
              {movie.title}
            </h3>
          </div>

          <span className="rounded-full border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-300">
            {movie.duration} min
          </span>
        </div>

        <p className="mb-3 line-clamp-3 text-sm leading-6 text-gray-300">
          {movie.synopsis}
        </p>

        <div className="mt-auto space-y-2 text-sm text-gray-400">
          <div>
            <span className="font-medium text-gray-200">Diretor:</span>{" "}
            {directorName}
          </div>

          <div>
            <span className="font-medium text-gray-200">Gêneros:</span>{" "}
            {genreNames.length ? genreNames.join(", ") : "Não informado"}
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleOpen();
          }}
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Ver detalhes
        </button>
      </div>
    </article>
  );
}
