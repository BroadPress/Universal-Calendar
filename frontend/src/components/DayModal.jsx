// frontend/src/components/DayModal.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function DayModal({ event, date, onClose, events }) {
  const [banners, setBanners] = useState([]);
  const [files, setFiles] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  useEffect(() => {
    if (date) fetchBanners();
  }, [date]);

  const fetchBanners = async () => {
    try {
      const res = await api.get(`/banners/day/${date}`);
      setBanners(res.data);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    }
  };

  const handleUpload = async () => {
    if (!files.length) return;
    const fd = new FormData();
    for (let f of files) fd.append('file', f);
    fd.append('dateFor', date);
    fd.append('viewType', 'stories');

    try {
      await api.post('/banners', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFiles([]);
      setShowUploadPopup(false);
      fetchBanners();
    } catch (err) {
      console.error('Failed to upload banners:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      await api.delete(`/banners/${id}`);
      fetchBanners(); // refresh banners after deletion
    } catch (err) {
      console.error('Failed to delete banner:', err);
      alert('Failed to delete banner');
    }
  };

  const singleEvent = event && !event.showAll;

  const renderBanners = () => (
    banners.length > 0 ? (
      banners.map((b) => (
        <div key={b._id} className="border p-2 text-center text-xs relative">
          <img
            src={b.url}
            alt={b.originalName}
            className="h-20 w-24 mx-auto object-cover rounded-md"
          />
          <div className="mt-2">{b.viewType}</div>

          {/* ❌ Delete button */}
          <button
            onClick={() => handleDelete(b._id)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700"
            title="Delete Banner"
          >
            ×
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-400 text-sm w-full text-center">
        No banners uploaded for this event.
      </p>
    )
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-40">
      <div className="w-[770px] bg-white rounded shadow-lg p-8 relative max-h-[90vh] overflow-y-auto">

        {/* 🔥 Close button top-right */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-semibold"
          title="Close"
        >
          ✕
        </button>

        {singleEvent ? (
          // 🔥 Single Event View
          <div>
            <h2 className="text-3xl font-bold mb-2 text-[#7b1515]">{event.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              <strong>Type:</strong> {event.eventType} <br />
              <strong>Date:</strong> {new Date(event.date).toDateString()}
            </p>
            <p className="text-gray-700 text-sm">
              {event.description || 'No description provided.'}
            </p>

            {/* 🔥 Banners container */}
            <div className="mt-6 flex flex-wrap gap-4 relative">
              {renderBanners()}

              {/* ➕ Add Banner button bottom-right */}
              <button
                onClick={() => setShowUploadPopup(true)}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#7b1515] text-white text-2xl font-bold hover:bg-[#a41c1c] flex items-center justify-center shadow-md"
                title="Add Banners"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          // 🔥 Day View
          <div className="flex gap-6">
            <div className="w-40">
              <div className="text-6xl font-bold text-[#7b1515]">
                {new Date(date).getDate()}
              </div>
              <div className="uppercase text-sm text-[#7b1515]">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                View or Upload Banners
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-semibold">Events on this day</h3>
              {events && events.length ? (
                <ul className="mt-3 space-y-2">
                  {events.map((ev) => (
                    <li key={ev._id} className="border-b pb-1">
                      <strong>{ev.title}</strong> – {ev.eventType}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 mt-2 text-sm">
                  No events for this day.
                </p>
              )}

              {/* 🔥 Banners container */}
              <div className="mt-6 flex flex-wrap gap-4 relative">
                {renderBanners()}

                {/* ➕ Add Banner button bottom-right */}
                <button
                  onClick={() => setShowUploadPopup(true)}
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#7b1515] text-white text-2xl font-bold hover:bg-[#a41c1c] flex items-center justify-center shadow-md"
                  title="Add Banners"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 Upload Banner Popup */}
        {showUploadPopup && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
              <button
                onClick={() => setShowUploadPopup(false)}
                className="absolute right-3 top-3 text-gray-600 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4 text-[#7b1515]">
                Upload Banners
              </h2>

              <input
                type="file"
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="w-full border p-2 rounded mb-3"
              />
              <button
                className="w-full py-2 bg-[#7b1515] text-white rounded hover:bg-[#a41c1c]"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
