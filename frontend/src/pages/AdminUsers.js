import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editUser, setEditUser] = useState(null);

  const loadUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/users?${params.toString()}`);
      setUsers(res.data);
    } catch { }
  };

  useEffect(() => { loadUsers(); }, [statusFilter]);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    try {
      const actions = {
        approve: () => api.put(`/users/${id}/approve`),
        reject: () => api.delete(`/users/${id}/reject`),
        suspend: () => api.put(`/users/${id}/suspend`),
        activate: () => api.put(`/users/${id}/activate`),
        delete: () => api.delete(`/users/${id}`)
      };
      await actions[action]();
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editUser.id}`, editUser);
      setEditUser(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const statusBadge = (status) => {
    const colors = { pending: 'warning', approved: 'success', suspended: 'danger' };
    return <span className={`badge bg-${colors[status]} bg-opacity-10 text-${colors[status]} border border-${colors[status]} border-opacity-25 px-3 py-2`}>{status}</span>;
  };

  const filterBtns = [
    { label: 'All', value: '' },
    { label: 'Pending', value: 'pending', color: '#ffc107' },
    { label: 'Approved', value: 'approved', color: '#28a745' },
    { label: 'Suspended', value: 'suspended', color: '#dc3545' }
  ];

  return (
    <div className="container-fluid p-4 page-container">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h3 className="fw-bold mb-1" style={{ color: '#e94560' }}>User Management</h3>
          <p className="text-secondary mb-0 small">Manage all registered users</p>
        </div>
        <div className="d-flex gap-2">
          <input type="text" className="form-control bg-dark border-secondary text-white" style={{ width: '250px' }} placeholder="Search by name, username, email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && loadUsers()} />
          <button className="btn border-0 fw-semibold px-3" style={{ background: '#e94560', color: '#fff', borderRadius: '10px' }} onClick={loadUsers}><i className="bi bi-search"></i></button>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        {filterBtns.map((btn) => (
          <button
            key={btn.value}
            className="btn btn-sm border-0 px-3 py-1 fw-semibold"
            style={{
              background: statusFilter === btn.value ? (btn.color || '#e94560') : 'rgba(255,255,255,0.05)',
              color: statusFilter === btn.value ? '#fff' : '#aaa',
              borderRadius: '20px',
              transition: 'all 0.2s'
            }}
            onClick={() => setStatusFilter(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div className="card-custom">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
            <thead>
              <tr className="text-secondary" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="ps-4">#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Election Location</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="10" className="text-center text-secondary py-4">No users found</td></tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td className="ps-4 text-secondary">{i + 1}</td>
                    <td className="fw-semibold">{u.full_name}</td>
                    <td className="text-secondary">{u.username}</td>
                    <td className="text-secondary small">{u.email}</td>
                    <td className="text-secondary">{u.phone || '-'}</td>
                    <td className="text-secondary small">{u.election_location || '-'}</td>
                    <td><span className={`badge bg-${u.role === 'super_admin' ? 'danger' : u.role === 'admin' ? 'info' : 'secondary'} bg-opacity-10 text-${u.role === 'super_admin' ? 'danger' : u.role === 'admin' ? 'info' : 'secondary'} border border-opacity-25 px-2 py-1`}>{u.role}</span></td>
                    <td>{statusBadge(u.status)}</td>
                    <td className="text-secondary small">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="pe-4 text-end">
                      <div className="btn-group btn-group-sm gap-1">
                        {u.status === 'pending' && (
                          <>
                            <button className="btn btn-sm btn-outline-success border-0" onClick={() => handleAction(u.id, 'approve')} title="Approve"><i className="bi bi-check-lg"></i></button>
                            <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleAction(u.id, 'reject')} title="Reject"><i className="bi bi-x-lg"></i></button>
                          </>
                        )}
                        {u.status === 'approved' && (
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleAction(u.id, 'suspend')} title="Suspend"><i className="bi bi-pause"></i></button>
                        )}
                        {u.status === 'suspended' && (
                          <button className="btn btn-sm btn-outline-success border-0" onClick={() => handleAction(u.id, 'activate')} title="Activate"><i className="bi bi-play"></i></button>
                        )}
                        <button className="btn btn-sm btn-outline-info border-0" onClick={() => setEditUser(u)} title="Edit"><i className="bi bi-pencil"></i></button>
                        {u.role !== 'super_admin' && (
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleAction(u.id, 'delete')} title="Delete"><i className="bi bi-trash"></i></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content-custom">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-white">Edit User</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setEditUser(null)}></button>
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">Full Name</label>
                    <input type="text" className="form-control bg-dark border-secondary text-white" value={editUser.full_name} onChange={(e) => setEditUser({ ...editUser, full_name: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">Email</label>
                    <input type="email" className="form-control bg-dark border-secondary text-white" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">Phone</label>
                    <input type="text" className="form-control bg-dark border-secondary text-white" value={editUser.phone || ''} onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-white-50 small">Election Location</label>
                    <input type="text" className="form-control bg-dark border-secondary text-white" value={editUser.election_location || ''} onChange={(e) => setEditUser({ ...editUser, election_location: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditUser(null)}>Cancel</button>
                  <button type="submit" className="btn" style={{ background: '#e94560', color: '#fff' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
