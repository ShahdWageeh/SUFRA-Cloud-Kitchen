import Link from "next/link";

export default function OnboardingPage() {
  return (
    <section className="bg-[url(/registerBackground.jpg)] bg-center rounded-3xl border border-[#ebdfd9] bg-white p-8 min-h-screen flex items-center justify-center">
      <div>
        <h3 className="text-7xl font-semibold text-primary">
          Welcome to Sufra Website
        </h3>
        <div className="text-center m-auto mt-8">
          <Link
            href="/chef/verificationForm"
            className="hover:bg-primary-container px-10 py-3 rounded-4xl text-lg text-white bg-primary"
          >
            Start your Verification
          </Link>
        </div>
      </div>
    </section>
  );
}
