type LogoItem = {
  name: string;
  company: string;
  src?: string; // optional URL for a real logo
  alt?: string;
};

const ITEMS: LogoItem[] = [
  { name: "Charlie Lefever", company: "NoCoded", alt: "NoCoded logo" },
  { name: "Liam Coyle", company: "ContentFlo", alt: "ContentFlo logo" },
  { name: "Joe Brady", company: "Who Media", alt: "Who Media logo" },
];

export default function ClientLogos() {
  return (
    <section aria-label="Client logos" className="mx-auto mt-8 max-w-5xl px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <div
            key={item.company}
            className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            title={`${item.name} — ${item.company}`}
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt ?? item.company}
                className="h-8 w-auto opacity-90"
                loading="lazy"
              />
            ) : (
              <span className="text-sm font-semibold tracking-wide text-gray-700 dark:text-gray-200">
                {item.company}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
