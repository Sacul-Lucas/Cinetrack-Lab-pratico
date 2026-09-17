import { useState } from "react";

interface ActorFormRegisterProps {
  onSubmit?: (data: FormData) => void;
}

export default function ActorFormRegister({
  onSubmit,
}: ActorFormRegisterProps) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [nationality, setNationality] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    onSubmit?.(formData);
  };

  const handleReset = () => {
    setName("");
    setBirthDate("");
    setNationality("");
  };

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Cadastrar ator</h1>
          <p className="mt-2 text-gray-400">
            Preencha as informações do ator para realizar o cadastro.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Nome *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                maxLength={150}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Matthew McConaughey"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="birth_date"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Data de nascimento
              </label>

              <input
                id="birth_date"
                name="birth_date"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Nacionalidade
              </label>

              <input
                id="nationality"
                name="nationality"
                type="text"
                maxLength={100}
                value={nationality}
                onChange={(event) => setNationality(event.target.value)}
                placeholder="Ex.: Americano"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-gray-800 pt-6 sm:flex-row sm:justify-end">
            <button
              type="reset"
              onClick={handleReset}
              className="rounded-lg border border-gray-700 px-6 py-3 font-medium text-gray-300 transition hover:bg-gray-800"
            >
              Limpar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Cadastrar ator
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}