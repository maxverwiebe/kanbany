export default function Footer() {
  return (
    <div>
      <footer className="w-full mb-4 text-center text-neutral-400 text-sm">
        <p className="flex flex-wrap justify-center items-center gap-2">
          <span>Data is stored in Local Storage.</span>
          <span>|</span>
          <span>
            Open Source:&nbsp;
            <a
              className="text-violet-300 hover:underline"
              href="https://github.com/maxverwiebe/kanbany"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Link
            </a>
          </span>
          <span>|</span>
          <span>© 2025 Kanbany. All rights reserved.</span>
        </p>
      </footer>
    </div>
  );
}
