import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Edit2, Check, X } from 'lucide-react';

interface Props {
  users: UserProfile[];
  onUpdateUsers: (users: UserProfile[]) => void;
}

export const UserCredentialsTable: React.FC<Props> = ({ users, onUpdateUsers }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPass, setEditPass] = useState('');
  const [editLogin, setEditLogin] = useState('');

  const handleEdit = (u: UserProfile) => {
    setEditingId(u.id);
    setEditName(u.name);
    setEditPass(u.password || (u.role === 'student' ? 'student123' : u.role === 'admin' ? 'admin123' : 'judge123'));
    setEditLogin(u.leaderId || u.email);
  };

  const handleSave = (u: UserProfile) => {
    const updated = users.map(user => {
      if (user.id === u.id) {
        return { 
          ...user, 
          name: editName.trim(), 
          password: editPass.trim(), 
          email: editLogin.trim(),
          leaderId: editLogin.trim(),
          username: editLogin.trim()
        };
      }
      return user;
    });
    onUpdateUsers(updated);
    localStorage.setItem('artsportal_users', JSON.stringify(updated));
    localStorage.setItem('users', JSON.stringify(updated));
    setEditingId(null);
  };

  return (
    <div className="rounded-2xl premium-card p-3 sm:p-4 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
          System Credentials Registry
        </h3>
      </div>
      <div className="overflow-x-auto overflow-y-auto max-h-96 hide-scrollbar">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] text-neutral-450 uppercase font-bold border-b border-neutral-200 dark:border-white/10 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
            <tr>
              <th className="pb-2">Role</th>
              <th className="pb-2">Name</th>
              <th className="pb-2">Login ID / Email</th>
              <th className="pb-2">Password</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
            {users.map(u => {
              const isEditing = editingId === u.id;
              const currentLogin = u.leaderId || u.email;
              const currentPass = u.password || (u.role === 'student' ? 'student123' : u.role === 'admin' ? 'admin123' : 'judge123');
              return (
                <tr key={u.id}>
                  <td className="py-2.5">
                     <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-500' : u.role === 'judge' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'}`}>
                       {u.role}
                     </span>
                  </td>
                  <td className="py-2.5">
                    {isEditing ? (
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full px-2 py-1 rounded bg-black/5 dark:bg-white/10 border-none outline-none text-neutral-800 dark:text-neutral-200 font-semibold" />
                    ) : (
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{u.name}</span>
                    )}
                  </td>
                  <td className="py-2.5">
                    {isEditing ? (
                      <input type="text" value={editLogin} onChange={e => setEditLogin(e.target.value)} className="w-full px-2 py-1 rounded bg-black/5 dark:bg-white/10 border-none outline-none text-neutral-800 dark:text-neutral-200" />
                    ) : (
                      <span className="text-neutral-600 dark:text-neutral-400">{currentLogin}</span>
                    )}
                  </td>
                  <td className="py-2.5 font-mono">
                    {isEditing ? (
                      <input type="text" value={editPass} onChange={e => setEditPass(e.target.value)} className="w-full px-2 py-1 rounded bg-black/5 dark:bg-white/10 border-none outline-none text-neutral-800 dark:text-neutral-200" />
                    ) : (
                      <span className="font-bold text-neutral-700 dark:text-neutral-300">{currentPass}</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleSave(u)} className="p-1.5 rounded bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 rounded bg-neutral-200 dark:bg-white/10 hover:bg-neutral-300 dark:hover:bg-white/20 text-neutral-700 dark:text-neutral-300 transition-colors"><X size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => handleEdit(u)} className="p-1.5 rounded bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-neutral-400 transition-colors"><Edit2 size={14} /></button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
