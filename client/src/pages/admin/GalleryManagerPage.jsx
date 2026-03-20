import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { API_BASE_URL } from '../../api/client';
import { pushAdminActivity } from '../../utils/adminActivity';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const categories = ['workout', 'machines', 'transformation'];

export default function GalleryManagerPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('workout');
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);

  const fetchItems = () => {
    api
      .get('/api/gallery')
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files.length) return;
    setMessage('');
    setLoading(true);
    setProgress(0);
    try {
      const formData = new FormData();
      formData.append('category', category);
      files.forEach((file) => formData.append('images', file));
      await api.post('/api/gallery', formData, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
      setFiles([]);
      fetchItems();
      setMessage('Gallery images uploaded successfully.');
      toast.success('Gallery images uploaded');
      pushAdminActivity('Uploaded gallery images', { count: files.length, category });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gallery upload failed.');
      toast.error(error.response?.data?.message || 'Gallery upload failed.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/gallery/${id}`);
      fetchItems();
      toast.success('Gallery item deleted');
      pushAdminActivity('Deleted gallery image', { itemId: id });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-semibold">Gallery Manager</h2>
        <p className="text-sm text-slate-400">Upload, categorize and remove gallery images.</p>
      </header>

      <form
        onSubmit={handleUpload}
        className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs"
      >
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Upload Gallery Images
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-300">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              className="w-full text-[11px] text-slate-300"
            />
          </div>
        </div>
        {!!previewUrls.length && (
          <div>
            <p className="mb-2 text-[11px] text-slate-400">Preview</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {previewUrls.slice(0, 10).map((url) => (
                <img key={url} src={url} alt="Preview" className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress || 10}%` }} />
            </div>
            <p className="text-[11px] text-slate-400">Uploading images... {progress || 0}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
        >
          {loading
            ? `Uploading... ${progress ? `${progress}%` : ''}`
            : `Upload ${files.length || ''} Image${files.length === 1 ? '' : 's'}`}
        </button>
        {message && <p className="text-[11px] text-slate-300">{message}</p>}
      </form>

      <div className="space-y-2">
        <p className="text-xs text-slate-400">Existing gallery items</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70"
            >
              <div className="aspect-square bg-slate-800">
                <img
                  src={resolveMediaUrl(item.url)}
                  alt={item.caption || item.category}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-2 p-3 text-xs">
                <p className="text-[11px] uppercase tracking-wide text-brand-300">{item.category}</p>
                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  className="w-full rounded-xl border border-red-500/50 px-3 py-1 text-[11px] text-red-300 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
          {!items.length && <p className="text-xs text-slate-500">No gallery items yet.</p>}
        </div>
      </div>
    </section>
  );
}
