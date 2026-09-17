import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieFormRegister from "../components/Forms/MovieFormRegister";

interface Option {
  id: number;
  name: string;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// O backend roda em uma origem separada do frontend (ver CORS_ALLOWED_ORIGINS
// em settings.py apontando para http://localhost:5173), então "/api/..."
// relativo não funciona aqui — precisa da URL absoluta do Django.
const API_BASE_URL = "http://localhost:8000/api";

// As listas do DRF vêm paginadas (DEFAULT_PAGINATION_CLASS + PAGE_SIZE = 10),
// então uma única requisição só traz os 10 primeiros registros. Essa função
// segue o campo "next" até esgotar as páginas e retorna a lista completa.
async function fetchAllPages<T>(url: string): Promise<T[]> {
  let results: T[] = [];
  let nextUrl: string | null = url;

  while (nextUrl) {
    const response = await fetch(nextUrl);

    if (!response.ok) {
      throw new Error("Falha ao carregar as opções do formulário.");
    }

    const data: PaginatedResponse<T> = await response.json();
    results = results.concat(data.results);
    nextUrl = data.next;
  }

  return results;
}

export const MovieRegister = () => {
  const [directors, setDirectors] = useState<Option[]>([]);
  const [genres, setGenres] = useState<Option[]>([]);
  const [actors, setActors] = useState<Option[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const [directorsData, genresData, actorsData] = await Promise.all([
          fetchAllPages<Option>(`${API_BASE_URL}/directors/`),
          fetchAllPages<Option>(`${API_BASE_URL}/genres/`),
          fetchAllPages<Option>(`${API_BASE_URL}/actors/`),
        ]);

        setDirectors(directorsData);
        setGenres(genresData);
        setActors(actorsData);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as opções do formulário."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      if (data.getAll("genres").length === 0) {
        throw new Error("Selecione pelo menos um gênero para cadastrar o filme.");
      }

      const response = await fetch(`${API_BASE_URL}/movies/`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData && typeof errorData === "object"
            ? Object.values(errorData)
                .flatMap((value) =>
                  Array.isArray(value) ? value : [value]
                )
                .join(" ")
            : "Não foi possível cadastrar o filme.";

        throw new Error(message || "Não foi possível cadastrar o filme.");
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o filme."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-gray-400">
        Carregando formulário...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-950 px-4 text-center text-gray-300">
        <p className="text-red-400">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 pt-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            to="/Movies"
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Ver filmes
          </Link>
          <Link
            to="/Register/Actor"
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Cadastrar ator
          </Link>
          <Link
            to="/Register/Director"
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Cadastrar diretor
          </Link>
          <Link
            to="/Register/Genre"
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Cadastrar gênero
          </Link>
        </div>
      </div>

      {(submitSuccess || submitError) && (
        <div className="mx-auto max-w-4xl px-4 pt-10">
          {submitSuccess && (
            <div className="rounded-lg border border-green-700 bg-green-900/40 px-4 py-3 text-sm text-green-300">
              Filme cadastrado com sucesso!
            </div>
          )}

          {submitError && (
            <div className="rounded-lg border border-red-700 bg-red-900/40 px-4 py-3 text-sm text-red-300">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mt-4 flex gap-3">
              <Link
                to="/Movies"
                className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700"
              >
                Voltar para a listagem
              </Link>
            </div>
          )}
        </div>
      )}

      <fieldset disabled={isSubmitting} className="disabled:opacity-60">
        <MovieFormRegister
          directors={directors}
          genres={genres}
          actors={actors}
          onSubmit={handleSubmit}
        />
      </fieldset>
    </div>
  );
};

export default MovieRegister;