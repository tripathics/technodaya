import IssuesGroup from "@/components/issues-group";
import styles from "./page.module.scss";

const About = () => (
  <div className={styles["read-component"]}>
    <div className="container">
      <header className="page-header">
        <h1 className="heading">All releases</h1>
      </header>
      <IssuesGroup />
    </div>
  </div>
)

export default About;