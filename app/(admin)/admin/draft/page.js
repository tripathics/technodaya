'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { DndMain } from '@/components/admin/dnd/dndMain'
import { db } from '@/firebasse.config'
import { BiMonthlyNames, CategoryTitles, getBiMonth } from '@/helpers/helpers'
import { doc, orderBy, setDoc, where } from 'firebase/firestore'
import { DateInput, SelectInput, TextInput } from '@/components/form/InputComponents'
import formStyles from '@/components/form/Form.module.scss'
import pageStyles from '../page.module.scss';
import styles from './page.module.scss'
import cx from 'classnames'
import useFetchCollection from '@/hooks/fetchCollection'
import usePageAlerts from '@/hooks/pageAlerts'
import SaveIcon from '@/components/icons/save-icon'
import NavigateBeforeIcon from '@/components/icons/navigate-before-icon'
import NavigateNextIcon from '@/components/icons/navigate-next-icon'
import SpinnerIcon from '@/components/icons/spinner-icon'
import RemoveIcon from '@/components/icons/remove-icon'
import LoadingScreen from '@/components/loading-screen'

const DraftForm = ({ formData, handleChange, submitForm, drafts = {} }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  }

  return (
    <form id="draftForm" className={cx('draft-form', formStyles.form, pageStyles.form)} onSubmit={handleSubmit}>
      <p className={formStyles['section-heading']}>Continue from last draft (optional)</p>
      <SelectInput name={'draftId'} placeholder='Select draft' value={formData.draftId} onChange={handleChange} options={Object.keys(drafts).map(id => ({
        value: id,
        label: drafts[id].month + ' - ' + drafts[id].title
      }))} />

      {formData?.draftId && (<div className={pageStyles['draft-info']}>
        <a target="_blank" rel="noreferrer" href={`/previews/${formData.draftId}`}>View draft</a>
        <button className={pageStyles.btn} type='button' aria-label='Cancel'
          onClick={e => { e.preventDefault(); handleChange({ target: { name: 'draftId', value: '' } }); }}
        >
          <div className={pageStyles['btn-text']}>Cancel</div>
          <RemoveIcon />
        </button>
      </div>)}

      <div className={cx(formStyles['form-header'], styles['form-header'])}>
        <input
          type="text"
          name="title"
          className={cx(formStyles['form-title'], styles['form-title'], formStyles['form-control'])}
          placeholder="Title of newsletter *"
          required={true}
          onChange={handleChange}
          value={formData.title || ''}
        />
      </div>
      <p className={formStyles['section-heading']}>Issue details</p>
      <TextInput required={true} name="vol" placeholder='Volume no. (in Romans)' onChange={handleChange} value={formData?.vol} />
      <TextInput type="number" attrs={{ min: 1 }} required={true} name='iss' placeholder='Issue' onChange={handleChange} value={formData?.iss} />
      <p className={formStyles['section-heading']}>Issue month (e.g. January-February issue, select January) *</p>
      <DateInput type="month" required={true} disabled={(formData.draftId && formData.month)} name='month' onChange={handleChange} value={formData?.month} />
    </form>
  )
}

const SmallScreenError = () => (
  <div className='error-bw'>
    <div className="error-gif-wrapper">
      <div className="error-gif">
        <Image src='/images/width.gif' width={620} height={258} alt="Take my money" />
      </div>
      <div className="error-message">
        <h1>
          Get A Real<br /> Screen
        </h1>
      </div>
    </div>
    <div className="error-description">
      <p>Drafting is only available on bigger screens</p>
    </div>
  </div>
)

