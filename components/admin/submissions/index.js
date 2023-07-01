import Image from 'next/image'
import DoneIcon from '@/components/icons/done-icon'
import RemoveIcon from '@/components/icons/remove-icon'
import UndoIcon from '@/components/icons/undo-icon'
import DeleteIcon from '@/components/icons/delete-icon'
import { CategoryTitles } from '@/helpers/helpers'
import MdInput from '@/components/MdInput'
import styles from './Submission.module.scss';

const Submission = ({ id, categoryId, author, title, created, desc, type, imgUrl, imgCaption, update, reject, approve, moveBack }) => (
  <tr className={styles.submission}>
    {type === 'pending' ? (<>
      <td>
        <button className="action-btn remove" type="button"
          onClick={(e) => { reject(id) }}>
          <RemoveIcon />
        </button>
      </td>
      <td>
        <button className="action-btn add" type="button"
          onClick={(e) => { approve(id) }}>
          <DoneIcon />
        </button>
      </td>
    </>) : (
      <td>
        <button className="action-btn" type="button"
          onClick={(e) => { moveBack(id) }}>
          <UndoIcon />
        </button>
      </td>
    )}
    <td>{created}</td>
    <td>{author}</td>
    <td>
      <MdInput value={title}
        placeholder={CategoryTitles[categoryId]}
        updateVal={(txt) => { update(id, type, 'title', txt) }}
      />
    </td>
    <td className={styles['table-desc']}>
      <MdInput value={desc}
        placeholder='Description'
        updateVal={(txt) => { update(id, type, 'desc', txt) }}
      />
      {imgUrl.length !== 0 && (<>
        <div className={styles.images}>
          {imgUrl.map(url => (
            <div key={url} className={styles['image-wrapper']}>
              <button title='Detele' className={styles.btn}
                onClick={(e) => { e.preventDefault(); update(id, type, 'imgUrl', url) }}>
                <DeleteIcon />
              </button>
              <Image alt='' src={url} width={400} height={400} />
            </div>
          ))}
        </div>
        <div className={styles['img-caption']}>
          <MdInput value={imgCaption}
            placeholder='Image Caption'
            updateVal={(txt) => { update(id, type, 'imgCaption', txt) }}
          />
        </div>
      </>)}
    </td>
  </tr>
)

export default Submission;