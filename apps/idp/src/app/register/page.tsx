export default function Register() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Register Page</h1>
        <p className="text-lg text-center sm:text-left">
          This is a simple registration page. You can add your registration form
          here.
        </p>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500">
          © 2024 Your Company. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
