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
import SendIcon from '@/components/icons/send-icon';
import RemoveIcon from '@/components/icons/remove-icon';
import usePageAlerts from '@/hooks/pageAlerts';
import Image from 'next/image';

export default function Publish() {
  const {
    docs: drafts,
    setDocs: setDrafts,
    fetching: loadingDrafts,
    error: draftsError,
  } = useFetchCollection('previews');

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const { add: addAlert, clear: clearAlerts } = usePageAlerts();

  useEffect(() => {
    if (loading) return;
    if (draftsError) {
      addAlert(`Error fetching drafts: ${draftsError.message}`, 'error');
    }
    if (!loadingDrafts) {
      if (Object.keys(drafts).length) addAlert('Draft(s) available', 'info');
      else addAlert('No draft(s) available', 'info');
    }
  }, [loadingDrafts, drafts, draftsError])

  const handleFormUpdate = (e) => {
    const { name, value } = e.target;
    // if draft is selected, populate form with draft data
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

    // if newsletter cover is selected, store image object
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
    clearAlerts();
    const { title, vol, iss, month, 'newsletter-link': newsletterLink, 'newsletter-cover': newsletterCover } = formData;

    // create index string in the format YYYYII where YYYY is year and II is issue number
    let index = `${month.slice(0, 4)}${iss.toString().padStart(2, '0')}`;
    // publishId is in the format YYYY-BiMonth (e.g. 2021JanFeb)
    let publishId = `${month.slice(0, 4)}${BiMonthlyNames[getBiMonth(month)][0]}`;
    addAlert('Publishing issue. Do not refresh, close or press back button', 'warning', 10000)

    try {
      // upload newsletter cover image
      const uploadTask = await uploadBytes(ref(storage, `Technodaya/CoverImages/${newsletterCover.name}`), newsletterCover);
      const coverUrl = await getDownloadURL(uploadTask.ref);

      // create magazine card for read section containing links, magazine cover and title
      await setDoc(doc(db, 'PastPublications', `${publishId}`), {
        index: index,
        Title: title,
        Vol: vol,
        Issue: iss,
        Month: BiMonthlyNames[getBiMonth(month)][2],
        Year: month.slice(0, 4),
        Link: formData.draftId ? `/issues/${publishId}` : '',
        PdfUrl: newsletterLink,
        ImageUrl: coverUrl,
      })

      // if draft exist, create web magazine and delete draft
      if (formData.draftId) {
        await setDoc(doc(db, 'issues', `${publishId}`), {
          orders: drafts[formData.draftId].orders,
          title: title,
          vol: vol,
          iss: iss,
          month: month,
        })

        await deleteDoc(doc(db, 'previews', `${publishId}`));
        setDrafts(prevDrafts => {
          const newDrafts = { ...prevDrafts };
          delete newDrafts[formData.draftId];
          return newDrafts;
        })

        // delete approved submissions as already published
        const approvedSubmissionsIds = Object.keys(drafts[formData.draftId].orders.activities);
        approvedSubmissionsIds.forEach(async (id) => {
          await deleteDoc(doc(db, 'submissions', id));
        });
      }
      addAlert('Issue published successfully!', 'success');
      setFormData({});
    } catch (err) {
      console.log(err);
      addAlert(`Error publishing issue: ${err.message}`, 'error');
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
          <p className={formStyles['section-heading']}>Issue month (e.g. January-February issue, select January) *</p>
          <DateInput type="month" required={true} name='month' onChange={handleFormUpdate} value={formData.month} disabled={(formData.draftId && formData.month)} />
          <TextInput name={'newsletter-link'} placeholder={'Link to newsletter (PDF)'} onChange={handleFormUpdate} required={true} type='url' value={formData['newsletter-link'] || ''} />

          <p className={cx(formStyles['section-heading'], 'sub-label')}>Upload newsletter cover *</p>
          <FileInput name='newsletter-cover' onChange={handleFormUpdate} required={true} accept='image/*' />
          {formData['newsletter-cover'] && (<div className={pageStyles['image-container']}>
            <Image className={pageStyles.image} fill={true} src={URL.createObjectURL(formData['newsletter-cover'])} alt="Newsletter cover" />
          </div>)}

          <button className={pageStyles['form-btn']} type="submit" disabled={loading || loadingDrafts}>
            <div className={pageStyles['btn-text']}>Publish Issue</div>
            <SendIcon />
          </button>
        </form>
      </main>
    </div>
  )
}