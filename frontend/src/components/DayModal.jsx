import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function DayModal({ event, date, onClose }) {
  const [banners, setBanners] = useState([]);
  const [files, setFiles] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  // Fetch banners for the selected event
  useEffect(() => {
    if (event?._id) fetchBanners();
  }, [event]);

  const fetchBanners = async () => {
    try {
      const res = await api.get(`/banners/event/${event._id}`);
      setBanners(res.data);
    } catch (err) {
      console.error('Failed to fetch banners:', err);
    }
  };

  const handleUpload = async () => {
    if (!files.length || !event?._id) return;

    const fd = new FormData();
    for (let f of files) fd.append('file', f);
    fd.append('eventId', event._id);
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
      fetchBanners();
    } catch (err) {
      console.error('Failed to delete banner:', err);
      alert('Failed to delete banner');
    }
  };

  const renderBanners = () => (
    banners.length > 0 ? (
      <div className="flex flex-wrap justify-center gap-4 mt-6">
        {banners.map((b) => (
          <div key={b._id} className="relative">
            <img
              src={b.url}
              alt={b.originalName}
              className="h-28 w-36 object-cover rounded-md border"
            />
            <button
              onClick={() => handleDelete(b._id)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center hover:bg-red-700"
              title="Delete Banner"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-400 text-sm w-full text-center mt-6">
        No banners uploaded for this event.
      </p>
    )
  );

  // Correct date formatting
  let dayVal, monthVal, yearVal, weekdayVal;
  if (date) {
    if (typeof date === 'string') {
      const dt = new Date(date);
      dayVal = dt.getDate();
      monthVal = dt.toLocaleString('default', { month: 'short' });
      yearVal = dt.getFullYear();
      weekdayVal = dt.toLocaleDateString('en-US', { weekday: 'long' });
    } else if (date.day && date.month && date.year) {
      dayVal = date.day;
      monthVal = date.month;
      yearVal = date.year;
      const dt = new Date(`${yearVal}-${monthVal}-${dayVal}`);
      weekdayVal = dt.toLocaleDateString('en-US', { weekday: 'long' });
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-40">
      <div className="w-[770px] bg-white rounded shadow-lg p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-semibold"
          title="Close"
        >
          ✕
        </button>

        {/* Date on left, title centered */}
        <div className="flex items-center gap-4">
          {/* Date */}
          <div className="text-[#7b1515] flex flex-col items-center">
            <div className="text-5xl font-bold">{dayVal}</div>
            <div className="uppercase text-xs">{weekdayVal}</div>
            <div className="text-xs">{monthVal} {yearVal}</div>
          </div>

          {/* Centered Title */}
          <h2 className="text-3xl font-bold text-black text-center flex-1">
            {event?.title || 'No Event Title'}
          </h2>
        </div>

        {/* Description stays under date */}
        {event?.description && (
          <p className="text-gray-700 text-sm mt-4 text-left max-w-[600px]">
            {event.description}
          </p>
        )}

        {/* Banners */}
        {renderBanners()}

        {/* Upload button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setShowUploadPopup(true)}
            className="w-12 h-12 rounded-full bg-[#7b1515] text-white text-2xl font-bold hover:bg-[#a41c1c] flex items-center justify-center shadow-md"
            title="Add Banners"
          >
            +
          </button>
        </div>

        {/* Upload Banner Popup */}
        {showUploadPopup && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg relative">
              <button
                onClick={() => setShowUploadPopup(false)}
                className="absolute right-3 top-3 text-gray-600 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-4 text-[#7b1515]">Upload Banners</h2>
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
