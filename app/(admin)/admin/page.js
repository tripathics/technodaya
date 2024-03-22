'use client'
import { useEffect, useState } from "react"
import Submission from "@/components/admin/submissions"
import { db } from "@/firebasse.config"
import { arrayRemove } from "firebase/firestore"
import SpinnerIcon from "@/components/icons/spinner-icon"
import { where, orderBy, setDoc, doc, deleteDoc } from 'firebase/firestore'
import useFetchCollection from "@/hooks/fetchCollection"
import LoadingPage from "@/components/loading-screen"
import { deleteFileFromStorage } from "@/helpers/helpers"
import cx from "classnames"
import styles from './page.module.scss'
import SaveIcon from "@/components/icons/save-icon"
import RefreshIcon from "@/components/icons/refresh-icon"
import usePageAlerts from "@/hooks/pageAlerts"

export default function Submissions() {
  const [unsaved, setUnsaved] = useState({});
  const [storageDeletes, setStorageDeletes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { add: addAlert, clear: clearAlerts } = usePageAlerts();

  const {
    docs: pending,
    setDocs: setPending,
    fetching: fetchingPending,
    refetch: refetchPending,
    error: errorPending
  } = useFetchCollection('submissions', [
    orderBy('createdInSeconds', 'desc'),
    where("approved", "==", false)
  ]);

  const {
    docs: approved,
    setDocs: setApproved,
    fetching: fetchingApproved,
    refetch: refetchApproved,
    error: errorApproved
  } = useFetchCollection('submissions', [
    orderBy('createdInSeconds', 'desc'),
    where("approved", "==", true)
  ]);

  const approve = (id) => {
    const ls = pending;
    setApproved({ [id]: ls[id], ...approved });
    delete ls[id];
    setPending({ ...ls });

    handleUpdate(id, 'approved', true);
  }

  const moveBack = (id) => {
    const ls = approved;
    setPending({ [id]: ls[id], ...pending });
    delete ls[id];
    setApproved({ ...ls });

    handleUpdate(id, 'approved', false);
  }

  const reject = (id) => {
    const ls = pending;
    let urls = pending[id].imgUrl;
    if (pending[id].brochureUrl) urls.push(pending[id].brochureUrl);
    delete ls[id];
    setPending({ ...ls });

    handleUpdate(id, 'delete', true, urls);
  }

  const update = (id, type, field, value) => {
    const ls = type === 'pending' ? pending : approved;
    const setLs = type === 'pending' ? setPending : setApproved;

    if (field === 'imgUrl') {
      ls[id][field] = ls[id][field].filter(url => url !== value);
      if (ls[id][field].length === 0) update(id, type, 'imgCaption', '');
    } else {
      ls[id][field] = value;
    }

    setLs({ ...ls });

    handleUpdate(id, field, value);
  }

  const handleUpdate = (id, key, value, urls = []) => {
    if (key === 'imgUrl') {
      setStorageDeletes([...storageDeletes, ...urls, value]);
      value = arrayRemove(value);
    } else {
      setStorageDeletes([...storageDeletes, ...urls]);
    }
    setUnsaved(prevData => ({ ...prevData, [id]: { ...prevData[id], [key]: value } }))
  }

  const saveChanges = () => {
    clearAlerts();
    const updateDoc = (id) => {
      const docRef = doc(db, 'submissions', id);
      if (unsaved[id].delete) {
        return deleteDoc(docRef);
      } else {
        return setDoc(docRef, unsaved[id], { merge: true });
      }
    }

    setUploading(true);
    const n = Object.keys(unsaved).length;
    Object.keys(unsaved).forEach((id, i) => {
      updateDoc(id)
        .then(() => {
          delete unsaved[id];
          if (i === n - 1) {
            setUploading(false);
            addAlert('Changes saved', 'success');
          };
        })
        .catch(err => { console.log(err) });
    })

    // delete storage files
    storageDeletes.forEach((url, i) => {
      if (!url) return;
      deleteFileFromStorage(url);
      if (i <= storageDeletes.length - 1) {
        setStorageDeletes([]);
      }
    })
  }

  const refresh = () => {
    refetchPending();
    refetchApproved();
    setUnsaved({});
    setStorageDeletes([]);
  }

  useEffect(() => {
    if (!(fetchingApproved && fetchingPending)) {
      setLastUpdated(new Date().toLocaleString('en-IN', {
        timeStyle: "medium",
        dateStyle: "medium",
      }));
    }
  }, [fetchingApproved, fetchingPending])

  return (
    <div className={cx('submissions', styles.page)}>
      <header className={cx(styles['page-header'], styles.container)}>
        <h1 className={styles.heading}>Submissions</h1>
        <div className={styles["btns-group"]}>
          {!(errorPending || errorApproved) && (fetchingApproved || fetchingPending) || uploading ? <SpinnerIcon /> : (<>
            <p className={styles.status}>Last updated: {lastUpdated}</p>
            {Object.keys(unsaved).length !== 0 && (
              <button className={cx(styles.btn, styles['btn-submit'])} onClick={saveChanges}>
                <SaveIcon />
              </button>
            )}
            <button className={styles.btn} onClick={refresh}>
              <RefreshIcon />
            </button>
          </>)}
        </div>
      </header>
      <main className={cx("workspace", styles.container)}>
        {errorApproved || errorPending ? (
          <div className="error">{errorApproved || errorPending}</div>
        ) : fetchingPending || fetchingApproved ? <LoadingPage /> : (
          <div className="submissions-wrapper">
            <div className="submission pending">
              <SubmissionSection type='pending'
                approve={approve} reject={reject} update={update} moveBack={moveBack}
                ls={pending} fetching={fetchingPending}
              />
            </div>
            <div className="submission approved">
              <SubmissionSection type='approved'
                approve={approve} reject={reject} update={update} moveBack={moveBack}
                ls={approved} fetching={fetchingApproved}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const SubmissionSection = ({ type, ls, approve, reject, update, moveBack }) => {
  return (
    <>
      <h3 className="sub-summary">{Object.keys(ls).length} {type} submissions</h3>
      {Object.keys(ls).length !== 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {type === 'pending'
                  ? <><th>Reject</th><th>Approve</th></>
                  : <th>Await</th>}
                <th style={{ minWidth: '120px' }}>Date added</th>
                <th>Author</th>
                <th>Title</th>
                <th>Activity description</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(ls).map(id => (
                <Submission key={`${id}sub`} {...ls[id]} type={type} approve={approve}
                  reject={reject} update={update} moveBack={moveBack}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
