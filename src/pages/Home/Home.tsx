const drinks = [
  {
    name: "Velvet Mocha",
    description: "Dark chocolate, double espresso, and a cloud of steamed milk.",
    price: "$6.50",
    image: "https://www.coffeesphere.com/wp-content/uploads/2021/01/red-velvet-mocha-recipe.jpg",
    label: "BEST SELLER",
  },
  {
    name: "Midnight Pour Over",
    description: "Slow-brewed single origin with notes of cocoa and plum.",
    price: "$5.00",
    image: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=900&q=85",
    label: "SLOW & STEADY",
  },
  {
    name: "Cinnamon Dusk",
    description: "A smooth oat latte finished with warm cinnamon and honey.",
    price: "$6.00",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    label: "A LITTLE COMFORT",
  },
];

export function Home() {
  return (
    <div>
      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">
            <span /> YOUR NEIGHBORHOOD HIDEAWAY
          </p>
          <h1>
            Find your
            <br />
            softer <em>side.</em>
          </h1>
          <p className="hero-description">
            Thoughtfully brewed coffee, slow mornings, and a little room to breathe. Come in from the noise.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#menu">
              Discover our coffee <span aria-hidden="true">↗</span>
            </a>
            <a className="text-link" href="#story">
              A little about us <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-note">
            <div className="avatar-stack" aria-hidden="true">
              <span>J</span>
              <span>M</span>
              <span>A</span>
            </div>
            <p>
              <strong>A favorite little corner</strong>
              <br />
              Loved by our local community
            </p>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=90"
            alt="A warmly lit coffee shop counter with freshly brewed coffee"
          />
          <div className="image-shade" />
          <div className="open-badge">
            <span className="open-dot" /> OPEN DAILY <span>·</span> 7AM—7PM
          </div>
          <div className="image-caption">
            <span>01 / 03</span>
            <span className="caption-line" />
            <span>THE QUIET HOURS</span>
          </div>
          <div className="coffee-stamp" aria-label="Made with care, served with warmth">
            <span>MADE WITH CARE</span>
            <span className="stamp-icon" aria-hidden="true">
              ✳
            </span>
            <span>SERVED WITH WARMTH</span>
          </div>
        </div>
        <a className="scroll-cue" href="#story">
          <span /> SCROLL TO SLOW DOWN
        </a>
      </section>

      <section className="welcome-section" id="story">
        <div className="welcome-heading">
          <p className="eyebrow">
            <span /> A PLACE TO PAUSE
          </p>
          <h2>
            Good coffee.
            <br />
            <em>Better company.</em>
          </h2>
        </div>
        <p className="welcome-copy">
          We believe the best things happen when you take your time. So we source with intention, brew with care, and
          save you a seat by the window.
        </p>
        <a className="round-link" href="#visit" aria-label="Find your way to Dark Coffee Shop">
          <span>
            COME
            <br />
            ON IN
          </span>
          <b aria-hidden="true">↘</b>
        </a>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span /> A FEW HOUSE FAVORITES
            </p>
            <h2>
              Made for your <em>moment.</em>
            </h2>
          </div>
          <a className="text-link menu-link" href="#visit">
            See you at the counter <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="drink-grid">
          {drinks.map((drink, index) => (
            <article className="drink-card" key={drink.name}>
              <div className="drink-image-wrap">
                <img src={drink.image} alt={drink.name} loading="lazy" />
                <span className="drink-number">0{index + 1}</span>
              </div>
              <div className="drink-details">
                <div className="drink-meta">
                  <span>{drink.label}</span>
                  <span>{drink.price}</span>
                </div>
                <h3>{drink.name}</h3>
                <p>{drink.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="visit-content">
          <p className="eyebrow">
            <span /> YOUR TABLE IS WAITING
          </p>
          <h2>
            Stay for
            <br />a <em>while.</em>
          </h2>
          <p>Bring a book, bring a friend, or just bring yourself. We’ll put the kettle on.</p>
          <a className="button button-light" href="mailto:hello@darkcoffeeshop.com">
            Come find us <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="visit-details">
          <div>
            <span className="detail-label">FIND OUR CORNER</span>
            <p>
              24 Willow Street
              <br />
              Portland, OR 97205
            </p>
          </div>
          <div>
            <span className="detail-label">WHEN THE LIGHTS ARE ON</span>
            <p>Every day, 7am — 7pm</p>
          </div>
          <span className="visit-decoration" aria-hidden="true">
            D
          </span>
        </div>
      </section>
    </div>
  );
}
