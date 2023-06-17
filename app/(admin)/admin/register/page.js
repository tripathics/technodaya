import pageStyles from '../page.module.scss';
import cx from 'classnames'

export default function Register() {
  return (
    <div className={pageStyles.page}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Register new user</h1>
      </header>
    </div>
  )
}