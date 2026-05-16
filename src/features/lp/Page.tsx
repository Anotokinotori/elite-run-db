import { HERO_IMAGE_URL } from "../home/config";

const LP_HERO_VISUAL_URL = HERO_IMAGE_URL;

export function LpPage() {
  return (
    <main className="lp-page">
      <LpHeroTitleSection />
    </main>
  );
}

function LpHeroTitleSection() {
  return (
    <section className="lp-hero-title" aria-label="Elite Run DB landing hero">
      <div className="lp-hero-title__right-bg" aria-hidden="true" />
      <div className="lp-hero-title__stage">
        <h1 className="lp-hero-title__heading">
          <span>Elite</span>
          <span className="lp-hero-title__heading-accent">Run</span>
          <span>DB</span>
        </h1>

        <p className="lp-hero-title__lead">
          <span className="lp-hero-title__lead-line">
            <span>ランキング</span>
            <span className="lp-hero-title__lead-kana">も</span>
            <span className="lp-hero-title__lead-punctuation">、</span>
            <span>参考探し</span>
            <span className="lp-hero-title__lead-kana">も</span>
            <span className="lp-hero-title__lead-punctuation">。</span>
          </span>
          <span className="lp-hero-title__lead-line">
            <span>精鋭狩り</span>
            <span className="lp-hero-title__lead-kana">の</span>
            <span>記録</span>
            <span className="lp-hero-title__lead-kana">を</span>
            <span>もっと見やすく</span>
            <span className="lp-hero-title__lead-punctuation">。</span>
          </span>
        </p>

        <div className="lp-hero-title__visual-wrap" aria-hidden="true">
          <img className="lp-hero-title__visual" src={LP_HERO_VISUAL_URL} alt="" />
        </div>

        <nav className="lp-hero-title__actions" aria-label="Landing page primary actions">
          <a className="lp-hero-title__action" href="#home">
            <span className="lp-hero-title__action-label">全ランキングを見る</span>
            <span className="lp-hero-title__arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a className="lp-hero-title__action" href="#library">
            <span className="lp-hero-title__action-label">条件から記録を探す</span>
            <span className="lp-hero-title__arrow" aria-hidden="true">
              →
            </span>
          </a>
        </nav>
      </div>
    </section>
  );
}
