import ArrowIcon from "../../components/icons/arrow-icon";
import styles from "./page.module.scss";
import { cn } from "@/lib/utils";
import Script from "next/script";
import HeroSection from "./heroSection";

const Home = () => (
  <div className={styles["home-component"]}>
    <HeroSection />

    <section className={cn(styles.counts, 'parallax', styles.parallax)}>
      <div className='flex items-center justify-center gap-10 h-full text-center text-white'>
        {/* <div className={styles['publication']}> */}
        <div className="text-center color-white">
          <h1 className="font-sans">53</h1>
          <h4 className="font-display">International Journals</h4>
        </div>
        <div className={styles['publication']}>
          <h1 className="font-sans">109</h1>
          <h4 className="font-display">National Journals</h4>
        </div>
        <div className={cn(styles['publication'],)}>
          <h1 className="font-sans">24</h1>
          <h4 className="font-display">Technodaya Issues</h4>
        </div>
      </div>
    </section>

    <section className={styles.home}>
      <div className="container flex flex-col mx-auto mt-12 justify-center items-center gap-5">
        <h1 className="text-center">Subscribe to our <br /> newsletter</h1>
        <h4 className="font-display font-normal text-xl italic">Stay updated with new Issues of Technodaya!</h4>
        <form className="flex flex-col justify-center items-center gap-5 mt-6 mb-2">
          <div className="flex flex-wrap justify-center *:p-4 *:m-2 *:font-display *:border-solid *:border *:border-black/10 *:focus:border-black/30 *:outline-none">
            <input required type="text" placeholder="First Name" />
            <input required type="text" placeholder="Last Name" />
            <input required type="email" placeholder="Email" />
          </div>
          <button type="submit" className="font-serif flex flex-row items-center text-2xl italic leading-normal px-4 relative before:absolute before:content-[''] before:left-0 before:rounded-full before:border-2 before:border-solid before:border-black/80 before:h-full before:w-9 before:transition-all before:duration-300 hover:before:w-full hover:cursor-pointer">
            <ArrowIcon className="w-8 mr-2" />
            Subscribe
          </button>
        </form>
      </div>
    </section>

    <Script src="/js/parallax.js" strategy="afterInteractive" />
  </div>
);

export default Home;
