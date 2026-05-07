import { Link } from "react-router-dom";
import Icon from "../components/Icon";
import PageTitle from "../components/PageTitle";

const Error = () => {
  return (
    <>
      <PageTitle title="Page not found" />
      <section className="section-shell grid min-h-[calc(100vh-12rem)] place-items-center py-16 text-center">
        <div className="panel max-w-xl p-8">
          <Icon name="package" className="mx-auto h-12 w-12 text-slate-300" />
          <h1 className="mt-5 text-4xl font-black text-slate-950">
            Page not found
          </h1>
          <p className="mt-3 text-slate-500">
            The page may have moved, or the route does not exist yet.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-[8px] bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700"
          >
            Back home
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Error;
