import SpinnerIcon from "../icons/spinner-icon";
import styles from "./loading-screen.module.scss";
import { Crimson_Text } from 'next/font/google';
import cx from 'classnames';
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] });

export default function LoadingScreen() {
  return (
    <div className={cx(styles["loading-screen"], crimson_text.className)}>
      <div className={styles["content"]}>
        <SpinnerIcon />
        <div className={styles["text"]}>Please wait...</div>
      </div>
    </div>
  );
}