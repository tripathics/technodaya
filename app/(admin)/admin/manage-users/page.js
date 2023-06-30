'use client'
import pageStyles from '../page.module.scss';
import cx from 'classnames'
import { useState } from 'react';
import { getDocs, setDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/firebasse.config';
import { RadioInput, TextInput } from '@/components/form/InputComponents';
import RefreshIcon from '@/components/icons/refresh-icon';
import DoneIcon2 from '@/components/icons/done2-icon';

export default function Register() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [authUsers, setAuthUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const handleFormUpdate = (e) => {
    setFormData(prevData => ({
      ...prevData,
      [e.target.name]: e.target.value
    }))
  }

  const addAuthorizedUser = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setLoading(true);
    // Add user to authorized users collection
    const { fullName, email, password, role } = formData;
    setDoc(doc(db, 'authorized-users', email), {
      FullName: fullName,
      Email: email,
      Password: password,
      Role: role || 'user',
    }).then(() => {
      setAuthUsers(prevUsers => [...prevUsers, {
        FullName: fullName,
        Email: email,
        Password: password,
        Role: role || 'user',
      }]);
      setSuccessMsg('User added successfully!');
      resetForm();
    }).catch(err => {
      setErrorMsg(err.message);
      resetForm();
    }).finally(() => {
      setLoading(false);
    })
  }

  const resetForm = () => {
    setFormData({});
  }

  const getUsers = (type) => {
    // fetch authorized users
    setLoading(true);
    getDocs(collection(db, type)).then((querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users);
      if (type === 'users') setRegisteredUsers(users);
      else setAuthUsers(users);
    }).catch(err => {
      setErrorMsg(err.message);
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <div className={pageStyles.page}>
      <header className={cx(pageStyles['page-header'], pageStyles.container)}>
        <h1 className={pageStyles.heading}>Manage users</h1>
      </header>
      <main className={pageStyles.container}>
        <div>{errorMsg}{successMsg}</div>
        <section>
          <h3 className={pageStyles['section-heading']}>Authorize a new user to register</h3>
          <form className={pageStyles.form} autoComplete="off" onSubmit={addAuthorizedUser}>
            <TextInput placeholder="Full Name" name="fullName" required onChange={handleFormUpdate} value={formData.fullName} />
            <TextInput placeholder="Email" name="email" required onChange={handleFormUpdate} value={formData.email} />
            <TextInput placeholder="Password" name="password" required onChange={handleFormUpdate} value={formData.password} />
            <RadioInput label='User type *' required={true} name="role" onChange={handleFormUpdate} radios={[
              { value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }
            ]} />

            <button className={pageStyles['form-btn']} type="submit" disabled={loading}>
              <div className={pageStyles['btn-text']}>Authorize credentials</div>
              <DoneIcon2 />
            </button>
          </form>
        </section>
        <section>
          <h3 className={pageStyles['section-heading']}>View users</h3>
          <header className={pageStyles['sub-section-header']}>
            <h4 className={pageStyles['sub-section-heading']}>Authorized users</h4>
            <button disabled={loading} className={pageStyles.btn} onClick={(e) => { getUsers('authorized-users') }} aria-label='Fetch authorized users'>
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
                {!!authUsers.length ? authUsers.map(user => (
                  <tr key={user.Email}>
                    <td>{user.FullName}</td>
                    <td>{user.Email}</td>
                    <td>{user.Password}</td>
                    <td>{user.Role}</td>
                  </tr>
                )) : <tr><td colSpan="4">No pending users for signup</td></tr>}
              </tbody>
            </table>
          </div>

          <header className={pageStyles['sub-section-header']}>
            <h4 className={pageStyles['sub-section-heading']}>Registered users</h4>
            <button disabled={loading} className={pageStyles.btn} onClick={(e) => { getUsers('users') }} aria-label='Fetch registered users'>
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
                {!!registeredUsers.length ? registeredUsers.map(user => (
                  <tr key={user.Email}>
                    <td>{user.FullName}</td>
                    <td>{user.Email}</td>
                    <td>{user.Password}</td>
                    <td>{user.Role}</td>
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