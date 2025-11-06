'use client'
import { useEffect, useMemo, useState } from "react"
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
    setApproved(prev => ({ [id]: pending[id], ...prev }));
    setPending(prev => {
      const ls = { ...prev };
      delete ls[id];
      return ls;
    })
    handleUpdate(id, 'approved', true);
  }

  const moveBack: DecisionFunction = (id) => {
    setPending(prev => ({ [id]: approved[id], ...prev }));
    setApproved(prev => {
      const ls = { ...prev };
      delete ls[id];
      return ls;
    })
    handleUpdate(id, 'approved', false);
  }

  const reject: DecisionFunction = (id) => {
    let urls: string[] = [];
    setPending(prev => {
      const ls = { ...prev };
      urls = ls[id].imgUrl;
      if (ls[id].brochureUrl) urls.push(ls[id].brochureUrl);
      delete ls[id];
      return ls;
    });

    handleUpdate(id, 'delete', true, urls);
  }

  /**
   * WARN: Not tested
   * Update a field in a submission
   */
  const update: UpdateFunction = (id, type, field, value) => {
    const setLs = type === 'pending' ? setPending : setApproved;
    let filtered: Collections.Submission['imgUrl'] | null = null;

    setLs(prev => {
      // imgUrl update is only for removal of a url
      if (field === 'imgUrl') {
        const [imgUrl] = value as string[]
        filtered = (prev[id][field] as Collections.Submission['imgUrl']).filter(url => url !== imgUrl)

        if (filtered.length === 0) {
          update(id, type, 'imgCaption', '');
        }
        handleUpdate(id, 'imgUrl', filtered);
      } else {
        handleUpdate(id, field, value);
      }
      return {
        ...prev,
        [id]: {
          ...prev[id],
          [field]: filtered || value
        }
      }
    });
  }

  /**
   * Update a field in a submission
   */
  // const update: UpdateFunction = (id, type, field, value) => {
  //   const ls = type === 'pending' ? pending : approved;
  //   const setLs = type === 'pending' ? setPending : setApproved;
  //
  //   if (field === 'imgUrl') {
  //     const current = ls[id][field] as Collections.Submission['imgUrl'];
  //     const filtered = current.filter(url => url !== value);
  //     if (filtered.length === 0) update(id, type, 'imgCaption', '');
  //   } else {
  //     ls[id][field] = value;
  //   }
  //   setLs({ ...ls });
  //
  //   handleUpdate(id, field, value);
  // }

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

  const lastUpdated = useMemo(() => {
    if (!(fetchingApproved && fetchingPending)) {
      return new Date().toLocaleString('en-IN', {
        timeStyle: "medium",
        dateStyle: "medium",
      });
    } else return null;
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
