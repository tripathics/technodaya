"use client";
import Navbar from "@/components/navbar/";
import Footer from "@/components/footer/";
import styles from "./layout.module.scss";
import useFetchCollection from "@/hooks/fetchCollection";
import { useEffect,useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebasse.config";

export default function Layout({ children }) {
  const { docs: visitorNumber, fetching:fetchingVisitors } = useFetchCollection("visitors");
  const {docs:magzinesCount,fetching:fetchingIssues} = useFetchCollection("PastPublications")

  const [Visitors, setVisitors] = useState(-1)
  const [Issues, setIssues] = useState(-1)

  useEffect(() => {
    if (!fetchingVisitors) {
      const ref = doc(db, "visitors", "visitorNumber");
      const curr = visitorNumber?.visitorNumber?.number || -1;
      if(curr!==-1){
        setVisitors(curr);
        setDoc(ref, {
          number: curr + 1,
        });
      }
    }
  }, [fetchingVisitors]);

  useEffect(()=>{
    if(!fetchingIssues){
      const count = Object.keys(magzinesCount).length || -1;
      if(count!==-1){
        setIssues(count);
        console.log(magzinesCount);
      }
    }
  },[fetchingIssues])

  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer
        issues={Issues}
        visitors={Visitors}
      />
    </>
  );
}
