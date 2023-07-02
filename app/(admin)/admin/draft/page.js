'use client'
import { useState } from 'react'
import { DndMain } from '@/components/admin/dnd/dndMain'
import { fs, db } from '@/firebasse.config'
import { getBiMonth, BiMonthlyNames, CategoryTitles } from '@/helpers/helpers'
import SpinnerIcon from '@/components/icons/spinner-icon'
import { collection, doc, getDoc, getDocs, query, setDoc, where, orderBy } from 'firebase/firestore'
import { DateInput, TextInput } from '@/components/form/InputComponents'
import formStyles from '@/components/form/Form.module.scss'
import pageStyles from '../page.module.scss';
import styles from './page.module.scss'
import cx from 'classnames'
import NavigateNextIcon from '@/components/icons/navigate-next-icon'
import NavigateBeforeIcon from '@/components/icons/navigate-before-icon'
import PreviewIcon from '@/components/icons/preview-icon'
import Image from 'next/image'

const DraftForm = ({ formData, handleChange, submitForm }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  }

  return (
    <form id="draftForm" className={cx('draft-form', formStyles.form, styles.form)} onSubmit={handleSubmit}>
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
      <p className={formStyles['section-heading']}>Month and year</p>
      <DateInput type="month" required={true} name='month' onChange={handleChange} value={formData?.month} />
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
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState(null);

  const fetchData = async () => {
    // fetch all approved submissions
    const queryApproved = query(collection(db, 'submissions'), orderBy('createdInSeconds', 'asc'), where('approved', '==', true));

    // fetch previews if any and populate the dnd with this data
    const year = formData.month.slice(0, 4);
    const biMonth = BiMonthlyNames[getBiMonth(formData.month)][0];
    const previewRef = doc(db, 'previews', year + biMonth);
    setLoading(true);

    let approved = {};
    let dndData = {
      activities: {},
      subSections: {},
      sections: {
        'default': { id: 'default', title: 'All activiites', subSecIds: [] },
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
    try {
      const querySnapshot = await getDocs(queryApproved);
      querySnapshot.forEach(doc => {
        approved[doc.id] = {
          id: doc.id,
          author: doc.data().author,
          created: doc.data().created,
          eventDate: doc.data().eventDate,
          content: doc.data().desc,
          brochureUrl: doc.data().brochureUrl,
          imgCaption: doc.data().imgCaption,
          imgUrl: doc.data().imgUrl,
          title: doc.data().title,
          categoryId: doc.data().categoryId
        };
      });

      const preview = await getDoc(previewRef);
      if (preview.exists()) {
        setPreview('previews/' + year + biMonth);
        console.log('preview exists');
        dndData = { ...preview.data().orders };
        // populate subsections
        Object.keys(dndData.subSections).forEach(subSecId => {
          const subSec = dndData.subSections[subSecId];
          const activities = subSec.activityIds.filter(id => approved[id]);
          if (activities.length === 0) {
            delete dndData.subSections[subSecId];
          } else {
            dndData.subSections[subSecId].activityIds = [...activities];
          }
        })

        // populate sections
        Object.keys(dndData.sections).forEach(secId => {
          const sec = dndData.sections[secId];
          dndData.sections[secId].subSecIds = sec.subSecIds.filter(id => dndData.subSections[id]);
        })

        const newActivities = Object.keys(approved).filter(id => !dndData.activities[id]);

        // set preview link
        if (!newActivities.length === 0) {
          setPreview('previews/' + year + biMonth);
        } else {
          newActivities.forEach(id => {
            const subSecId = approved[id].categoryId;
            console.log(subSecId);
            console.log(id);
            // create the subsection under default section if its id doesn't exist in subsections
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
        }
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
      dndData.activities = approved;
      setOrders({ ...dndData });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
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
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (name === 'month') {
      setIsPreviewAfresh(false);
      setPreview(null);
    }
  }

  const handleUpdateOrders = (orders) => {
    setOrders(prevData => ({ ...prevData, ...orders }));
    setIsPreviewAfresh(false);
  }

  const switchView = (e) => {
    setFormView(!formView);
  }

  return (<>
    <SmallScreenError />
    <div className={cx("draft", pageStyles.page, styles.draft)}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Draft Issue</h1>
        <div className={pageStyles["btns-group"]}>
          {formView ? (
            <button className={pageStyles.btn} title="Next" onClick={(e) => {
              if (document.getElementById('draftForm').checkValidity()) {
                e.preventDefault();
                fetchData();
                switchView();
              };
            }} type="submit" form='draftForm' >
              <span className={pageStyles['btn-text']}>Next</span> <NavigateNextIcon />
            </button>
          ) : (<>
            {loading ? <SpinnerIcon /> : preview ? (<>
              <p className={pageStyles.status}>
                <a target="_blank" rel="noreferrer" href={`/${preview}`}>{!previewAfresh ? 'Preview is outdated' : 'View preview'}</a>
              </p>
              {!previewAfresh && (
                <button
                  form="draftForm"
                  className={cx(pageStyles.btn, pageStyles['btn-submit'])}
                  id="publishBtn"
                  onClick={handlePreviewIssue}
                  type="submit"
                >
                  <span className={pageStyles['btn-text']}>Update preview</span> <PreviewIcon />
                </button>
              )}
            </>) : (
              <button
                form="draftForm"
                className={cx(pageStyles.btn, pageStyles['btn-submit'])}
                id="publishBtn"
                onClick={handlePreviewIssue}
                type="submit"
              >
                <span className={pageStyles['btn-text']}>Get preview</span> <PreviewIcon />
              </button>
            )}
            <button className={pageStyles.btn} title="Back" onClick={switchView} type="button">
              <span className={pageStyles['btn-text']}>Back</span> <NavigateBeforeIcon />
            </button>
          </>)}
        </div>
      </header>
      <main className={cx("workspace", pageStyles.container)}>
        {formView
          ? <DraftForm handleChange={handleForm} formData={formData} submitForm={fetchData} />
          : loading
            ? <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
              <SpinnerIcon />
            </div>
            : (orders && orders?.activities.length !== 0) &&
            <DndMain orders={orders} updateOrders={handleUpdateOrders} />
        }
      </main>
    </div>
  </>)
}