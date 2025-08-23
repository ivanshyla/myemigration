"use client";
import Image from "next/image";
import Link from "next/link";
import WindowChrome from "../_components/WindowChrome";

export default function ChangePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <WindowChrome>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 sm:py-16">
        {/* Навигация назад */}
        <div className="mb-6 sm:mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Вярнуцца на галоўную
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight">Пра змены</h1>
        
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
          <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden border border-black/15 shadow-sm">
            <Image
              src="/kalinouski.webp"
              alt="Кастусь Каліноўскі"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-base sm:text-lg leading-relaxed">
              Змены не залежаць толькі ад нас. Кастусь Каліноўскі не змог — і ты, хутчэй за ўсё, таксама не зможаш.
            </p>
            <p className="mt-2 sm:mt-3 text-base sm:text-lg leading-relaxed">
              Але дакладна зможаш зрабіць сваё жыццё крыху прасьцейшым ужо цяпер — напрыклад, замовіць прыборку кватэры за 135 зл.
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center sm:text-left">
          <a
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
            href="https://cleanwhale.pl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Замовіць прыборку
          </a>
        </div>

        {/* Кнопки шеринга */}
        <div className="mt-8 sm:mt-10 text-center sm:text-left">
          <p className="text-sm sm:text-base text-gray-600 mb-4">Падзяліся гэтай старонкай:</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-start">
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Пра змены — Кастусь Каліноўскі не змог, але ты дакладна зможаш зрабіць сваё жыццё лепшым")}&url=${encodeURIComponent("https://cleanwhale.pl/")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              𝕏 Tweet
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://cleanwhale.pl/")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
              href={`https://threads.net/intent/post?text=${encodeURIComponent("Пра змены — Кастусь Каліноўскі не змог, але ты дакладна зможаш зрабіць сваё жыццё лепшым")}&url=${encodeURIComponent("https://cleanwhale.pl/")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Threads
            </a>
            <button
              className="inline-flex items-center justify-center gap-2 border border-black/10 px-3 sm:px-4 py-2 hover:bg-black/5 text-sm sm:text-base w-full sm:w-auto"
              onClick={async () => {
                try {
                  await navigator.share?.({ 
                    text: "Пра змены — Кастусь Каліноўскі не змог, але ты дакладна зможаш зрабіць сваё жыццё лепшым", 
                    url: "https://cleanwhale.pl/" 
                  });
                } catch {}
              }}
            >
              📲 Share
            </button>
          </div>
        </div>
        </div>
      </WindowChrome>
    </main>
  );
}


