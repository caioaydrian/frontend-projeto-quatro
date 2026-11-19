import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDrinks } from "../../services/drinks";
import { DEFAULT_DRINK_IMAGE } from "../../utils/constants";
import type { Drink } from "../../types/drink";
import styles from "./Home.module.css";

export function Home() {
  const [drinks, setDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    listDrinks(1, 3)
      .then((res) => setDrinks(res.data || []))
      .catch((err) => console.error("Failed to load favorite drinks:", err));
  }, []);
  return (
    <div>
      <section className={styles.hero} id="home">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <span /> YOUR NEIGHBORHOOD HIDEAWAY
          </p>
          <h1 className={styles.title}>
            Find your
            <br />
            softer <em>side.</em>
          </h1>
          <p className={styles.heroDescription}>
            Thoughtfully brewed coffee, slow mornings, and a little room to breathe. Come in from
            the noise.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.buttonPrimary} to="/menu">
              Discover our coffee <span aria-hidden="true">↗</span>
            </Link>
            <a className={styles.textLink} href="#story">
              A little about us <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <img
            className={styles.heroImage}
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1400&q=90"
            alt="A warmly lit coffee shop counter with freshly brewed coffee"
          />
          <div className={styles.imageShade} />
          <div className={styles.openBadge}>
            <span className={styles.openDot} /> OPEN DAILY <span>·</span> 7AM—7PM
          </div>
          <div className={styles.imageCaption}>
            <span>01 / 03</span>
            <span className={styles.captionLine} />
            <span>THE QUIET HOURS</span>
          </div>
          <div className={styles.coffeeStamp} aria-label="Made with care, served with warmth">
            <span>MADE WITH CARE</span>
            <span className={styles.stampIcon} aria-hidden="true">
              ✳
            </span>
            <span>SERVED WITH WARMTH</span>
          </div>
        </div>
        <a className={styles.scrollCue} href="#story">
          <span /> SCROLL TO SLOW DOWN
        </a>
      </section>

      <section className={styles.welcomeSection} id="story">
        <div className={styles.welcomeHeading}>
          <p className={styles.eyebrow}>
            <span /> A PLACE TO PAUSE
          </p>
          <h2>
            Good coffee.
            <br />
            <em>Better company.</em>
          </h2>
        </div>
        <p className={styles.welcomeCopy}>
          We believe the best things happen when you take your time. So we source with intention,
          brew with care, and save you a seat by the window.
        </p>
        <a
          className={styles.roundLink}
          href="#visit"
          aria-label="Find your way to Dark Coffee Shop"
        >
          <span>
            COME
            <br />
            ON IN
          </span>
          <b aria-hidden="true">↘</b>
        </a>
      </section>

      <section className={styles.menuSection} id="menu">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>
              <span /> A FEW HOUSE FAVORITES
            </p>
            <h2>
              Made for your <em>moment.</em>
            </h2>
          </div>
          <Link className={`${styles.textLink} ${styles.menuLink}`} to="/menu">
            See you at the counter <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.drinkGrid}>
          {drinks.map((drink, index) => (
            <article className={styles.drinkCard} key={drink.id}>
              <div className={styles.drinkImageWrap}>
                <img
                  src={drink.imageUrl || DEFAULT_DRINK_IMAGE}
                  alt={drink.name}
                  loading="lazy"
                />
                <span className={styles.drinkNumber}>0{index + 1}</span>
              </div>
              <div className={styles.drinkDetails}>
                <div className={styles.drinkMeta}>
                  <span>{drink.category?.name || "SPECIALTY"}</span>
                  <span>${Number(drink.price).toFixed(2)}</span>
                </div>
                <h3>{drink.name}</h3>
                <p>{drink.stock} in stock</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.visitSection} id="visit">
        <div className={styles.visitContent}>
          <p className={styles.eyebrow}>
            <span /> YOUR TABLE IS WAITING
          </p>
          <h2>
            Stay for
            <br />a <em>while.</em>
          </h2>
          <p>Bring a book, bring a friend, or just bring yourself. We’ll put the kettle on.</p>
          <a className={styles.buttonLight} href="mailto:hello@darkcoffeeshop.com">
            Come find us <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className={styles.visitDetails}>
          <div>
            <span className={styles.detailLabel}>FIND OUR CORNER</span>
            <p>
              24 Willow Street
              <br />
              Portland, OR 97205
            </p>
          </div>
          <div>
            <span className={styles.detailLabel}>WHEN THE LIGHTS ARE ON</span>
            <p>Every day, 7am — 7pm</p>
          </div>
          <span className={styles.visitDecoration} aria-hidden="true">
            D
          </span>
        </div>
      </section>
    </div>
  );
}
