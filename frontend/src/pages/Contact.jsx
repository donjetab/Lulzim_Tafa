import { useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import { siteSettings } from '../data/content.js';

export default function Contact() {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('Message ready to submit. Connect /api/contact when the backend is running.');
  }

  return (
    <>
      <PageHero eyebrow="Contact" title="Send a Message" text="The form shape matches the backend ContactMessages table." />
      <section className="section contact-layout">
        <div className="contact-cards">
          <article><h3>Email</h3><p>{siteSettings.contactEmail}</p></article>
          {siteSettings.contactPhone && <article><h3>Phone</h3><p>{siteSettings.contactPhone}</p></article>}
          <article><h3>Location</h3><p>{siteSettings.location}</p></article>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Full name<input name="fullName" required /></label>
          <label>Email<input type="email" name="email" required /></label>
          <label>Subject<input name="subject" required /></label>
          <label>Message<textarea name="message" rows="6" required /></label>
          <button className="button-primary" type="submit">Submit</button>
          {status && <p>{status}</p>}
        </form>
      </section>
    </>
  );
}
