import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import api, { API_BASE_URL } from '../../api/client';
import { logout } from '../../store/authSlice';

const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

const tabs = ['my-profile', 'my-photos', 'update-details'];

export default function TrainerDashboardLayout() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('my-profile');
  const [trainer, setTrainer] = useState(null);
  const [details, setDetails] = useState({
    name: '',
    age: '',
    mobile: '',
    speciality: '',
    experienceYears: '',
    bio: '',
    email: '',
    password: '',
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [deleteTargetPhotoId, setDeleteTargetPhotoId] = useState('');

  const loadProfile = () => {
    api
      .get('/api/trainers/me/profile')
      .then((res) => {
        const t = res.data;
        setTrainer(t);
        setDetails({
          name: t?.name || '',
          age: t?.age || '',
          mobile: t?.mobile || '',
          speciality: t?.speciality || '',
          experienceYears: t?.experienceYears || '',
          bio: t?.bio || '',
          email: t?.email || '',
          password: '',
        });
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load trainer profile');
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!profilePhoto) {
      setPreviewUrl('');
      return;
    }
    const url = URL.createObjectURL(profilePhoto);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  const gallery = useMemo(() => trainer?.galleryPhotos || [], [trainer]);

  const onDetailChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(details).forEach(([key, value]) => {
        if (key === 'password' && !value) return;
        formData.append(key, value);
      });
      if (profilePhoto) formData.append('photo', profilePhoto);
      await api.put('/api/trainers/me/profile', formData, {
        onUploadProgress: () => {},
      });
      toast.success('Profile updated');
      setProfilePhoto(null);
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const uploadMyPhotos = async () => {
    if (!photoFiles.length) {
      toast.error('Choose photos first');
      return;
    }
    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      photoFiles.forEach((f) => formData.append('photos', f));
      await api.post('/api/trainers/me/photos', formData);
      toast.success('Photos uploaded');
      setPhotoFiles([]);
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Photo upload failed');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const deletePhoto = async () => {
    if (!deleteTargetPhotoId) return;
    try {
      await api.delete(`/api/trainers/me/photos/${deleteTargetPhotoId}`);
      toast.success('Photo deleted');
      setDeleteTargetPhotoId('');
      loadProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete photo');
    }
  };

  return (
    <div className="mx-auto mt-24 flex max-w-6xl flex-col gap-6 px-4 pb-12 md:flex-row">
      <aside className="hidden w-56 flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-sm md:flex">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Trainer Panel</p>
        <button
          onClick={() => setActiveTab('my-profile')}
          className={`rounded-xl px-3 py-2 text-left ${
            activeTab === 'my-profile' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('my-photos')}
          className={`rounded-xl px-3 py-2 text-left ${
            activeTab === 'my-photos' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          My Photos
        </button>
        <button
          onClick={() => setActiveTab('update-details')}
          className={`rounded-xl px-3 py-2 text-left ${
            activeTab === 'update-details' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          Update Details
        </button>
        <button
          onClick={() => dispatch(logout())}
          className="mt-4 rounded-xl px-3 py-2 text-left text-slate-400 hover:bg-red-500/10 hover:text-red-300"
        >
          Log out
        </button>
      </aside>

      <main className="flex-1 space-y-4">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2 md:hidden">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Trainer Panel</p>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-xl px-3 py-2 text-xs capitalize ${
                    active ? 'bg-brand-500/20 text-brand-300' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  {tab.replace('-', ' ')}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="rounded-xl px-3 py-2 text-xs text-slate-400 hover:bg-red-500/10 hover:text-red-300"
            >
              Log out
            </button>
          </div>
        </section>

        {activeTab === 'my-profile' && (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <h2 className="text-lg font-semibold">My Profile</h2>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="h-32 w-32 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
                {previewUrl || trainer?.photoUrl ? (
                  <img
                    src={previewUrl || resolveMediaUrl(trainer?.photoUrl)}
                    alt={trainer?.name || 'Trainer'}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-100">{trainer?.name || 'Trainer'}</p>
                <p className="text-slate-400">{trainer?.speciality || 'Speciality not set'}</p>
                <p className="text-slate-400">Experience: {trainer?.experienceYears || 0} years</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'my-photos' && (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <h2 className="text-lg font-semibold">My Photos</h2>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setPhotoFiles(Array.from(e.target.files || []))}
                className="text-slate-300"
              />
              <button
                type="button"
                disabled={uploadingPhotos}
                onClick={uploadMyPhotos}
                className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {uploadingPhotos ? 'Uploading...' : 'Upload Photos'}
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {gallery.map((photo) => (
                <article key={photo._id} className="overflow-hidden rounded-xl border border-slate-800">
                  <img
                    src={resolveMediaUrl(photo.url)}
                    alt="Trainer"
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteTargetPhotoId(photo._id)}
                    className="w-full border-t border-slate-800 bg-slate-900/80 px-2 py-1.5 text-[11px] text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </article>
              ))}
              {!gallery.length && <p className="text-slate-500">No photos uploaded yet.</p>}
            </div>
          </section>
        )}

        {activeTab === 'update-details' && (
          <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <h2 className="text-lg font-semibold">Update Details</h2>
            <form onSubmit={saveDetails} className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="name"
                  value={details.name}
                  onChange={onDetailChange}
                  placeholder="Name"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
                <input
                  name="email"
                  type="email"
                  value={details.email}
                  onChange={onDetailChange}
                  placeholder="Email"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
                <input
                  name="age"
                  type="number"
                  value={details.age}
                  onChange={onDetailChange}
                  placeholder="Age"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
                <input
                  name="mobile"
                  value={details.mobile}
                  onChange={onDetailChange}
                  placeholder="Mobile"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
                <input
                  name="speciality"
                  value={details.speciality}
                  onChange={onDetailChange}
                  placeholder="Speciality"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
                <input
                  name="experienceYears"
                  type="number"
                  value={details.experienceYears}
                  onChange={onDetailChange}
                  placeholder="Experience (years)"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
              </div>
              <textarea
                name="bio"
                value={details.bio}
                onChange={onDetailChange}
                rows={4}
                placeholder="Bio"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="password"
                  type="password"
                  value={details.password}
                  onChange={onDetailChange}
                  placeholder="New password (optional)"
                  className="rounded-xl border border-slate-700 bg-slate-950/40 px-3 py-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="text-slate-300"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-brand-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>
        )}
      </main>

      {deleteTargetPhotoId && (
        <div className="fixed inset-0 z-50 grid place-content-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-4">
            <p className="text-sm font-semibold text-slate-100">Delete this photo?</p>
            <p className="mt-1 text-xs text-slate-400">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetPhotoId('')}
                className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deletePhoto}
                className="rounded-xl border border-red-500/50 px-3 py-1.5 text-xs text-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
