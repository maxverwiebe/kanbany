export default function Footer() {
  return (
    <footer className="w-full mb-4 text-center text-neutral-400 text-sm dark:text-neutral-500 px-2">
      <p className="flex flex-wrap justify-center items-center gap-2">
        <span>Data is stored in Local Storage.</span>
        <span className="text-neutral-400 dark:text-neutral-600">|</span>
        <span>
          Open Source:&nbsp;
          <a
            className="text-violet-300 hover:underline dark:text-violet-300 dark:hover:underline"
            href="https://github.com/maxverwiebe/kanbany"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Link
          </a>
        </span>
        <span className="text-neutral-400 dark:text-neutral-600">|</span>
        <span>© 2025 Kanbany. All rights reserved.</span>
      </p>
    </footer>
  );
}
