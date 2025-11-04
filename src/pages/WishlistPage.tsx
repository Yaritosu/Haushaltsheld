import AppShell from '../components/AppShell';
import { GiftIcon } from '@heroicons/react/24/outline';

type Props = { onLogout: () => void };

export default function WishlistPage({ onLogout }: Props) {
  const items = [
    { name: 'PS5', points: 5000 },
    { name: 'Nintendo Switch', points: 3000 },
    { name: 'Neues Fahrrad', points: 2000 },
    { name: 'Laptop', points: 6000 },
    { name: 'Kopfhörer', points: 800 },
  ];

  return (
    <AppShell onLogout={onLogout}>
      <div className="dashboard-card" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card-icon"><GiftIcon style={{ width: 28, height: 28 }} /></div>
        <h3>Wunschliste</h3>
        <p className="muted">Alle Ziele deines Haushalts.</p>
        
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => (
            <div key={item.name} className="task-item">
              <div>
                <div className="task-title">{item.name}</div>
                <div className="task-meta muted">{item.points} P</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
