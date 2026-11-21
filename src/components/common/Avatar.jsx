import React from 'react';

export function Avatar({ user, size = 'md', className = '' }) {
  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm font-semibold',
    xl: 'w-14 h-14 text-base font-bold'
  };

  if (!user) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-medium ${className}`}>
        ?
      </div>
    );
  }

  const initials = user.initials || (user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U');

  return (
    <div
      title={user.name + (user.role ? ` • ${user.role}` : '')}
      className={`relative inline-flex shrink-0 rounded-full overflow-hidden ring-2 ring-white dark:ring-[#0E111A] select-none ${sizeClasses[size]} ${className}`}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-medium">
        {initials}
      </div>
    </div>
  );
}

export function AvatarGroup({ users = [], max = 3, size = 'sm' }) {
  const displayed = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {displayed.map((user, idx) => (
        <Avatar key={user.id || idx} user={user} size={size} />
      ))}
      {remaining > 0 && (
        <div className={`relative inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 ring-2 ring-white dark:ring-[#0E111A] text-xs font-semibold ${
          size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
        }`}>
          +{remaining}
        </div>
      )}
    </div>
  );
}
