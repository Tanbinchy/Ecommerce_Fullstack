import Icon from "../components/Icon";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex items-center gap-3 text-xl font-black text-slate-950">
              <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-slate-950 text-white">
                <Icon name="bag" className="h-5 w-5" />
              </span>
              MyStore
            </div>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Curated electronics, clean checkout, and a complete admin control
              room built for your MERN backend.
            </p>
          </div>
          <form className="flex w-full max-w-md overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50 md:w-96">
            <input
              type="email"
              placeholder="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Join
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row">
          <span>Copyright 2026 Ashiful Hoque. All rights reserved.</span>
          <span>Ready for Vercel and Render deployment.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