export default function Draft() {
  const [formData, setFormData] = useState({});
  const [formView, setFormView] = useState(true);
  const [preview, setPreview] = useState(null);
  const [previewAfresh, setIsPreviewAfresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState(null);
  const { docs: drafts, fetching: fetchingDrafts, error: draftsError } = useFetchCollection('previews');
  const { docs: approved, fetching: fetchingApproved, error: approvedError } = useFetchCollection('submissions', [orderBy('createdInSeconds', 'asc'), where('approved', '==', true)]);

  const { add: addAlert, clear: clearAlerts } = usePageAlerts();

  useEffect(() => {
    if (!fetchingDrafts) {
      if (Object.keys(drafts).length) addAlert('Draft(s) available', 'info');
      else addAlert('No drafts available', 'info');
    }
  }, [fetchingDrafts, drafts])

  useEffect(() => {
    if (fetchingApproved) return;
    if (!Object.keys(approved).length) addAlert('Please approve some submissions first to create a draft.', 'warning', 0);
  }, [approved, fetchingApproved])

  useEffect(() => {
    if (draftsError) {
      addAlert('Error fetching drafts: ', draftsError, 'error');
    }
    if (approvedError) {
      addAlert('Error fetching approved submissions: ', approvedError, 'error');
    }
  }, [draftsError, approvedError])

  const populateDnd = () => {
    if (fetchingApproved || fetchingDrafts) {
      clearAlerts();
      addAlert('Please wait for the data to load', 'warning');
      return;
    }

    let dndData = {
      activities: {},
      subSections: {},
      sections: {
        'default': { id: 'default', title: 'All activities', subSecIds: [] },
        's0': { id: 's0', title: 'Academic Activities', subSecIds: [] },
        's1': { id: 's1', title: 'Research & Development', subSecIds: [] },
        's2': { id: 's2', title: 'Faculty Empowerment Programs', subSecIds: [] },
        's3': { id: 's3', title: 'Awards', subSecIds: [] },
        's4': { id: 's4', title: 'Outreach Activities', subSecIds: [] },
        's5': { id: 's5', title: 'Alumni Association', subSecIds: [] },
        's6': { id: 's6', title: 'Upcoming Events', subSecIds: [] },
      },
      sectionOrder: ['default', 's0', 's1', 's2', 's3', 's4', 's5', 's6']
    };

    if (!!formData.draftId && drafts[formData.draftId]) {
      const draft = drafts[formData.draftId];
      setPreview('previews/' + formData.draftId);
      dndData = { ...draft.orders };
      // populate subsections
      Object.keys(dndData.subSections).forEach(subSecId => {
        const subSec = dndData.subSections[subSecId];
        console.log(subSec);
        const activities = subSec.activityIds.filter(id => approved[id]);
        if (activities.length === 0) {
          delete dndData.subSections[subSecId];
        } else {
          dndData.subSections[subSecId].activityIds = [...activities];
        }
      })

      // populate sections
      Object.keys(dndData.sections).forEach(secId => {
        console.log(secId);
        const sec = dndData.sections[secId];
        dndData.sections[secId].subSecIds = sec.subSecIds.filter(id => dndData.subSections[id]);
      })

      const newActivities = Object.keys(approved).filter(id => !dndData.activities[id]);

      newActivities.forEach(id => {
        const subSecId = approved[id].categoryId;
        // create the subsection under default section if its id doesn't exist in subsections)
        if (!dndData.subSections[subSecId]) {
          dndData.sections.default.subSecIds.push(subSecId);
        }
        dndData.subSections[subSecId] = {
          id: subSecId,
          title: CategoryTitles[subSecId],
          activityIds: dndData.subSections[subSecId] ? [
            ...dndData.subSections[subSecId].activityIds, id
          ] : [id],
        }
      })
    } else {
      // populate subsections
      Object.keys(approved).forEach(id => {
        dndData.subSections[approved[id].categoryId] = {
          id: approved[id].categoryId,
          title: CategoryTitles[approved[id].categoryId],
          activityIds: dndData.subSections[approved[id].categoryId] ? [
            ...dndData.subSections[approved[id].categoryId].activityIds, id
          ] : [id],
        }
      })

      // populate sections
      dndData.sections.default.subSecIds = Object.keys(dndData.subSections);
    }
    // populate activities
    Object.keys(approved).forEach(id => {
      const { 'desc': desc, ...rest } = approved[id];
      dndData.activities[id] = { ...rest, content: desc };
    })
    setOrders({ ...dndData });

    switchView();
  }

  const handlePreviewIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsPreviewAfresh(false);
    const year = formData.month.slice(0, 4)
    const biMonth = BiMonthlyNames[getBiMonth(formData.month)][0]
    const publishObj = {
      orders: orders,
      ...formData,
    }
    console.log(publishObj);
    // setLoading(false);
    // return;

    const previewLink = `previews/${year}${biMonth}`
    const docRef = doc(db, 'previews', `${year}${biMonth}`);
    try {
      await setDoc(docRef, publishObj);
      setPreview(previewLink);
      setIsPreviewAfresh(true);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const handleForm = (e) => {
    const { name, value } = e.target;
    if (name === 'month' || name === 'draftId') {
      setIsPreviewAfresh(false);
      setPreview(null);
    }
    if (name === 'draftId' && value !== '') {
      const draft = drafts[value];
      setFormData(prevData => ({
        ...prevData,
        title: draft.title,
        vol: draft.vol,
        iss: draft.iss,
        month: draft.month,
        draftId: value
      }));
      return;
    }
    setFormData(prevData => ({ ...prevData, [name]: value }));
  }

  const handleUpdateOrders = (orders) => {
    setOrders(prevData => ({ ...prevData, ...orders }));
    setIsPreviewAfresh(false);
  }

  const switchView = (e) => {
    if (!Object.keys(approved).length) {
      clearAlerts();
      addAlert('Please approve some submissions first to create a draft.', 'warning');
      return;
    };
    setFormView(!formView);
  }

  return (<>
    {/* <SmallScreenError /> */}
    <div className={cx("draft", pageStyles.page, styles.draft)}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Draft Issue</h1>
        <div className={pageStyles["btns-group"]}>
          {formView ? (
            <button className={pageStyles.btn} title="Next" onClick={(e) => {
              if (document.getElementById('draftForm').checkValidity()) {
                e.preventDefault();
                populateDnd();
              };
            }} type="submit" form='draftForm' disabled={(fetchingDrafts || fetchingApproved)} >
              <span className={pageStyles['btn-text']}>Next</span> <NavigateNextIcon />
            </button>
          ) : (<>
            {(fetchingDrafts || fetchingApproved) ? <SpinnerIcon /> : (<>
              {preview && (<p className={pageStyles.status}>
                <a target="_blank" rel="noreferrer" href={`/${preview}`}>{!previewAfresh ? 'Draft is outdated' : 'View draft'}</a>
              </p>)}
              {(!previewAfresh || !preview) && (<button
                form="draftForm"
                className={cx(pageStyles.btn, pageStyles['btn-submit'])}
                id="publishBtn"
                onClick={handlePreviewIssue}
                type="submit"
                disabled={loading}>
                <span className={pageStyles['btn-text']}>Save draft</span>
                {loading ? <SpinnerIcon /> : <SaveIcon />}
              </button>)}
            </>)}
            <button className={pageStyles.btn} title="Back" onClick={switchView} type="button">
              <span className={pageStyles['btn-text']}>Back</span> <NavigateBeforeIcon />
            </button>
          </>)}
        </div>
      </header>
      <main className={cx("workspace", pageStyles.container)}>
        {formView
          ? <DraftForm handleChange={handleForm} formData={formData} drafts={drafts} submitForm={populateDnd} />
          : (fetchingApproved || fetchingDrafts)
            ? <LoadingScreen />
            : (orders && orders?.activities.length !== 0) &&
            <DndMain orders={orders} updateOrders={handleUpdateOrders} />
        }
      </main>
    </div>
  </>)
}