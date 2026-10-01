import { getRoleColor } from '../../services/adminUserData'

export default function DeleteUserModal({ isOpen, user, onClose, onConfirmDelete }) {
  if (!isOpen || !user) return null

  const roleStyle = getRoleColor(user.role)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(145deg, #161f30, #0f1624)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(239, 68, 68, 0.15)',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '480px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with warning icon */}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ef4444',
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              Remove System User
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Are you sure you want to permanently remove this user account?
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* User preview card */}
        <div style={{ padding: '24px 28px' }}>
          <div
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: `2px solid ${roleStyle.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: roleStyle.text,
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {user.avatar || 'US'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>{user.name}</span>
                <span
                  style={{
                    backgroundColor: roleStyle.bg,
                    color: roleStyle.text,
                    border: `1px solid ${roleStyle.border}`,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}
                >
                  {user.role}
                </span>
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email} &bull; {user.facility}
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#fca5a5',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}
          >
            <svg style={{ flexShrink: 0, marginTop: '2px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <div>
              <strong>Action cannot be undone:</strong> Deleting this account will immediately revoke access to all assigned roles, portal permissions, and active device sessions.
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div
          style={{
            padding: '18px 28px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background 0.15s ease',
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirmDelete(user.id)}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Remove User
          </button>
        </div>
      </div>
    </div>
  )
}
