import { useEffect, useState } from 'react';
import { fetchGroups, createGroup, addGroupMember, deleteGroup, removeGroupMember } from '../api/groupService.js';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadGroups = async () => {
    const response = await fetchGroups();
    setGroups(response.data.data.groups);
    if (!selectedGroup && response.data.data.groups.length) setSelectedGroup(response.data.data.groups[0]);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createGroup(form);
      setForm({ name: '', description: '' });
      setStatusMessage('Group created successfully');
      setErrorMessage('');
      await loadGroups();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Unable to create group');
      setStatusMessage('');
    }
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim() || !selectedGroup) return;
    try {
      await addGroupMember({ groupId: selectedGroup._id, memberId: memberEmail });
      setMemberEmail('');
      setStatusMessage('Member added successfully');
      setErrorMessage('');
      await loadGroups();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Unable to add member');
      setStatusMessage('');
    }
  };

  const handleDelete = async (groupId) => {
    try {
      await deleteGroup(groupId);
      setSelectedGroup(null);
      setStatusMessage('Group deleted successfully');
      setErrorMessage('');
      await loadGroups();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Unable to delete group');
      setStatusMessage('');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!selectedGroup) return;
    try {
      await removeGroupMember(selectedGroup._id, memberId);
      setStatusMessage('Member removed successfully');
      setErrorMessage('');
      await loadGroups();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Unable to remove member');
      setStatusMessage('');
    }
  };

  return (
    <main className="grid gap-8 xl:grid-cols-[0.9fr_0.6fr]">
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-white">Groups</h1>
            <p className="mt-2 text-slate-400">Create groups, invite members, and review membership.</p>
          </div>
          <button onClick={() => setSelectedGroup(null)} className="rounded-3xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">New group</button>
        </div>
        <div className="mt-8 grid gap-3">
          {groups.map((group) => (
            <button key={group._id} onClick={() => setSelectedGroup(group)} className={`w-full rounded-3xl border px-5 py-4 text-left transition ${selectedGroup?._id === group._id ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 bg-slate-950/70 hover:border-cyan-400'}`}>
              <div className="font-semibold text-white">{group.name}</div>
              <div className="mt-1 text-sm text-slate-400">{group.members.length} members</div>
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        {selectedGroup ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold text-white">{selectedGroup.name}</h2>
                <p className="mt-2 text-slate-400">{selectedGroup.description}</p>
              </div>
              <button onClick={() => handleDelete(selectedGroup._id)} className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950">Delete Group</button>
            </div>
            {(statusMessage || errorMessage) && (
              <div className="mt-5 space-y-3">
                {statusMessage && <div className="rounded-3xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{statusMessage}</div>}
                {errorMessage && <div className="rounded-3xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</div>}
              </div>
            )}
            <div className="mt-8 space-y-5">
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
                <h3 className="text-xl font-semibold text-white">Members</h3>
                <div className="mt-4 space-y-3">
                  {selectedGroup.members.map((member) => (
                    <div key={member.user._id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                      <div>
                        <p className="font-semibold text-white">{member.user.name}</p>
                        <p className="text-sm text-slate-400">{member.user.email}</p>
                      </div>
                      <button onClick={() => handleRemoveMember(member.user._id)} className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-5">
                <h3 className="text-xl font-semibold text-white">Add member</h3>
                <div className="mt-4 flex gap-3">
                  <input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} placeholder="User ID or email" className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
                  <button onClick={handleAddMember} className="rounded-3xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950">Add</button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleCreate} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-200">Group name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" className="mt-3 w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none" />
            </div>
            <button type="submit" className="rounded-3xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950">Create group</button>
          </form>
        )}
      </section>
    </main>
  );
};

export default Groups;
