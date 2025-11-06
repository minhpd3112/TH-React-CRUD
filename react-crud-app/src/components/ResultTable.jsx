import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import './ResultTable.css';

const PROFILES = [
  {
    name: 'Nguyễn Văn An',
    username: 'nguyenvana',
    email: 'an.nguyen@example.vn',
    phone: '0901 234 567',
    website: 'an-nguyen.vn',
    address: { street: '12 Lê Lợi', suite: 'Tầng 5', city: 'Hà Nội' },
  },
  {
    name: 'Trần Thị Bình',
    username: 'tranthibinh',
    email: 'binh.tran@example.vn',
    phone: '0912 345 678',
    website: 'binhtran.vn',
    address: { street: '89 Nguyễn Huệ', suite: 'Căn hộ B2-08', city: 'TP. Hồ Chí Minh' },
  },
  {
    name: 'Lê Quốc Cường',
    username: 'lequoccuong',
    email: 'cuong.le@example.vn',
    phone: '0987 654 321',
    website: 'quoccuong.vn',
    address: { street: '27 Hai Bà Trưng', suite: 'Phòng 403', city: 'Đà Nẵng' },
  },
  {
    name: 'Phạm Minh Duy',
    username: 'phamminhduy',
    email: 'duy.pham@example.vn',
    phone: '0908 888 222',
    website: 'minhduy.vn',
    address: { street: '15 Phạm Văn Đồng', suite: 'Biệt thự 12', city: 'Nha Trang' },
  },
  {
    name: 'Đỗ Thảo Em',
    username: 'dothaoem',
    email: 'em.do@example.vn',
    phone: '0933 777 444',
    website: 'thaodo.vn',
    address: { street: '102 Hùng Vương', suite: 'Tập thể 2, tầng 3', city: 'Huế' },
  },
  {
    name: 'Võ Hữu Giang',
    username: 'vohuugiang',
    email: 'giang.vo@example.vn',
    phone: '0977 888 999',
    website: 'huugiang.vn',
    address: { street: '56 Lý Thường Kiệt', suite: 'Số nhà 56/4', city: 'Quy Nhơn' },
  },
  {
    name: 'Ngô Mai Hạ',
    username: 'ngomaiha',
    email: 'ha.ngo@example.vn',
    phone: '0944 222 555',
    website: 'ngomaiha.vn',
    address: { street: '323 Trần Phú', suite: 'Chung cư A1-1204', city: 'Vũng Tàu' },
  },
  {
    name: 'Bùi Gia Khang',
    username: 'buigiakhang',
    email: 'khang.bui@example.vn',
    phone: '0902 333 666',
    website: 'giakhang.vn',
    address: { street: '75 Nguyễn Văn Cừ', suite: 'Căn hộ 10A', city: 'Cần Thơ' },
  },
  {
    name: 'Phan Thảo Ly',
    username: 'phanthaoly',
    email: 'ly.phan@example.vn',
    phone: '0916 888 333',
    website: 'thaoly.vn',
    address: { street: '41 Võ Thị Sáu', suite: 'Nhà số 41B', city: 'Biên Hòa' },
  },
  {
    name: 'Đặng Nhật Minh',
    username: 'dangnhatminh',
    email: 'minh.dang@example.vn',
    phone: '0966 456 789',
    website: 'nhatminh.vn',
    address: { street: '8 Điện Biên Phủ', suite: 'Tầng 12, tòa N01', city: 'Hải Phòng' },
  },
];

function normalizeAddress(address = {}) {
  return {
    street: address.street ?? '',
    suite: address.suite ?? '',
    city: address.city ?? '',
  };
}

