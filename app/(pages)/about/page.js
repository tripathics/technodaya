import ProfileCard from "@/components/profile-card/";
import styles from "./page.module.scss";
import { Cormorant } from 'next/font/google'

const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })

const People = {
  chief: [
    {
      name: 'Dr Ram Prakash Sharma',
      role: 'Chairman',
      designation: 'Director, NIT Arunachal Pradesh',
      description: 'Assistant Professor, Mechanical Engineering NIT AP and He is a  speaker, a listener, a demonstrator, and most of all, an influencer. He ia a teacher which is passionate, compassionate, dedicated, understanding, and supportive when it comes to their jobs and their students.',
      profile: '/images/director.png',
      links: [
        { to: 'https://linkedin.com/in/ram-prakash-sharma-90087637', icon: 'linkedin' },
      ],
    },
    {
      name: 'Dr K. Vijaykumar',
      role: 'Editor-in-chief',
      designation: 'Assistant Professor, Department of M&H',
      description: 'Assistant Professor, Management & Humanities NIT AP and He is a  speaker, a listener, a demonstrator, and most of all, an influencer. He ia a teacher which is passionate, compassionate, dedicated, understanding, and supportive when it comes to their jobs and their students.',
      profile: '/images/sir.jpeg',
      links: [
        { to: 'https://www.linkedin.com/in/vijayakumar-kathirvel-75ab64143', icon: 'linkedin' },
        { to: 'https://www.facebook.com/kapvijayakumar', icon: 'facebook' },
        { to: 'https://www.instagram.com/vijayakumarkathirvel/', icon: 'instagram' },
      ],
    },
  ],

  editors: [
    {
      name: 'Dr. Shubhajit Das',
      role: 'Editor',
      designation: 'Assistant Professor, Department of ME',
      description: 'Assistant Professor, Department of Mechanical Engineering NIT AP.His qualities include being a great speaker and most importantly, an influencer. When it comes to his job and his students, he is passionate, compassionate, dedicated, understanding, and supportive.',
      profile: '/images/subhajitSir.jpg',
      links: [
        { to: 'https://www.linkedin.com/in/shubhajit-das-8860a873/', icon: 'linkedin' },
        { to: 'https://www.facebook.com/06shubhajit', icon: 'facebook' },
      ],
    },
    {
      name: 'Mr Ashok. R',
      role: 'Co-Editor',
      designation: 'Research Scholar, Department of ME',
      description: 'Research Scholar, Department of Mechanical Engineering NIT AP. One of best student from the Department of Mechanical Engineering working very hard to achieve great sucess.Also, he is passionate about writing journels and documentations.',
      profile: '/images/ashok.jpg',
      links: [
        { to: 'https://www.linkedin.com/in/ashok-ravichandran-ba761785/', icon: 'linkedin' },
        { to: 'https://www.facebook.com/ashok.ravi.712', icon: 'facebook' },
        { to: 'https://www.instagram.com/ashokravi3652/', icon: 'instagram' },
      ],
    },
  ],
  studentEditors: [
    {
      name: 'Keshav Arora',
      role: 'Developer and Maintainer',
      designation: 'UG Student, CSE 3rd year',
      description: 'None',
      profile: 'https://avatars.githubusercontent.com/u/124811079',
      links: [
        { to: 'https://www.linkedin.com/in/keshav-arora-a5a20325b', icon: 'linkedin' },
        { to: 'https://github.com/keshav7104/', icon: 'github' },
        { to: 'https://instagram.com/keshav_7104/', icon: 'instagram' },
      ],
    },
    {
      name: 'Vanshika Marwaha',
      role: 'Designer and Editor',
      designation: 'UG Student, CSE 3rd year',
      description: 'None',
      profile: 'https://avatars.githubusercontent.com/u/101502532',
      links: [
        { to: 'https://www.linkedin.com/in/vanshika-marwaha/', icon: 'linkedin' },
        { to: 'https://github.com/marwahavanshika', icon: 'github' },
        { to: 'https://www.instagram.com/d_chaotic_vibe/', icon: 'instagram' },
      ],
    },
    {
      name: 'Omsubhra Singha',
      role: 'Designer and Editor',
      designation: 'UG Student, CSE 3rd year',
      description: 'None',
      profile: '/images/Omsubhra.jpg',
      links: [
        { to: 'https://www.linkedin.com/in/omsubhra-singha-30447a254', icon: 'linkedin' },
        { to: 'https://www.facebook.com/omsubhra.singha', icon: 'facebook' },
      ],
    },
    {
      name: 'Rupom Nandi',
      role: 'Designer and Editor',
      designation: 'UG Student, CSE 3rd year',
      description: 'None',
      profile:'/images/Rupom.jpg',
      links: [
        { to: 'https://www.linkedin.com/in/rupom-nandi', icon: 'linkedin' },
        { to: 'https://instagram.com/the_rustic_bong', icon: 'instagram' },
      ],
    },
    {
      name: 'Aaryan',
      role: 'Developer and Maintainer',
      designation: 'UG Student, CSE 3rd year',
      description: 'None',
      profile: '/images/Aaryan.jpg',
      links: [
        { to: 'https://www.linkedin.com/in/aaryan-prasad-9ba1552a1/', icon: 'linkedin' },
        { to: 'https://github.com/aaryan3783', icon: 'github' },
      ],
    },
  ]
}

export default function About() {
  return (
    <div className={styles["about-component"]}>
      <div className="container">
        <header className={'page-header'}>
          <h1 className="heading">About us</h1>
        </header>
        <section>
          <div className={[styles.technodaya, cormorant.className].join(' ')}>
            <p>Technodaya is the bimonthly newsletter of National Institute of Technology, Arunachal Pradesh. Every issue of this magazine contains the activities held within the last two months in the institute. </p>
          </div>
        </section>

        <section className={styles.people}>
          <header className={styles["section-header"]}>
            <h1 className={styles.heading}>Editorial</h1>
          </header>

          <div className={styles.members}>
            {People.chief.map(person => <ProfileCard key={person.name} {...person} />)}
          </div>
          <div className={styles.members}>
            {People.editors.map(person => <ProfileCard key={person.name} {...person} />)}
          </div>
        </section>
        <section className={styles.people}>
          <header className={styles["section-header"]}>
            <h1 className={styles.heading}>Student Editors & Developers</h1>
          </header>
          <div className={styles.members}>
            {People.studentEditors.map(person => <ProfileCard key={person.name} {...person} />)}
          </div>
        </section>
      </div>
    </div>
  )
}