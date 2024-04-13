"use client";
import Navbar from "@/components/navbar/";
import Footer from "@/components/footer/";
import styles from "./layout.module.scss";
import useFetchCollection from "@/hooks/fetchCollection";
import { useEffect } from "react";
import { setDoc, doc } from "firebase/firestore";
import { db } from "@/firebasse.config";

export default function Layout({ children }) {
  const { docs: visitorNumber, fetching } = useFetchCollection("visitors");

  useEffect(() => {
    if (!fetching) {
      const ref = doc(db, "visitors", "visitorNumber");
      const curr = visitorNumber?.visitorNumber?.number || -1;
      // console.log(curr);
      if(curr!==-1){
        setDoc(ref, {
          number: curr + 1,
        });
      }
    }
  }, [fetching]);

  return (
    <>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer
        fetching={fetching}
        visitors={visitorNumber?.visitorNumber?.number}
      />
    </>
  );
}
