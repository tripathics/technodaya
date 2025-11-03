'use client'
import { useEffect, useState } from "react"
import Submission, { DecisionFunction, UpdateFunction } from "@/components/admin/submissions"
import { db } from "@/firebase.config"
import { arrayRemove } from "firebase/firestore"
import SpinnerIcon from "@/components/icons/spinner-icon"
import { where, orderBy, setDoc, doc, deleteDoc } from 'firebase/firestore'
import useFetchCollection from "@/hooks/fetchCollection"
import LoadingPage from "@/components/icons/spinner-icon"
import { deleteFileFromStorage } from "@/helpers/helpers"
import cx from "classnames"
import styles from './page.module.scss'
import SaveIcon from "@/components/icons/save-icon"
import RefreshIcon from "@/components/icons/refresh-icon"
import { useAlerts } from "@/contexts/alerts"
import type { Collections } from "@/types/collection"

export default function Submissions() {
  const [unsaved, setUnsaved] = useState<Record<string, Collections.SubmissionUpdate>>({});
  const [storageDeletes, setStorageDeletes] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const { addAlert, clearAlerts } = useAlerts();

  const {
    docs: pending,
    setDocs: setPending,
    fetching: fetchingPending,
    refetch: refetchPending,
    error: errorPending
  } = useFetchCollection<Collections.Submission>('submissions', [
    orderBy('createdInSeconds', 'desc'),
    where("approved", "==", false)
  ]);

  const {
    docs: approved,
    setDocs: setApproved,
    fetching: fetchingApproved,
    refetch: refetchApproved,
    error: errorApproved
  } = useFetchCollection<Collections.Submission>('submissions', [
    orderBy('createdInSeconds', 'desc'),
    where("approved", "==", true)
  ]);

  const approve: DecisionFunction = (id) => {
    const ls = { ...pending };
    setApproved({ [id]: ls[id], ...approved });
    delete ls[id];
    setPending(ls);

    handleUpdate(id, 'approved', true);
  }

  const moveBack: DecisionFunction = (id) => {
    const ls = approved;
    setPending({ [id]: ls[id], ...pending });
    delete ls[id];
    setApproved({ ...ls });

    handleUpdate(id, 'approved', false);
  }

  const reject: DecisionFunction = (id) => {
    const ls = pending;
    const urls = pending[id].imgUrl;
    if (pending[id].brochureUrl) urls.push(pending[id].brochureUrl);
    delete ls[id];
    setPending({ ...ls });

    handleUpdate(id, 'delete', true, urls);
  }

  /**
   * Update a field in a submission
   */
  const update: UpdateFunction = (id, type, field, value) => {
    const ls = type === 'pending' ? pending : approved;
    const setLs = type === 'pending' ? setPending : setApproved;

    if (field === 'imgUrl') {
      const current = ls[id][field] as Collections.Submission['imgUrl'];
      const filtered = current.filter(url => url !== value);
      if (filtered.length === 0) update(id, type, 'imgCaption', '');
    } else {
      ls[id][field] = value;
    }
    setLs({ ...ls });

    handleUpdate(id, field, value);
  }

  /**
   * Store unsaved changes
  */
  const handleUpdate = <K extends keyof Collections.SubmissionUpdate>(
    id: Collections.Submission['id'],
    key: K,
    value: Collections.SubmissionUpdate[K],
    urls: string[] = []
  ) => {
    // store img url for deletion of image if updating imgUrl
    if (key === 'imgUrl') {
      const [imgUrl] = value as string[]
      setStorageDeletes(prev => [...prev, ...urls, imgUrl]);
      setUnsaved(prev => ({ ...prev, [id]: { ...prev[id], [key]: arrayRemove(imgUrl) } }))
    } else {
      setStorageDeletes(prev => [...prev, ...urls]);
      setUnsaved(prev => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
    }
  }

  const saveChanges = () => {
    clearAlerts();
    const updateDoc = (id: Collections.Submission['id']) => {
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
                ls={pending}
              />
            </div>
            <div className="submission approved">
              <SubmissionSection type='approved'
                approve={approve} reject={reject} update={update} moveBack={moveBack}
                ls={approved}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

const SubmissionSection: React.FC<{
  type: 'pending' | 'approved';
  ls: Record<Collections.Submission['id'], Collections.Submission>;
  approve: DecisionFunction;
  reject: DecisionFunction;
  moveBack: DecisionFunction;
  update: UpdateFunction;
}> = ({ type, ls, approve, reject, update, moveBack }) => {
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
