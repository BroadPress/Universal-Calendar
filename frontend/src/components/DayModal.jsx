import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function DayModal({ date, onClose, events }) {
  const [banners, setBanners] = useState([]);
  const [files, setFiles] = useState([]);
  useEffect(() => { fetchBanners(); }, [date]);

  const fetchBanners = async () => {
    try {
      const res = await api.get(`/banners/day/${date}`);
      setBanners(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async () => {
    if (!files.length) return;
    const fd = new FormData();
    for (let f of files) fd.append('banners', f);
    fd.append('dateFor', date);
    fd.append('viewType', 'stories');
    try {
      await api.post('/banners/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      await fetchBanners();
      setFiles([]);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-40">
      <div className="w-[770px] bg-white rounded shadow-lg p-8 relative">
        <button onClick={onClose} className="absolute right-4 top-4 w-9 h-9 rounded-full bg-gray-100">X</button>
        <div className="flex gap-6">
          <div className="w-40">
            <div className="text-6xl font-bold text-[#7b1515]">{new Date(date).getDate()}</div>
            <div className="uppercase text-sm text-[#7b1515]">Thursday</div>
            <div className="mt-4 text-xs">Upload Banners</div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">International Packer's Day</h3>
            <p className="mt-3 text-sm text-gray-600">Description or notes here...</p>

            <div className="mt-6">
              <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
              <button className="ml-4 px-4 py-2 bg-[#7b1515] text-white rounded" onClick={handleUpload}>Upload</button>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4">
              {banners.map(b => (
                <div key={b._id} className="border p-2 text-center text-xs">
                  <img src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api','')}/uploads/${b.filename}`} alt={b.originalName} className="h-20 mx-auto object-cover" />
                  <div className="mt-2">{b.viewType}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
