import { Helmet } from 'react-helmet';

const AIResumeAnalyser = () => {
  return (
    <>
      <Helmet>
        <title>AI Resume Analyser | Interview Experience</title>
        <meta
          name="description"
          content="Analyse your resume and discover practical improvements with AI."
        />
      </Helmet>

      <main className="min-h-screen bg-white px-6 py-16 text-slate-800 dark:bg-black dark:text-white md:px-16 lg:px-24 xl:px-40">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            AI Tools
          </p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">AI Resume Analyser</h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 dark:text-gray-300">
            Review your resume for clarity, structure, keywords, and role alignment before applying.
          </p>
        </section>
      </main>
    </>
  );
};

export default AIResumeAnalyser;
