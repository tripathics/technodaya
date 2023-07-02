'use client'
import { TextInput, DateInput, SelectInput, FileInput } from '@/components/form/InputComponents';
import pageStyles from '../page.module.scss';
import formStyles from '@/components/form/Form.module.scss'
import cx from 'classnames'
import useFetchCollection from '@/hooks/fetchCollection';
import { useEffect, useState } from 'react';
import { deleteDoc, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, db } from '@/firebasse.config';
import { BiMonthlyNames, getBiMonth } from '@/helpers/helpers';
import Alert, { AlertWrapper } from '@/components/alert';
import SendIcon from '@/components/icons/send-icon';
import RemoveIcon from '@/components/icons/remove-icon';

export default function Publish() {
  const {
    docs: drafts,
    setDocs: setDrafts,
    fetching: loadingDrafts,
    error: draftsError,
  } = useFetchCollection('previews');

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (draftsError) {
      setAlerts(prevAlerts => [...prevAlerts, { message: `Error fetching drafts: ${draftsError.message}`, severity: 'error' }]);
    }
  }, [draftsError])

  const handleFormUpdate = (e) => {
    const { name, value } = e.target;
    if (name === 'draftId' && value) {
      setFormData(prevData => ({
        ...prevData,
        draftId: value,
        title: drafts[value].title,
        vol: drafts[value].vol,
        iss: drafts[value].iss,
        month: drafts[value].month,
      }))
      return;
    }

    if (name === 'newsletter-cover') {
      let imageObject = e.target.files[0];
      setFormData(prevData => ({
        ...prevData,
        [name]: imageObject,
      }))
      return;
    }

    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

  const handlePublish = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlerts([]);
    const { title, vol, iss, month, 'newsletter-link': newsletterLink, 'newsletter-cover': newsletterCover } = formData;

    let index = parseInt(`${month.slice(0, 4)}${iss}`);

    try {
      const uploadTask = await uploadBytes(ref(storage, `Technodaya/CoverImages/${newsletterCover.name}`), newsletterCover);
      const coverUrl = await getDownloadURL(uploadTask.ref);

      if (formData.draftId) {
        await setDoc(doc(db, 'issues', `${formData.draftId}`), {
          orders: drafts[formData.draftId].orders,
          title: title,
          vol: vol,
          iss: iss,
          month: month,
        })
      }

      await setDoc(doc(db, 'PastPublications', `${formData.draftId}`), {
        index: index,
        Title: title,
        Vol: vol,
        Issue: iss,
        Month: BiMonthlyNames[getBiMonth(month)][2],
        Year: month.slice(0, 4),
        Link: formData.draftId ? `/issues/${index}` : '',
        PdfUrl: newsletterLink,
        ImageUrl: coverUrl,
      })

      if (formData.draftId) {
        await deleteDoc(doc(db, 'previews', `${formData.draftId}`));
        setDrafts(prevDrafts => {
          const newDrafts = { ...prevDrafts };
          delete newDrafts[formData.draftId];
          return newDrafts;
        })
      }

      setAlerts(prevAlerts => [...prevAlerts, { message: 'Issue published successfully', severity: 'success' }]);
      setFormData({});
    } catch (err) {
      console.log(err);
      setAlerts(prevAlerts => [...prevAlerts, { message: `Error publishing issue: ${err.message}`, severity: 'error' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={pageStyles.page}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Publish issue</h1>
      </header>

      <main className={pageStyles.container}>
        <AlertWrapper>
          {alerts.map(({ message, severity }, index) => (
            <Alert key={message} severity={severity} message={message} handleDismiss={() => setAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index))} />
          ))}
        </AlertWrapper>

        <form className={pageStyles.form} autoComplete='off' onSubmit={handlePublish}>
          <p className={cx(formStyles['section-heading'], 'sub-label')}>Select existing draft (optional)</p>
          <SelectInput name={'draftId'} placeholder='Select draft' value={formData.draftId} onChange={handleFormUpdate} options={Object.keys(drafts).map(id => ({
            value: id,
            label: drafts[id].month + ' - ' + drafts[id].title
          }))} />
          {formData.draftId && (<div className={pageStyles['draft-info']}>
            <a target="_blank" rel="noreferrer" href={`/previews/${formData.draftId}`}>View draft</a>
            <button className={pageStyles.btn} type='button' aria-label='Cancel'
              onClick={(e) => { e.preventDefault(); setFormData(prevData => ({ ...prevData, 'draftId': '' })) }}>
              <div className={pageStyles['btn-text']}>Cancel</div>
              <RemoveIcon />
            </button>
          </div>)}
          <TextInput name={'title'} placeholder={'Title of newsletter'} onChange={handleFormUpdate} required={true} type='text' value={formData.title || ''} />
          <TextInput name={'vol'} placeholder={'Volume no. (in romans)'} onChange={handleFormUpdate} required={true} type='text' value={formData.vol || ''} />
          <TextInput type="number" attrs={{ min: 1 }} required={true} name='iss' placeholder='Issue' onChange={handleFormUpdate} value={formData?.iss} />
          <p className={cx(formStyles['section-heading'], 'sub-label')}>Issue month</p>
          <DateInput type="month" required={true} name='month' onChange={handleFormUpdate} value={formData?.month} />
          <TextInput name={'newsletter-link'} placeholder={'Link to newsletter (PDF)'} onChange={handleFormUpdate} required={true} type='url' value={formData['newsletter-link'] || ''} />

          <p className={cx(formStyles['section-heading'], 'sub-label')}>Upload newsletter cover *</p>
          <FileInput name='newsletter-cover' onChange={handleFormUpdate} required={true} accept='image/*' />
          {formData['newsletter-cover'] && <img style={{ maxWidth: '100%' }} src={URL.createObjectURL(formData['newsletter-cover'])} alt="Newsletter cover" />}

          <button className={pageStyles['form-btn']} type="submit" disabled={loading || loadingDrafts}>
            <div className={pageStyles['btn-text']}>Publish Issue</div>
            <SendIcon />
          </button>
        </form>
      </main>
    </div>
  )
}