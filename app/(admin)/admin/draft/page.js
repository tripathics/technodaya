'use client'
import { useEffect, useState } from 'react'
import { DndMain } from '@/components/admin/dnd/dndMain'
import { fs, db } from '@/firebasse.config'
import { getBiMonth, BiMonthlyNames, CategoryTitles } from '@/helpers/helpers'
import SpinnerIcon from '@/components/icons/spinner-icon'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { DateInput, TextInput } from '@/components/form/InputComponents'
import formStyles from '@/components/form/Form.module.scss'
import pageStyles from '../page.module.scss';
import styles from './page.module.scss'
import cx from 'classnames'
import NavigateNextIcon from '@/components/icons/navigate-next-icon'
import NavigateBeforeIcon from '@/components/icons/navigate-before-icon'
import PreviewIcon from '@/components/icons/preview-icon'

const DraftForm = ({ title, vol, iss, month, handleChange }) => {
  const handleInput = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  }

  return (
    <form id="draftForm" className={cx('draft-form', formStyles.form, styles.form)}>
      <div className={cx(formStyles['form-header'], styles['form-header'])}>
        <input
          type="text"
          name="title"
          className={cx(formStyles['form-title'], styles['form-title'], formStyles['form-control'])}
          placeholder="Title of newsletter"
          onChange={handleInput}
          value={title}
        />
      </div>
      <p className={formStyles['section-heading']}>Issue details</p>
      <TextInput required={true} name='vol' placeholder='Volume no. (in Romans)' onChange={handleInput} value={vol} />
      <TextInput type="number" attrs={{ min: 1 }} required={true} name='iss' placeholder='Issue' onChange={handleInput} value={iss} />
      <p className={formStyles['section-heading']}>Month and year</p>
      <DateInput type="month" required={true} name='month' onChange={handleInput} value={month} />
    </form>
  )
}

const SmallScreenError = () => (
  <div className='error-bw'>
    <div className="error-gif-wrapper">
      <div className="error-gif">
        <Image src='/images/width.gif' alt="Take my money" />
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
  const [state, setState] = useState({
    title: '',
    vol: '',
    iss: '',
    month: '',
    formView: true,
    preview: null,
    published: false,
    loading: false,
    orders: {
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
    },
  });

  const fetchData = async () => {
    const q = query(collection(db, 'submissions'), where('approved', '==', true));
    const querySnapshot = await getDocs(q);

    const fetchedOrders = state.orders;

    querySnapshot.forEach(doc => {
      const sub = doc.data()
      const subObj = {
        id: doc.id,
        author: sub.author,
        created: sub.created,
        eventDate: sub.eventDate,
        content: sub.desc,
        brochureUrl: sub.brochureUrl,
        imgCaption: sub.imgCaption,
        imgUrl: sub.imgUrl,
        title: sub.title,
        categoryId: sub.categoryId
      }

      fetchedOrders.activities[subObj.id] = subObj;

      fetchedOrders.subSections[sub.categoryId] = {
        id: sub.categoryId,
        title: CategoryTitles[sub.categoryId],
        activityIds: fetchedOrders.subSections[sub.categoryId] ? [
          ...fetchedOrders.subSections[sub.categoryId].activityIds, subObj.id
        ] : [subObj.id],
      }
    })
    fetchedOrders.sections.default.subSecIds = Object.keys(fetchedOrders.subSections)
    setState(prevData => ({ ...prevData, orders: fetchedOrders }))
  }

  const handlePreviewIssue = (e) => {
    e.preventDefault();
    const { orders, title, vol, iss, month } = state;
    setState(prevData => ({ ...prevData, loading: true }));

    document.getElementById("publishBtn").setAttribute("disabled", "");

    const year = month.slice(0, 4)
    const biMonth = BiMonthlyNames[getBiMonth(month)][0]
    const publishObj = {
      orders: {
        activities: orders.activities,
        subSections: orders.subSections,
        sections: orders.sections,
        sectionOrder: orders.sectionOrder
      },
      title: title,
      vol: vol,
      iss: iss,
      month: month,
    }

    console.log(publishObj);

    const previewLink = `previews/${year}/${biMonth}`

    // delete existing previews
    fs.collection(previewLink).get()
      .then(previews => {
        console.log(previews.docs);
        console.log('Deleting old previews');
        let left = previews.docs.length;
        console.log(`${left} to delete`);
        for (let snap of previews.docs) {
          fs.collection(previewLink).doc(`${snap.id}`).delete().then(() => {
            console.log(`Deleted ${snap.id}`);
            if (left === 0) return;
          })
            .catch(err => { throw err; })
        }
      })
      .then(() => {
        console.log(`Generating preview`)
        fs.collection(previewLink).doc().set(publishObj)
          .then(async () => {
            console.log('Preview generated!');
            setState(prevData => ({ ...prevData, preview: previewLink, loading: false }));
          })
      })
  }

  const handleForm = (name, value) => {
    setState(prevData => ({ ...prevData, [name]: value }));
  }

  const handleUpdateOrders = (orders) => {
    setState(prevData => ({ ...prevData, orders: orders, preview: null }));
  }

  const switchView = (e) => {
    setState(prevData => ({ ...prevData, formView: !state.formView }))
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className={cx("draft", pageStyles.page)}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Draft an Issue</h1>
        <div className={pageStyles["btns-group"]}>
          {!state.formView && !state.preview && (
            !state.loading ? <button
              form="draftForm"
              className={pageStyles.btn}
              id="publishBtn"
              onClick={handlePreviewIssue}
              type="submit"
            >
              <span className={pageStyles['btn-text']}>Get preview</span> <PreviewIcon />
            </button> :
              <SpinnerIcon />
          )}

          {state.preview && (<>
            <a target="_blank" rel="noreferrer" href={`/${preview}`}>
              Show preview
            </a>

            <button
              form="draftForm"
              className={pageStyles.btn}
              id="publishBtn"
              onClick={() => { }}
              type="submit"
            >
              Publish
            </button>
          </>)}
          {state.title && state.iss && state.month && state.vol && (
            state.formView ? (
              <button className={pageStyles.btn} title="Next" onClick={switchView} type="button">
                <span className={pageStyles['btn-text']}>Next</span> <NavigateNextIcon />
              </button>
            ) : (
              <button className={pageStyles.btn} title="Back" onClick={switchView} type="button">
                <span className={pageStyles['btn-text']}>Back</span> <NavigateBeforeIcon />
              </button>
            ))}
        </div>
      </header >

      <main className={cx("workspace", pageStyles.container)}>
        {state.published && (
          <div className="container" >
            <div style={{
              color: '#155724',
              backgroundColor: '#d4edda',
              borderColor: '#c3e6cb',
              padding: '1.75rem 1.25rem',
              margin: '2rem 0',
            }}>
              <h3>Published! <a href={`/${state.preview}`}>Check it out</a></h3>
            </div>
          </div>
        )}

        {
          state.formView ? (
            <DraftForm handleChange={handleForm} title={state.title} vol={state.vol} iss={state.iss} month={state.month} />
          ) : (
            Object.keys(state.orders.activities).length !== 0 &&
            <DndMain orders={state.orders} updateOrders={handleUpdateOrders} />
          )
        }
      </main >
    </div >
  )
}