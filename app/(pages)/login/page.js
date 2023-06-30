'use client'
import { useEffect, useState } from 'react'
import { auth, db } from '@/firebasse.config';
import ErrorIcon from '@/components/icons/error-icon';
import SpinnerIcon from '@/components/icons/spinner-icon';
import EmailIcon from '@/components/icons/email-icon';
import LockIcon from '@/components/icons/lock-icon';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore'
import cx from 'classnames';
import styles from './styles/Login.module.scss';
import { useUser } from '@/contexts/user';
import { useRouter } from 'next/navigation';

const Login = () => {
  const { user, admin, redirected, setRedirected, logout } = useUser();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const signUpIfAuthorized = async () => {
    // Check if user is present in the authorized users signup collection
    try {
      const docSnap = await getDoc(doc(db, 'authorized-users', email));
      if (docSnap.exists()) {
        // check if password matches
        if (docSnap.data().Password !== password) {
          throw new Error('Invalid password!');
        }
        // If user is present, sign them up and update profile
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName: docSnap.data().FullName });
        // Add user to users collection
        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          FullName: docSnap.data().FullName,
          Email: email,
          Password: password,
          Role: docSnap.data().Role || 'user'
        });
        await deleteDoc(doc(db, 'authorized-users', email));
        // Redirect to admin page if user is admin
        if (redirected === true) {
          setRedirected(false);
          router.back();
        } else {
          router.push(docSnap.data().Role === 'admin' ? '/admin' : '/submit');
        }
      } else {
        throw new Error('Invalid username or password!');
      }
    } catch (err) {
      setErrorMsg(err.message);
      resetForm();
      logout();
    } finally {
      if (!user) setLoading(false);
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const docSnap = await getDoc(doc(db, 'users', res.user.uid));
      if (docSnap.exists()) {
        const authUser = {
          user: res.user,
          admin: docSnap.data().Role === 'admin'
        }

        if (redirected === true) {
          setRedirected(false);
          router.back();
        } else {
          router.push(docSnap.data().Role === 'admin' ? '/admin' : '/submit');
        }
      }
      else {
        throw new Error('Invalid username or password!');
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        signUpIfAuthorized();
      } else {
        setErrorMsg(err.message);
        resetForm();
        logout();
        setLoading(false);
      }
    }
  }

  const resetForm = () => {
    setEmail('');
    setPassword('');
  }

  useEffect(() => {
    if (user && !loading) router.push(admin ? '/admin' : '/submit');
  })

  return (
    <div className={styles['login-page']}>
      <div className='container'>
        <header className='page-header'>
          <h1 className='heading'>Login</h1>
        </header>
        <div className={styles['form-box']}>
          <div className='messages'>
            {errorMsg && <div className={cx(styles['login-msg'], styles.error)}>
              <div className={styles.icon}><ErrorIcon /></div>
              {errorMsg}
            </div>}
          </div>
          <form className={styles['login-form']} onSubmit={handleLogin}>
            <div className={cx(styles['login-field'], styles.email)}>
              <EmailIcon />
              <input type='email' required placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} ></input>
            </div>
            <div className={cx(styles['login-field'], styles.password)}>
              <LockIcon />
              <input type='password' onChange={(e) => setPassword(e.target.value)} value={password} required placeholder='Password'></input>
            </div>
            {loading ? (
              <button className={styles['login-btn']} disabled type="submit">
                <SpinnerIcon style={{ height: '1.2rem' }} />
              </button>
            ) : (
              <button className={styles['login-btn']} type="submit">Login</button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
