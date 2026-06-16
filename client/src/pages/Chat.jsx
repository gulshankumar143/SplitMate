import { useEffect, useState } from 'react';
import { fetchGroups } from '../api/groupService.js';
import ChatBox from '../components/ui/ChatBox.jsx';

const Chat = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const loadGroups = async () => {
      const response = await fetchGroups();
      setGroups(response.data.data.groups);
      if (response.data.data.groups.length) setSelectedGroup(response.data.data.groups[0]);
    };
    loadGroups();
  }, []);

  return (
    <div className="grid gap-8 xl:grid-cols-[0.35fr_1fr]">
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold text-white">Live group chat</h1>
        <p className="mt-2 text-slate-400">Select a group to join the chat room.</p>
        <div className="mt-8 space-y-3">
          {groups.map((group) => (
            <button key={group._id} onClick={() => setSelectedGroup(group)} className={`w-full rounded-3xl border px-5 py-4 text-left transition ${selectedGroup?._id === group._id ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-slate-700 bg-slate-950/80 text-slate-200 hover:border-cyan-400'}`}>
              <div className="font-semibold">{group.name}</div>
              <div className="text-sm text-slate-500">{group.members.length} members</div>
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        {selectedGroup ? (
          <div>
            <h2 className="text-2xl font-semibold text-white">{selectedGroup.name}</h2>
            <p className="text-slate-400">Room ID: {selectedGroup._id}</p>
            <div className="mt-8">
              <ChatBox roomId={selectedGroup._id} />
            </div>
          </div>
        ) : (
          <div className="text-slate-400">No groups available. Create a group to start chatting.</div>
        )}
      </section>
    </div>
  );
};

export default Chat;