function applyProfiles(data) {
  return data.map((item, index) => {
    const profile = PROFILES[index % PROFILES.length];
    return {
      ...item,
      name: profile.name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      address: normalizeAddress(profile.address),
    };
  });
}

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu người dùng.');
        }
        return response.json();
      })
      .then((data) => {
        if (!ignore) {
          setUsers(applyProfiles(data));
          setError('');
        }
      })
      .catch(() => {
        if (!ignore) {
          setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setUsers((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((entry) => Number(entry.id) || 0)) + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          ...user,
          address: normalizeAddress(user.address),
        },
      ];
    });
    onAdded();
  }, [user, onAdded]);

  const filteredUsers = useMemo(() => {
    if (!keyword.trim()) return users;
    const kw = keyword.trim().toLowerCase();
    return users.filter((item) => {
      const name = item.name?.toLowerCase() ?? '';
      const username = item.username?.toLowerCase() ?? '';
      return name.includes(kw) || username.includes(kw);
    });
  }, [users, keyword]);

  const startEdit = (userToEdit) => {
    setEditing({
      ...userToEdit,
      address: { ...normalizeAddress(userToEdit.address) },
    });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const handleEditChange = (field, value) => {
    if (!editing) return;
    if (['street', 'suite', 'city'].includes(field)) {
      setEditing((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setEditing((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const saveEdit = () => {
    if (!editing) return;
    setUsers((prev) =>
      prev.map((entry) =>
        entry.id === editing.id
          ? {
              ...editing,
              name: editing.name.trim(),
              username: editing.username.trim(),
              email: editing.email?.trim() ?? '',
              phone: editing.phone?.trim() ?? '',
              website: editing.website?.trim() ?? '',
              address: {
                street: editing.address.street.trim(),
                suite: editing.address.suite.trim(),
                city: editing.address.city.trim(),
              },
            }
          : entry
      )
    );
    setEditing(null);
  };

  const removeUser = (id) => {
    setUsers((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <section className="result-table">
      <div className="table-wrapper">
        {loading && <p className="info muted">Đang tải dữ liệu...</p>}
        {error && !loading && <p className="info error">{error}</p>}
        {!loading && !error && filteredUsers.length === 0 && (
          <p className="info muted">Không tìm thấy người dùng phù hợp.</p>
        )}
        {!loading && !error && filteredUsers.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Thành phố</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.address.city}</td>
                  <td className="actions">
                    <button type="button" className="btn" onClick={() => startEdit(item)}>
                      Sửa
                    </button>
                    <button type="button" className="btn btn-danger" onClick={() => removeUser(item.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <Modal title={`Sửa người dùng #${editing.id}`} onClose={cancelEdit} onSubmit={saveEdit}>
          <div className="form-grid">
            <div className="form-control">
              <label htmlFor="edit-name">Họ tên</label>
              <input
                id="edit-name"
                value={editing.name}
                onChange={(event) => handleEditChange('name', event.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="edit-username">Tên đăng nhập</label>
              <input
                id="edit-username"
                value={editing.username}
                onChange={(event) => handleEditChange('username', event.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="edit-email">Email</label>
              <input
                id="edit-email"
                value={editing.email}
                onChange={(event) => handleEditChange('email', event.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="edit-phone">Số điện thoại</label>
              <input
                id="edit-phone"
                value={editing.phone}
                onChange={(event) => handleEditChange('phone', event.target.value)}
              />
            </div>
            <div className="form-control">
              <label htmlFor="edit-website">Website</label>
              <input
                id="edit-website"
                value={editing.website}
                onChange={(event) => handleEditChange('website', event.target.value)}
              />
            </div>
            <div className="form-control span-2">
              <label>Địa chỉ</label>
              <div className="address-grid">
                <input
                  id="edit-street"
                  placeholder="Đường"
                  value={editing.address.street}
                  onChange={(event) => handleEditChange('street', event.target.value)}
                />
                <input
                  id="edit-suite"
                  placeholder="Phường / Ấp"
                  value={editing.address.suite}
                  onChange={(event) => handleEditChange('suite', event.target.value)}
                />
                <input
                  id="edit-city"
                  placeholder="Thành phố"
                  value={editing.address.city}
                  onChange={(event) => handleEditChange('city', event.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
}

ResultTable.propTypes = {
  keyword: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    name: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    address: PropTypes.shape({
      street: PropTypes.string,
      suite: PropTypes.string,
      city: PropTypes.string,
    }),
  }),
  onAdded: PropTypes.func.isRequired,
};

ResultTable.defaultProps = {
  user: null,
};

export default ResultTable;
