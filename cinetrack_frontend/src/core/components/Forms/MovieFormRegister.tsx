import { useState } from "react";

interface Option {
  id: number;
  name: string;
}

interface MovieRegisterProps {
  directors?: Option[];
  genres?: Option[];
  actors?: Option[];
  onSubmit?: (data: FormData) => void;
}

export default function MovieFormRegister({
  directors = [],
  genres = [],
  actors = [],
  onSubmit,
}: MovieRegisterProps) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedActors, setSelectedActors] = useState<number[]>([]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    selectedGenres.forEach((id) => {
      formData.append("genres", String(id));
    });

    selectedActors.forEach((id) => {
      formData.append("actors", String(id));
    });

    onSubmit?.(formData);
  };

  const toggleSelection = (
    id: number,
    setSelected: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cadastrar filme</h1>
          <p className="mt-2 text-gray-400">
            Preencha as informações do filme para realizar o cadastro.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl md:p-8"
        >
          {/* Informações principais */}
          <section>
            <h2 className="mb-5 text-xl font-semibold">
              Informações do filme
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Título *
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  maxLength={200}
                  required
                  placeholder="Ex.: Interestelar"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="synopsis"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Sinopse *
                </label>

                <textarea
                  id="synopsis"
                  name="synopsis"
                  required
                  rows={5}
                  placeholder="Digite a sinopse do filme..."
                  className="w-full resize-y rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="release_date"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Data de lançamento *
                </label>

                <input
                  id="release_date"
                  name="release_date"
                  type="date"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Duração (minutos) *
                </label>

                <input
                  id="duration"
                  name="duration"
                  type="number"
                  min="1"
                  required
                  placeholder="Ex.: 148"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="rating"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Avaliação
                </label>

                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  defaultValue="0"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Valor entre 0 e 10.
                </p>
              </div>

              <div>
                <label
                  htmlFor="poster_url"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  URL do pôster
                </label>

                <input
                  id="poster_url"
                  name="poster_url"
                  type="url"
                  placeholder="https://exemplo.com/poster.jpg"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-gray-800" />

          {/* Diretor */}
          <section>
            <h2 className="mb-5 text-xl font-semibold">Equipe</h2>

            <div>
              <label
                htmlFor="director"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Diretor
              </label>

              <select
                id="director"
                name="director"
                defaultValue=""
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Selecione um diretor</option>

                {directors.map((director) => (
                  <option key={director.id} value={director.id}>
                    {director.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Gêneros */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Gêneros *</h2>

            {genres.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum gênero disponível.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {genres.map((genre) => (
                  <label
                    key={genre.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 transition hover:border-gray-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(genre.id)}
                      onChange={() => toggleSelection(genre.id, setSelectedGenres)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="text-sm text-gray-200">
                      {genre.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Atores */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Atores</h2>

            {actors.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum ator disponível.
              </p>
            ) : (
              <div className="grid max-h-64 gap-3 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
                {actors.map((actor) => (
                  <label
                    key={actor.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 p-3 transition hover:border-gray-600"
                  >
                    <input
                      type="checkbox"
                      checked={selectedActors.includes(actor.id)}
                      onChange={() =>
                        toggleSelection(actor.id, setSelectedActors)
                      }
                      className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="text-sm text-gray-200">
                      {actor.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Assistido */}
          {/* <section>
            <h2 className="mb-4 text-xl font-semibold">Assistido</h2>

            <div className="grid max-h-64 gap-3 overflow-y-auto sm:grid-cols-2 md:grid-cols-3">
                
                <label
                  htmlFor="watched"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Assistido
                </label>

                <input
                  id="watched"
                  name="watched"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
            
              </div>
          </section> */}

          <div className="md:col-span-2">
                <label
                  htmlFor="watched"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Assistido
                </label>

                <input
                  id="watched"
                  name="watched"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
          </div>

          {/* Botões */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:justify-end">
            <button
              type="reset"
              onClick={() => {
                setSelectedGenres([]);
                setSelectedActors([]);
              }}
              className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 transition hover:bg-gray-800"
            >
              Limpar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Cadastrar filme
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
