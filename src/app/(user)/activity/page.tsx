'use client'
import React, { useState, useEffect } from "react";
import { where, orderBy } from "firebase/firestore";
import SpinnerIcon from "@/components/icons/spinner-icon";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import useFetchCollection from "@/hooks/fetchCollection";
import styles from './Activity.module.scss';
import EmailVerification from "@/components/email-verification";
import { useUser } from "@/contexts/user";
import Image from "next/image";

const Activity = () => {
  const [lastUpdated, setLastUpdated] = useState(null);
  const { user } = useUser();

  const { docs: pending, fetching: fetchingPending, refetch: refetchPending } = useFetchCollection('submissions', [
    orderBy('createdInSeconds', 'desc'),
    where("uid", "==", user.uid),
    where("approved", "==", false),
  ]);

  const { docs: approved, fetching: fetchingApproved, refetch: refetchApproved } = useFetchCollection('submissions', [
    orderBy('createdInSeconds', 'desc'),
    where("uid", "==", user.uid),
    where("approved", "==", true),
  ]);

  const refresh = () => {
    refetchApproved();
    refetchPending();
  }

  useEffect(() => {
    if (!(fetchingApproved && fetchingPending)) {
      setLastUpdated(new Date().toLocaleString('en-IN', {
        timeStyle: "medium",
        dateStyle: "medium"
      }))
    }
  }, [fetchingApproved, fetchingPending])

  return (
    <div className={styles["activity-component"]}>
      <div className="container">
        <header className="page-header">
          <h1 className="heading">My Activity</h1>
        </header>

        {!user?.emailVerified ? (
          <EmailVerification user={user} />
        ) : (<>
          {lastUpdated && (
            <div className={styles["last-updated"]}>
              <p>Last updated: {lastUpdated}</p>
              <button onClick={refresh} className="btn">
                Refresh
              </button>
            </div>
          )}
          {(fetchingApproved && fetchingPending) || !user ? <SpinnerIcon />
            : Object.keys(pending).length || Object.keys(approved).length ? (<>
              <div className={styles.summary}>
                <h2>
                  Hi{user.displayName && `, ${user.displayName.slice(0, user.displayName.search(' '))}`}!
                  {Object.keys(pending).length > 0 ? ` You have ${Object.keys(pending).length} pending submission${Object.keys(pending).length > 1 ? 's' : ''}`
                    : ` You don't have any pending submissions`}
                </h2>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th style={{ minWidth: '120px' }}>Date added</th>
                      <th style={{ minWidth: '160px' }}>Title</th>
                      <th>Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(pending).map(id => <Submission {...pending[id]} type='Pending' key={id} />)}
                    {Object.keys(approved).map(id => <Submission {...approved[id]} type='Approved' key={id} />)}
                  </tbody>
                </table>
              </div>
            </>) : <p>You have not made any submissions for the current issue yet</p>}
        </>)}
      </div>
    </div>
  )
}

const Submission = ({ type, created, title, desc, imgUrl }) => (
  <tr>
    <td>{type}</td>
    <td>{created}</td>
    <td>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >{title}</ReactMarkdown>
    </td>
    <td className={styles['table-desc']}>
      <div>
        <ReactMarkdown rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
        >{desc}</ReactMarkdown>
      </div>
      <div className={styles['image-container']}>
        {imgUrl.map(url => (
          <Image key={url} alt='' src={url} fill={true} className={styles['image']} />
        ))}
      </div>
    </td>
  </tr>
)

export default Activity;