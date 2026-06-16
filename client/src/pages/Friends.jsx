import { useEffect, useState } from 'react';
import { fetchFriends, fetchFriendRequests, searchFriends, sendFriendRequest, respondFriendRequest, removeFriend } from '../api/friendService.js';
import { uploadFile } from '../api/uploadService.js';
import FileUploader from '../components/ui/FileUploader.jsx';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [sendingRequestIds, setSendingRequestIds] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [proofAttachments, setProofAttachments] = useState([]);

  const loadFriends = async () => {
    const [friendResponse, requestResponse] = await Promise.all([fetchFriends(), fetchFriendRequests()]);
    setFriends(friendResponse.data.data.friends);
    setRequests(requestResponse.data.data.requests);
  };

  useEffect(() => {
    loadFriends();
  }, []);

  const performSearch = async () => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchMessage('');
      return;
    }

    try {
      const response = await searchFriends(query);
      const users = response.data.data.users;
      setSearchResults(users);
      setSearchMessage(users.length ? '' : 'No such user exists');
    } catch (error) {
      setSearchResults([]);
      setSearchMessage(error.response?.data?.message || 'Unable to search users.');
    }
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setActionMessage('');
    await performSearch();
  };

  const handleSend = async (userId) => {
    const receiverId = userId?.toString ? userId.toString() : userId;
    setActionMessage('');
    setSendingRequestIds((prev) => [...prev, receiverId]);
    try {
      await sendFriendRequest({ receiverId });
      setActionMessage('Friend request sent successfully.');
      setSearchResults((prev) => prev.filter((user) => (user._id || user.id)?.toString() !== receiverId));
      await loadFriends();
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Unable to send friend request.');
    } finally {
      setSendingRequestIds((prev) => prev.filter((id) => id !== receiverId));
    }
  };

  const handleRespond = async (requestId, action) => {
    setActionMessage('');
    try {
      await respondFriendRequest({ requestId, action });
      setActionMessage(`Friend request ${action === 'accept' ? 'accepted' : 'rejected'}.`);
      await loadFriends();
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Unable to update friend request.');
    }
  };

  const handleRemove = async (id) => {
    setActionMessage('');
    try {
      await removeFriend(id);
      setActionMessage('Friend removed successfully.');
      await loadFriends();
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Unable to remove friend.');
    }
  };

  const handleUploadProof = async (file) => {
    setUploadError('');
    setUploadStatus('Uploading proof...');
    try {
      const attachment = await uploadFile(file);
      setProofAttachments((prev) => [...prev, attachment]);
      setUploadStatus('Proof uploaded successfully.');
    } catch (error) {
      setUploadError(error.response?.data?.message || 'Unable to upload proof. Please try again.');
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <main className="grid gap-8 lg:grid-cols-[0.85fr_0.5fr]">
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h1 className="text-3xl font-semibold text-white">Friends</h1>
        <p className="mt-2 text-slate-400">Connect with friends, approve requests, and manage balances.</p>
        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Search contacts</h2>
            <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-3">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email"
                className="flex-1 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none"
              />
              <button type="submit" className="rounded-3xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950">Search</button>
            </form>
            {searchResults.length > 0 && (
              <div className="mt-5 space-y-3">
                {searchResults.map((user) => {
                  const userId = user._id || user.id;
                  const isSending = sendingRequestIds.includes(userId);
                  const isFriend = user.isFriend;
                  const isPendingOutgoing = user.requestStatus === 'pendingOutgoing';
                  const isPendingIncoming = user.requestStatus === 'pendingIncoming';
                  const isPending = user.hasPendingRequest || isPendingOutgoing || isPendingIncoming;
                  const disabled = isSending || isFriend || isPending;
                  const buttonLabel = isFriend
                    ? 'Friends'
                    : isPendingOutgoing
                    ? 'Pending'
                    : isPendingIncoming
                    ? 'Requested'
                    : isPending
                    ? 'Pending'
                    : isSending
                    ? 'Sending...' : 'Add';

                  return (
                    <div key={userId} className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
                      <div>
                        <div className="font-semibold text-white">{user.name}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                        {(isFriend || isPendingOutgoing || isPendingIncoming) && (
                          <div className="mt-1 text-sm text-cyan-300">
                            {isFriend && 'Already friends'}
                            {isPendingOutgoing && 'Friend request pending'}
                            {isPendingIncoming && 'Requested you'}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSend(userId)}
                        disabled={disabled}
                        title={disabled ? 'A friend request has already been sent or this user is already a friend' : 'Send friend request'}
                        className={`rounded-3xl px-4 py-2 text-sm font-semibold text-slate-950 transition ${disabled ? 'bg-slate-600 cursor-not-allowed opacity-70' : 'bg-cyan-500 hover:bg-cyan-400'}`}
                      >
                        {buttonLabel}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {searchMessage && <div className="mt-5 text-slate-400">{searchMessage}</div>}
            {actionMessage && <div className="mt-5 rounded-3xl border border-cyan-500 bg-cyan-500/10 p-4 text-sm text-cyan-100">{actionMessage}</div>}
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-950/70 p-6">
            <h2 className="text-xl font-semibold text-white">Friend requests</h2>
            <div className="mt-4 space-y-3">
              {requests.map((request) => (
                <div key={request._id} className="flex items-center justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                  <div>
                    <div className="font-semibold text-white">{request.sender.name}</div>
                    <div className="text-sm text-slate-400">{request.sender.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRespond(request._id, 'accept')} className="rounded-3xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">Accept</button>
                    <button onClick={() => handleRespond(request._id, 'reject')} className="rounded-3xl bg-slate-700 px-4 py-2 text-sm text-slate-200">Reject</button>
                  </div>
                </div>
              ))}
              {!requests.length && <div className="text-slate-500">No friend requests at the moment.</div>}
            </div>
          </div>
        </div>
      </section>
      <section className="rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
        <h2 className="text-3xl font-semibold text-white">Your friends</h2>
        <div className="mt-6 space-y-3">
          {friends.map((friend) => (
            <div key={friend._id} className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-950/70 p-4">
              <div>
                <p className="font-semibold text-white">{friend.name}</p>
                <p className="text-sm text-slate-400">{friend.email}</p>
              </div>
              <button onClick={() => handleRemove(friend._id)} className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950">Remove</button>
            </div>
          ))}
          {!friends.length && <div className="text-slate-500">No friends added yet.</div>}
        </div>
        <div className="mt-6 rounded-[2rem] border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
          <h2 className="text-3xl font-semibold text-white">Upload proof</h2>
          <p className="mt-2 text-slate-400">Upload receipts and proofs directly while managing friends.</p>
          <div className="mt-6">
            <FileUploader label="Upload receipt or invoice" onUpload={handleUploadProof} />
            {uploadStatus && <p className="mt-3 text-slate-400">{uploadStatus}</p>}
            {uploadError && <div className="mt-3 rounded-3xl border border-rose-500 bg-rose-500/10 p-4 text-sm text-rose-200">{uploadError}</div>}
            {proofAttachments.length > 0 && (
              <div className="mt-4 space-y-3">
                {proofAttachments.map((attachment) => (
                  <div key={attachment._id || attachment.filename || attachment.url} className="rounded-3xl border border-slate-700 bg-slate-950/70 p-4 text-slate-200">
                    <p className="font-semibold">{attachment.filename || attachment.originalname || attachment.public_id || attachment._id}</p>
                    {attachment.url && (
                      <a href={attachment.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-cyan-300 hover:text-cyan-200">
                        View proof
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Friends;
