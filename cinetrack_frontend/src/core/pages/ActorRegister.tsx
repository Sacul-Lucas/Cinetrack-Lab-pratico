import { useState } from "react";
import { Link } from "react-router-dom";
import ActorFormRegister from "../components/Forms/ActorFormRegister";

const API_BASE_URL = "http://localhost:8000/api";

export const ActorRegister = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/actors/`, {
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
            : "Não foi possível cadastrar o ator.";

        throw new Error(message || "Não foi possível cadastrar o ator.");
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Não foi possível cadastrar o ator."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            to="/Register/Movie"
            className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800"
          >
            Cadastrar filme
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
              Ator cadastrado com sucesso!
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
        <ActorFormRegister onSubmit={handleSubmit} />
      </fieldset>
    </div>
  );
};

export default ActorRegister;
