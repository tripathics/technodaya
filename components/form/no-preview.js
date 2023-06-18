import React from "react"
import Link from "next/link";
import EmptyLetterBox from "../icons/illustrations/empty-letter-box";
import styles from './NoPreview.module.scss';
import cx from "classnames";

import { Open_Sans } from "next/font/google";
const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })

const NoPreview = () => (
  <div className={cx(styles.nocontent, open_sans.className)}>
    <div className={styles.illustration}>
      <EmptyLetterBox />
    </div>

    <h2>There is nothing to show yet.</h2>
    <p>
      Select an activity category first and fill the form, then use this preview mode to edit the generated text or
    </p>
    <p>Already filled? <Link href={'/activity'}>View your submissions</Link></p>
  </div>
)

export default NoPreview;