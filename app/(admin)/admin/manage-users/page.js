'use client'
import pageStyles from '../page.module.scss';
import formStyles from '@/components/form/Form.module.scss'
import cx from 'classnames'
import { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/firebasse.config';
import { RadioInput, TextInput } from '@/components/form/InputComponents';
import RefreshIcon from '@/components/icons/refresh-icon';
import useFetchCollection from '@/hooks/fetchCollection';
import { useAlerts } from '@/contexts/alerts';

export default function Register() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertIds, setAlertIds] = useState([]); // [{ message: '', severity: '' }
  const { addAlert, removeAlert } = useAlerts();

  const {
    docs: authUsers,
    setDocs: setAuthUsers,
    fetching: loadingAuth,
    refetch: getAuthUsers
  } = useFetchCollection('authorized-users');

  const {
    docs: registeredUsers,
    fetching: loadingRegistered,
    refetch: getRegisteredUsers
  } = useFetchCollection('users');

  const handleFormUpdate = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

  const addAuthorizedUser = (e) => {
    e.preventDefault();
    alertIds.forEach(id => removeAlert(id));
    setAlertIds([]);

    setLoading(true);
    // Add user to authorized users collection
    const { fullName, email, password, role } = formData;

    if (Object.keys(registeredUsers).map(id => registeredUsers[id].Email).includes(email)
      || Object.keys(authUsers).map(id => authUsers[id].Email).includes(email)) {
      let id = addAlert('User already exists with that email!', 'error');
      setAlertIds(prevIds => [...prevIds, id]);
      setLoading(false);
      return;
    }
    setDoc(doc(db, 'authorized-users', email), {
      FullName: fullName,
      Email: email,
      Password: password,
      Role: role || 'user',
    }).then(() => {
      setAuthUsers(prevUsers => ({
        ...prevUsers,
        [email]: {
          FullName: fullName,
          Email: email,
          Password: password,
          Role: role || 'user',
        }
      }));
      let id = addAlert('User added successfully!', 'success');
      setAlertIds(prevIds => [...prevIds, id]);
      resetForm();
    }).catch(err => {
      let id = addAlert(`Error adding user: ${err.message}`, 'error');
      setAlertIds(prevIds => [...prevIds, id]);
      resetForm();
    }).finally(() => {
      setLoading(false);
    })
  }

  const resetForm = () => {
    setFormData({});
  }

  return (
    <div className={pageStyles.page}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Manage users</h1>
      </header>
      <main className={pageStyles.container}>
        <section className={pageStyles.section}>
          <h3 className={pageStyles['section-heading']}>Authorize a new user to register</h3>
          <form className={pageStyles.form} autoComplete="off" onSubmit={addAuthorizedUser}>
            <TextInput placeholder="Full Name" name="fullName" required onChange={handleFormUpdate} value={formData.fullName} />
            <TextInput placeholder="Email" name="email" required onChange={handleFormUpdate} value={formData.email} />
            <p className={cx(formStyles['section-heading'], 'sub-label')}>Password must be of atleast 6 characters and contain atleast one special character from set &#39;?@#$%^&+=&#39;</p>
            <TextInput
              placeholder="Password"
              name="password"
              pattern="^(?=.*[?@#$%^&+=])(.{6,})$"
              title="Must be of atleast 6 characters and must contain atleast one special character from the set '?@#$%^&+='"
              required onChange={handleFormUpdate} value={formData.password} />
            <RadioInput label='User type *' required={true} name="role" onChange={handleFormUpdate} radios={[
              { value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }
            ]} />

            <button className={pageStyles['form-btn']} type="submit" disabled={loading || loadingRegistered || loadingAuth}>
              Authorize credentials
            </button>
          </form>
        </section>
        <section className={pageStyles.section}>
          <h3 className={pageStyles['section-heading']}>View users</h3>
          <header className={pageStyles['sub-section-header']}>
            <h4 className={pageStyles['sub-section-heading']}>Authorized users</h4>
            <button disabled={loadingAuth} className={pageStyles.btn} onClick={getAuthUsers} aria-label='Fetch authorized users'>
              <RefreshIcon />
            </button>
          </header>
          <div className='table-wrapper'>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {!!Object.keys(authUsers).length ? Object.keys(authUsers).map(id => (
                  <tr key={id}>
                    <td>{authUsers[id].FullName}</td>
                    <td>{authUsers[id].Email}</td>
                    <td>{authUsers[id].Password}</td>
                    <td>{authUsers[id].Role}</td>
                  </tr>
                )) : <tr><td colSpan="4">No pending users for signup</td></tr>}
              </tbody>
            </table>
          </div>

          <header className={pageStyles['sub-section-header']}>
            <h4 className={pageStyles['sub-section-heading']}>Registered users</h4>
            <button disabled={loadingRegistered} className={pageStyles.btn} onClick={getRegisteredUsers} aria-label='Fetch registered users'>
              <RefreshIcon />
            </button>
          </header>
          <div className='table-wrapper'>
            <table>
              <thead>
                <tr>
                  <th>UID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Password</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {!!Object.keys(registeredUsers).length ? Object.keys(registeredUsers).map(id => (
                  <tr key={id}>
                    <td style={{ fontFamily: 'monospace', letterSpacing: '0.15ch' }}>{id}</td>
                    <td>{registeredUsers[id].FullName}</td>
                    <td>{registeredUsers[id].Email}</td>
                    <td style={{ fontFamily: 'monospace', letterSpacing: '0.15ch' }}>{registeredUsers[id].Password}</td>
                    <td>{registeredUsers[id].Role}</td>
                  </tr>
                )) : <tr><td colSpan="4">No registered users</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}