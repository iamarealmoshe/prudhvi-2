import React from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDays, CheckCircle2, MapPin, Ticket, UserRound } from 'lucide-react';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(value));
}

function App() {
  const [event, setEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [confirmation, setConfirmation] = React.useState(null);
  const [form, setForm] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: '',
    quantity: 1
  });

  React.useEffect(() => {
    async function loadEvent() {
      try {
        const response = await fetch(`${API_URL}/events`);
        const events = await response.json();

        if (!response.ok) {
          throw new Error(events.message || 'Unable to load events.');
        }

        const firstEvent = events[0];
        setEvent(firstEvent);
        setForm((current) => ({
          ...current,
          ticketType: firstEvent?.ticketTypes?.[0]?.name || ''
        }));
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, []);

  const selectedTicket = event?.ticketTypes.find((ticket) => ticket.name === form.ticketType);
  const quantity = Number(form.quantity);
  const total = selectedTicket ? selectedTicket.price * quantity : 0;

  function updateForm(field, value) {
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(eventToSubmit) {
    eventToSubmit.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          attendee: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone
          },
          ticketType: form.ticketType,
          quantity
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      setConfirmation(data);
      setEvent((current) => ({
        ...current,
        registeredCount: current.capacity - data.event.remainingSeats,
        remainingSeats: data.event.remainingSeats
      }));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <main className="status-page">Loading event details...</main>;
  }

  if (!event) {
    return <main className="status-page">{error || 'No event is available yet.'}</main>;
  }

  if (confirmation) {
    return (
      <main className="shell">
        <section className="confirmation-panel">
          <CheckCircle2 aria-hidden="true" className="success-icon" />
          <p className="eyebrow">Registration confirmed</p>
          <h1>{confirmation.event.title}</h1>
          <div className="confirmation-code">{confirmation.registration.confirmationCode}</div>
          <div className="confirmation-grid">
            <p>
              <span>Attendee</span>
              {confirmation.registration.attendee.fullName}
            </p>
            <p>
              <span>Tickets</span>
              {confirmation.registration.quantity} {confirmation.registration.ticketType}
            </p>
            <p>
              <span>Total</span>
              Rs. {confirmation.registration.totalPrice.toLocaleString('en-IN')}
            </p>
            <p>
              <span>Remaining seats</span>
              {confirmation.event.remainingSeats}
            </p>
          </div>
          <button className="primary-button" onClick={() => setConfirmation(null)}>
            Register another attendee
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="event-pane">
        <p className="eyebrow">Event Registration Portal</p>
        <h1>{event.title}</h1>
        <p className="description">{event.description}</p>
        <div className="event-facts">
          <span>
            <CalendarDays aria-hidden="true" />
            {formatDate(event.startsAt)}
          </span>
          <span>
            <MapPin aria-hidden="true" />
            {event.location}
          </span>
          <span>
            <Ticket aria-hidden="true" />
            {event.remainingSeats ?? event.capacity - event.registeredCount} seats left
          </span>
        </div>
      </section>

      <section className="registration-layout">
        <form className="form-panel" onSubmit={handleSubmit}>
          <div className="section-title">
            <UserRound aria-hidden="true" />
            <h2>Attendee details</h2>
          </div>

          <label>
            Full name
            <input
              required
              value={form.fullName}
              onChange={(event) => updateForm('fullName', event.target.value)}
              placeholder="Enter attendee name"
            />
          </label>

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateForm('email', event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label>
            Phone
            <input
              required
              value={form.phone}
              onChange={(event) => updateForm('phone', event.target.value)}
              placeholder="+91 98765 43210"
            />
          </label>

          <div className="ticket-row">
            <label>
              Ticket type
              <select value={form.ticketType} onChange={(event) => updateForm('ticketType', event.target.value)}>
                {event.ticketTypes.map((ticket) => (
                  <option key={ticket.name} value={ticket.name}>
                    {ticket.name} - Rs. {ticket.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity
              <input
                min="1"
                max="10"
                required
                type="number"
                value={form.quantity}
                onChange={(event) => updateForm('quantity', event.target.value)}
              />
            </label>
          </div>

          {error ? <p className="error-message">{error}</p> : null}

          <button className="primary-button" disabled={submitting} type="submit">
            {submitting ? 'Checking seats...' : 'Confirm registration'}
          </button>
        </form>

        <aside className="summary-panel">
          <div className="section-title">
            <Ticket aria-hidden="true" />
            <h2>Ticket summary</h2>
          </div>
          <div className="summary-line">
            <span>Ticket</span>
            <strong>{selectedTicket?.name}</strong>
          </div>
          <div className="summary-line">
            <span>Quantity</span>
            <strong>{quantity}</strong>
          </div>
          <div className="summary-line">
            <span>Price each</span>
            <strong>Rs. {selectedTicket?.price.toLocaleString('en-IN')}</strong>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>Rs. {total.toLocaleString('en-IN')}</strong>
          </div>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
